import React, { useState, useEffect } from 'react';
import { wishService } from '../../services/api';

function WishesManagement() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingWish, setEditingWish] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    visibility: 'all',
    likes: 'all',
    hasLikes: 'all'
  });

  // Fetch wishes
  useEffect(() => {
    fetchWishes();
  }, [filters]);

  const fetchWishes = async () => {
    try {
      setLoading(true);
      const data = await wishService.getAllWishes(filters);
      setWishes(data);
    } catch (err) {
      setError('Không thể tải danh sách lời chúc');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle actions
  const handleDelete = async (wishId) => {
    if (!window.confirm('Bạn có chắc muốn xóa lời chúc này?')) return;
    
    try {
      await wishService.deleteWish(wishId);
      setWishes(wishes.filter(w => w.id !== wishId));
    } catch (err) {
      alert('Không thể xóa lời chúc');
      console.error(err);
    }
  };

  const handleStatusChange = async (wishId, newStatus) => {
    try {
      await wishService.updateWishStatus(wishId, newStatus);
      setWishes(wishes.map(w => 
        w.id === wishId ? { ...w, status: newStatus } : w
      ));
    } catch (err) {
      alert('Không thể cập nhật trạng thái');
      console.error(err);
    }
  };

  const handleEdit = (wish) => {
    setEditingWish({ ...wish });
  };

  const handleUpdate = async () => {
    try {
      const updated = await wishService.updateWish(editingWish.id, editingWish);
      setWishes(wishes.map(w => 
        w.id === updated.id ? updated : w
      ));
      setEditingWish(null);
    } catch (err) {
      alert('Không thể cập nhật lời chúc');
      console.error(err);
    }
  };

  const handleToggleVisibility = async (wishId) => {
    try {
      const updatedWish = await wishService.toggleVisibility(wishId);
      if (updatedWish) {
        // Cập nhật state với dữ liệu mới từ server
        setWishes(wishes.map(w => 
          w.id === wishId ? { ...w, isHidden: updatedWish.isHidden } : w
        ));
      }
    } catch (err) {
      console.error('Error toggling visibility:', err);
      alert('Không thể thay đổi trạng thái hiển thị');
    }
  };

  const handleResetLikes = async (wishId) => {
    if (!window.confirm('Bạn có chắc muốn reset số lượt thích về 0?')) return;

    try {
      await wishService.resetLikes(wishId);
      
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

  const renderLikesInfo = (wish) => {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-red-500">❤️</span>
          <span className="font-medium">{wish.likes || 0} lượt thích</span>
        </div>
        {wish.likedBy && wish.likedBy.length > 0 && (
          <div className="text-xs text-gray-500">
            <div className="font-medium mb-1">Người đã thích:</div>
            <div className="max-h-20 overflow-y-auto space-y-1">
              {wish.likedBy.map((ip, index) => (
                <div key={index} className="flex items-center gap-1">
                  <span>👤</span>
                  <span>{ip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="px-4 py-2 rounded-lg border border-gray-300"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Đã từ chối</option>
        </select>

        <select
          className="px-4 py-2 rounded-lg border border-gray-300"
          value={filters.visibility}
          onChange={(e) => setFilters({ ...filters, visibility: e.target.value })}
        >
          <option value="all">Tất cả</option>
          <option value="visible">Đang hiển thị</option>
          <option value="hidden">Đang ẩn</option>
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="px-4 py-2 rounded-lg border border-gray-300 flex-1"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          className="px-4 py-2 rounded-lg border border-gray-300"
          value={filters.hasLikes}
          onChange={(e) => setFilters({ ...filters, hasLikes: e.target.value })}
        >
          <option value="all">Tất cả lời chúc</option>
          <option value="liked">Đã có lượt thích ❤️</option>
          <option value="notLiked">Chưa có lượt thích 🤍</option>
        </select>

        <select
          className="px-4 py-2 rounded-lg border border-gray-300"
          value={filters.likes}
          onChange={(e) => setFilters({ ...filters, likes: e.target.value })}
        >
          <option value="all">Sắp xếp lượt thích</option>
          <option value="most">Nhiều lượt thích nhất ↓</option>
          <option value="least">Ít lượt thích nhất ↑</option>
        </select>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Tổng số lượt thích */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-full">
              <span className="text-2xl">❤️</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">Tổng lượt thích</h3>
              <p className="text-3xl font-bold text-red-600">
                {wishes.reduce((sum, w) => sum + (w.likes || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Lời chúc được thích nhiều nhất */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Lời chúc được thích nhiều nhất
          </h3>
          {(() => {
            const mostLikedWish = [...wishes].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];
            return mostLikedWish ? (
              <div className="space-y-2">
                <div className="font-medium text-gray-700">{mostLikedWish.title}</div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">❤️</span>
                  <span className="text-xl font-bold text-red-600">
                    {mostLikedWish.likes || 0} lượt thích
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">Chưa có lời chúc nào được thích</div>
            );
          })()}
        </div>

        {/* Thống kê chi tiết */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Thống kê chi tiết</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Số lời chúc có lượt thích:</span>
              <span className="font-bold">
                {wishes.filter(w => (w.likes || 0) > 0).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Số lời chúc chưa có lượt thích:</span>
              <span className="font-bold">
                {wishes.filter(w => !w.likes || w.likes === 0).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Trung bình lượt thích/lời chúc:</span>
              <span className="font-bold">
                {(wishes.reduce((sum, w) => sum + (w.likes || 0), 0) / wishes.length).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wishes Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người gửi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lượt thích & Người thích
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {wishes
              .filter(wish => {
                if (filters.hasLikes === 'liked') return (wish.likes || 0) > 0;
                if (filters.hasLikes === 'notLiked') return !wish.likes || wish.likes === 0;
                return true;
              })
              .sort((a, b) => {
                if (filters.likes === 'most') return (b.likes || 0) - (a.likes || 0);
                if (filters.likes === 'least') return (a.likes || 0) - (b.likes || 0);
                return 0;
              })
              .map(wish => (
                <tr key={wish.id} className={`hover:bg-gray-50 ${wish.isHidden ? 'bg-gray-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {wish.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {editingWish?.id === wish.id ? (
                      <input
                        type="text"
                        className="w-full px-2 py-1 border rounded"
                        value={editingWish.title}
                        onChange={(e) => setEditingWish({
                          ...editingWish,
                          title: e.target.value
                        })}
                      />
                    ) : (
                      <div>
                        <div className="font-medium">{wish.title}</div>
                        <div className="text-gray-500">{wish.content.substring(0, 50)}...</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {wish.isAnonymous ? '🎭 Ẩn danh' : wish.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {wish.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      wish.status === 'approved' ? 'bg-green-100 text-green-800' :
                      wish.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {wish.status === 'approved' ? 'Đã duyệt' :
                       wish.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                        <span className="text-red-500 text-lg">❤️</span>
                        <span className="font-medium text-red-600">{wish.likes || 0} lượt thích</span>
                      </div>
                      {wish.likedBy && wish.likedBy.length > 0 ? (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            Danh sách người đã thích:
                          </div>
                          <div className="max-h-32 overflow-y-auto space-y-2">
                            {wish.likedBy.map((ip, index) => (
                              <div 
                                key={index}
                                className="flex items-center justify-between bg-white p-2 rounded-lg text-sm hover:bg-gray-100"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400">👤</span>
                                  <span className="text-gray-600">{ip}</span>
                                </div>
                                <div className="text-xs text-gray-400">
                                  {new Date(wish.updatedAt).toLocaleString('vi-VN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          Chưa có ai thích lời chúc này
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingWish?.id === wish.id ? (
                      <div className="space-x-2">
                        <button onClick={handleUpdate} className="text-green-600 hover:text-green-900">
                          Lưu
                        </button>
                        <button onClick={() => setEditingWish(null)} className="text-gray-600 hover:text-gray-900">
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusChange(wish.id, 'approved')}
                          className="text-green-600 hover:text-green-900"
                          disabled={wish.status === 'approved'}
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleStatusChange(wish.id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                          disabled={wish.status === 'rejected'}
                        >
                          Từ chối
                        </button>
                        <button
                          onClick={() => handleEdit(wish)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(wish.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                        <button
                          onClick={() => handleToggleVisibility(wish.id)}
                          className={`${
                            wish.isHidden 
                              ? 'text-green-600 hover:text-green-900' 
                              : 'text-yellow-600 hover:text-yellow-900'
                          }`}
                        >
                          {wish.isHidden ? '👁️ Hiện' : '👁️‍🗨️ Ẩn'}
                        </button>
                        <button
                          onClick={() => handleResetLikes(wish.id)}
                          className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-red-500 bg-gray-100 rounded transition-colors"
                          title="Reset lượt thích về 0"
                        >
                          <span>🔄</span>
                          <span className="whitespace-nowrap">Reset ({wish.likes || 0})</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Thêm thông tin tổng hợp */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-600">
          Đang hiển thị: {wishes.filter(wish => {
            if (filters.hasLikes === 'liked') return (wish.likes || 0) > 0;
            if (filters.hasLikes === 'notLiked') return !wish.likes || wish.likes === 0;
            return true;
          }).length} lời chúc
          {filters.hasLikes === 'liked' && ' đã có lượt thích'}
          {filters.hasLikes === 'notLiked' && ' chưa có lượt thích'}
        </div>
      </div>
    </div>
  );
}

export default WishesManagement; 