import React from 'react';
import { useParams, Link } from 'react-router-dom';
import recipeData from '../data/recipes.json';

const ChiTietMonAn = () => {
  const { id } = useParams();
  const recipe = recipeData.recipes.find(r => r.id === id);

  if (!recipe) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Không tìm thấy món ăn
          </h2>
          <Link
            to="/mon-an"
            className="text-red-600 hover:text-red-700"
          >
            ← Quay lại danh sách món ăn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-red-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/mon-an"
          className="inline-flex items-center text-red-600 hover:text-red-700 mb-6"
        >
          <span>←</span>
          <span className="ml-2">Quay lại danh sách món ăn</span>
        </Link>

        {/* Recipe Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="aspect-video relative">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
            <p className="text-gray-600 mb-6">{recipe.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <span className="block text-2xl mb-2">⏱️</span>
                <span className="text-sm text-gray-600">Thời gian nấu</span>
                <span className="block font-medium">{recipe.cookTime}</span>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <span className="block text-2xl mb-2">👨‍🍳</span>
                <span className="text-sm text-gray-600">Độ khó</span>
                <span className="block font-medium">{recipe.difficulty}</span>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <span className="block text-2xl mb-2">⏲️</span>
                <span className="text-sm text-gray-600">Chuẩn bị</span>
                <span className="block font-medium">{recipe.prepTime}</span>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <span className="block text-2xl mb-2">👥</span>
                <span className="text-sm text-gray-600">Khẩu phần</span>
                <span className="block font-medium">{recipe.servings}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ingredients */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Nguyên liệu</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li 
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span>{ingredient.name}</span>
                    <span className="text-gray-600">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Steps */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Các bước thực hiện</h2>
              <div className="space-y-6">
                {recipe.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <p className="mb-3">{step.description}</p>
                      {step.image && (
                        <img
                          src={step.image}
                          alt={`Bước ${step.step}`}
                          className="rounded-lg w-full"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        {recipe.video && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Video hướng dẫn</h2>
            <div className="aspect-video">
              <iframe
                src={recipe.video}
                title={`Hướng dẫn nấu ${recipe.name}`}
                className="w-full h-full rounded-lg"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Tips Section */}
        {recipe.tips && recipe.tips.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Mẹo nấu ăn</h2>
            <ul className="list-disc list-inside space-y-2">
              {recipe.tips.map((tip, index) => (
                <li key={index} className="text-gray-700">{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChiTietMonAn; 