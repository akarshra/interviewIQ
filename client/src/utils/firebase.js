import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-852be.firebaseapp.com",
  projectId: "interviewiq-852be",
  storageBucket: "interviewiq-852be.firebasestorage.app",
  messagingSenderId: "112903250456",
  appId: "1:112903250456:web:293aa3d6bb0ab80052d96d",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
