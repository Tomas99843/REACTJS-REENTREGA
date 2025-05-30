import { db } from './firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export const CATEGORIES = {
  SMARTPHONES: 'iphones',
  LAPTOPS: 'macbooks',
  SMARTWATCHES: 'smartwatches'
};

const getCategoryName = (categoryId) => {
  const categoryNames = {
    [CATEGORIES.SMARTPHONES]: 'iPhone',
    [CATEGORIES.LAPTOPS]: 'Mac',
    [CATEGORIES.SMARTWATCHES]: 'Watch'
  };
  return categoryNames[categoryId] || categoryId;
};

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error al cargar los productos");
  }
};

export const getProductById = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }
    
    return { id: docSnap.id, ...docSnap.data() };
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
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const allProducts = await getProducts();
    return allProducts.filter(product => 
      product.title.toLowerCase().includes(query.toLowerCase())
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