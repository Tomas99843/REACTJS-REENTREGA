import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducts, getProductsByCategory } from "../../src/services/products"
import ItemList from "../components/Item/ItemList";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import "./ItemListContainer.css";

const ItemListContainer = ({ categoryId: propCategoryId }) => {
  const { categoryId: urlCategoryId } = useParams();
  const categoryId = propCategoryId || urlCategoryId;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryName = useMemo(() => getCategoryName(categoryId), [categoryId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
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

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (products.length === 0) return (
    <div className="no-products">
      <p>No hay productos en esta categoría.</p>
      <Link to="/">Ver todos los productos</Link>
    </div>
  );

  return (
    <div className="item-list-container">
      <h2 className="category-title">
        {categoryId ? `Productos ${categoryName}` : "Todos los productos"}
      </h2>
      <ItemList key={categoryId || 'all-products'} products={products} />
    </div>
  );
};

const getCategoryName = (categoryId) => {
  const categoryNames = {
    iphones: "iPhone",
    macbooks: "Mac",
    smartwatches: "Apple Watch"
  };
  return categoryNames[categoryId] || categoryId;
};

export default ItemListContainer;