import React from 'react';
import Item from "./Item";
import "./ItemList.css";

const ItemList = ({ products }) => {
  return (
    <div className="item-list-grid">
      {products.map((product) => (
        <Item 
          key={product.firestoreId}  
          product={product}
          className="item-card"
        />
      ))}
    </div>
  );
};

export default ItemList;