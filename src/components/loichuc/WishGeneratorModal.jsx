import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyC6KA8KmAQJ8UaS5wCuUCGoNGsww59nwO0");

function WishGeneratorModal({ isOpen, onClose, onGenerated }) {
  const [recipient, setRecipient] = useState('');
  const [wishType, setWishType] = useState('');
  const [loading, setLoading] = useState(false);

  const generateWish = async () => {
    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Viết một lời chúc Tết ngắn gọn, ý nghĩa và chân thành cho ${recipient} về ${wishType}. 
        Lời chúc nên mang phong cách truyền thống Việt Nam, sử dụng các từ ngữ trang trọng và mang tính chất ngày Tết.
        Độ dài khoảng 3-4 câu.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      onGenerated({
        title: `Lời chúc Tết cho ${recipient}`,
        content: text
      });
      onClose();
    } catch (error) {
      console.error('Error generating wish:', error);
      alert('Có lỗi xảy ra khi tạo lời chúc. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-red-800 mb-4">
        🧨Tạo lời chúc tự động
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Bạn muốn chúc ai?</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              placeholder="VD: ông bà, bố mẹ, anh chị..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Chúc về điều gì?</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              placeholder="VD: sức khỏe, công việc, học tập..."
              value={wishType}
              onChange={(e) => setWishType(e.target.value)}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={generateWish}
              disabled={!recipient || !wishType || loading}
              className={`flex-1 bg-red-600 text-white py-2 px-4 rounded-lg ${
                loading || !recipient || !wishType
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-red-700'
              }`}
            >
              {loading ? 'Đang tạo...' : '✨ Tạo lời chúc'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishGeneratorModal; 