// src/containers/ItemDetailContainer.jsx
import React from 'react'; // ← Asegúrate de importar React
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/products"; // Necesitarás esta función
import ItemDetail from "../components/Item/ItemDetail";

const ItemDetailContainer = () => {
  const { itemId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(itemId).then((data) => setProduct(data));
  }, [itemId]);

  return product && <ItemDetail product={product} />;
};

export default ItemDetailContainer;