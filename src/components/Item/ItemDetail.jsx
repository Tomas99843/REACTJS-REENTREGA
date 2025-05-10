import React from 'react';
import { useCart } from "../../context/CartContext";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/products";

const ItemDetail = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="item-detail">
      <img src={product.image} alt={product.title} />
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <p>Precio: ${product.price}</p>
      <div className="quantity-controls">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>
      <button 
        onClick={() => addToCart(product, quantity)}
        className="add-to-cart-btn"
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default ItemDetail;