import { db } from './firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export const CATEGORIES = Object.freeze({
  SMARTPHONES: 'iphones',
  LAPTOPS: 'macbooks',
  SMARTWATCHES: 'smartwatches'
});

const productCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos de caché

// Limpiar caché periódicamente
setInterval(() => {
  productCache.clear();
}, CACHE_TTL);

const normalizeProduct = (doc) => {
  const data = doc.data();
  return {
    id: doc.id, // ID principal (de Firestore)
    firestoreId: doc.id, // Compatibilidad con código existente
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

/**
 * Busca productos por término (título o keywords).
 * @param {string} searchTerm - Término de búsqueda.
 * @returns {Promise<Array>} Lista de productos filtrados.
 */
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

/**
 * Obtiene todos los productos desde Firestore (con caché).
 * @returns {Promise<Array>} Lista completa de productos.
 */
export const getProducts = async () => {
  try {
    // Descomenta para limpiar caché durante pruebas:
    // productCache.delete('ALL_PRODUCTS');

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

/**
 * Obtiene un producto específico por ID desde Firestore.
 * @param {string} id - ID del producto en Firestore.
 * @returns {Promise<Object|null>} Datos del producto o null si no existe.
 * @throws {Error} Si el ID es inválido o hay un error técnico.
 */
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

/**
 * Obtiene productos filtrados por categoría.
 * @param {string} category - Categoría (ej: 'iphones').
 * @returns {Promise<Array>} Lista de productos en la categoría.
 */
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

/**
 * Obtiene categorías con conteo de productos.
 * @returns {Promise<Array>} Lista de categorías formateadas.
 */
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

/**
 * Traduce el ID de categoría a nombre legible.
 * @param {string} categoryId - ID de categoría (ej: 'iphones').
 * @returns {string} Nombre formateado (ej: 'iPhone').
 */
export const getCategoryName = (categoryId) => {
  const names = {
    iphones: 'iPhone',
    macbooks: 'MacBook',
    smartwatches: 'Apple Watch'
  };
  return names[categoryId] || categoryId;
};