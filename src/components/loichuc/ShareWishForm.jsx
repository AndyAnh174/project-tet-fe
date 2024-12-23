import React, { useState } from 'react';
import { wishService } from '../../services/api';
import WishGeneratorModal from './WishGeneratorModal';
import { generateStyle } from '../../services/gemini';

const STYLE_PREVIEWS = {
  style1: {
    name: "Phong cách truyền thống",
    preview: "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
    textColor: "text-red-800",
    className: "border-2 border-red-300 shadow-red-100"
  },
  style2: {
    name: "Phong cách hiện đại",
    preview: "bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200",
    textColor: "text-yellow-800",
    className: "border-2 border-yellow-300 shadow-yellow-100"
  },
  style3: {
    name: "Phong cách hoa đào",
    preview: "bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200",
    textColor: "text-pink-800",
    className: "border-2 border-pink-300 shadow-pink-100",
    backgroundImage: "url('/hoa-dao-bg.png')",
    backgroundOpacity: "0.1"
  },
  style4: {
    name: "Phong cách mai vàng",
    preview: "bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200",
    textColor: "text-amber-800",
    className: "border-2 border-amber-300 shadow-amber-100",
    backgroundImage: "url('/mai-vang-bg.png')",
    backgroundOpacity: "0.1"
  },
  style5: {
    name: "Phong cách lân rồng",
    preview: "bg-gradient-to-br from-red-50 via-yellow-50 to-red-100 border-red-200",
    textColor: "text-red-800",
    className: "border-2 border-red-300 shadow-red-100",
    backgroundImage: "url('/dragon-pattern.png')",
    backgroundOpacity: "0.1"
  }
};

const FONT_PREVIEWS = {
  dancing: {
    name: "Dancing Script",
    className: "font-dancing"
  },
  montserrat: {
    name: "Montserrat",
    className: "font-montserrat"
  }
};

const StylePreview = React.memo(({ style, content, formData }) => {
  const styleConfig = STYLE_PREVIEWS[style];
  return (
    <div 
      className={`relative p-4 rounded-lg ${styleConfig.preview} ${styleConfig.className} overflow-hidden transition-all duration-300`}
      style={{ minHeight: '100px' }}
    >
      {styleConfig.backgroundImage && (
        <div 
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: styleConfig.backgroundImage,
            opacity: styleConfig.backgroundOpacity
          }}
        />
      )}
      <div className={`${styleConfig.textColor} text-sm relative z-10`}>
        <p className="transition-all duration-300">
          {formData?.content || content}
        </p>
      </div>
    </div>
  );
});

function FontPreview({ font, content }) {
  const fontConfig = FONT_PREVIEWS[font];
  return (
    <div className={`${fontConfig.className} text-lg mb-2`}>
      {content}
    </div>
  );
}

const ShareWishForm = ({ selectedStyle, onStyleChange, formData, setFormData, onSubmitSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [customStyleInput, setCustomStyleInput] = useState('');
  const [customStyle, setCustomStyle] = useState(null);
  const [aiGeneratedStyle, setAiGeneratedStyle] = useState(null);
  const [styles, setStyles] = useState({
    style1: STYLE_PREVIEWS.style1.preview,
    style2: STYLE_PREVIEWS.style2.preview,
    style3: STYLE_PREVIEWS.style3.preview,
    style4: STYLE_PREVIEWS.style4.preview,
    style5: STYLE_PREVIEWS.style5.preview
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('FormData before submit:', formData);
      console.log('CustomStyle before submit:', customStyle);

      const wishData = {
        ...formData,
        style: formData.style,
        customStyle: formData.style === 'custom' ? customStyle : null
      };

      console.log('Final wishData being sent:', wishData);
      await wishService.createWish(wishData);
      setSuccess(true);
      
      setFormData({
        title: '',
        content: '',
        author: '',
        isAnonymous: false,
        style: 'style1',
        font: 'dancing',
        customStyle: null
      });
      setCustomStyle(null);
      setCustomStyleInput('');

      if (onSubmitSuccess) {
        setTimeout(() => {
          onSubmitSuccess();
        }, 1500);
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStyle = async () => {
    if (!customStyleInput) return;
    
    try {
      setLoading(true);
      setError(null);
      const generatedStyle = await generateStyle(customStyleInput);
      
      setAiGeneratedStyle(generatedStyle);
      setCustomStyle(generatedStyle);
    } catch (err) {
      console.error('Style generation error:', err);
      setError('Không thể tạo style. Vui lòng thử lại với mô tả khác.');
    } finally {
      setLoading(false);
    }
  };

  const handleStyleButtonClick = (style) => {
    onStyleChange(style);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-dancing font-bold text-red-800 mb-6">
        ✍️ Viết lời chúc
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          Gửi lời chúc thành công! 🎉
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Tiêu đề</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            placeholder="Nhập tiêu đề lời chúc..."
            value={formData.title}
            onChange={(e) => handleFormChange('title', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Nội dung</label>
          <textarea
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 h-32"
            placeholder="Nhập lời chúc của bạn..."
            value={formData.content}
            onChange={(e) => handleFormChange('content', e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Chọn phong cách</label>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => handleStyleButtonClick('preset')}
              className={`px-4 py-2 rounded ${
                selectedStyle === 'preset' ? 'bg-red-600 text-white' : 'bg-gray-200'
              }`}
            >
              Phong cách có sẵn
            </button>
            <button
              onClick={() => handleStyleButtonClick('ai')}
              className={`px-4 py-2 rounded ${
                selectedStyle === 'ai' ? 'bg-red-600 text-white' : 'bg-gray-200'
              }`}
            >
              AI Tạo style
            </button>
          </div>

          {selectedStyle === 'preset' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(STYLE_PREVIEWS).map(([key, style]) => (
                <div
                  key={key}
                  className={`cursor-pointer rounded-lg border-2 transition-all duration-300 ${
                    formData.style === key
                      ? 'border-red-500 shadow-lg'
                      : 'border-transparent hover:border-red-200'
                  }`}
                  onClick={() => handleFormChange('style', key)}
                >
                  <div className="p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      {style.name}
                      {formData.style === key && (
                        <span className="ml-2 text-red-500">✓</span>
                      )}
                    </h4>
                    <StylePreview
                      style={key}
                      content="Chúc mừng năm mới! An khang thịnh vượng"
                      formData={formData}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedStyle === 'ai' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={customStyleInput}
                  onChange={(e) => setCustomStyleInput(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Mô tả style bạn muốn..."
                />
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Gợi ý:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    <li>AI CŨNG CÓ HẠN CHẾ CỦA NÓ NÊN MỌI ƯƠIỜI CÓ DÙNG KEYWORD ĐỂ TẠO STYLE. Chỉ có thể tạo được khung màu</li>
                    <li>"Khung màu đỏ rực rỡ"</li>
                    <li>"Khung màu xanh lá cây với hiệu ứng đổi màu từ xanh sang vàng"</li>
                  </ul>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateStyle}
                    disabled={!customStyleInput || loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Đang tạo...' : '✨ Tạo style'}
                  </button>
                  {error && (
                    <div className="text-sm text-red-500 mt-1 animate-fade-in">
                      ⚠️ {error}
                    </div>
                  )}
                </div>
              </div>

              {customStyle && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Xem trước style mới:</h4>
                  <div 
                    style={customStyle}
                    className="p-6 rounded-lg transition-all duration-300"
                  >
                    <h3 className="text-xl mb-3">
                      {formData.title || "Tiêu đề lời chúc"}
                    </h3>
                    <p className="whitespace-pre-line">
                      {formData.content || "Chúc mừng năm mới! An khang thịnh vượng"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Current customStyle before applying:', customStyle);
                      setFormData(prev => {
                        const newData = { 
                          ...prev, 
                          style: 'custom',
                          customStyle: customStyle
                        };
                        console.log('New formData after applying style:', newData);
                        return newData;
                      });
                      alert('Đã áp dụng style mới!');
                    }}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    💫 Áp dụng style này
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Chọn font chữ</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {Object.entries(FONT_PREVIEWS).map(([key, font]) => (
              <div
                key={key}
                className={`cursor-pointer p-4 rounded-lg border transition-all ${
                  formData.font === key
                    ? 'border-red-500 shadow-md'
                    : 'border-gray-200 hover:border-red-300'
                }`}
                onClick={() => handleFormChange('font', key)}
              >
                <h4 className="font-medium mb-2">{font.name}</h4>
                <FontPreview
                  font={key}
                  content="Chúc mừng năm mới! An khang thịnh vượng"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Tên của bạn</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            placeholder="Nhập tên của bạn..."
            value={formData.author}
            onChange={(e) => handleFormChange('author', e.target.value)}
            disabled={formData.isAnonymous}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="anonymous"
            className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
            checked={formData.isAnonymous}
            onChange={(e) => handleFormChange('isAnonymous', e.target.checked)}
          />
          <label htmlFor="anonymous" className="text-gray-700">
            Gửi ẩn danh 🎭
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Đang gửi...' : '🧧 Chia sẻ lời chúc'}
        </button>
      </form>
    </div>
  );
};

export default ShareWishForm; 