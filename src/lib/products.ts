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
import { db } from "./firebase";
import { Product } from "@/types";
import { uploadImage } from "./images";

// Шинэ бүтээгдэхүүн нэмэх
export const addProduct = async (
  productData: Omit<Product, "id" | "createdAt" | "updatedAt" | "status">,
  imageFiles: File[]
) => {
  try {
    // Firestore дээр шинэ документ үүсгэх
    const productRef = doc(collection(db, "products"));
    const productId = productRef.id;

    // Зургуудыг ImgBB руу upload хийх
    const imageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        try {
          return await uploadImage(file);
        } catch (error) {
          console.error("Error uploading image:", error);
          throw new Error("Зураг хуулахад алдаа гарлаа");
        }
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
  category?: string,
  subcategory?: string,
  searchTerm?: string
) => {
  try {
    // Firestore-ийн үндсэн query
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

      // Хэрэв subcategory мөн байвал filter хийх
      if (subcategory) {
        productsQuery = query(
          collection(db, "products"),
          where("status", "==", "approved"),
          where("category", "==", category),
          where("subCategory", "==", subcategory),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }
    }

    // Pagination
    if (lastDoc) {
      productsQuery = query(productsQuery, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(productsQuery);
    let products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push(doc.data() as Product);
    });

    // Хэрэв хайлт байвал client side дээр filter хийх
    // (Firestore дээр текстээр хайх боломжгүй тул)
    if (searchTerm && searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      products = products.filter((product) => {
        return (
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.herderName.toLowerCase().includes(searchLower)
        );
      });
    }

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

// Админ бүх бүтээгдэхүүнийг авах
export const getAllProducts = async () => {
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push(doc.data() as Product);
    });

    return { success: true, products };
  } catch (error: any) {
    console.error("Error getting all products:", error);
    return { success: false, error: error.message };
  }
};

// Бүтээгдэхүүнийг устгах
export const deleteProduct = async (productId: string) => {
  try {
    await deleteDoc(doc(db, "products", productId));
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
};
