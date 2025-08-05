// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";

// Config
const firebaseConfig = {
  apiKey: "AIzaSyAnpARX4M8RxzLrVa1ay4cGo2NRGcHnirs",
  authDomain: "trading-journal-ai-8769b.firebaseapp.com",
  projectId: "trading-journal-ai-8769b",
  storageBucket: "trading-journal-ai-8769b.firebasestorage.app",
  messagingSenderId: "15290027314",
  appId: "1:15290027314:web:492524ec658555ed981b2b",
  measurementId: "G-JT7DELQS4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut };
