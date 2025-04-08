import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "@/types";

// Шинэ хэрэглэгч бүртгэх
export const registerUser = async (
  email: string,
  password: string,
  userData: Omit<User, "id" | "createdAt">
) => {
  try {
    // Firebase Auth дээр хэрэглэгч үүсгэх
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Firestore дээр хэрэглэгчийн мэдээллийг хадгалах
    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      id: user.uid,
      createdAt: Date.now(),
    });

    return { success: true, user };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Нэвтрэх
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Гарах
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Хэрэглэгчийн мэдээлэл авах
export const getUserData = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};
