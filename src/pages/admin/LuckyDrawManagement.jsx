import React, { useState, useEffect } from 'react';
import { luckyDrawService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const LuckyDrawManagement = () => {
  const navigate = useNavigate();
  const [luckyDraws, setLuckyDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalDraws: 0,
    pendingDraws: 0,
    approvedDraws: 0,
    rejectedDraws: 0,
    fund: 0,
    remainingFund: 0
  });
  const [showFundModal, setShowFundModal] = useState(false);
  const [newFund, setNewFund] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    loadLuckyDraws();
  }, []);

  const loadLuckyDraws = async () => {
    try {
      const response = await luckyDrawService.getLuckyDraws();
      setLuckyDraws(response.draws);
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading lucky draws:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (draw, index) => {
    setSelectedDraw({ ...draw, index });
    setShowConfirmModal(true);
  };

  const handleRejectClick = (draw, index) => {
    setSelectedDraw({ ...draw, index });
    setShowRejectModal(true);
  };

  const handleApproveConfirm = async () => {
    try {
      await luckyDrawService.updateLuckyDraw(selectedDraw.index, 'approved');
      await loadLuckyDraws();
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error approving:', error);
      alert('Có lỗi xảy ra khi duyệt yêu cầu');
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    try {
      await luckyDrawService.updateLuckyDraw(
        selectedDraw.index, 
        'rejected',
        rejectReason
      );
      await loadLuckyDraws();
      setShowRejectModal(false);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Có lỗi xảy ra khi từ chối yêu cầu');
    }
  };

  const handleUpdateFund = async () => {
    try {
      const amount = parseInt(newFund.replace(/[,.]/g, ''), 10);
      if (isNaN(amount) || amount < 0) {
        alert('Vui lòng nhập số tiền hợp lệ');
        return;
      }
      
      await luckyDrawService.updateFund(amount);
      await loadLuckyDraws();
      setShowFundModal(false);
      setNewFund('');
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra khi cập nhật quỹ');
    }
  };

  const handleDeleteClick = (draw, index) => {
    setSelectedDraw({ ...draw, index });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await luckyDrawService.deleteLuckyDraw(selectedDraw.index);
      await loadLuckyDraws();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Có lỗi xảy ra khi xóa yêu cầu');
    }
  };

  const handleEditClick = (draw, index) => {
    setSelectedDraw({ ...draw, index });
    setEditStatus(draw.status);
    setRejectReason(draw.reject_reason || '');
    setShowEditModal(true);
  };

  const handleEditConfirm = async () => {
    try {
      if (editStatus === 'rejected' && !rejectReason.trim()) {
        alert('Vui lòng nhập lý do từ chối');
        return;
      }

      await luckyDrawService.updateLuckyDraw(
        selectedDraw.index,
        editStatus,
        rejectReason
      );
      await loadLuckyDraws();
      setShowEditModal(false);
      setRejectReason('');
    } catch (error) {
      alert(error.response?.data?.error || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <span>←</span>
            <span>Quay lại</span>
          </button>
          <h1 className="text-2xl font-bold">Quản Lý Hái Lộc</h1>
        </div>
        <button
          onClick={() => setShowFundModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Cập nhật quỹ
        </button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Tổng yêu cầu</h3>
          <p className="text-2xl font-bold">{stats.totalDraws}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Chờ duyệt</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingDraws}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Đã duyệt</h3>
          <p className="text-2xl font-bold text-green-600">{stats.approvedDraws}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Đã từ chối</h3>
          <p className="text-2xl font-bold text-red-600">{stats.rejectedDraws}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Tổng tiền đã duyệt</h3>
          <p className="text-2xl font-bold text-red-600">
            {stats.totalAmount.toLocaleString()}đ
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Tổng quỹ</h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.fund?.toLocaleString()}đ
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm">Quỹ còn lại</h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.remainingFund?.toLocaleString()}đ
          </p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Thời Gian</th>
              <th className="px-6 py-3 text-left">Số TK</th>
              <th className="px-6 py-3 text-left">Ngân Hàng</th>
              <th className="px-6 py-3 text-left">Tên TK</th>
              <th className="px-6 py-3 text-left">Số Tiền</th>
              <th className="px-6 py-3 text-left">Trạng Thái</th>
              <th className="px-6 py-3 text-left">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {luckyDraws.map((draw, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{new Date(draw.created_at).toLocaleString()}</td>
                <td className="px-6 py-4">{draw.account_number}</td>
                <td className="px-6 py-4">{draw.bank_name}</td>
                <td className="px-6 py-4">{draw.account_name}</td>
                <td className="px-6 py-4">{draw.amount.toLocaleString()}đ</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    draw.status === 'approved' ? 'bg-green-100 text-green-800' :
                    draw.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {draw.status === 'approved' ? 'Đã duyệt' :
                     draw.status === 'rejected' ? 'Từ chối' :
                     'Chờ duyệt'}
                  </span>
                  {draw.reject_reason && (
                    <p className="text-sm text-red-600 mt-1">
                      Lý do: {draw.reject_reason}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  {draw.status === 'pending' ? (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleApproveClick(draw, index)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleRejectClick(draw, index)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Từ chối
                      </button>
                    </div>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditClick(draw, index)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteClick(draw, index)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận duyệt */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Xác nhận duyệt yêu cầu</h3>
            <p>Bạn có chắc chắn muốn duyệt yêu cầu hái lộc này?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={handleApproveConfirm}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal từ chối */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Từ chối yêu cầu</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do từ chối
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                rows="3"
                placeholder="Nhập lý do từ chối..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal cập nhật quỹ */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Cập nhật số tiền quỹ</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền quỹ mới
              </label>
              <input
                type="text"
                value={newFund}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setNewFund(value.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                }}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập số tiền..."
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowFundModal(false);
                  setNewFund('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateFund}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal sửa trạng thái */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Sửa trạng thái</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
            
            {editStatus === 'rejected' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do từ chối
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="Nhập lý do từ chối..."
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={handleEditConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa yêu cầu hái lộc này?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyDrawManagement; 