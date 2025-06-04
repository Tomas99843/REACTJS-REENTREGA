import React from 'react';
import { useParams } from 'react-router-dom';
import ItemListContainer from "@containers/ItemListContainer";
import { getCategoryName } from "@services/products"; // Importación añadida

const CategoryPage = () => {
  const { categoryId } = useParams();

  return (
    <div className="category-page container py-4">
      <h2 className="text-center mb-4">
        {!categoryId || categoryId === 'all' 
          ? 'Todos nuestros productos' 
          : getCategoryName(categoryId)}
      </h2>
      <ItemListContainer categoryId={categoryId} />
    </div>
  );
};

export default CategoryPage;