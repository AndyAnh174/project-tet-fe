import React, { useState, useEffect } from 'react';
import { wishService } from '../services/api';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyC6KA8KmAQJ8UaS5wCuUCGoNGsww59nwO0");

function AIWishGenerator() {
  const [recipient, setRecipient] = useState('');
  const [wishType, setWishType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedWishes, setGeneratedWishes] = useState([]);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError('');

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Viết một lời chúc Tết ngắn gọn, ý nghĩa và chân thành cho ${recipient} về ${wishType}. 
        Lời chúc nên mang phong cách truyền thống Việt Nam, sử dụng các từ ngữ trang trọng và mang tính chất ngày Tết.
        Độ dài khoảng 3-4 câu.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const newWish = {
        title: `Lời chúc Tết cho ${recipient}`,
        content: text,
        timestamp: new Date().toLocaleString('vi-VN'),
        recipient,
        wishType
      };

      setGeneratedWishes(prev => [newWish, ...prev]);
      setRecipient('');
      setWishType('');

    } catch (err) {
      setError('Có lỗi xảy ra khi tạo lời chúc. Vui lòng thử lại.');
      console.error('Generate error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (wish) => {
    try {
      await wishService.createWish({
        title: wish.title,
        content: wish.content,
        author: "AI Generator",
        isAnonymous: true,
        style: 'style1',
        font: 'dancing'
      });
      alert('Đã lưu lời chúc thành công!');
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu lời chúc');
      console.error('Save error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-dancing font-bold text-red-800 mb-8 text-center">
              🤖 Tạo Lời Chúc Tết Bằng AI
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            </div>

            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!recipient || !wishType || loading}
              className={`w-full bg-red-600 text-white py-3 px-4 rounded-lg ${
                loading || !recipient || !wishType
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-red-700'
              }`}
            >
              {loading ? 'Đang tạo...' : '✨ Tạo lời chúc'}
            </button>
          </div>

          {/* Bảng danh sách lời chúc đã tạo */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📝 Danh sách lời chúc đã tạo
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người nhận
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chủ đề
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lời chúc
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {generatedWishes.map((wish, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {wish.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {wish.recipient}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {wish.wishType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-md">
                          <h4 className="font-medium text-gray-900">{wish.title}</h4>
                          <p className="whitespace-pre-line">{wish.content}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleSave(wish)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          💾 Lưu
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIWishGenerator; 