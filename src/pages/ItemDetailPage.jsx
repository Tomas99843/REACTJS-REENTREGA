import React from 'react'; 

import ItemDetailContainer from "../containers/ItemDetailContainer";

const ItemDetailPage = ({ products }) => {
  return <ItemDetailContainer products={products} />;
};

export default ItemDetailPage;