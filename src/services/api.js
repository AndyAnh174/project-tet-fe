import axios from 'axios';

console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('MODE:', import.meta.env.MODE);

const API_URL = import.meta.env.VITE_API_URL;
console.log('Using API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Thêm chi tiết hơn cho error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED')
      console.error('Request timed out');
    else if (!error.response)
      console.error('Network error:', error.message);
    else {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.username) {
      config.headers.Authorization = `Bearer ${user.username}`;
      console.log('Adding auth header:', config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Test function
export const testConnection = async () => {
  try {
    const response = await api.get('/test');
    console.log('Test response:', response.data);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

// Tách riêng public và private APIs
const publicApi = {
  getWishes: async (status = 'all') => {
    try {
      console.log('Calling getWishes API with status:', status);
      const response = await api.get(`/wishes`, {
        params: { status }
      });
      console.log('API Response:', response);
      return response.data;
    } catch (error) {
      console.error('getWishes API error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  createWish: async (wishData) => {
    try {
      console.log('Creating wish with full data:', wishData);
      const response = await api.post('/wishes', wishData);
      console.log('Create wish response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create wish error:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Không thể gửi lời chúc');
    }
  }
};

const privateApi = {
  // Các API cần authentication
  updateWishStatus: async (wishId, status) => {
    const response = await api.put(`/wishes/${wishId}/status`, { status });
    return response.data;
  },
  // ... other private APIs
};

export const wishService = {
  ...publicApi,
  ...privateApi,
  testConnection,
  updateWishStatus: async (wishId, status) => {
    try {
      console.log('Updating wish status:', { wishId, status });
      const response = await api.put(`/wishes/${wishId}/status`, { status });
      console.log('Update status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  },
  getAllWishes: async (filters = {}) => {
    try {
      console.log('Getting all wishes with filters:', filters);
      const params = new URLSearchParams(filters);
      const response = await api.get(`/wishes/all?${params}`);
      console.log('Get all wishes response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get all wishes error:', error);
      throw error;
    }
  },
  getStats: async () => {
    try {
      console.log('Getting stats');
      const response = await api.get('/stats');
      console.log('Stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  },
  updateWish: async (wishId, wishData) => {
    try {
      console.log('Updating wish:', { wishId, wishData });
      const response = await api.put(`/wishes/${wishId}`, wishData);
      console.log('Update wish response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update wish error:', error);
      throw error;
    }
  },
  deleteWish: async (wishId) => {
    try {
      console.log('Deleting wish:', wishId);
      const response = await api.delete(`/wishes/${wishId}`);
      console.log('Delete wish response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Delete wish error:', error);
      throw error;
    }
  },
  toggleVisibility: async (wishId) => {
    try {
      const response = await api.put(`/wishes/${wishId}/visibility`);
      return response.data;
    } catch (error) {
      console.error('Toggle visibility error:', error);
      throw error;
    }
  },
  generateWish: async (recipient, wishType) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Viết một lời chúc Tết ngắn gọn, ý nghĩa và chân thành cho ${recipient} về ${wishType}. 
        Lời chúc nên mang phong cách truyền thống Việt Nam, sử dụng các từ ngữ trang trọng và mang tính chất ngày Tết.
        Độ dài khoảng 3-4 câu.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return {
        title: `Lời chúc Tết cho ${recipient}`,
        content: text
      };
    } catch (error) {
      console.error('Generate wish error:', error);
      throw error;
    }
  },
  generateWishFrame: async (expressionStyle, recipient) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      let stylePrompt = "";
      switch (expressionStyle) {
        case 'formal':
          stylePrompt = "trang trọng, kính cẩn, sử dụng từ ngữ trang nhã";
          break;
        case 'fun':
          stylePrompt = "vui vẻ, hài hước, sử dụng emojis và từ ngữ trẻ trung";
          break;
        case 'poetic':
          stylePrompt = "theo phong cách thơ ca, văn vẻ, bay bổng";
          break;
        case 'modern':
          stylePrompt = "hiện đại, năng động, có thể pha trộn tiếng Anh";
          break;
        case 'traditional':
          stylePrompt = "truyền thống Việt Nam, sử dụng thành ngữ, tục ngữ";
          break;
      }

      const prompt = `Tạo một khung mẫu lời chúc Tết cho ${recipient} với phong cách ${stylePrompt}.
        Khung này nên có:
        1. Một câu mở đầu phù hợp
        2. Các cụm từ gợi ý để điền vào
        3. Một câu kết thúc ý nghĩa
        Giữ nguyên các placeholder trong ngoặc [...] để người dùng điền vào.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Generate frame error:', error);
      throw error;
    }
  },
  getCustomStyle: async (wishId) => {
    try {
      console.log('Getting custom style for wish:', wishId);
      const response = await api.get(`/wishes/${wishId}/custom-style`);
      console.log('Custom style response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting custom style:', error);
      throw error;
    }
  },
  toggleLike: async (wishId) => {
    try {
      console.log('Toggling like for wish:', wishId);
      const response = await api.post(`/wishes/${wishId}/like`);
      console.log('Toggle like response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Toggle like error:', error);
      throw new Error('Không thể thả tim lời chúc. Vui lòng thử lại.');
    }
  },
  resetLikes: async (wishId) => {
    try {
      const response = await api.post(`/wishes/${wishId}/reset-likes`);
      return response.data;
    } catch (error) {
      console.error('Reset likes error:', error);
      throw new Error('Không thể reset lượt thích');
    }
  }
};

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  validateToken: async () => {
    try {
      const response = await api.get('/validate-token');
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  }
};

export const luckyDrawService = {
  getLuckyDraws: async () => {
    try {
      const response = await api.get('/lucky-draws');
      return response.data;
    } catch (error) {
      console.error('Get lucky draws error:', error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/lucky-draws/stats');
      return response.data;
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  },

  createLuckyDraw: async (data) => {
    try {
      const response = await api.post('/lucky-draws', data);
      return response.data;
    } catch (error) {
      console.error('Create lucky draw error:', error);
      throw error;
    }
  },

  updateLuckyDraw: async (index, status, reason = '') => {
    try {
      const response = await api.put(`/lucky-draws/${index}`, { 
        status,
        reason 
      });
      return response.data;
    } catch (error) {
      console.error('Update lucky draw error:', error);
      throw error;
    }
  },

  updateFund: async (amount) => {
    try {
      const response = await api.put('/lucky-draws/fund', { fund: amount });
      return response.data;
    } catch (error) {
      console.error('Update fund error:', error);
      throw error;
    }
  },

  deleteLuckyDraw: async (index) => {
    try {
      const response = await api.delete(`/lucky-draws/${index}`);
      return response.data;
    } catch (error) {
      console.error('Delete lucky draw error:', error);
      throw error;
    }
  }
};

export const chatService = {
  getChatHistory: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/chats/${userId}`);
      if (!response.ok) throw new Error('Failed to load chat history');
      return response.json();
    } catch (error) {
      console.error('Error in getChatHistory:', error);
      return [];
    }
  },

  sendMessage: async (userId, data) => {
    try {
      const response = await fetch(`${API_URL}/api/chats/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  },

  getUnreadChats: async () => {
    const response = await fetch(`${API_URL}/api/chats/admin/unread`);
    if (!response.ok) throw new Error('Failed to get unread chats');
    return response.json();
  },

  markAsRead: async (userId) => {
    const response = await fetch(`${API_URL}/api/chats/${userId}/read`, {
      method: 'PUT'
    });
    if (!response.ok) throw new Error('Failed to mark messages as read');
    return response.json();
  },

  getAllChats: async () => {
    const response = await fetch(`${API_URL}/api/chats/all`);
    if (!response.ok) throw new Error('Failed to load all chats');
    return response.json();
  },
}; 