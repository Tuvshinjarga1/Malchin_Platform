import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import { Product } from "@/types";

// Шинэ бүтээгдэхүүн нэмэх
export const addProduct = async (
  productData: Omit<Product, "id" | "createdAt" | "updatedAt" | "status">,
  imageFiles: File[]
) => {
  try {
    // Firestore дээр шинэ документ үүсгэх
    const productRef = doc(collection(db, "products"));
    const productId = productRef.id;

    // Зургуудыг Storage руу upload хийх
    const imageUrls = await Promise.all(
      imageFiles.map(async (file, index) => {
        const imageRef = ref(storage, `products/${productId}/${index}`);
        await uploadBytes(imageRef, file);
        return getDownloadURL(imageRef);
      })
    );

    // Бүтээгдэхүүний мэдээллийг хадгалах
    const timestamp = Date.now();
    await setDoc(productRef, {
      ...productData,
      id: productId,
      status: "pending", // Админ зөвшөөрөх хүлээгдэж байгаа
      images: imageUrls,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return { success: true, productId };
  } catch (error: any) {
    console.error("Error adding product:", error);
    return { success: false, error: error.message };
  }
};

// Бүтээгдэхүүний мэдээллийг авах
export const getProduct = async (
  productId: string
): Promise<Product | null> => {
  try {
    const productDoc = await getDoc(doc(db, "products", productId));
    if (productDoc.exists()) {
      return productDoc.data() as Product;
    }
    return null;
  } catch (error) {
    console.error("Error getting product:", error);
    return null;
  }
};

// Бүтээгдэхүүний мэдээллийг шинэчлэх
export const updateProduct = async (
  productId: string,
  updateData: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      ...updateData,
      updatedAt: Date.now(),
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
};

// Малчны бүх бүтээгдэхүүнийг авах
export const getHerderProducts = async (herderId: string) => {
  try {
    const q = query(
      collection(db, "products"),
      where("herderId", "==", herderId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push(doc.data() as Product);
    });

    return { success: true, products };
  } catch (error: any) {
    console.error("Error getting herder products:", error);
    return { success: false, error: error.message };
  }
};

// Бүх зөвшөөрөгдсөн бүтээгдэхүүнийг авах (pagination-тэй)
export const getApprovedProducts = async (
  lastDoc: DocumentSnapshot | null = null,
  pageSize = 10,
  category?: string
) => {
  try {
    let productsQuery = query(
      collection(db, "products"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    // Хэрэв category байвал filter хийх
    if (category) {
      productsQuery = query(
        collection(db, "products"),
        where("status", "==", "approved"),
        where("category", "==", category),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );
    }

    // Pagination
    if (lastDoc) {
      productsQuery = query(productsQuery, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(productsQuery);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push(doc.data() as Product);
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    return {
      success: true,
      products,
      lastDoc: lastVisible,
    };
  } catch (error: any) {
    console.error("Error getting approved products:", error);
    return { success: false, error: error.message };
  }
};

// Админ хүлээгдэж буй бүтээгдэхүүнүүдийг авах
export const getPendingProducts = async () => {
  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push(doc.data() as Product);
    });

    return { success: true, products };
  } catch (error: any) {
    console.error("Error getting pending products:", error);
    return { success: false, error: error.message };
  }
};

// Админ зөвшөөрөх/цуцлах
export const updateProductStatus = async (
  productId: string,
  status: "approved" | "rejected"
) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      status,
      updatedAt: Date.now(),
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating product status:", error);
    return { success: false, error: error.message };
  }
};
