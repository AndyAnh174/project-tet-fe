import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateStyle = async (description) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Tạo một đối tượng style CSS sáng tạo cho thẻ chúc Tết với mô tả: "${description}".
    Hãy tự do sáng tạo với bất kỳ hiệu ứng CSS nào bạn muốn, nếu mô tả tui không đủ, bạn có thể tự do sáng tạo. 
    Nếu bạn không thể tạo được, hãy trả về một đối tượng style mặc định hoặc một đối tượng style khác.
    
    Return a JSON object with your creative styles. Example:
    {
      // Base styles
      "background": "linear-gradient(45deg, rgba(255,215,0,0.8), rgba(255,0,0,0.6))",
      "borderRadius": "15px", 
      "padding": "20px",
      "boxShadow": "0 5px 15px rgba(0,0,0,0.1)",
      "position": "relative",
      "overflow": "hidden",

      // Animation & Transition
      "transition": "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "animation": "float 3s ease-in-out infinite",

      // Pseudo elements for decorative effects
      ":before": {
        "content": "''",
        "position": "absolute",
        "top": "-50%",
        "left": "-50%",
        "width": "200%",
        "height": "200%",
        "backgroundImage": "radial-gradient(circle, rgba(255,255,255,0.2) 2px, transparent 3px)",
        "backgroundSize": "20px 20px",
        "animation": "sparkle 4s linear infinite"
      },

      // Hover effects
      ":hover": {
        "transform": "translateY(-5px) scale(1.02)",
        "boxShadow": "0 10px 30px rgba(255, 107, 107, 0.3)",
        "background": "linear-gradient(45deg, rgba(255,0,0,0.6), rgba(255,215,0,0.8))",
        "filter": "brightness(1.1)"
      },

      // Custom keyframes animations
      "@keyframes float": {
        "0%, 100%": {
          "transform": "translateY(0)"
        },
        "50%": {
          "transform": "translateY(-10px)"
        }
      },

      "@keyframes sparkle": {
        "0%": {
          "transform": "rotate(0deg)"
        },
        "100%": {
          "transform": "rotate(360deg)"
        }
      },

      // Text styles
      "color": "#333",
      "textShadow": "1px 1px 2px rgba(0,0,0,0.1)",
      "fontWeight": "bold",
      
      // Custom icons or decorative elements
      "icons": {
        "position": "absolute",
        "fontSize": "24px",
        "color": "rgba(255,255,255,0.8)",
        "animation": "float 2s ease-in-out infinite"
      }
    }

    Hãy sáng tạo tự do và tạo ra style đẹp mắt nhất có thể dựa trên mô tả được cung cấp. 
    Đảm bảo bao gồm:
    1. Hiệu ứng gradient hoặc màu sắc đẹp mắt
    2. Animation và transition mượt mà
    3. Hover effects ấn tượng
    4. Pseudo elements để tạo hiệu ứng trang trí
    5. Custom keyframes nếu cần
    6. Text styling phù hợp
    7. Icons hoặc decorative elements nếu phù hợp`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    try {
      // Clean up response
      const cleanedText = text.replace(/```json|```/g, '').trim();
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}') + 1;
      const jsonText = cleanedText.slice(jsonStart, jsonEnd);
      
      const parsedStyle = JSON.parse(jsonText);

      // Thêm các keyframes vào document nếu có
      if (parsedStyle['@keyframes']) {
        Object.entries(parsedStyle['@keyframes']).forEach(([name, frames]) => {
          const styleSheet = document.createElement('style');
          const keyframesRule = `@keyframes ${name} {
            ${Object.entries(frames).map(([key, value]) => 
              `${key} { ${Object.entries(value).map(([prop, val]) => 
                `${prop}: ${val}`).join('; ')} }`
            ).join('\n')}
          }`;
          styleSheet.textContent = keyframesRule;
          document.head.appendChild(styleSheet);
        });
        // Xóa @keyframes từ style object vì đã được thêm vào document
        delete parsedStyle['@keyframes'];
      }

      return parsedStyle;
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      throw new Error('Invalid style format');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Không thể tạo style. Vui lòng thử lại sau.');
  }
}; 