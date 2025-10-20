// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, updateDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOqqnnBNSACBh9WzjqiEPSinrBJ2ixeuw",
  authDomain: "ieee-34131.firebaseapp.com",
  projectId: "ieee-34131",
  storageBucket: "ieee-34131.firebasestorage.app",
  messagingSenderId: "133827734645",
  appId: "1:133827734645:web:5ca85322918d7ed28f5c3c",
  measurementId: "G-VCJDRWNC64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Game State
const gameState = {
    cards: [],
    flipped: [],
    matched: [],
    isProcessing: false,
    gameStarted: false,
    startTime: null,
    elapsedSeconds: 0,
    timerInterval: null,
    points: 0
};

// Card Images (Emojis for variety)
const cardImages = [
    '🚀', '🎮', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎻'
];

// DOM Elements
const instructionsModal = document.getElementById('instructionsModal');
const gameSection = document.getElementById('gameSection');
const victoryScreen = document.getElementById('victoryScreen');
const cardsGrid = document.getElementById('cardsGrid');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const timerDisplay = document.getElementById('timer');
const displayTimer = document.getElementById('displayTimer');
const remainingPairs = document.getElementById('remainingPairs');
const finalTime = document.getElementById('finalTime');
const finalPoints = document.getElementById('finalPoints');

// Sound Effects
const matchSound = document.getElementById('matchSound');
const victorySound = document.getElementById('victorySound');

// Initialize Game
function initGame() {
    gameState.cards = [];
    gameState.flipped = [];
    gameState.matched = [];
    gameState.isProcessing = false;
    gameState.gameStarted = false;
    gameState.startTime = null;
    gameState.elapsedSeconds = 0;
    gameState.points = 0;

    // Create card pairs
    const pairs = [];
    cardImages.forEach((image, index) => {
        pairs.push({ id: index * 2, image, pairId: index });
        pairs.push({ id: index * 2 + 1, image, pairId: index });
    });

    // Shuffle cards
    gameState.cards = shuffleArray(pairs);

    // Render cards
    renderCards();

    // Reset displays
    timerDisplay.textContent = '00:00';
    remainingPairs.textContent = '10';
}

// Shuffle Array (Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Render Cards
function renderCards() {
    cardsGrid.innerHTML = '';
    gameState.cards.forEach((card, index) => {
        const cardElement = document.createElement('button');
        cardElement.className = 'card';
        cardElement.dataset.index = index;
        cardElement.dataset.pairId = card.pairId;

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.textContent = '?';

        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        cardContent.textContent = card.image;
        cardContent.style.display = 'none';

        cardElement.appendChild(cardBack);
        cardElement.appendChild(cardContent);

        cardElement.addEventListener('click', () => flipCard(index, cardElement));
        cardsGrid.appendChild(cardElement);
    });
}

// Flip Card
function flipCard(index, cardElement) {
    if (!gameState.gameStarted) return;

    if (gameState.isProcessing || gameState.flipped.includes(index) || gameState.matched.includes(index)) {
        return;
    }

    cardElement.classList.add('flipped');
    cardElement.querySelector('.card-back').style.display = 'none';
    cardElement.querySelector('.card-content').style.display = 'flex';

    gameState.flipped.push(index);

    if (gameState.flipped.length === 2) {
        gameState.isProcessing = true;
        checkMatch();
    }
}

// Check Match
function checkMatch() {
    const [index1, index2] = gameState.flipped;
    const card1 = gameState.cards[index1];
    const card2 = gameState.cards[index2];

    if (card1.pairId === card2.pairId) {
        gameState.matched.push(index1, index2);
        
        playSound(matchSound);

        const cards = document.querySelectorAll('.card');
        cards[index1].classList.add('matched', 'celebrate');
        cards[index2].classList.add('matched', 'celebrate');

        createConfetti();

        gameState.flipped = [];
        gameState.isProcessing = false;

        const remainingCount = 10 - (gameState.matched.length / 2);
        remainingPairs.textContent = remainingCount;

        if (gameState.matched.length === 20) {
            endGame();
        }
    } else {
        setTimeout(() => {
            const cards = document.querySelectorAll('.card');
            cards[index1].classList.remove('flipped');
            cards[index2].classList.remove('flipped');
            cards[index1].querySelector('.card-back').style.display = 'flex';
            cards[index2].querySelector('.card-back').style.display = 'flex';
            cards[index1].querySelector('.card-content').style.display = 'none';
            cards[index2].querySelector('.card-content').style.display = 'none';

            gameState.flipped = [];
            gameState.isProcessing = false;
        }, 1000);
    }
}

// Calculate Points
function calculatePoints(seconds) {
    if (seconds < 40) return 60;
    if (seconds < 80) return 40;
    if (seconds < 120) return 20;
    return 10;
}

// End Game
function endGame() {
    clearInterval(gameState.timerInterval);
    gameState.gameStarted = false;

    gameState.points = calculatePoints(gameState.elapsedSeconds);

    const minutes = Math.floor(gameState.elapsedSeconds / 60);
    const seconds = gameState.elapsedSeconds % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    finalTime.textContent = timeString;
    finalPoints.textContent = gameState.points;

    playSound(victorySound);

    gameSection.style.display = 'none';
    victoryScreen.style.display = 'flex';

    for (let i = 0; i < 30; i++) {
        setTimeout(() => createConfetti(), i * 50);
    }

    // Update victory screen message and button
    const victoryMessage = document.getElementById('victoryMessage');
    if (victoryMessage) {
        victoryMessage.textContent = 'شكراً على مشاركتك معانا، وأتمنى تكون اتبسطت!';
    }

    const playAgainBtn = document.getElementById('playAgainBtn');
    if (playAgainBtn) {
        playAgainBtn.textContent = 'العودة إلى الصفحة الرئيسية';
        playAgainBtn.onclick = () => {
            window.location.href = 'index.html'; // تغيير من login.html ل index.html
        };
    }

    // Update points in Firebase
    updatePointsInFirebase();
}

// Timer
function startTimer() {
    gameState.startTime = Date.now();
    gameState.timerInterval = setInterval(() => {
        gameState.elapsedSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
        updateTimerDisplay();
    }, 100);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.elapsedSeconds / 60);
    const seconds = gameState.elapsedSeconds % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = timeString;
    displayTimer.textContent = timeString;
}

// Play Sound
function playSound(audio) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Create Confetti
function createConfetti() {
    const confettiPiece = document.createElement('div');
    confettiPiece.className = 'confetti';
    confettiPiece.style.left = Math.random() * 100 + '%';
    confettiPiece.style.backgroundColor = ['#FF6B35', '#00D9FF', '#00C853', '#FFB300', '#FF3B30'][Math.floor(Math.random() * 5)];
    confettiPiece.style.animationDelay = Math.random() * 0.2 + 's';
    document.body.appendChild(confettiPiece);

    setTimeout(() => confettiPiece.remove(), 3000);
}

// Update Points in Firebase
async function updatePointsInFirebase() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || localStorage.getItem('userEmail');

    if (email) {
        const playersRef = collection(db, "players");
        const q = query(playersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnapshot) => {
            const currentPoints = docSnapshot.data().points || 0;
            const newTotalPoints = currentPoints + gameState.points;
            updateDoc(docSnapshot.ref, {
                points: newTotalPoints
            }).then(() => {
                console.log("Points updated successfully for email: ", email, "New total: ", newTotalPoints);
            }).catch((error) => {
                console.error("Error updating points: ", error);
                showAlert("Error updating points. Try again.", "error");
            });
        });
    }
}

// Show Alert
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = 'alert-notification ' + type;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => alert.remove(), 300);
    }, 3000);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutRight {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100px); }
        }
    `;
    document.head.appendChild(style);
}

// Event Listeners
startBtn.addEventListener('click', () => {
    instructionsModal.style.display = 'none';
    gameSection.style.display = 'block';
    gameState.gameStarted = true;
    startTimer();
});

resetBtn.addEventListener('click', () => {
    clearInterval(gameState.timerInterval);
    initGame();
    gameState.gameStarted = true;
    startTimer();
});

playAgainBtn.addEventListener('click', () => {
    victoryScreen.style.display = 'none';
    gameSection.style.display = 'block';
    initGame();
    gameState.gameStarted = true;
    startTimer();
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});