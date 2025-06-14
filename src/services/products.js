import { db } from './firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export const CATEGORIES = Object.freeze({
  SMARTPHONES: 'iphones',
  LAPTOPS: 'macbooks',
  SMARTWATCHES: 'smartwatches'
});

const productCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

setInterval(() => {
  productCache.clear();
}, CACHE_TTL);

const normalizeProduct = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    firestoreId: doc.id,
    title: data.title || 'Sin título',
    price: Number(data.price) || 0,
    category: Object.values(CATEGORIES).includes(data.category) 
      ? data.category 
      : CATEGORIES.SMARTPHONES,
    imageUrl: data.imageUrl || '/images/placeholder.png',
    description: data.description || '',
    stock: Math.max(0, Number(data.stock) || 0),
    keywords: Array.isArray(data.keywords) ? data.keywords : []
  };
};

export const searchProducts = async (searchTerm) => {
  try {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return [];

    const products = await getProducts();
    return products.filter(product => 
      product.title.toLowerCase().includes(term) ||
      (product.keywords || []).some(kw => kw.toLowerCase().includes(term))
    );
  } catch (error) {
    console.error("Error en búsqueda:", error);
    return [];
  }
};

export const getProducts = async () => {
  try {
    if (productCache.has('ALL_PRODUCTS')) {
      return productCache.get('ALL_PRODUCTS');
    }

    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map(normalizeProduct);
    
    productCache.set('ALL_PRODUCTS', products);
    return products;
  } catch (error) {
    console.error("Error al cargar productos:", error);
    return [];
  }
};

export const getProductById = async (id) => {
  if (!id || typeof id !== 'string') {
    console.error("ID de producto no válido:", id);
    throw new Error('ID de producto inválido');
  }

  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.warn(`Producto con ID ${id} no encontrado en Firestore`);
      return null;
    }

    return normalizeProduct(docSnap);
  } catch (error) {
    console.error(`Error al cargar producto ${id}:`, error);
    throw new Error('Error técnico al cargar el producto');
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, "products"), 
      where("category", "==", category)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(normalizeProduct);
  } catch (error) {
    console.error(`Error al cargar productos de ${category}:`, error);
    return [];
  }
};

export const getFormattedCategories = async () => {
  try {
    const products = await getProducts();
    const counts = {};
    
    products.forEach(p => {
      if (Object.values(CATEGORIES).includes(p.category)) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });

    return Object.values(CATEGORIES).map(id => ({
      id,
      name: getCategoryName(id),
      count: counts[id] || 0
    }));
  } catch (error) {
    console.error("Error al cargar categorías:", error);
    return [];
  }
};

export const getCategoryName = (categoryId) => {
  const names = {
    iphones: 'iPhone',
    macbooks: 'MacBook',
    smartwatches: 'Watch'
  };
  return names[categoryId] || categoryId;
};