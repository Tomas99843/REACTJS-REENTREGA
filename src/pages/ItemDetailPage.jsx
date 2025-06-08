import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ItemDetailContainer from "../containers/ItemDetailContainer";
import { useCart } from "@context/CartContext";
import { getProductById } from "@services/products";
import "./ItemDetailPage.css";

const ItemDetailPage = () => {
  const { itemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
       
        if (location.state?.fromSearch && location.state?.productData) {
          setProductData(location.state.productData);
        } else {
          
          const product = await getProductById(itemId);
          setProductData(product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate('/404', { replace: true });
      }
    };

    if (itemId) {
      fetchProduct();
    } else {
      navigate('/');
    }
  }, [itemId, location.state, navigate]);

  if (!productData) {
    return <div className="container py-4">Cargando producto...</div>;
  }

  return (
    <div className="item-detail-page container py-4">
      <ItemDetailContainer 
        product={productData}
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default ItemDetailPage;