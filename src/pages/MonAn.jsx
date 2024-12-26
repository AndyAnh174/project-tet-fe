import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import recipeData from '../data/recipes.json';

const MonAn = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { categories, recipes } = recipeData;

  const filteredRecipes = selectedCategory
    ? recipes.filter(recipe => recipe.categories.includes(selectedCategory))
    : recipes;

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-red-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-red-800 to-red-700">
        <div className="absolute inset-0 bg-[url('/bg-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-4xl md:text-6xl font-dancing font-bold text-yellow-300 mb-6 
            opacity-0 animate-title will-change-transform will-change-opacity">
            Món Ngon Ngày Tết
          </h1>
          <p className="text-yellow-100 text-lg md:text-2xl max-w-2xl mx-auto font-be-vietnam
            opacity-0 animate-description will-change-transform will-change-opacity">
            Khám phá và học cách nấu các món ăn truyền thống ngày Tết
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(
                category.id === selectedCategory ? null : category.id
              )}
              className={`relative overflow-hidden rounded-xl shadow-lg transition-all ${
                category.id === selectedCategory 
                  ? 'ring-4 ring-red-500 scale-105'
                  : 'hover:scale-105'
              }`}
            >
              <div className="aspect-square">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="font-medium text-sm md:text-base">
                    {category.name}
                  </h3>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <Link
              key={recipe.id}
              to={`/mon-an/${recipe.id}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-video relative">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                {recipe.categories.map(catId => {
                  const category = categories.find(c => c.id === catId);
                  return (
                    <span
                      key={catId}
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                    >
                      {category?.name}
                    </span>
                  );
                })}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-lexend font-semibold mb-2">
                  {recipe.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {recipe.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{recipe.cookTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👨‍🍳</span>
                    <span>{recipe.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👥</span>
                    <span>{recipe.servings}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonAn; 