import React from 'react';
// Import ảnh
import family1 from '../../assets/card/family1.png';
import friend1 from '../../assets/card/friends1.png';
import business1 from '../../assets/card/cv1.png';
import love1 from '../../assets/card/love1.png';

const cards = [
  {
    id: 1,
    title: 'Thiệp Tết Gia đình',
    category: 'family',
    thumbnail: family1,
    template: 'classic',
  },
  {
    id: 2,
    title: 'Thiệp Tết Bạn bè', 
    category: 'friend',
    thumbnail: friend1,
    template: 'modern',
  },
  {
    id: 3,
    title: 'Thiệp Tết Công việc',
    category: 'business', 
    thumbnail: business1,
    template: 'business',
  },
  {
    id: 4,
    title: 'Thiệp Tết Tình yêu',
    category: 'love',
    thumbnail: love1,
    template: 'love', 
  }
];

const ThiepList = ({ selectedCategory, onSelectCard }) => {
  const filteredCards = selectedCategory === 'all'
    ? cards
    : cards.filter(card => card.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredCards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
          onClick={() => onSelectCard(card)}
        >
          <div className="relative pt-[75%]">
            <img
              src={card.thumbnail}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-dancing text-red-800 mb-2">
              {card.title}
            </h3>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Tùy chỉnh
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThiepList; 