import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Loading from '../components/Loading';
import hoaDaoImg from '../assets/tree/hoa-dao.png';
import hoaMaiImg from '../assets/tree/hoa-mai.png';
import * as marked from 'marked';

const TetQA = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Hãy trả lời câu hỏi sau về Tết Việt Nam một cách chi tiết và thân thiện: ${question}

      Nếu câu hỏi liên quan đến địa điểm du lịch, hãy trình bày theo format sau:

      **[Tên địa điểm]**
      
      **Đặc điểm nổi bật:**
      - Điểm 1
      - Điểm 2
      
      **Hoạt động có thể tham gia:**
      - Hoạt động 1
      - Hoạt động 2
      
      **Thời điểm đẹp nhất:**
      - [Thông tin thời gian]
      
      **Lưu ý khi đi du lịch dịp Tết:**
      - Lưu ý 1
      - Lưu ý 2

      Với các câu hỏi khác, hãy sử dụng ** ** để in đậm các tiêu đề và điểm quan trọng.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAnswer(response.text());
    } catch (error) {
      console.error('Error:', error);
      setAnswer('Xin lỗi, tôi không thể trả lời câu hỏi này lúc này. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuggestedQuestion = (selectedQuestion) => {
    setQuestion(selectedQuestion);
    handleSubmit({ preventDefault: () => {} });
  };

  const suggestedQuestions = [
    "Những địa điểm du lịch nào đẹp nhất để đi chơi Tết ở miền Bắc?",
    "Các phong tục truyền thống ngày Tết của người Việt Nam?",
    "Nên chuẩn bị gì khi đi du lịch dịp Tết Nguyên đán?",
    "Những món ăn truyền thống không thể thiếu trong ngày Tết?",
    "Các lễ hội xuân nổi tiếng ở Việt Nam?"
  ];

  return (
    <div className="container mx-auto px-4 pt-20 pb-10">
      <h1 className="text-4xl md:text-5xl text-center font-dancing text-red-800 mb-8">
        🎊 Hỏi Đáp Về Tết 🎊
      </h1>

      {/* Câu hỏi gợi ý - Đưa lên trước */}
      <div className="mb-8">
        <h2 className="text-2xl font-dancing text-red-700 mb-4">
          💭 Câu hỏi gợi ý
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedQuestion(question)}
              className="text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-red-100 hover:border-red-200"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Form đặt câu hỏi - Chuyển xuống dưới */}
      <div className="mb-8">
        <h2 className="text-2xl font-dancing text-red-700 mb-4">
          ❓ Đặt câu hỏi
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Nhập câu hỏi của bạn về Tết..."
            className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent min-h-[120px]"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className={`w-full md:w-auto px-8 py-3 rounded-lg text-white font-medium 
              ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}
              transition-colors`}
          >
            {submitting ? 'Đang xử lý...' : 'Gửi câu hỏi'}
          </button>
        </form>
      </div>

      {/* Phần hiển thị câu trả lời giữ nguyên */}
      {answer && (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-red-100 animate-fade-in">
          <h3 className="text-xl font-dancing text-red-700 mb-4">
            📝 Câu trả lời
          </h3>
          <div 
            className="prose prose-red max-w-none whitespace-pre-line"
            dangerouslySetInnerHTML={{ 
              __html: marked(answer, { breaks: true }) 
            }}
          />
        </div>
      )}
      {submitting && <Loading />}
    </div>
  );
};

export default TetQA; 