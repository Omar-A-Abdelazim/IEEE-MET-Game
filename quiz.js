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

// Quiz Data - Mixed Funny and Branch Questions
const quizData = {
    questions: [
        // Funny Questions
        {
            question: "أكتر حاجة اتعلمتها في السايكل دي: 😭",
            answers: ["إن النوم رفاهية", "يعني إيه teamwork بجد", "إن الواي فاي غدار", "إن الميتنجات ما بتخلصش"],
            correct: 3
        },
        {
            question: "لما الهيد يقول 'عندي announcement بسيط'، إحنا:",
            answers: ["بنهرب من الجروب", "بنعرف إن في شغل جاي في الطريق", "بنعمل ميوت", "بنقول 'يا رب خير'"],
            correct: 2
        },
        {
            question: "الفايس لما يقول 'متقلقوش يا جماعة'، معناها غالبًا: 😂",
            answers: ["كل حاجة هتولع", "فعلاً متقلقوش، كله تحت السيطرة", "هو نفسه قلقان", "احنا كده كده هنقلق"],
            correct: 0
        },
        {
            question: "أكتر جملة بنسمعها في السايكل: 😭",
            answers: ["'في تعديل بسيط في التاسك'", "'حد فاضي خمس دقايق؟'", "'مين معندوش نت؟'", "'انا كنت نايم آسفة 😂'"],
            correct: 0
        },
        {
            question: "أول ما بنسمع كلمة 'سيشن'، إحنا:",
            answers: ["بنقول 'تانيييي؟' 😂", "بنفتح اللابتوب بحماس", "بنقلب في الريلّز", "بنحضر جبر خواطر"],
            correct: 3
        },
        {
            question: "أكتر حاجة بتخلي السيشن حلوة:",
            answers: ["البريك 😂", "التفاعل والضحك", "الباوربوينت المتحرك", "لما النت يفصل"],
            correct: 0
        },
        {
            question: "لما الديدلاين يتأجل، إحنا:",
            answers: ["بنرقص من الفرحة", "بنبدأ نشتغل فعلاً", "بننام أكتر", "بنأجله تاني 😂"],
            correct: 3
        },
        {
            question: "لما حد يخلص التاسك بدري، إحنا:",
            answers: ["بنشك فيه 😂", "بنسقف له", "بياخد بونص وبنسقف له", "بنسأله إزاي عمل كده"],
            correct: 2
        },
        {
            question: "لما الهيد يقول 'عايز feedback بصراحة'، إنت:",
            answers: ["بتقول رأيك بجد (لازم تختارها غصب) ", "بتقول 'كل حاجة حلوة' عشان الأمان", "بتضحك وتسكت", "بتغيّر الموضوع"],
            correct: 0
        },
        {
            question: "أكتر حاجة لو تحسنت، السايكل هتبقى perfect:",
            answers: ["الالتزام بالمواعيد", "قلة الضغط", "زيادة الهزار", "حذف كلمة 'تاسك'"],
            correct: 3
        },
        {
            question: "لما حد يغلط في التاسك، رد التيم بيكون:",
            answers: ["هزار خفيف وتشجيع مع الفيدباك", "تحقيق رسمي", "بنعمل ميم عليه", "ننسى الموضوع"],
            correct: 2
        },
        {
            question: "كتر وقت بيكون فيه الإنتاج عالي:",
            answers: ["الساعة 2 بالليل", "قبل الديدلاين بنص ساعة", "أول يوم من التاسك", "بعد الميتينج الأول"],
            correct: 1
        },
        {
            question: "أكتر حاجة بتخليك تحضر السيشن مبسوط:",
            answers: ["الناس", "المواضيع", "التنظيم", "الهزار"],
            correct: 3
        },
        {
            question: "لما الهيد يقول 'ده مجرد اجتماع بسيط'، تتوقع:",
            answers: ["presentation كاملة 😂", "نقاش طويل", "فعلاً بسيط", "اجتماع تاني بعده"],
            correct: 1
        },
        {
            question: "لما التاسك يكون كبير قوي، أول رد فعل بيكون:",
            answers: ["'ولا يهمنا 💪'", "'دي بسيطة'", "'طب نبدأ منين؟ 😂'", "حسبي الله ونعمه الوكيل"],
            correct: 3
        },
        {
            question: "أكتر حاجة مستحيل تحصل: 😂",
            answers: ["نبدأ الميتينج في معاده", "التاسك يخلص من أول مرّة", "الجروب يفضل ساكت يوم كامل", "محدش يعمل ميم"],
            correct: 0
        },
        {
            question: "أول انطباعك عن الفايس كان إيه؟ 😄",
            answers: ["شكلها/شكله جد جدًا 😳", "طاقة إيجابية ودم خفيف", "بيخوف شوية بس شكله طيب 😅", "حسيت إننا أصحاب من أول دقيقة 😎"],
            correct: 1
        },
        {
            question: "لما الهيد بدأ يتكلم عن الخطة، كان إحساسك؟ 😂",
            answers: ["'هو أنا في محاضرة ولا ميتنج؟' 😅", "'واو الخطة جامدة ومتحمسة!' 💪", "'أنا مش فاهم بس ماشي مع التيار'", "حاسس اني هستفاد اوي"],
            correct: 2
        },
        // Branch Questions
        {
            question: "🟦 ما هو الاختصار الصحيح لـ IEEE؟",
            answers: ["International Electrical and Energy Engineers", "Institute of Electrical and Electronics Engineers", "International Engineers of Energy and Electricity", "International Engineering of Electric Experts"],
            correct: 1
        },
        {
            question: "🟦 في أي سنة تأسست منظمة IEEE؟",
            answers: ["1884", "1900", "1945", "2001"],
            correct: 0
        },
        {
            question: "🟦 ما هو الهدف الأساسي من IEEE؟",
            answers: ["نشر ثقافة التكنولوجيا والعلم والهندسة", "تنظيم حفلات ترفيهية", "تطوير تطبيقات تواصل اجتماعي", "تقديم خدمات توصيل كهرباء"],
            correct: 0
        },
        {
            question: "🟦 أين يقع المقر الرئيسي لمنظمة IEEE؟",
            answers: ["نيويورك", "لندن", "طوكيو", "باريس"],
            correct: 0
        },
        {
            question: "🟦 IEEE تعتبر أكبر منظمة عالمية لـ...؟",
            answers: ["الأطباء", "المهندسين", "الفنانين", "المحامين"],
            correct: 1
        },
        {
            question: "🟦 ما عدد الأعضاء تقريبًا في IEEE حول العالم؟",
            answers: ["100 ألف", "400 ألف", "مليون", "50 ألف"],
            correct: 1
        },
        {
            question: "🟦 في IEEE، كلمة 'Student Branch' معناها إيه؟",
            answers: ["لجنة للمحاسبين", "فرع طلابي تابع لـ IEEE داخل الجامعة", "مكتب هندسي", "نشاط رياضي"],
            correct: 1
        },
        {
            question: "🟦 من اللجان أو الـTeams اللي ممكن تلاقيها داخل IEEE؟",
            answers: ["HR", "PR", "Technical", "كل ما سبق"],
            correct: 3
        },
        {
            question: "🟦 الـ IEEE بتقدم أنواع أنشطة مختلفة منها...",
            answers: ["ورش عمل تقنية", "مسابقات وبرامج تدريب", "فعاليات توعوية", "كل ما سبق"],
            correct: 3
        },
        {
            question: "🟦 إيه أشهر مؤتمر بيعمله IEEE سنويًا عالميًا؟",
            answers: ["CES", "IEEE Global Congress", "IEEE Xplore Conference", "IEEE International Conference"],
            correct: 3
        },
        {
            question: "🟦 منصة الأبحاث التابعة لـ IEEE اسمها إيه？",
            answers: ["IEEE Explore", "IEEE Learn", "IEEE Hub", "IEEE Docs"],
            correct: 0
        },
        {
            question: "🟦 شعار IEEE فيه رمز شكله دايمًا...",
            answers: ["نجمة", "مغناطيس", "معين (Diamond) فيه سهم كهربائي", "موجة صوت"],
            correct: 2
        },
        {
            question: "🟦 أحد أهم أهداف IEEE للطلاب هو...",
            answers: ["تطوير مهاراتهم التقنية والقيادية", "تنظيم رحلات", "بيع منتجات إلكترونية", "مساعدة في الواجبات فقط"],
            correct: 0
        },
        {
            question: "🟦 إيه الميزة اللي بتخلي IEEE مختلفة عن باقي الأنشطة الطلابية？",
            answers: ["إنها بتركّز على التكنولوجيا والهندسة", "إنها فيها مسابقات غناء", "إنها بتقدم كورسات لغة", "إنها نشاط اجتماعي فقط"],
            correct: 0
        },
        {
            question: "🟦 الانضمام لـ IEEE بيخليك...",
            answers: ["تتعرف على ناس جديدة", "تكتسب مهارات جديدة", "تشارك في مشاريع ومؤتمرات", "كل ما سبق"],
            correct: 3 }
    ]
};

// Quiz State
let currentQuizState = {
    questions: [],
    currentQuestionIndex: 0,
    totalPoints: 0,
    answered: false,
    selectedAnswer: null,
    timer: null
};

// DOM Elements
const timerFill = document.querySelector('.timer-fill');
const timerText = document.querySelector('.timer-text');
const questionText = document.getElementById('questionText');
const nextStageModal = document.getElementById('nextStageModal');
const nextStageButton = document.getElementById('nextStageButton');

// Initialize Quiz
function initializeQuiz() {
    currentQuizState = {
        questions: [],
        currentQuestionIndex: 0,
        totalPoints: 0,
        answered: false,
        selectedAnswer: null,
        timer: null
    };

    currentQuizState.questions = shuffleArray([...quizData.questions]);

    if (currentQuizState.questions.length === 0) {
        questionText.textContent = "Error: No questions available!";
        return;
    }

    updateTotalQuestionsCount();
    loadQuestion();
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Load current question
function loadQuestion() {
    const currentQuestion = currentQuizState.questions[currentQuizState.currentQuestionIndex];
    
    if (!currentQuestion) {
        showNextStage();
        return;
    }

    currentQuizState.answered = false;
    currentQuizState.selectedAnswer = null;

    questionText.textContent = currentQuestion.question || "Error loading question!";
    document.getElementById('difficultyBadge').style.display = 'none'; // Hide difficulty badge

    currentQuestion.answers.forEach((answer, index) => {
        const answerElement = document.getElementById('answer' + index);
        if (answerElement) {
            answerElement.textContent = answer || "No answer available!";
        }
    });

    updateProgress();

    document.getElementById('feedbackSection').style.display = 'none';

    document.querySelectorAll('.answer-option').forEach((option, index) => {
        option.classList.remove('selected', 'correct', 'incorrect', 'disabled');
        option.style.pointerEvents = 'auto';
        option.onclick = () => selectAnswer(index);
    });

    // Start Timer
    startTimer(10);
}

// Start Timer
function startTimer(seconds) {
    clearInterval(currentQuizState.timer);
    let timeLeft = seconds;
    timerText.textContent = timeLeft;

    const totalPerimeter = 219; // 2 * π * 35
    const decrement = totalPerimeter / seconds;

    timerFill.style.strokeDashoffset = totalPerimeter;
    timerFill.style.transition = 'none'; // Reset transition

    // Force reflow to apply initial state
    timerFill.getBoundingClientRect();

    timerFill.style.transition = `stroke-dashoffset ${seconds}s linear`;
    currentQuizState.timer = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;
        const dashOffset = totalPerimeter - (seconds - timeLeft) * decrement;
        timerFill.style.strokeDashoffset = dashOffset;

        if (timeLeft <= 0) {
            clearInterval(currentQuizState.timer);
            handleTimeout(currentQuizState.questions[currentQuizState.currentQuestionIndex]);
        }
    }, 1000);
}

// Handle timeout (auto move to next question as incorrect)
function handleTimeout(question) {
    currentQuizState.answered = true;
    document.querySelectorAll('.answer-option').forEach(option => {
        option.style.pointerEvents = 'none';
    });

    setTimeout(() => {
        showFeedback(false, question, -1);
    }, 300);
}

// Select an answer
function selectAnswer(answerIndex) {
    if (currentQuizState.answered) return;

    const currentQuestion = currentQuizState.questions[currentQuizState.currentQuestionIndex];
    const answerOption = document.querySelector('[data-answer="' + answerIndex + '"]');

    currentQuizState.selectedAnswer = answerIndex;
    currentQuizState.answered = true;

    answerOption.classList.add('selected');
    document.querySelectorAll('.answer-option').forEach(option => {
        option.style.pointerEvents = 'none';
    });

    clearInterval(currentQuizState.timer);

    setTimeout(() => {
        showFeedback(answerIndex === currentQuestion.correct, currentQuestion, answerIndex);
    }, 300);
}

// Create celebration effects
function createCelebrationEffects() {
    for (let i = 0; i < 12; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti celebrate';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '50%';
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA502', '#00D084'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 1000);
    }
}

// Create points popup
function createPointsPopup(points) {
    const popup = document.createElement('div');
    popup.className = 'points-popup';
    popup.textContent = '+' + points;
    popup.style.left = Math.random() * 80 + 10 + '%';
    popup.style.top = '50%';
    document.body.appendChild(popup);
    
    setTimeout(() => popup.remove(), 1000);
}

// Show feedback
function showFeedback(isCorrect, question, selectedIndex) {
    const feedbackSection = document.getElementById('feedbackSection');
    const feedbackContent = document.getElementById('feedbackContent');
    const correctOption = document.querySelector('[data-answer="' + question.correct + '"]');
    let selectedOption;
    if (selectedIndex !== -1) {
        selectedOption = document.querySelector('[data-answer="' + selectedIndex + '"]');
    }

    if (isCorrect) {
        selectedOption.classList.add('correct');
        feedbackContent.innerHTML = '<span class="feedback-icon">✓</span> Correct! You earned 5 points!';
        feedbackContent.classList.add('correct');
        feedbackContent.style.color = 'var(--success-green)';
        
        currentQuizState.totalPoints += 5;

        createCelebrationEffects();
        createPointsPopup(5);

        playCorrectSound();
    } else {
        if (selectedOption) {
            selectedOption.classList.add('incorrect');
        }
        correctOption.classList.add('correct');
        feedbackContent.innerHTML = '<span class="feedback-icon">✗</span> Incorrect! The correct answer is ' + String.fromCharCode(65 + question.correct) + '.';
        feedbackContent.classList.add('incorrect');
        feedbackContent.style.color = 'var(--error-red)';

        playIncorrectSound();
    }

    updatePointsDisplay();
    feedbackSection.style.display = 'block';
}

// Update points display
function updatePointsDisplay() {
    document.getElementById('pointsValue').textContent = currentQuizState.totalPoints;
}

// Update progress
function updateProgress() {
    const progress = ((currentQuizState.currentQuestionIndex + 1) / currentQuizState.questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = currentQuizState.currentQuestionIndex + 1;
}

// Update total questions count
function updateTotalQuestionsCount() {
    document.getElementById('totalQuestions').textContent = currentQuizState.questions.length;
}

// Next question
function nextQuestion() {
    currentQuizState.currentQuestionIndex++;
    
    if (currentQuizState.currentQuestionIndex < currentQuizState.questions.length) {
        loadQuestion();
    } else {
        showNextStage();
    }
}

// Show next stage
async function showNextStage() {
    const modal = document.getElementById('nextStageModal');
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || localStorage.getItem('userEmail');

    if (email) {
        const playersRef = collection(db, "players");
        const q = query(playersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docSnapshot) => {
            // Get current points from Firebase
            const currentPoints = docSnapshot.data().points || 0;
            // Update with the new total from Quiz
            const newTotalPoints = currentQuizState.totalPoints + currentPoints;
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

    modal.style.display = 'flex';
}

// Restart quiz
function restartQuiz() {
    document.getElementById('nextStageModal').style.display = 'none';
    initializeQuiz();
}

// Play correct sound
function playCorrectSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        osc1.frequency.value = 800;
        osc1.type = 'sine';
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc1.start(now);
        osc1.stop(now + 0.15);
        
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 1200;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.2, now);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc2.start(now);
        osc2.stop(now + 0.1);
    } catch (e) {
        console.log('Audio context not available');
    }
}

// Play incorrect sound
function playIncorrectSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(400, now + 0.1);
        osc.type = 'square';
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        
        osc.start(now);
        osc.stop(now + 0.25);
    } catch (e) {
        console.log('Audio context not available');
    }
}

// Show alert
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

// Event listeners
document.getElementById('nextButton').addEventListener('click', nextQuestion);
document.getElementById('nextStageButton').addEventListener('click', () => {
    window.location.href = 'cards.html';
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeQuiz);