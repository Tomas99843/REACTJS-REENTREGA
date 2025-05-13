// Definimos constantes para las categorías para evitar errores de escritura
export const CATEGORIES = {
  SMARTPHONES: 'iphones',
  LAPTOPS: 'macbooks',
  SMARTWATCHES: 'smartwatches'
};

const products = [
  // Apple Watch Models
  {
    id: 1,
    title: "Apple Watch Series 10",
    category: CATEGORIES.SMARTWATCHES,
    price: 399,
    description: "Thinnest design with largest display...",
    image: "/images/WatchAppleS10.webp",
    stock: 10
  },
  {
    id: 2,
    title: "Apple Watch Ultra 2",
    category: CATEGORIES.SMARTWATCHES,
    price: 799,
    description: "49mm black titanium case...",
    image: "/images/WatchAppleUltra2.webp",
    stock: 10
  },
  {
    id: 3,
    title: "Apple Watch SE (2nd Gen)",
    category: CATEGORIES.SMARTWATCHES,
    price: 249,
    description: "40mm or 44mm aluminum case...",
    image: "/images/WatchAppleSE2nd.webp",
    stock: 10
  },

  // MacBook Models (CORREGIDO: cambiado de SMARTWATCHES a LAPTOPS)
  {
    id: 4,
    title: "MacBook Air 13-inch M2",
    category: CATEGORIES.LAPTOPS,
    price: 999,
    description: "M2 chip, 13.6-inch Liquid Retina display...",
    image: "/images/MacBookAir13M2.webp",
    stock: 10
  },
  {
    id: 5,
    title: "MacBook Air 13-inch M3",
    category: CATEGORIES.LAPTOPS,
    price: 1099,
    description: "M3 chip, 13.6-inch Liquid Retina display...",
    image: "/images/MacBookAir13-inchM3.webp",
    stock: 10
  },
  {
    id: 6,
    title: "MacBook Pro 14-inch M4",
    category: CATEGORIES.LAPTOPS,
    price: 1599,
    description: "M4 chip, 14.2-inch Liquid Retina XDR display...",
    image: "/images/MacBookPro14-inchM4Pro.webp",
    stock: 10
  },
  {
    id: 7,
    title: "MacBook Pro 14-inch M4 Pro",
    category: CATEGORIES.LAPTOPS,
    price: 1999,
    description: "M4 Pro chip, 14.2-inch Liquid Retina XDR display...",
    image:  "/images/MacBookPro14-inchM4Pro.webp",
    stock: 10
  },
  {
    id: 8,
    title: "MacBook Pro 16-inch M4 Pro",
    category: CATEGORIES.LAPTOPS,
    price: 2499,
    description: "M4 Pro chip, 16.2-inch Liquid Retina XDR display...",
    image: "/images/MacBookPro16-inchM4Pro.webp",
    stock: 10
  },
  {
    id: 9,
    title: "MacBook Pro 16-inch M4 Max",
    category: CATEGORIES.LAPTOPS,
    price: 3499,
    description: "M4 Max chip, 16.2-inch Liquid Retina XDR display...",
    image: "/images/MacBookPro16inchM4Max.webp",
    stock: 10
  },

  // iPhone Models (CORREGIDO: cambiado de SMARTWATCHES a SMARTPHONES)
  {
    id: 10,
    title: "iPhone 16",
    category: CATEGORIES.SMARTPHONES,
    price: 799,
    description: "6.1-inch Super Retina XDR display...",
    image: "/images/iPhone16.webp",
    stock: 10
  },
  {
    id: 11,
    title: "iPhone 16 Plus",
    category: CATEGORIES.SMARTPHONES,
    price: 899,
    description: "6.7-inch Super Retina XDR display...",
    image: "/images/iphone-16-plus.webp",
    stock: 10
  },
  {
    id: 12,
    title: "iPhone 16 Pro",
    category: CATEGORIES.SMARTPHONES,
    price: 999,
    description: "6.3-inch Super Retina XDR display...",
    image: "/images/iphone-16-pro.webp",
    stock: 10
  },
  {
    id: 13,
    title: "iPhone 16 Pro Max",
    category: CATEGORIES.SMARTPHONES,
    price: 1199,
    description: "6.9-inch Super Retina XDR display...",
    image: "/images/iphone-16-pro-max.webp",
    stock: 10
  },
  {
    id: 14,
    title: "iPhone 15",
    category: CATEGORIES.SMARTPHONES,
    price: 699,
    description: "6.1-inch Super Retina XDR display...",
    image: "/images/iphone-15.webp",
    stock: 10
  },
  {
    id: 15,
    title: "iPhone 15 Plus",
    category: CATEGORIES.SMARTPHONES,
    price: 799,
    description: "6.7-inch Super Retina XDR display...",
    image: "/images/iPhone15Plus.webp",
    stock: 10
  },
  {
    id: 16,
    title: "iPhone 15 Pro Max",
    category: CATEGORIES.SMARTPHONES,
    price: 1099,
    description: "6.7-inch Super Retina XDR display...",
    image: "/images/iphone-15-pro-max.webp",
    stock: 10
  },
  {
    id: 17,
    title: "iPhone 14",
    category: CATEGORIES.SMARTPHONES,
    price: 599,
    description: "6.1-inch Super Retina XDR display...",
    image: "/images/iphone-14.webp",
    stock: 10
  },
  {
    id: 18,
    title: "iPhone 14 Plus",
    category: CATEGORIES.SMARTPHONES,
    price: 699,
    description: "6.7-inch Super Retina XDR display...",
    image: "/images/iPhone14plus.webp",
    stock: 10
  }
];

// Función para obtener nombres amigables de categoría
const getCategoryName = (categoryId) => {
  const categoryNames = {
    [CATEGORIES.SMARTWATCHES]: 'Watch',
    [CATEGORIES.LAPTOPS]: 'Mac',
    [CATEGORIES.SMARTPHONES]: 'iPhone'
  };
  return categoryNames[categoryId] || categoryId;
};

// Funciones de servicio con manejo de errores
export const getProducts = () => Promise.resolve([...products]);

export const getProductById = (id) => {
  const productId = Number(id);
  const product = products.find(item => item.id === productId);
  return product 
    ? Promise.resolve(product)
    : Promise.reject(new Error(`Producto con ID ${id} no encontrado`));
};

export const getProductsByCategory = (categoryId) => {
  const validCategories = Object.values(CATEGORIES);
  if (!validCategories.includes(categoryId)) {
    return Promise.reject(new Error(`Categoría ${categoryId} no válida`));
  }
  return Promise.resolve(products.filter(item => item.category === categoryId));
};

// Función para categorías formateadas (NavBar)
export const getFormattedCategories = () => {
  const uniqueCategories = [...new Set(products.map(p => p.category))];
  return uniqueCategories.map(cat => ({
    id: cat,
    name: getCategoryName(cat)
  }));
};

// Exportación directa del array de productos
export { products };