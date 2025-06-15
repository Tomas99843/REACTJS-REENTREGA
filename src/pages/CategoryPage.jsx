import React from 'react';
import { useParams } from 'react-router-dom';
import ItemListContainer from "@containers/ItemListContainer";
import { getCategoryName } from "@services/products"; 

const CategoryPage = () => {
  const { categoryId } = useParams();

  return (
    <div className="category-page container py-4">
      
      <ItemListContainer categoryId={categoryId} />
    </div>
  );
};

export default CategoryPage;