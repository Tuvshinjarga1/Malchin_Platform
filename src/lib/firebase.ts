import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase тохиргоо (Firebase консол дээрээс авах)
const firebaseConfig = {
  apiKey: "AIzaSyC6FftXyRidX1Q565qK3neHAAqBHxn_JO4",
  authDomain: "malchin-5f2cb.firebaseapp.com",
  projectId: "malchin-5f2cb",
  storageBucket: "malchin-5f2cb.firebasestorage.app",
  messagingSenderId: "213099704404",
  appId: "1:213099704404:web:9538ba7eb6091c3f5efdc1",
  measurementId: "G-NBKZ6NL84R",
};

// Ensure Firebase is initialized only once
let app: FirebaseApp;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error; // Re-throw to prevent undefined app usage
  }
} else {
  app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
