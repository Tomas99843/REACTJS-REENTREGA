// src/containers/ItemListContainer.jsx
import React from 'react'; // ← Asegúrate de importar React
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../services/products"; // Asegúrate de tener este archivo
import ItemList from "../components/Item/ItemList";

const ItemListContainer = () => {
  const { categoryId } = useParams(); // Obtiene el parámetro de la URL
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => {
      if (categoryId) {
        // Filtra por categoría si existe
        setProducts(data.filter((item) => item.category === categoryId));
      } else {
        // Si no hay categoría, muestra todos
        setProducts(data);
      }
    });
  }, [categoryId]);

  return <ItemList products={products} />;
};

export default ItemListContainer;