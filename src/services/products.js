import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc 
} from 'firebase/firestore';

// Categorías de productos
export const CATEGORIES = Object.freeze({
  SMARTPHONES: 'iphones',
  LAPTOPS: 'macbooks',
  SMARTWATCHES: 'smartwatches'
});

// Nombres para mostrar en el NavBar
const CATEGORY_NAMES = Object.freeze({
  iphones: 'iPhone',
  macbooks: 'MacBook',
  smartwatches: 'Apple Watch'
});

// Obtener nombre legible de categoría
export const getCategoryName = (categoryId) => {
  return CATEGORY_NAMES[categoryId] || categoryId;
};

// Validación de productos (usa ID de Firestore)
const validateProductData = (docData, firestoreId) => {
  return {
    firestoreId: firestoreId, // ID automático de Firestore
    title: docData.title || 'Sin título',
    price: Number(docData.price) || 0,
    category: Object.values(CATEGORIES).includes(docData.category) 
      ? docData.category 
      : CATEGORIES.SMARTPHONES,
    imageUrl: docData.imageUrl || '/images/placeholder.png',
    description: docData.description || '',
    stock: Math.max(0, Number(docData.stock) || 0),
    keywords: Array.isArray(docData.keywords) ? docData.keywords : []
  };
};

// Cache de productos
const productCache = new Map();

// Obtener categorías formateadas para el NavBar
export const getFormattedCategories = async () => {
  try {
    const products = await getProducts();
    const categoryCounts = {};
    
    products.forEach(product => {
      if (Object.values(CATEGORIES).includes(product.category)) {
        categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
      }
    });

    return Object.values(CATEGORIES).map(categoryId => ({
      id: categoryId,
      name: getCategoryName(categoryId),
      count: categoryCounts[categoryId] || 0
    }));

  } catch (error) {
    console.error("Error al cargar categorías:", error);
    return Object.values(CATEGORIES).map(categoryId => ({
      id: categoryId,
      name: getCategoryName(categoryId),
      count: 0
    }));
  }
};

// Búsqueda de productos (versión mejorada)
export const searchProducts = async (searchTerm) => {
  try {
    const products = await getProducts();
    const term = searchTerm.toLowerCase().trim();
    
    const filteredProducts = products
      .filter(product => 
        product.title.toLowerCase().includes(term) ||
        (product.keywords || []).some(kw => kw.toLowerCase().includes(term))
      )
      .map(product => ({
        ...product,
        firestoreId: product.firestoreId // Garantiza que exista
      }));

    console.debug('Resultados de búsqueda:', filteredProducts);
    return filteredProducts;

  } catch (error) {
    console.error("Error en búsqueda:", error);
    return [];
  }
};

// Obtener todos los productos
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map(doc => 
      validateProductData(doc.data(), doc.id)
    );
    console.debug('Productos cargados:', products);
    return products;
  } catch (error) {
    console.error("Error al cargar productos:", error);
    return [];
  }
};

// Obtener producto por ID (usa ID de Firestore)
export const getProductById = async (id) => {
  if (!id) {
    console.error("Se intentó buscar un producto sin ID");
    throw new Error('ID de producto inválido');
  }

  if (productCache.has(id)) {
    return productCache.get(id);
  }

  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Producto no encontrado');
    }

    const productData = validateProductData(docSnap.data(), docSnap.id);
    productCache.set(id, productData);
    return productData;

  } catch (error) {
    console.error(`Error al cargar producto ${id}:`, error);
    throw error;
  }
};

// Obtener productos por categoría
export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, "products"), 
      where("category", "==", category)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      validateProductData(doc.data(), doc.id)
    );
  } catch (error) {
    console.error(`Error al cargar productos de ${category}:`, error);
    return [];
  }
};

// Limpiar cache cada 5 minutos
setInterval(() => {
  productCache.clear();
  console.log('Cache de productos limpiado');
}, 300000);