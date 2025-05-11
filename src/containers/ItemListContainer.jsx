import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts, getProductsByCategory } from "../services/products";
import ItemList from "../components/Item/ItemList";
import Loader from "./Loader"; // Asume que tienes un componente Loader
import ErrorMessage from "./ErrorMessage"; // Componente para mostrar errores
import "./ItemListContainer.css"; // Estilos específicos

const ItemListContainer = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Usamos la función específica por categoría si existe categoryId
        const productsData = categoryId 
          ? await getProductsByCategory(categoryId)
          : await getProducts();
        
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error al cargar los productos. Por favor intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  // Estados de carga y error
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (products.length === 0) return <div className="no-products">No se encontraron productos</div>;

  return (
    <div className="item-list-container">
      <h2 className="category-title">
        {categoryId 
          ? `Productos ${getCategoryName(categoryId)}` 
          : "Todos los productos"}
      </h2>
      <ItemList products={products} />
    </div>
  );
};

// Función helper para mostrar nombres amigables de categoría
const getCategoryName = (categoryId) => {
  const categoryNames = {
    iphones: "iPhone",
    macbooks: "Mac",
    smartwatches: "Apple Watch"
  };
  return categoryNames[categoryId] || categoryId;
};

export default ItemListContainer;