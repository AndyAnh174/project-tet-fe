import React from 'react';

const ThiepCategories = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`
            px-6 py-3 rounded-full font-dancing text-xl transition-all
            ${selectedCategory === category.id
              ? 'bg-red-600 text-white shadow-lg scale-105'
              : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50'
            }
          `}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default ThiepCategories; 