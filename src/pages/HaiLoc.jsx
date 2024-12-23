import React, { useState, useEffect } from 'react';
import cayMai from '../assets/tree/cay-mai.png';
import chauMai from '../assets/tree/chau-mai.png';
import chauDao from '../assets/tree/chau-dao.png';
import liXi1 from '../assets/li-xi/li-xi1.png';
import liXi2 from '../assets/li-xi/li-xi2.png';
import liXi3 from '../assets/li-xi/li-xi3.png';
import liXi4 from '../assets/li-xi/li-xi4.png';
import Loading from '../components/Loading';
import banks from '../../bank.json';
import { luckyDrawService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const treeOptions = [
  { 
    id: 1, 
    name: 'Cây Mai', 
    image: cayMai, 
    description: 'Cây mai vàng cao to, tượng trưng cho sự thịnh vượng',
    envelopes: [
      { position: { top: '41%', left: '35%', rotate: '-15deg' } },
      { position: { top: '40%', right: '32%', rotate: '15deg' } },
      { position: { top: '63%', left: '33%', rotate: '10deg' } },
      { position: { top: '62%', right: '30%', rotate: '-10deg' } },
      { position: { top: '25%', left: '38%', rotate: '-15deg' } },
    ]
  },
  { 
    id: 2, 
    name: 'Chậu Mai', 
    image: chauMai, 
    description: 'Chậu mai nhỏ xinh, mang đến may mắn',
    envelopes: [
      { position: { top: '38%', left: '45%', rotate: '-8deg' } },
      { position: { top: '60%', right: '35%', rotate: '10deg' } },
      { position: { top: '70%', left: '32%', rotate: '5deg' } },
      { position: { top: '45%', left: '34%', rotate: '-5deg' } },
    ]
  },
  { 
    id: 3, 
    name: 'Chậu Đào', 
    image: chauDao, 
    description: 'Chậu đào hồng thắm, biểu tượng của phúc lộc',
    envelopes: [
      { position: { top: '27%', left: '43%', rotate: '-10deg' } },
      { position: { top: '18%', right: '40%', rotate: '8deg' } },
      { position: { top: '38%', left: '40%', rotate: '5deg' } },
      { position: { top: '37%', right: '34%', rotate: '-8deg' } },
    ]
  },
];

const luckyMoney = [
  { id: 1, amount: 20000, image: liXi1, probability: 1 },   // 1% cơ hội
  { id: 2, amount: 10000, image: liXi2, probability: 2 },  // 2% cơ hội
  { id: 3, amount: 5000, image: liXi3, probability: 15 },   // 15% cơ hội
  { id: 4, amount: 2000, image: liXi4, probability: 34 },   // 34% cơ hội
  { id: 5, amount: 1000, image: liXi1, probability: 49 }    // 49% cơ hội
];

const getRandomEnvelope = () => {
  const random = Math.random() * 100; // Random từ 0-100
  let sum = 0;

  for (const envelope of luckyMoney) {
    sum += envelope.probability;
    if (random <= sum) {
      return envelope;
    }
  }
  
  // Nếu không trúng gì thì trả về giá trị nhỏ nhất
  return luckyMoney[luckyMoney.length - 1];
};

const HaiLoc = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTree, setSelectedTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [selectedEnvelope, setSelectedEnvelope] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    accountNumber: '',
    bankName: '',
    accountName: '',
  });
  const [bankSearchTerm, setBankSearchTerm] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);

  // Lọc ngân hàng dựa trên từ khóa tìm kiếm
  const filteredBanks = banks.filter(bank => 
    bank.shortName.toLowerCase().includes(bankSearchTerm.toLowerCase()) ||
    bank.fullName.toLowerCase().includes(bankSearchTerm.toLowerCase())
  );

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen khi đang tải trang
  if (loading) {
    return <Loading />;
  }

  const handleEnvelopeClick = (position) => {
    if (loading) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const wonEnvelope = getRandomEnvelope();
      setSelectedEnvelope(wonEnvelope);
      setShowResult(true);
      setLoading(false);
    }, 800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await luckyDrawService.createLuckyDraw({
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
        accountName: formData.accountName,
        amount: selectedEnvelope.amount
      });
      
      // Nếu là admin thì chuyển đến trang quản lý
      if (user?.isAdmin) {
        navigate('/admin/lucky-draws');
        return;
      }
      
      // Hiển thị thông báo thành công cho user thường
      alert('Gửi yêu cầu thành công! Vui lòng đợi admin duyệt.');
      
      // Reset form
      setFormData({
        accountNumber: '',
        bankName: '',
        accountName: ''
      });
      setSelectedEnvelope(null);
    } catch (error) {
      console.error('Error submitting lucky draw:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedTree) {
    return (
      <div className="min-h-screen pt-20 px-4 bg-red-50/50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl text-center font-dancing text-red-800 mb-8">
            🌺 Chọn Cây Hái Lộc 🌺
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {treeOptions.map((tree) => (
              <button
                key={tree.id}
                onClick={() => setSelectedTree(tree)}
                className="group relative bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="aspect-square overflow-hidden rounded-xl mb-4">
                  <img
                    src={tree.image}
                    alt={tree.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="text-2xl font-dancing text-red-700 mb-2">
                  {tree.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {tree.description}
                </p>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-red-600 text-white px-6 py-2 rounded-full shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform">
                    Chọn cây này
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto relative">
        {/* Back button - tăng z-index lên cao hơn */}
        <button
          onClick={() => setSelectedTree(null)}
          className="absolute top-4 left-4 text-red-600 hover:text-red-700 flex items-center gap-2 z-[60]"
        >
          <span className="text-2xl">←</span>
          <span>Chọn cây khác</span>
        </button>

        {/* Selected tree */}
        <div className="relative w-full h-[80vh] flex items-center justify-center">
          <img 
            src={selectedTree.image}
            alt={selectedTree.name}
            className="h-full object-contain max-w-[90%] md:max-w-[80%] select-none"
            style={{
              imageRendering: 'crisp-edges',
              WebkitImageRendering: 'crisp-edges',
              filter: 'contrast(1.05) brightness(1.02)'
            }}
            draggable="false"
          />
          
          {/* Các bao lì xì */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {selectedTree.envelopes.map((envelope, index) => (
              <button
                key={index}
                onClick={() => handleEnvelopeClick(envelope.position)}
                className="absolute w-12 md:w-16 h-12 md:h-16 transform hover:scale-110 transition-transform pointer-events-auto"
                style={{
                  ...envelope.position,
                  transform: `rotate(${envelope.position.rotate})`,
                  animation: `bounce ${3 + index * 0.2}s infinite ease-in-out`,
                  animationDelay: `${index * 0.3}s`,
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                }}
              >
                <img 
                  src={luckyMoney[Math.floor(Math.random() * luckyMoney.length)].image}
                  alt={`Lì xì ${index + 1}`}
                  className="w-full h-full object-contain drop-shadow-lg hover:drop-shadow-2xl"
                  draggable="false"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Modal thông báo trúng và form */}
        {selectedEnvelope && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-red-50 p-8 rounded-2xl max-w-md w-full mx-4">
              <h2 className="text-2xl font-dancing text-red-600 text-center mb-4">
                🎊 Chúc Mừng Năm Mới 🎊
              </h2>
              <div className="text-center mb-6">
                <p className="text-lg">
                  Bạn đã nhận được lì xì{' '}
                  <span className="font-bold text-red-600">
                    {selectedEnvelope.amount.toLocaleString()}đ
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Vui lòng điền thông tin để nhận lì xì
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tài khoản
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                    placeholder="Nhập số tài khoản..."
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chọn ngân hàng
                  </label>
                  <input
                    type="text"
                    value={bankSearchTerm}
                    onChange={(e) => {
                      setBankSearchTerm(e.target.value);
                      setShowBankDropdown(true);
                    }}
                    onFocus={() => setShowBankDropdown(true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Tìm kiếm ngân hàng..."
                    required
                  />
                  
                  {showBankDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filteredBanks.map((bank) => (
                        <button
                          key={bank.shortName}
                          type="button"
                          className="w-full px-4 py-2 text-left hover:bg-red-50 focus:bg-red-50"
                          onClick={() => {
                            setFormData({...formData, bankName: bank.shortName});
                            setBankSearchTerm(bank.shortName);
                            setShowBankDropdown(false);
                          }}
                        >
                          <div className="font-medium">{bank.shortName}</div>
                          <div className="text-sm text-gray-500">{bank.fullName}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên chủ tài khoản
                  </label>
                  <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                    placeholder="Nhập tên chủ tài khoản..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {user?.isAdmin ? 'Nhận và quản lý' : 'Nhận lì xì'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEnvelope(null);
                      setFormData({
                        accountNumber: '',
                        bankName: '',
                        accountName: ''
                      });
                      setBankSearchTerm('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Đóng
                  </button>
                </div>

                {/* Thêm thông tin cho admin */}
                {user?.isAdmin && (
                  <div className="mt-4 text-sm text-gray-600 text-center">
                    Nhấn "Nhận và quản lý" để chuyển đến trang quản lý lì xì
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
      {loading && <Loading />} {/* Show loading khi đang xử lý */}
    </div>
  );
};

export default HaiLoc; 