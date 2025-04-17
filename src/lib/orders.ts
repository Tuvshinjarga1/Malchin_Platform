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
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Order, Product } from "@/types";

interface OrderInput {
  customerId: string;
  customerName: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
    title: string;
  }[];
  totalAmount: number;
  contactPhone: string;
  deliveryAddress: string;
  notes?: string;
}

interface OrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

// Захиалга үүсгэх
export async function createOrder(orderData: OrderInput): Promise<OrderResult> {
  try {
    // Бүтээгдэхүүний эзэмшигчийн ID олох (эхний бүтээгдэхүүний эзнийг авъя)
    if (orderData.products.length === 0) {
      return {
        success: false,
        error: "Бүтээгдэхүүн сонгогдоогүй байна",
      };
    }

    const firstProductId = orderData.products[0].productId;
    const productRef = doc(db, "products", firstProductId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return {
        success: false,
        error: "Бүтээгдэхүүн олдсонгүй",
      };
    }

    const productData = productSnap.data();
    const herderId = productData.herderId;

    const now = Date.now();

    const newOrder: Omit<Order, "id"> = {
      customerId: orderData.customerId,
      customerName: orderData.customerName,
      herderId: herderId,
      products: orderData.products,
      totalAmount: orderData.totalAmount,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      contactPhone: orderData.contactPhone,
      deliveryAddress: orderData.deliveryAddress,
    };

    const orderRef = await addDoc(collection(db, "orders"), newOrder);

    // Бүтээгдэхүүний үлдэгдлийг шинэчлэх
    for (const item of orderData.products) {
      const productRef = doc(db, "products", item.productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const productData = productSnap.data();
        const newQuantity = Math.max(0, productData.quantity - item.quantity);

        await updateDoc(productRef, {
          quantity: newQuantity,
          updatedAt: now,
        });
      }
    }

    return {
      success: true,
      orderId: orderRef.id,
    };
  } catch (error) {
    console.error("Захиалга үүсгэхэд алдаа гарлаа:", error);
    return {
      success: false,
      error: "Захиалга үүсгэхэд алдаа гарлаа",
    };
  }
}

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
export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      } as Order);
    });

    return orders;
  } catch (error) {
    console.error("Захиалга авахад алдаа гарлаа:", error);
    return [];
  }
}

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

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
      return {
        id: orderSnap.id,
        ...orderSnap.data(),
      } as Order;
    }

    return null;
  } catch (error) {
    console.error("Захиалга дэлгэрэнгүй авахад алдаа гарлаа:", error);
    return null;
  }
}
