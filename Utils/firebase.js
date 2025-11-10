// src/Utils/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBgX7EbJtBiXklr4dEhOpuL0ZbbowBxknw",
  authDomain: "proba-2ef31.firebaseapp.com",
  projectId: "proba-2ef31",
  storageBucket: "proba-2ef31.firebasestorage.app",
  messagingSenderId: "863587597693",
  appId: "1:863587597693:web:2842998d1154386ae2a014",
  measurementId: "G-ZQW0N5XP4Z"
};

const app = initializeApp(firebaseConfig);

// 🔹 Esto es lo importante
export const db = getFirestore(app);
