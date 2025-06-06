import { db } from './firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export const CATEGORIES = {
  SMARTPHONES: 'iphones',
  LAPTOPS: 'macbooks',
  SMARTWATCHES: 'smartwatches'
};

// Función para obtener nombres de categorías formateados
export const getCategoryName = (categoryId) => {
  const categoryNames = {
    iphones: 'iPhone',
    macbooks: 'Mac',
    smartwatches: 'Watch'
  };
  return categoryNames[categoryId] || categoryId;
};

// Función para validar estructura de productos
const validateProductData = (productData) => {
  return {
    id: productData.id,
    title: productData.title || 'Sin título',
    price: productData.price || 0,
    category: productData.category || CATEGORIES.SMARTPHONES,
    stock: productData.stock || 0,
    imageUrl: productData.imageUrl || '/images/placeholder-product.png',
    description: productData.description || '',
    keywords: productData.keywords || []
  };
};

// Obtener todas las categorías formateadas
export const getFormattedCategories = async () => {
  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const uniqueCategories = [...new Set(products.map(p => p.category))];
    
    return uniqueCategories.map(cat => ({
      id: cat,
      name: getCategoryName(cat),
      count: products.filter(p => p.category === cat).length
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Object.values(CATEGORIES).map(id => ({
      id,
      name: getCategoryName(id),
      count: 0
    }));
  }
};

// Obtener todos los productos
export const getProducts = async () => {
  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);
    return querySnapshot.docs.map(doc => 
      validateProductData({ id: doc.id, ...doc.data() })
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Obtener producto por ID
export const getProductById = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Producto no encontrado');
    }
    
    return validateProductData({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Búsqueda de productos
export const searchProducts = async (searchQuery) => {
  try {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef,
      where("keywords", "array-contains", searchQuery.toLowerCase())
    );
    
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => 
      validateProductData({ id: doc.id, ...doc.data() })
    );

    return results.length > 0 ? results : await getProducts(); // Fallback
  } catch (error) {
    console.error("Error searching products:", error);
    return await getProducts(); // Fallback completo
  }
};