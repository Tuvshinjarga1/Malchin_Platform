"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { Product } from "@/types";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

export function useCart() {
  return useContext(CartContext);
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Auth өөрчлөлтийг шууд авах
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });

    return () => unsubscribe();
  }, []);

  // Хэрэглэгч нэвтрэх/гарах үед сагсны мэдээллийг ачаалах
  useEffect(() => {
    if (typeof window !== "undefined") {
      loadCartData();
    }
  }, [userId]);

  // Сагсны мэдээллийг локал хранилгаас ачаалах
  const loadCartData = () => {
    try {
      const storageKey = userId ? `cart_${userId}` : "cart";
      console.log("Loading cart with key:", storageKey);
      const savedCart = localStorage.getItem(storageKey);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
        console.log("Loaded cart items:", parsedCart.length);
      } else {
        setItems([]);
        console.log("No saved cart found, setting empty cart");
      }
      setIsInitialized(true);
    } catch (error) {
      console.error("Сагсны мэдээлэл уншихад алдаа гарлаа:", error);
      setItems([]);
      setIsInitialized(true);
    }
  };

  // Сагсны мэдээлэл өөрчлөгдөх бүрт хадгалах
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      const storageKey = userId ? `cart_${userId}` : "cart";

      if (items.length > 0) {
        console.log(
          "Saving cart with key:",
          storageKey,
          "items:",
          items.length
        );
        localStorage.setItem(storageKey, JSON.stringify(items));
        const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
        const price = items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );
        setTotalItems(itemCount);
        setTotalPrice(price);
      } else {
        console.log("Removing cart with key:", storageKey);
        localStorage.removeItem(storageKey);
        setTotalItems(0);
        setTotalPrice(0);
      }
    }
  }, [items, isInitialized, userId]);

  const addToCart = (product: Product, quantity: number) => {
    console.log("Adding to cart:", product.title, "qty:", quantity);
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        console.log("Updated existing item quantity");
        return updatedItems;
      } else {
        console.log("Added new item to cart");
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    console.log("Removing from cart:", productId);
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    console.log("Updating quantity for:", productId, "new qty:", quantity);
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    console.log("Clearing cart");
    setItems([]);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
