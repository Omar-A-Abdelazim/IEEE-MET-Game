// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

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

// Save user data
async function saveUserData(name, email) {
  try {
    const docRef = await addDoc(collection(db, "players"), {
      name: name,
      email: email,
      points: 0,
      timestamp: new Date()
    });
    showAlert("🚀 Welcome " + name + "! You're now registered!", "success");
    // Store email in localStorage and navigate to quiz page
    localStorage.setItem('userEmail', email);
    setTimeout(() => window.location.href = `quiz.html?email=${encodeURIComponent(email)}`, 1000);
  } catch (error) {
    console.error("Error saving user:", error);
    showAlert("Something went wrong. Try again.", "error");
  }
}

// Handle form submission
document.getElementById('signin-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!username || !email) {
    showAlert('Please fill in all fields', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showAlert('Please enter a valid email address', 'error');
    return;
  }

  saveUserData(username, email);
  this.reset();
});

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
}

// Animation for alerts
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