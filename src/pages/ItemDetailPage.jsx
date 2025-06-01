// src/pages/ItemDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ItemDetailContainer from "../containers/ItemDetailContainer";
import { useCart } from "@context/CartContext"; // Corregido el nombre y la ruta
import "./ItemDetailPage.css";

const ItemDetailPage = () => {
  const { itemId } = useParams();
  const { addToCart } = useCart();

  return (
    <div className="item-detail-page container py-4">
      <ItemDetailContainer 
        itemId={itemId} 
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default ItemDetailPage;