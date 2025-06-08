import { db } from './firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

export const CATEGORIES = {
  SMARTPHONES: 'iphones',
  LAPTOPS: 'macbooks',
  SMARTWATCHES: 'smartwatches'
};

export const getCategoryName = (categoryId) => {
  const categoryNames = {
    iphones: 'iPhone',
    macbooks: 'Mac',
    smartwatches: 'Watch'
  };
  return categoryNames[categoryId] || categoryId;
};

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

export const getProductsByCategory = async (categoryId) => {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("category", "==", categoryId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      validateProductData({ id: doc.id, ...doc.data() })
    );
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const searchProducts = async (searchQuery) => {
  try {
    const searchTerm = searchQuery.toLowerCase().trim();
    
    const keywordsQuery = query(
      collection(db, "products"),
      where("keywords", "array-contains", searchTerm)
    );
    const keywordsSnapshot = await getDocs(keywordsQuery);
    const keywordsResults = keywordsSnapshot.docs.map(doc => 
      validateProductData({ id: doc.id, ...doc.data() })
    );

    const titleQuery = query(
      collection(db, "products"),
      where("title", ">=", searchTerm),
      where("title", "<=", searchTerm + "\uf8ff")
    );
    const titleSnapshot = await getDocs(titleQuery);
    const titleResults = titleSnapshot.docs.map(doc => 
      validateProductData({ id: doc.id, ...doc.data() })
    );

    const combinedResults = [...keywordsResults, ...titleResults];
    const uniqueResults = combinedResults.filter(
      (product, index, self) => index === self.findIndex(p => p.id === product.id)
    );

    return uniqueResults;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

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