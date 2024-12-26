import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { wishService, authService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../../services/api';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalWishes: 0,
    pendingWishes: 0,
    approvedWishes: 0,
    rejectedWishes: 0
  });
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('pending'); // 'pending' hoặc 'all'
  const [editingWish, setEditingWish] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Validate auth first
        const isValid = await authService.validateToken();
        if (!isValid.valid) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          return;
        }

        console.log('Fetching dashboard data...');
        console.log('Current viewMode:', viewMode);
        
        // Fetch data
        const statsData = await wishService.getStats();
        const wishesData = await wishService.getAllWishes({ 
          status: viewMode === 'all' ? 'all' : 'pending' 
        });

        setStats(statsData);
        setWishes(wishesData || []);
      } catch (err) {
        console.error('Dashboard error:', err);
        if (err.response?.status === 401) {
          setError('Vui lòng đăng nhập lại để tiếp tục.');
        } else {
          setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewMode]);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const unreadChats = await chatService.getUnreadChats();
      // Tính tổng số tin nhắn chưa đọc từ tất cả users
      const total = Object.values(unreadChats).reduce((sum, count) => sum + count, 0);
      setUnreadCount(total);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleApproveWish = async (wishId) => {
    try {
      console.log('Approving wish:', wishId);
      const updatedWish = await wishService.updateWishStatus(wishId, 'approved');
      console.log('Updated wish:', updatedWish);
      
      // Cập nhật UI - nếu đang ở chế độ xem tất cả thì cập nhật status, ngược lại thì xóa khỏi danh sách
      if (viewMode === 'all') {
        setWishes(wishes.map(w => 
          w.id === wishId ? { ...w, status: 'approved' } : w
        ));
      } else {
        setWishes(wishes.filter(w => w.id !== wishId));
      }

      // Cập nhật stats
      setStats(prev => ({
        ...prev,
        pendingWishes: prev.pendingWishes - 1,
        approvedWishes: prev.approvedWishes + 1
      }));
    } catch (err) {
      console.error('Approve error:', err);
      alert('Có lỗi xảy ra khi duyệt lời chúc');
    }
  };

  const handleRejectWish = async (wishId) => {
    try {
      console.log('Rejecting wish:', wishId);
      const updatedWish = await wishService.updateWishStatus(wishId, 'rejected');
      console.log('Updated wish:', updatedWish);

      // Cập nhật UI - tương tự như approve
      if (viewMode === 'all') {
        setWishes(wishes.map(w => 
          w.id === wishId ? { ...w, status: 'rejected' } : w
        ));
      } else {
        setWishes(wishes.filter(w => w.id !== wishId));
      }

      // Cập nhật stats
      setStats(prev => ({
        ...prev,
        pendingWishes: prev.pendingWishes - 1,
        rejectedWishes: prev.rejectedWishes + 1
      }));
    } catch (err) {
      console.error('Reject error:', err);
      alert('Có lỗi xảy ra khi từ chối lời chúc');
    }
  };

  const handleEdit = (wish) => {
    setEditingWish(wish);
  };

  const handleCancelEdit = () => {
    setEditingWish(null);
  };

  const handleUpdate = async (wishId, updatedData) => {
    try {
      await wishService.updateWish(wishId, updatedData);
      // Cập nhật UI
      setWishes(wishes.map(w => 
        w.id === wishId ? { ...w, ...updatedData } : w
      ));
      setEditingWish(null);
    } catch (err) {
      console.error('Update error:', err);
      alert('Có lỗi xảy ra khi cập nhật lời chúc');
    }
  };

  const handleDelete = async (wishId) => {
    if (!window.confirm('Bạn có chắc muốn xóa lời chúc này?')) return;
    
    try {
      await wishService.deleteWish(wishId);
      // Cập nhật UI
      setWishes(wishes.filter(w => w.id !== wishId));
      setStats(prev => ({
        ...prev,
        totalWishes: prev.totalWishes - 1
      }));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Có lỗi xảy ra khi xóa lời chúc');
    }
  };

  const handleToggleVisibility = async (wishId) => {
    try {
      const updatedWish = await wishService.toggleVisibility(wishId);
      // Cập nhật UI
      setWishes(wishes.map(w => 
        w.id === wishId ? { ...w, isHidden: !w.isHidden } : w
      ));
    } catch (err) {
      console.error('Toggle visibility error:', err);
      alert('Có lỗi xảy ra khi thay đổi trạng thái hiển thị');
    }
  };

  const handleResetLikes = async (wishId) => {
    if (!window.confirm('Bạn có chắc muốn reset số lượt thích về 0?')) return;

    try {
      await wishService.resetLikes(wishId);
      // Cập nhật UI
      setWishes(prevWishes => 
        prevWishes.map(wish => 
          wish.id === wishId ? { ...wish, likes: 0 } : wish
        )
      );
    } catch (error) {
      console.error('Error resetting likes:', error);
      alert('Không thể reset lượt thích');
    }
  };

  const handleNavigateToLuckyDraws = () => {
    navigate('/admin/lucky-draws');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
            <p className="mt-4">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center text-red-600">
              <p className="mb-4">⚠️ {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-yellow-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-b from-red-900 to-red-800 shadow-lg border-b-4 border-yellow-500">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-yellow-400">🏮 Tết 2025</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-yellow-100">Xin chào, {user?.displayName}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quản lý hệ thống</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/admin/lucky-draws')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 
                transition-colors flex items-center gap-2"
            >
              <span>🎁</span>
              Quản lý hái lộc
            </button>
            <button
              onClick={() => navigate('/admin/chats')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
                transition-colors flex items-center gap-2 relative group"
            >
              <span>💬</span>
              Quản lý chat
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 
                  rounded-full text-xs flex items-center justify-center
                  transition-transform group-hover:scale-110">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setViewMode(viewMode === 'all' ? 'pending' : 'all')}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-800">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Tổng lời chúc</p>
                <p className="text-2xl font-bold">{stats.totalWishes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-800">
                <span className="text-2xl">⌛</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Chờ duyệt</p>
                <p className="text-2xl font-bold">{stats.pendingWishes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-800">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Đã duyệt</p>
                <p className="text-2xl font-bold">{stats.approvedWishes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-800">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Đã từ chối</p>
                <p className="text-2xl font-bold">{stats.rejectedWishes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-800">
                <span className="text-2xl">❤️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Tổng lượt thích</p>
                <p className="text-2xl font-bold">
                  {wishes.reduce((sum, w) => sum + (w.likes || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div 
            onClick={handleNavigateToLuckyDraws}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-800">
                <span className="text-2xl">🧧</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Quản lý hái lộc</p>
                <p className="text-lg font-semibold text-red-600">Xem tất cả →</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wishes List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {viewMode === 'all' ? 'Tất cả lời chúc' : `Lời chúc chờ duyệt (${stats.pendingWishes})`}
            </h2>
            <button
              onClick={() => setViewMode(viewMode === 'all' ? 'pending' : 'all')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              {viewMode === 'all' ? 'Xem chờ duyệt' : 'Xem tất cả'}
            </button>
          </div>

          {wishes.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              {viewMode === 'all' ? 'Chưa có lời chúc nào' : 'Không có lời chúc nào đang chờ duyệt'}
            </p>
          ) : (
            <div className="space-y-4">
              {wishes.map(wish => (
                <div key={wish.id} className="border rounded-lg p-4">
                  {editingWish?.id === wish.id ? (
                    // Edit form
                    <div className="space-y-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded"
                        value={editingWish.title}
                        onChange={e => setEditingWish({
                          ...editingWish,
                          title: e.target.value
                        })}
                      />
                      <textarea
                        className="w-full px-3 py-2 border rounded"
                        value={editingWish.content}
                        onChange={e => setEditingWish({
                          ...editingWish,
                          content: e.target.value
                        })}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleUpdate(wish.id, editingWish)}
                          className="px-4 py-2 bg-green-600 text-white rounded"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-600 text-white rounded"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <h3 className="font-bold text-lg mb-2">{wish.title}</h3>
                      <p className="text-gray-600 mb-4">{wish.content}</p>
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-gray-500">
                            Từ: {wish.isAnonymous ? "🎭 Người gửi ẩn danh" : wish.author}
                          </span>
                          <span className="ml-4 text-gray-400">
                            {new Date(wish.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="ml-4 px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            ❤️ {wish.likes || 0} lượt thích
                          </span>
                          <span className={`ml-4 px-2 py-1 rounded-full text-xs ${
                            wish.status === 'approved' ? 'bg-green-100 text-green-800' :
                            wish.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {wish.status === 'approved' ? 'Đã duyệt' :
                             wish.status === 'rejected' ? 'Đã từ chối' : 'Chờ duyệt'}
                          </span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            wish.isHidden ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {wish.isHidden ? '🔒 Đã ẩn' : '👁️ Hiển thị'}
                          </span>
                        </div>
                        <div className="space-x-2">
                          {wish.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveWish(wish.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => handleRejectWish(wish.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Từ chối
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleEdit(wish)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(wish.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Xóa
                          </button>
                          <button
                            onClick={() => handleToggleVisibility(wish.id)}
                            className={`px-4 py-2 rounded text-white ${
                              wish.isHidden 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-yellow-600 hover:bg-yellow-700'
                            }`}
                          >
                            {wish.isHidden ? '👁️ Hiện' : '🔒 Ẩn'}
                          </button>
                          <button
                            onClick={() => handleResetLikes(wish.id)}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-1"
                          >
                            <span>🔄</span>
                            <span>Reset ({wish.likes || 0})</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 