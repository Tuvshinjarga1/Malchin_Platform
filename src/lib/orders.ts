import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { Order, Product } from "@/types";

// Захиалга үүсгэх
export const createOrder = async (
  orderData: Omit<Order, "id" | "createdAt" | "updatedAt" | "status">
) => {
  try {
    // Firestore дээр захиалгын документ үүсгэх
    const orderRef = doc(collection(db, "orders"));
    const orderId = orderRef.id;

    // Захиалгын мэдээллийг хадгалах
    const timestamp = Date.now();
    await setDoc(orderRef, {
      ...orderData,
      id: orderId,
      status: "pending",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return { success: true, orderId };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
};

// Захиалгын мэдээллийг авах
export const getOrder = async (orderId: string): Promise<Order | null> => {
  try {
    const orderDoc = await getDoc(doc(db, "orders", orderId));
    if (orderDoc.exists()) {
      return orderDoc.data() as Order;
    }
    return null;
  } catch (error) {
    console.error("Error getting order:", error);
    return null;
  }
};

// Захиалгын статусыг шинэчлэх (малчин, админ хэрэглэнэ)
export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"]
) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Date.now(),
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }
};

// Хэрэглэгчийн бүх захиалгыг авах
export const getCustomerOrders = async (customerId: string) => {
  try {
    const q = query(
      collection(db, "orders"),
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      orders.push(doc.data() as Order);
    });

    return { success: true, orders };
  } catch (error: any) {
    console.error("Error getting customer orders:", error);
    return { success: false, error: error.message };
  }
};

// Малчны бүх захиалгыг авах
export const getHerderOrders = async (herderId: string) => {
  try {
    const q = query(
      collection(db, "orders"),
      where("herderId", "==", herderId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      orders.push(doc.data() as Order);
    });

    return { success: true, orders };
  } catch (error: any) {
    console.error("Error getting herder orders:", error);
    return { success: false, error: error.message };
  }
};
