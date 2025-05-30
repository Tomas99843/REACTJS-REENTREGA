import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts, getProductsByCategory } from '@services/products';
import ItemList from '@components/Item/ItemList';
import Loader from '@containers/Loader';

const ItemListContainer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    
    const fetchProducts = categoryId 
      ? getProductsByCategory(categoryId)
      : getProducts();

    fetchProducts
      .then(data => setProducts(data))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return <Loader />;

  return (
    <div className="item-list-container">
      <ItemList products={products} />
    </div>
  );
};

export default ItemListContainer;