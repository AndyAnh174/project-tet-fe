import React, { useState, useEffect } from 'react';
import { wishService } from '../../services/api';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

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

// Thêm hàm helper để thêm keyframes an toàn
const addKeyframes = (name, rules) => {
  try {
    // Tạo một style element mới
    const styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);
    
    // Thêm keyframes vào style element
    styleSheet.sheet.insertRule(`
      @keyframes ${name} {
        ${rules}
      }
    `, 0);
  } catch (error) {
    console.error('Error adding keyframes:', error);
  }
};

function LoiChucList() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likingWishId, setLikingWishId] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, mostLiked

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          await wishService.testConnection();
        } catch (err) {
          throw new Error('Không thể kết nối đến server');
        }
        
        const data = await wishService.getWishes('approved');
        
        if (!Array.isArray(data)) {
          throw new Error('Dữ liệu không hợp lệ');
        }
        
        const visibleWishes = data.filter(wish => 
          wish && 
          wish.status === 'approved' && 
          wish.isHidden !== true
        ).map(wish => ({
          ...wish,
          likes: wish.likes || 0
        }));
        
        setWishes(visibleWishes);

      } catch (err) {
        console.error('Error fetching wishes:', err);
        setError(err.message || 'Không thể tải danh sách lời chúc');
      } finally {
        setLoading(false);
      }
    };

    fetchWishes();
  }, []);

  const handleLike = async (wishId) => {
    if (likingWishId) return; // Prevent multiple clicks

    try {
      setLikingWishId(wishId);
      
      // Optimistic update
      setWishes(prevWishes => 
        prevWishes.map(wish => {
          if (wish.id === wishId) {
            return {
              ...wish,
              likes: (wish.likes || 0) + 1
            };
          }
          return wish;
        })
      );

      // Send request to server
      await wishService.toggleLike(wishId);

    } catch (error) {
      console.error('Error liking wish:', error);
      
      // Rollback on error
      try {
        const response = await wishService.getWishes('approved');
        const updatedWishes = response
          .filter(wish => wish && !wish.isHidden && wish.status === 'approved')
          .map(wish => ({
            ...wish,
            likes: wish.likes || 0
          }));
        setWishes(updatedWishes);
      } catch (rollbackError) {
        console.error('Error rolling back:', rollbackError);
      }
    } finally {
      setLikingWishId(null);
    }
  };

  // Thêm hàm sắp xếp wishes
  const getSortedWishes = () => {
    return [...wishes].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'mostLiked':
          return (b.likes || 0) - (a.likes || 0);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const renderLikeButton = (wish) => (
    <button
      onClick={() => handleLike(wish.id)}
      disabled={likingWishId === wish.id}
      className="flex items-center gap-1 px-2 py-1 rounded-full transition-all bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-400"
    >
      <span className="text-lg">
        {likingWishId === wish.id ? '⌛' : '❤️'}
      </span>
      <span>{wish.likes || 0}</span>
    </button>
  );

  const renderDefaultCard = (wish) => {
    const styleConfig = STYLE_PREVIEWS[wish.style] || STYLE_PREVIEWS.style1;
    const fontClass = FONT_PREVIEWS[wish.font]?.className || 'font-dancing';
    const isLiked = wish.isLiked;

    return (
      <div 
        key={wish.id}
        className={`relative p-6 rounded-lg ${styleConfig.preview} ${styleConfig.className} ${fontClass} overflow-hidden`}
      >
        {styleConfig.backgroundImage && (
          <div 
            className="absolute inset-0 bg-repeat opacity-10"
            style={{
              backgroundImage: styleConfig.backgroundImage,
              opacity: styleConfig.backgroundOpacity
            }}
          />
        )}
        <div className="relative z-10">
          <h3 className={`text-xl mb-3 ${styleConfig.textColor}`}>
            {wish.title}
          </h3>
          <p className={`${styleConfig.textColor} whitespace-pre-line`}>
            {wish.content}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
            <span>
              Từ: {wish.isAnonymous ? '🎭 Người gửi ẩn danh' : wish.author}
            </span>
            <div className="flex items-center gap-2">
              {renderLikeButton(wish)}
              <span className="text-gray-400">
                {formatDate(wish.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tách component RenderCustomWish ra và truyền renderDefaultCard như một prop
  const RenderCustomWish = ({ wish }) => {
    const [customStyle, setCustomStyle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadCustomStyle = async () => {
        try {
          const style = await wishService.getCustomStyle(wish.id);
          console.log('Loaded custom style for wish', wish.id, ':', style); // Thêm log
          setCustomStyle(style);
        } catch (error) {
          console.error('Error loading custom style:', error);
        } finally {
          setLoading(false);
        }
      };
      loadCustomStyle();
    }, [wish.id]);

    // Thêm log để debug
    console.log('Rendering custom wish:', {
      wishId: wish.id,
      customStyle,
      loading
    });

    if (loading) return renderDefaultCard(wish);

    const fontClass = FONT_PREVIEWS[wish.font]?.className || 'font-dancing';

    return (
      <div 
        style={customStyle}  // Áp dụng style trực tiếp
        className={`p-6 rounded-lg ${fontClass} transition-all duration-300`}
      >
        <div className="relative z-10">
          <h3 className="text-xl mb-3">{wish.title}</h3>
          <p className="whitespace-pre-line">{wish.content}</p>
          <div className="flex justify-between items-center text-sm mt-4">
            <span>
              Từ: {wish.isAnonymous ? '🎭 Người gửi ẩn danh' : wish.author}
            </span>
            <div className="flex items-center gap-2">
              {renderLikeButton(wish)}
              <span className="text-gray-400">
                {formatDate(wish.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-dancing font-bold text-red-800">
          💌 Lời chúc đã chia sẻ
        </h2>
        
        {/* Thêm bộ lọc sắp xếp */}
        <select
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Mới nhất 🔼</option>
          <option value="oldest">Cũ nhất 🔽</option>
          <option value="mostLiked">Nhiều lượt thích ❤️</option>
        </select>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
            <p className="mt-4">Đang tải lời chúc...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : getSortedWishes().length === 0 ? (
          <div className="text-gray-500 text-center">Chưa có lời chúc nào.</div>
        ) : (
          <div className="space-y-6">
            {getSortedWishes().map(wish => (
              <div key={wish.id}>
                {wish.style === 'custom' ? (
                  <RenderCustomWish wish={wish} />
                ) : (
                  renderDefaultCard(wish)
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoiChucList; 