const products = [
    // Apple Watch Models
    {
      id: 1,
      title: "Apple Watch Series 10",
      category: "smartwatches",
      price: 399,
      description: "Thinnest design with largest display, sleep apnea detection, LTPO3 OLED up to 2000 nits, S10 chip, GPS or GPS + Cellular.",
      image: "../../public/images/WatchAppleS10.jpg",
      stock: 10
    },
    {
      id: 2,
      title: "Apple Watch Ultra 2",
      category: "smartwatches",
      price: 799,
      description: "49mm black titanium case, dual-frequency GPS, up to 36 hours battery, dive computer with Oceanic+ app, Action button.",
      image: "../../public/images/WatchAppleUltra2.jpg",
      stock: 10
    },
    {
      id: 3,
      title: "Apple Watch SE (2nd Gen)",
      category: "smartwatches",
      price: 249,
      description: "40mm or 44mm aluminum case, S8 chip, water resistance up to 50m, heart rate monitoring, crash detection.",
      image: "../../public/images/WatchAppleSE2nd.jpg",
      stock: 10
    },
    // MacBook Models
    {
      id: 4,
      title: "MacBook Air 13-inch M2",
      category: "macbooks",
      price: 999,
      description: "M2 chip, 13.6-inch Liquid Retina display, 8-core CPU, up to 18 hours battery life, 1080p FaceTime HD camera.",
      image: "../../public/images/MacBookAir13M2.jpg",
      stock: 10
    },
    {
      id: 5,
      title: "MacBook Air 15-inch M2",
      category: "macbooks",
      price: 1299,
      description: "M2 chip, 15.3-inch Liquid Retina display, 8-core CPU, 10-core GPU, up to 18 hours battery life.",
      image: "../../public/images/MacBookAir15M2.webp",
      stock: 10
    },
    {
      id: 6,
      title: "MacBook Air 13-inch M3",
      category: "macbooks",
      price: 1099,
      description: "M3 chip, 13.6-inch Liquid Retina display, 8-core CPU, up to 10-core GPU, supports two external displays, 18 hours battery.",
      image: "/../../public/images/MacBookAir13-inchM3.webp",
      stock: 10
    },
    {
      id: 7,
      title: "MacBook Air 15-inch M3",
      category: "macbooks",
      price: 1299,
      description: "M3 chip, 15.3-inch Liquid Retina display, 8-core CPU, 10-core GPU, Wi-Fi 6E, up to 18 hours battery life.",
      image: "../../public/images/MacBookAir15-inchM3.jpg",
      stock: 10
    },
    {
      id: 8,
      title: "MacBook Pro 14-inch M4",
      category: "macbooks",
      price: 1599,
      description: "M4 chip, 14.2-inch Liquid Retina XDR display, 10-core CPU, 14-core GPU, up to 22 hours battery life, Thunderbolt 5.",
      image: "../../public/images/MacBookPro14-inchM4.jpg",
      stock: 10
    },
    {
      id: 9,
      title: "MacBook Pro 14-inch M4 Pro",
      category: "macbooks",
      price: 1999,
      description: "M4 Pro chip, 14.2-inch Liquid Retina XDR display, 12-core CPU, 18-core GPU, 16GB unified memory, up to 22 hours battery.",
      image: "../../public/images/MacBookPro14-inchM4.jpg",
      stock: 10
    },
    {
      id: 10,
      title: "MacBook Pro 16-inch M4 Pro",
      category: "macbooks",
      price: 2499,
      description: "M4 Pro chip, 16.2-inch Liquid Retina XDR display, 12-core CPU, 20-core GPU, up to 24 hours battery life, 12MP Center Stage camera.",
      image: "../../public/images/MacBookPro16-inchM4Pro.jpg",
      stock: 10
    },
    {
      id: 11,
      title: "MacBook Pro 16-inch M4 Max",
      category: "macbooks",
      price: 3499,
      description: "M4 Max chip, 16.2-inch Liquid Retina XDR display, 16-core CPU, 40-core GPU, 32GB unified memory, up to 22 hours battery.",
      image: "../../public/images/MacBookPro16inchM4Max.jpg",
      stock: 10
    },
  
    // iPhone Models
    {
      id: 12,
      title: "iPhone 16",
      category: "iphones",
      price: 799,
      description: "6.1-inch Super Retina XDR display, A18 chip, 48MP Fusion camera, Camera Control, USB-C connector, iOS 18.",
      image: "../../public/images/iPhone16.jpg",
      stock: 10
    },
    {
      id: 13,
      title: "iPhone 16 Plus",
      category: "iphones",
      price: 899,
      description: "6.7-inch Super Retina XDR display, A18 chip, 48MP Fusion camera with 2x telephoto, Camera Control, iOS 18.",
      image: "../../public/images/iphone-16-plus.jpg",
      stock: 10
    },
    {
      id: 14,
      title: "iPhone 16 Pro",
      category: "iphones",
      price: 999,
      description: "6.3-inch Super Retina XDR display, A18 Pro chip, 48MP Fusion camera, 4K 120fps video, titanium design, iOS 18.",
      image: "../../public/images/iphone-16-pro.jpg",
      stock: 10
    },
    {
      id: 15,
      title: "iPhone 16 Pro Max",
      category: "iphones",
      price: 1199,
      description: "6.9-inch Super Retina XDR display, A18 Pro chip, 48MP Fusion camera with 5x telephoto, titanium design, iOS 18.",
      image: "../../public/images/iphone-16-pro-max.jpg",
      stock: 10
    },
    {
      id: 16,
      title: "iPhone 15",
      category: "iphones",
      price: 699,
      description: "6.1-inch Super Retina XDR display, A16 Bionic chip, 48MP main camera, USB-C connector, iOS 18.",
      image: "../../public/images/iphone-15.jpg",
      stock: 10
    },
    {
      id: 17,
      title: "iPhone 15 Plus",
      category: "iphones",
      price: 799,
      description: "6.7-inch Super Retina XDR display, A16 Bionic chip, 48MP main camera, USB-C, up to 26 hours video playback.",
      image: "../../public/images/iPhone15Plus.jpg",
      stock: 10
    },
    {
      id: 18,
      title: "iPhone 15 Pro Max",
      category: "iphones",
      price: 1099,
      description: "6.7-inch Super Retina XDR display, A17 Pro chip, titanium design, 48MP camera with 5x telephoto, iOS 18.",
      image: "../../public/images/iphone-15-pro-max.jpg",
      stock: 10
    },
    {
      id: 19,
      title: "iPhone 14",
      category: "iphones",
      price: 599,
      description: "6.1-inch Super Retina XDR display, A15 Bionic chip, dual 12MP camera system, up to 20 hours video playback.",
      image: "../../public/images/iphone-14.jpg",
      stock: 10
    },
    {
      id: 20,
      title: "iPhone 14 Plus",
      category: "iphones",
      price: 699,
      description: "6.7-inch Super Retina XDR display, A15 Bionic chip, dual 12MP camera system, up to 26 hours video playback.",
      image: "../../public/images/iPhone14plus.png",
      stock: 10
    }
  ];
  
  export const getProducts = () => Promise.resolve(products);
  export const getProductById = (id) => 
    Promise.resolve(products.find((item) => item.id === Number(id)));
  export const getProductsByCategory = (categoryId) =>
    Promise.resolve(products.filter((item) => item.category === categoryId));