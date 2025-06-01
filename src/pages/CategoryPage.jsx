import React, { useEffect, useState, useCallback } from 'react'; // Asegúrate de importar useCallback
import { useParams, useNavigate } from 'react-router-dom';
import ItemListContainer from "@containers/ItemListContainer";
import { getProductsByCategory, getAllProducts } from "@services/products"; // Ruta corregida
import { useCart } from "@context/CartContext"; // Ruta corregida
import { Spinner } from 'react-bootstrap';


const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = !categoryId || categoryId === 'all' 
        ? await getAllProducts() 
        : await getProductsByCategory(categoryId);

      if (!data || data.length === 0) {
        setError(`No se encontraron productos en esta categoría`);
      }
      setProducts(data || []);
    } catch (err) {
      console.error("Error loading products:", err);
      setError(err.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleRetry = () => {
    fetchProducts();
  };

  if (loading) return (
    <div className="text-center my-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <Alert variant="danger" className="text-center">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
        <div className="d-flex justify-content-center gap-3">
          <Button variant="primary" onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
          <Button variant="outline-primary" onClick={handleRetry}>
            Reintentar
          </Button>
        </div>
      </Alert>
    </div>
  );

  return (
    <div className="category-page container py-4">
      <h2 className="text-center mb-4">
        {!categoryId || categoryId === 'all' 
          ? 'Todos nuestros productos' 
          : getCategoryName(categoryId)}
      </h2>
      <ItemListContainer 
        products={products} 
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default CategoryPage;