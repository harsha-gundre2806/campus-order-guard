import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDo0khLjzcJtrjXGDtasHbtGFrzzOSJc3Y",
  authDomain: "campus-order-guard-d581c.firebaseapp.com",
  projectId: "campus-order-guard-d581c",
  storageBucket: "campus-order-guard-d581c.firebasestorage.app",
  messagingSenderId: "187810414744",
  appId: "1:187810414744:web:89a0a3fe10510fe93910ed",
  measurementId: "G-TFQN5S3N1C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
