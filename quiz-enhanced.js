// Add these functions to quiz.js

// Create celebration effects
function createCelebrationEffects() {
    // Create multiple confetti particles
    for (let i = 0; i < 12; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti celebrate';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '50%';
        confetti.style.backgroundColor = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA502', '#00D084'][Math.floor(Math.random() * 5)];
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 1000);
    }
}

// Create points popup
function createPointsPopup(points) {
    const popup = document.createElement('div');
    popup.className = 'points-popup';
    popup.textContent = `+${points}`;
    popup.style.left = Math.random() * 80 + 10 + '%';
    popup.style.top = '50%';
    document.body.appendChild(popup);
    
    setTimeout(() => popup.remove(), 1000);
}

// Enhanced Play correct sound
function playCorrectSoundEnhanced() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        // Main tone
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
        
        // Higher harmonic
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

// Enhanced Play incorrect sound
function playIncorrectSoundEnhanced() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        // Create a "buzz" sound
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
