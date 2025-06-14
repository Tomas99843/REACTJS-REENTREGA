import React from 'react';
import './ItemDetail.css';

const ItemDetail = ({ product }) => {
  if (!product) return <div className="error">Producto no encontrado</div>;

  return (
    <div className="item-detail">
      <img 
        src={product.imageUrl} 
        alt={product.title}
        onError={(e) => {
          e.target.src = '/images/placeholder.jpg';
          e.target.classList.add('error-image');
        }}
      />
      <h2>{product.title}</h2>
      <p className="price">${product.price?.toLocaleString?.() || 'N/A'}</p>
      <p className="description">{product.description || 'Descripción no disponible'}</p>
      
    </div>
  );
};

export default ItemDetail;