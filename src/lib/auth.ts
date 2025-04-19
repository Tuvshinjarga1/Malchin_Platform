import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { User } from "@/types";

// Шинэ хэрэглэгч бүртгэх
export const registerUser = async (
  email: string,
  password: string,
  userData: {
    name: string;
    role: "herder" | "customer";
    phoneNumber?: string;
    location?: string;
  }
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
    const timestamp = Date.now();
    const userDoc: User = {
      id: user.uid,
      email: email,
      name: userData.name,
      role: userData.role,
      phoneNumber: userData.phoneNumber || "",
      location: userData.location || "",
      createdAt: timestamp,
    };

    await setDoc(doc(db, "users", user.uid), userDoc);
    return { success: true, userId: user.uid };
  } catch (error: any) {
    let errorMessage = "Бүртгүүлэхэд алдаа гарлаа";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Энэ и-мэйл хаяг бүртгэлтэй байна";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "И-мэйл хаяг буруу байна";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Нууц үг хэтэрхий богино байна";
    }
    return { success: false, error: errorMessage };
  }
};

// Нэвтрэх
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return { success: true, userId: user.uid };
  } catch (error: any) {
    let errorMessage = "Нэвтрэхэд алдаа гарлаа";
    if (error.code === "auth/user-not-found") {
      errorMessage = "И-мэйл хаяг олдсонгүй";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Нууц үг буруу байна";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "И-мэйл хаяг буруу байна";
    }
    return { success: false, error: errorMessage };
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

// Хэрэглэгчийн профайл шинэчлэх
export const updateUserProfile = async (
  userId: string,
  userData: {
    name?: string;
    phoneNumber?: string;
    location?: string;
  }
) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Date.now(),
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return { success: false, error: error.message };
  }
};
