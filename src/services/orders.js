import { db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const createOrder = async (order) => {
  try {
    
    if (!order.buyer?.email || !order.items?.length) {
      throw new Error("Faltan datos esenciales: email o items");
    }

    
    const isValidItems = order.items.every(item => 
      item.id && item.title && item.price && item.quantity
    );
    if (!isValidItems) {
      throw new Error("Uno o más items tienen formato incorrecto");
    }

    const orderData = {
      buyer: {
        name: order.buyer.name || 'Cliente no identificado',
        email: order.buyer.email,
        phone: order.buyer.phone || 'No proporcionado'
      },
      items: order.items.map(item => ({
        id: item.id,
        title: item.title,
        price: Number(item.price),
        quantity: Number(item.quantity),
        ...(item.image && { image: item.image }) 
      })),
      total: Number(order.total),
      date: serverTimestamp(),
      status: "generada"
    };

    const ordersRef = collection(db, "orders");
    const docRef = await addDoc(ordersRef, orderData);
    
    return {
      id: docRef.id,
      ...orderData,
      date: new Date().toISOString() 
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(
      error.message || "No se pudo crear la orden. Intente nuevamente."
    );
  }
};