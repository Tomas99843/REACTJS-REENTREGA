import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ItemListContainer from "../containers/ItemListContainer";
import { getProductsByCategory } from "@services/products";
import { Spinner } from 'react-bootstrap';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsByCategory(categoryId);
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) return (
    <div className="text-center my-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger text-center my-5">
      {error}
    </div>
  );

  return <ItemListContainer products={products} />;
};

export default CategoryPage;