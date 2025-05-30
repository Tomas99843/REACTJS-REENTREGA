import { db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const createOrder = async (order) => {
  try {
    const ordersRef = collection(db, "orders");
    const docRef = await addDoc(ordersRef, {
      ...order,
      date: serverTimestamp(), // Usamos timestamp de Firestore
      status: "generada"
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("No se pudo crear la orden. Intente nuevamente.");
  }
};