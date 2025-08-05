// welcome-script.js (Firebase enabled)
import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from './firebase.js';

class WelcomePage {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('login-btn').addEventListener('click', () => {
      this.showLoginModal();
    });
    document.getElementById('register-btn').addEventListener('click', () => {
      this.showRegisterModal();
    });
    document.getElementById('close-login').addEventListener('click', () => {
      this.hideModal('login-modal');
    });
    document.getElementById('close-register').addEventListener('click', () => {
      this.hideModal('register-modal');
    });
    document.getElementById('switch-to-register').addEventListener('click', (e) => {
      e.preventDefault();
      this.hideModal('login-modal');
      this.showRegisterModal();
    });
    document.getElementById('switch-to-login').addEventListener('click', (e) => {
      e.preventDefault();
      this.hideModal('register-modal');
      this.showLoginModal();
    });

    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.loginUser();
    });
    document.getElementById('register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.registerUser();
    });
  }

  async loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('currentUserId', user.uid);
      localStorage.setItem('userEmail', user.email);
      window.location.href = 'main.html';
    } catch (error) {
      alert('فشل تسجيل الدخول: ' + error.message);
    }
  }

  async registerUser() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const agreeTerms = document.getElementById('agree-terms').checked;

    if (password !== confirmPassword) {
      alert('كلمة المرور غير متطابقة');
      return;
    }
    if (!agreeTerms) {
      alert('يجب الموافقة على الشروط');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('currentUserId', user.uid);
      localStorage.setItem('userEmail', user.email);
      alert('تم إنشاء الحساب بنجاح');
      window.location.href = 'main.html';
    } catch (error) {
      alert('فشل في إنشاء الحساب: ' + error.message);
    }
  }

  showLoginModal() {
    document.getElementById('login-modal').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  showRegisterModal() {
    document.getElementById('register-modal').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  hideModal(id) {
    document.getElementById(id).classList.remove('show');
    document.body.style.overflow = 'auto';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new WelcomePage();
});
