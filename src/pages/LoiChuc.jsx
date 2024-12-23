import React, { useState, useEffect } from 'react';
import ShareWishForm from '../components/loichuc/ShareWishForm';
import LoiChucList from '../components/loichuc/LoiChucList';
import Loading from '../components/Loading';

function LoiChuc() {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('preset');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    isAnonymous: false,
    style: 'style1',
    font: 'dancing',
    customStyle: null
  });

  const handleStyleChange = (newStyle) => {
    event?.preventDefault();
    
    setSelectedStyle(newStyle);
    setFormData(prev => ({
      ...prev,
      style: newStyle === 'preset' ? 'style1' : 'custom',
      customStyle: null
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-[calc(100*var(--vh))] pt-16 bg-gradient-to-b from-red-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-red-800 to-red-700">
        <div className="absolute inset-0 bg-[url('/bg-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-4xl md:text-5xl font-dancing font-bold text-yellow-300 mb-4">
            Gửi Lời Chúc Tết Yêu Thương
          </h1>
          <p className="text-yellow-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Chia sẻ những lời chúc Tết ý nghĩa đến người thân yêu của bạn
          </p>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-yellow-500 hover:bg-yellow-400 text-red-800 font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105"
          >
            ✍️ Thêm lời chúc mới
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {showForm ? (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-dancing text-red-800">
                ✍️ Viết lời chúc mới
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-red-600 hover:text-red-700"
              >
                ← Quay lại danh sách
              </button>
            </div>

            <div className="mb-6">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => handleStyleChange('preset')}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStyle === 'preset'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Phong cách có sẵn
                </button>
                <button
                  onClick={() => handleStyleChange('ai')}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStyle === 'ai'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  AI Tạo style
                </button>
              </div>
            </div>

            <ShareWishForm 
              selectedStyle={selectedStyle}
              onStyleChange={handleStyleChange}
              formData={formData}
              setFormData={setFormData}
              onSubmitSuccess={() => {
                setShowForm(false);
                setFormData({
                  title: '',
                  content: '',
                  author: '',
                  isAnonymous: false,
                  style: 'style1',
                  font: 'dancing',
                  customStyle: null
                });
              }}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <LoiChucList />
          </div>
        )}
      </div>
    </div>
  );
}

export default LoiChuc; 