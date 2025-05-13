import React from 'react'; // ← Asegúrate de importar React
// src/pages/ItemDetailPage.jsx
import ItemDetailContainer from "../containers/ItemDetailContainer";

const ItemDetailPage = ({ products }) => {
  return <ItemDetailContainer products={products} />;
};

export default ItemDetailPage;