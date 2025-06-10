import React from 'react';
import { Link } from 'react-router-dom';
import "./Item.css";

const Item = ({ product }) => {
  // Verificación segura del producto
  if (!product || !product.firestoreId) {
    console.error("Producto no válido:", product);
    return <div className="item-unavailable">Producto no disponible</div>;
  }

  return (
    <div className="item-card">
      <img src={product.imageUrl} alt={product.title} />
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      <Link to={`/item/${product.firestoreId}`} className="btn-details">
        Ver detalle
      </Link>
    </div>
  );
};

export default Item;