import React, { useState } from 'react';

function LoiChucForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    style: 'style1',
    font: 'dancing',
    author: '',
    isAnonymous: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý submit form
    console.log({
      ...formData,
      author: formData.isAnonymous ? 'Người gửi ẩn danh' : formData.author || 'Khách'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <h2 className="text-2xl font-dancing font-bold text-red-800 mb-6">
        ✍️ Viết lời chúc của bạn
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Tiêu đề</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            placeholder="Nhập tiêu đề lời chúc..."
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Nội dung</label>
          <textarea
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 h-32"
            placeholder="Nhập lời chúc của bạn..."
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
          />
        </div>

        <div className="space-y-4">
          <div className={formData.isAnonymous ? 'opacity-50' : ''}>
            <label className="block text-gray-700 mb-2">Tên của bạn</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              placeholder="Nhập tên của bạn..."
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              disabled={formData.isAnonymous}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anonymous"
              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
            />
            <label htmlFor="anonymous" className="text-gray-700">
              Gửi ẩn danh 🎭
            </label>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Chọn phong cách</label>
          <select
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
            value={formData.style}
            onChange={(e) => setFormData({...formData, style: e.target.value})}
          >
            <option value="style1">Phong cách 1</option>
            <option value="style2">Phong cách 2</option>
            <option value="style3">Phong cách 3</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Chọn font chữ</label>
          <select
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
            value={formData.font}
            onChange={(e) => setFormData({...formData, font: e.target.value})}
          >
            <option value="dancing">Dancing Script</option>
            <option value="montserrat">Montserrat</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow transition"
        >
          🧧 Chia sẻ lời chúc
        </button>
      </form>
    </div>
  );
}

export default LoiChucForm; 