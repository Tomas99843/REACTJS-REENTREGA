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
    image: "/images/WatchAppleS10.jpg",
    stock: 10
  },
  {
    id: 2,
    title: "Apple Watch Ultra 2",
    category: CATEGORIES.SMARTWATCHES,
    price: 799,
    description: "49mm black titanium case...",
    image: "/images/WatchAppleUltra2.jpg",
    stock: 10
  },
  {
    id: 3,
    title: "Apple Watch SE (2nd Gen)",
    category: CATEGORIES.SMARTWATCHES,
    price: 249,
    description: "40mm or 44mm aluminum case...",
    image: "/images/WatchAppleSE2nd.jpg",
    stock: 10
  },

  // MacBook Models (CORREGIDO: cambiado de SMARTWATCHES a LAPTOPS)
  {
    id: 4,
    title: "MacBook Air 13-inch M2",
    category: CATEGORIES.LAPTOPS,
    price: 999,
    description: "M2 chip, 13.6-inch Liquid Retina display...",
    image: "/images/MacBookAir13M2.jpg",
    stock: 10
  },
  {
    id: 5,
    title: "MacBook Air 15-inch M2",
    category: CATEGORIES.LAPTOPS,
    price: 1299,
    description: "M2 chip, 15.3-inch Liquid Retina display...",
    image: "/images/MacBookAir15M2.webp",
    stock: 10
  },
  {
    id: 6,
    title: "MacBook Air 13-inch M3",
    category: CATEGORIES.LAPTOPS,
    price: 1099,
    description: "M3 chip, 13.6-inch Liquid Retina display...",
    image: "/images/MacBookAir13-inchM3.webp",
    stock: 10
  },
  {
    id: 7,
    title: "MacBook Air 15-inch M3",
    category: CATEGORIES.LAPTOPS,
    price: 1299,
    description: "M3 chip, 15.3-inch Liquid Retina display...",
    image: "/images/MacBookAir15-inchM3.jpg",
    stock: 10
  },
  {
    id: 8,
    title: "MacBook Pro 14-inch M4",
    category: CATEGORIES.LAPTOPS,
    price: 1599,
    description: "M4 chip, 14.2-inch Liquid Retina XDR display...",
    image: "/images/MacBookPro14-inchM4.jpg",
    stock: 10
  },
  {
    id: 9,
    title: "MacBook Pro 14-inch M4 Pro",
    category: CATEGORIES.LAPTOPS,
    price: 1999,
    description: "M4 Pro chip, 14.2-inch Liquid Retina XDR display...",
    image: "/images/MacBookPro14-inchM4.jpg",
    stock: 10
  },
  {
    id: 10,
    title: "MacBook Pro 16-inch M4 Pro",
    category: CATEGORIES.LAPTOPS,
    price: 2499,
    description: "M4 Pro chip, 16.2-inch Liquid Retina XDR display...",
    image: "/images/MacBookPro16-inchM4Pro.jpg",
    stock: 10
  },
  {
    id: 11,
    title: "MacBook Pro 16-inch M4 Max",
    category: CATEGORIES.LAPTOPS,
    price: 3499,
    description: "M4 Max chip, 16.2-inch Liquid Retina XDR display...",
    image: "/images/MacBookPro16inchM4Max.jpg",
    stock: 10
  },

  // iPhone Models (CORREGIDO: cambiado de SMARTWATCHES a SMARTPHONES)
  {
    id: 12,
    title: "iPhone 16",
    category: CATEGORIES.SMARTPHONES,
    price: 799,
    description: "6.1-inch Super Retina XDR display...",
    image: "/images/iPhone16.jpg",
    stock: 10
  },
  {
    id: 13,
    title: "iPhone 16 Plus",
    category: CATEGORIES.SMARTPHONES,
    price: 899,
    description: "6.7-inch Super Retina XDR display...",
    image: "/images/iphone-16-plus.jpg",
    stock: 10
  },
  {
    id: 14,
    title: "iPhone 16 Pro",
    category: CATEGORIES.SMARTPHONES,
    price: 999,
    description: "6.3-inch Super Retina XDR display...",
    image: "/images/iphone-16-pro.jpg",
    stock: 10
  },
  {
    id: 15,
    title: "iPhone 16 Pro Max",
    category: CATEGORIES.SMARTPHONES,
    price: 1199,
    description: "6.9-inch Super Retina XDR display...",
    image: "/images/iphone-16-pro-max.jpg",
    stock: 10
  },
  {
    id: 16,
    title: "iPhone 15",
    category: CATEGORIES.SMARTPHONES,
    price: 699,
    description: "6.1-inch Super Retina XDR display...",
    image: "/images/iphone-15.jpg",
    stock: 10
  },
  {
    id: 17,
    title: "iPhone 15 Plus",
    category: CATEGORIES.SMARTPHONES,
    price: 799,
    description: "6.7-inch Super Retina XDR display...",
    image: "/images/iPhone15Plus.jpg",
    stock: 10
  },
  {
    id: 18,
    title: "iPhone 15 Pro Max",
    category: CATEGORIES.SMARTPHONES,
    price: 1099,
    description: "6.7-inch Super Retina XDR display...",
    image: "/images/iphone-15-pro-max.jpg",
    stock: 10
  },
  {
    id: 19,
    title: "iPhone 14",
    category: CATEGORIES.SMARTPHONES,
    price: 599,
    description: "6.1-inch Super Retina XDR display...",
    image: "/images/iphone-14.jpg",
    stock: 10
  },
  {
    id: 20,
    title: "iPhone 14 Plus",
    category: CATEGORIES.SMARTPHONES,
    price: 699,
    description: "6.7-inch Super Retina XDR display...",
    image: "/images/iPhone14plus.png",
    stock: 10
  }
];

// Exportación directa del array de productos
export { products };

// Función para obtener categorías formateadas para el NavBar
export const getFormattedCategories = () => {
  const uniqueCategories = [...new Set(products.map(p => p.category))];
  return uniqueCategories.map(cat => ({
    id: cat,
    name: cat === CATEGORIES.SMARTWATCHES ? 'Watch' : 
          cat === CATEGORIES.LAPTOPS ? 'Mac' : 
          'iPhone'
  }));
};

// Funciones de servicio
export const getProducts = () => Promise.resolve(products);
export const getProductById = (id) => 
  Promise.resolve(products.find((item) => item.id === Number(id)));
export const getProductsByCategory = (categoryId) =>
  Promise.resolve(products.filter((item) => item.category === categoryId));