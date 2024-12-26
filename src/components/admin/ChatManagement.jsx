import React, { useState, useEffect } from 'react';
import { chatService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ChatManagement = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    loadAllChats();
    const interval = setInterval(loadAllChats, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadAllChats = async () => {
    try {
      const allChats = await chatService.getAllChats();
      const counts = await chatService.getUnreadChats();
      
      setUnreadCounts(counts);
      setChats(allChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const loadChatHistory = async (userId) => {
    try {
      const history = await chatService.getChatHistory(userId);
      setChats(prev => ({...prev, [userId]: history}));
      setSelectedUserId(userId);
      await chatService.markAsRead(userId);
      loadUnreadCounts();
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    // Tạo tin nhắn tạm thời để hiển thị ngay
    const tempMessage = {
      id: Date.now(),
      message: newMessage,
      sender: 'admin',
      created_at: new Date().toISOString(),
      is_read: true
    };

    // Cập nhật UI ngay lập tức
    setChats(prev => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), tempMessage]
    }));
    setNewMessage('');

    try {
      // Gửi tin nhắn lên server
      await chatService.sendMessage(selectedUserId, {
        message: newMessage,
        sender: 'admin'
      });

      // Load lại toàn bộ chat để đồng bộ
      loadAllChats();
    } catch (error) {
      console.error('Error sending message:', error);
      // Xóa tin nhắn tạm nếu gửi thất bại
      setChats(prev => ({
        ...prev,
        [selectedUserId]: prev[selectedUserId].filter(msg => msg.id !== tempMessage.id)
      }));
      alert('Có lỗi xảy ra khi gửi tin nhắn');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50 pt-20">
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 
            transition-colors font-medium"
        >
          <span className="text-lg">←</span>
          <span className="text-lg font-dancing">Quay lại</span>
        </button>
      </div>

      <div className="container mx-auto px-4 mb-6">
        <h1 className="text-3xl font-dancing text-center">Quản Lý Chat</h1>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-4">
          {/* Danh sách user */}
          <div className="col-span-1 border rounded-lg p-4">
            <h3 className="font-bold mb-2">Danh sách chat</h3>
            {Object.keys(chats).length === 0 ? (
              <p className="text-gray-500 text-center">Chưa có cuộc trò chuyện nào</p>
            ) : (
              Object.entries(chats).map(([userId, messages]) => (
                <button
                  key={userId}
                  onClick={() => loadChatHistory(userId)}
                  className={`w-full text-left p-2 rounded mb-2 ${
                    selectedUserId === userId ? 'bg-red-100' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="text-gray-600">🌐</span>
                      {userId.startsWith('unknown-') ? 'Khách' : 
                       userId.includes('@') ? 'Admin' : userId}
                    </span>
                    {unreadCounts[userId] > 0 && (
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                        {unreadCounts[userId]}
                      </span>
                    )}
                  </div>
                  {messages.length > 0 && (
                    <p className="text-sm text-gray-500 truncate">
                      {messages[messages.length - 1].message}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Chat area */}
          <div className="col-span-3 border rounded-lg p-4">
            {selectedUserId ? (
              <>
                <div className="h-[500px] overflow-y-auto mb-4">
                  {chats[selectedUserId]?.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-2 flex ${
                        message.sender === 'admin' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender === 'admin'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100'
                      }`}>
                        <p>{message.message}</p>
                        <p className="text-xs opacity-75">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-2"
                    placeholder="Nhập tin nhắn..."
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                    disabled={!newMessage.trim()}
                  >
                    Gửi
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Chọn một cuộc trò chuyện để bắt đầu
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatManagement; 