import { db } from './firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export const CATEGORIES = {
  SMARTPHONES: 'iphones',
  LAPTOPS: 'macbooks',
  SMARTWATCHES: 'smartwatches'
};

export const getCategoryName = (categoryId) => {
  const categoryNames = {
    [CATEGORIES.SMARTPHONES]: 'iPhone',
    [CATEGORIES.LAPTOPS]: 'Mac',
    [CATEGORIES.SMARTWATCHES]: 'Watch'
  };
  return categoryNames[categoryId] || categoryId;
};

export const getProducts = async () => {
  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      title: doc.data().title || 'Sin título',
      price: doc.data().price || 0,
      category: doc.data().category || CATEGORIES.SMARTPHONES,
      stock: doc.data().stock || 0
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error al cargar los productos");
  }
};

export const getAllProducts = async () => {
  return await getProducts();
};

export const getProductById = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }
    
    return { 
      id: docSnap.id, 
      ...docSnap.data(),
      title: docSnap.data().title || 'Sin título',
      price: docSnap.data().price || 0,
      stock: docSnap.data().stock || 0
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const validCategories = Object.values(CATEGORIES);
    if (!validCategories.includes(categoryId)) {
      throw new Error(`Categoría ${categoryId} no válida`);
    }

    const q = query(
      collection(db, "products"),
      where("category", "==", categoryId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      title: doc.data().title || 'Sin título',
      price: doc.data().price || 0,
      stock: doc.data().stock || 0
    }));
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const searchProducts = async (searchQuery) => {
  try {
    const allProducts = await getProducts();
    return allProducts.filter(product => 
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const getFormattedCategories = async () => {
  try {
    const products = await getProducts();
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    
    return uniqueCategories.map(cat => ({
      id: cat,
      name: getCategoryName(cat),
      count: products.filter(p => p.category === cat).length
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Object.entries(CATEGORIES).map(([key, id]) => ({
      id,
      name: getCategoryName(id),
      count: 0
    }));
  }
};