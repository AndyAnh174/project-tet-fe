import React, { useState, useEffect } from 'react';
import ThiepList from '../components/thiep/ThiepList';
import ThiepEditor from '../components/thiep/ThiepEditor';
import ThiepCategories from '../components/thiep/ThiepCategories';
import Loading from '../components/Loading';

const Thiep = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'family', name: 'Gia đình' },
    { id: 'friend', name: 'Bạn bè' },
    { id: 'business', name: 'Công việc' },
    { id: 'love', name: 'Tình yêu' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50 pt-16">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-dancing text-red-800 text-center mb-12 animate-fade-in">
          🎋 Thiệp Tết 2025 🎋
        </h1>
        
        {!selectedCard ? (
          <div className="animate-fade-in">
            <ThiepCategories 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <ThiepList 
              selectedCategory={selectedCategory}
              onSelectCard={setSelectedCard}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <ThiepEditor 
              card={selectedCard}
              onBack={() => setSelectedCard(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Thiep; 