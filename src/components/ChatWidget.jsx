import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { chatService } from '../services/api';
import ErrorBoundary from '../components/ErrorBoundary';
import { getClientIP } from '../services/ipService';

const ChatWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // Lấy IP khi component mount
  useEffect(() => {
    const initializeUserId = async () => {
      // Nếu user đã đăng nhập thì dùng id của user
      if (user?.id) {
        setUserId(user.id);
        return;
      }
      // Nếu chưa đăng nhập thì dùng IP
      const ip = await getClientIP();
      setUserId(ip);
    };

    initializeUserId();
  }, [user]);

  // Chỉ load chat history khi đã có userId
  useEffect(() => {
    let interval;
    if (isExpanded && userId) {
      loadChatHistory();
      interval = setInterval(loadChatHistory, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExpanded, userId]);

  const defaultMessage = {
    id: 'welcome',
    message: "Xin chào! Tôi có thể giúp gì cho bạn? 🎋",
    sender: "admin",
    created_at: new Date().toISOString(),
    is_read: true
  };

  const loadChatHistory = async () => {
    try {
      const history = await chatService.getChatHistory(userId);
      
      // Nếu chưa có tin nhắn nào và không có history
      if (!history?.length && messages.length === 0) {
        setMessages([defaultMessage]);
        return;
      }

      // Nếu có history
      if (history?.length > 0) {
        // Kiểm tra xem có tin nhắn mới không
        const lastCurrentMessage = messages[messages.length - 1];
        const lastNewMessage = history[history.length - 1];

        // Chỉ cập nhật nếu:
        // 1. Chưa có tin nhắn nào
        // 2. Có tin nhắn mới (ID khác nhau)
        // 3. Số lượng tin nhắn khác nhau
        if (!lastCurrentMessage || 
            lastCurrentMessage.id !== lastNewMessage.id ||
            messages.length !== history.length) {
          
          // Giữ lại tin nhắn chào mừng nếu history trống
          if (messages.length === 1 && messages[0].id === 'welcome') {
            setMessages([messages[0], ...history]);
          } else {
            setMessages(history);
          }
          scrollToBottom();
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Chỉ hiển thị tin nhắn chào mừng nếu chưa có tin nhắn nào
      if (messages.length === 0) {
        setMessages([defaultMessage]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMessage = {
      id: Date.now(),
      message: newMessage,
      sender: 'user',
      created_at: new Date().toISOString(),
      is_read: false
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    scrollToBottom();

    try {
      await chatService.sendMessage(userId, {
        message: tempMessage.message,
        sender: 'user'
      });
      
      loadChatHistory();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      alert('Có lỗi xảy ra khi gửi tin nhắn');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleError = (error) => {
    console.error('Chat error:', error);
    alert('Có lỗi xảy ra, vui lòng thử lại sau');
  };

  return (
    <ErrorBoundary fallback={<div>Có lỗi xảy ra với chat</div>}>
      <div className={`fixed bottom-[-15rem] right-4 z-50 transform transition-transform duration-300 ${
        isExpanded ? 'translate-y-[-380px]' : ''
      }`}>
        {isExpanded ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-red-100 
            transition-all duration-500 w-80 h-[350px]">
            {/* Header */}
            <div 
              className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl 
                flex items-center justify-between cursor-pointer"
              onClick={() => setIsExpanded(false)}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white font-medium">Chat với Admin</span>
              </div>
              <button className="text-white hover:text-red-100 transition-colors">
                ▼
              </button>
            </div>

            {/* Messages */}
            <div className="p-4 h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-red-200 scrollbar-track-transparent">
              {messages.map(message => (
                <div
                  key={message.id || message.created_at}
                  className={`mb-3 flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-red-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-red-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form 
              onSubmit={handleSubmit}
              className="p-4 border-t border-gray-100"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full 
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 
                    text-white rounded-full hover:from-red-600 hover:to-red-700 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Gửi
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-red-600 
              text-white flex items-center justify-center shadow-lg
              hover:from-red-600 hover:to-red-700 transition-all duration-300
              transform hover:scale-110 relative group"
          >
            {/* Icon */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-7 h-7"
            >
              <path 
                fillRule="evenodd" 
                d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" 
                clipRule="evenodd" 
              />
            </svg>

            {/* Pulse Effect */}
            <span className="absolute -top-1 -right-1 w-3 h-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>

            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-2 py-1 bg-gray-800 text-white text-sm 
              rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity
              before:content-[''] before:absolute before:right-[-5px] before:top-1/2 before:-translate-y-1/2
              before:border-[6px] before:border-transparent before:border-l-gray-800">
              Chat với Admin
            </span>
          </button>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ChatWidget; 
