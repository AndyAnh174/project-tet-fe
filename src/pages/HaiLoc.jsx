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
      { 
        position: { 
          desktop: { top: '41%', left: '35%', rotate: '-15deg' },
          mobile: { top: '35%', left: '30%', rotate: '-15deg' }
        }
      },
      { 
        position: { 
          desktop: { top: '40%', right: '32%', rotate: '15deg' },
          mobile: { top: '34%', right: '28%', rotate: '15deg' }
        }
      },
      { 
        position: { 
          desktop: { top: '63%', left: '33%', rotate: '10deg' },
          mobile: { top: '55%', left: '28%', rotate: '10deg' }
        }
      },
      { 
        position: { 
          desktop: { top: '62%', right: '30%', rotate: '-10deg' },
          mobile: { top: '54%', right: '26%', rotate: '-10deg' }
        }
      },
      { 
        position: { 
          desktop: { top: '25%', left: '38%', rotate: '-15deg' },
          mobile: { top: '22%', left: '32%', rotate: '-15deg' }
        }
      },
    ]
  },
  { 
    id: 2, 
    name: 'Chậu Mai', 
    image: chauMai, 
    description: 'Chậu mai nhỏ xinh, mang đến may mắn',
    envelopes: [
      { 
        position: { 
          desktop: { top: '38%', left: '45%', rotate: '-8deg' },
          mobile: { top: '32%', left: '40%', rotate: '-8deg' }
        }
      },
      { 
        position: { 
          desktop: { top: '60%', right: '35%', rotate: '10deg' },
          mobile: { top: '52%', right: '30%', rotate: '10deg' }
        }
      },
      { 
        position: { 
          desktop: { top: '70%', left: '32%', rotate: '5deg' },
          mobile: { top: '62%', left: '28%', rotate: '5deg' }
        }
      },
      { 
        position: { 
          desktop: { top: '45%', left: '34%', rotate: '-5deg' },
          mobile: { top: '38%', left: '30%', rotate: '-5deg' }
        }
      }
    ]
  },
  { 
    id: 3, 
    name: 'Chậu Đào', 
    image: chauDao, 
    description: 'Chậu đào hồng thắm, biểu tượng của phúc lộc',
    envelopes: [
      { 
        position: { 
          desktop: { top: '27%', left: '43%', rotate: '-10deg' },
          mobile: { top: '22%', left: '38%', rotate: '-10deg' }
        }
      },
      { 
        position: { 
          desktop: { top: '18%', right: '40%', rotate: '8deg' },
          mobile: { top: '15%', right: '35%', rotate: '8deg' }
        }
      },
      { 
        position: { 
          desktop: { top: '38%', left: '40%', rotate: '5deg' },
          mobile: { top: '32%', left: '35%', rotate: '5deg' }
        }
      },
      { 
        position: { 
          desktop: { top: '37%', right: '34%', rotate: '-8deg' },
          mobile: { top: '31%', right: '30%', rotate: '-8deg' }
        }
      }
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

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
      setShowResultModal(true);
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
      
      // Đóng form modal trước
      setShowForm(false);
      
      // Nếu là admin thì chuyển đến trang quản lý
      if (user?.isAdmin) {
        navigate('/admin/lucky-draws');
        return;
      }
      
      // Hiển thị thông báo thành công cho user thường
      setShowSuccessModal(true);
      
      // Reset form và envelope
      setFormData({
        accountNumber: '',
        bankName: '',
        accountName: ''
      });
      setBankSearchTerm('');
      setSelectedEnvelope(null);
    } catch (error) {
      console.error('Error submitting lucky draw:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 bg-red-50/50">
      <div className="max-w-6xl mx-auto">
        {!selectedTree ? (
          // Màn hình chọn cây
          <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-dancing text-red-800 mb-6 sm:mb-8">
              🌺 Chọn Cây Hái Lộc 🌺
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
              {treeOptions.map((tree) => (
                <button
                  key={tree.id}
                  onClick={() => setSelectedTree(tree)}
                  className="group relative bg-white p-3 sm:p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="aspect-square overflow-hidden rounded-xl mb-3 sm:mb-4">
                    <img
                      src={tree.image}
                      alt={tree.name}
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium text-red-800 mb-1 sm:mb-2">
                    {tree.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {tree.description}
                  </p>
                </button>
              ))}
            </div>
          </>
        ) : (
          // Màn hình cây đã chọn
          <div className="relative">
            <button
              onClick={() => setSelectedTree(null)}
              className="absolute top-0 left-0 z-10 px-3 py-2 text-red-600 hover:text-red-700 flex items-center gap-2 sm:text-lg"
            >
              ← Chọn cây khác
            </button>
            
            <div className="relative mt-12 sm:mt-16">
              <img
                src={selectedTree.image}
                alt={selectedTree.name}
                className="w-full max-w-2xl mx-auto"
              />
              
              {/* Lì xì */}
              {selectedTree.envelopes.map((envelope, index) => {
                const isMobile = window.innerWidth < 640;
                const position = isMobile ? envelope.position.mobile : envelope.position.desktop;
                
                return (
                  <button
                    key={index}
                    onClick={() => !loading && handleEnvelopeClick(position)}
                    disabled={loading}
                    className={`absolute w-12 sm:w-16 h-12 sm:h-16 transform 
                      hover:scale-110 transition-all duration-300
                      ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                      group`}
                    style={{
                      ...position,
                      transform: `rotate(${position.rotate})`,
                    }}
                  >
                    <img
                      src={liXi1}
                      alt="Lì xì"
                      className={`w-full h-full object-contain
                        group-hover:animate-wiggle
                        animate-float`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-lg"></div>
                  </button>
                );
              })}
            </div>
            
            <div className="text-center mt-6 sm:mt-8">
              <h2 className="text-xl sm:text-2xl font-dancing text-red-800 mb-2 sm:mb-3">
                Chọn một bao lì xì để hái lộc
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Mỗi bao lì xì ẩn chứa một điều may mắn
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Result Modal */}
      {showResultModal && selectedEnvelope && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 relative overflow-hidden">
            {/* Background hoa mai */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 transform -translate-x-1/2">🌸</div>
              <div className="absolute top-0 right-0 transform translate-x-1/2">🌸</div>
              <div className="absolute bottom-0 left-0 transform -translate-x-1/2">🌸</div>
              <div className="absolute bottom-0 right-0 transform translate-x-1/2">🌸</div>
            </div>
            
            {/* Content */}
            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto mb-4">
                <img
                  src={selectedEnvelope.image}
                  alt="Lì xì"
                  className="w-full h-full object-contain animate-bounce"
                />
              </div>
              
              <h3 className="text-2xl font-bold text-red-600 mb-4">
                🎊 Chúc mừng bạn! 🎊
              </h3>
              
              <p className="text-lg text-gray-700 mb-4">
                Bạn đã nhận được lì xì trị giá:
              </p>
              
              <p className="text-3xl font-bold text-red-600 mb-6">
                {selectedEnvelope.amount.toLocaleString()}đ
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowResultModal(false);
                    setTimeout(() => {
                      setShowForm(true);
                    }, 100);
                  }}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Nhận lì xì ngay
                </button>
                <button
                  onClick={() => {
                    setShowResultModal(false);
                    setSelectedEnvelope(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hái lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Thông tin nhận lì xì
            </h3>

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
                  Ngân hàng
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
                  required
                  placeholder="Chọn ngân hàng..."
                />
                
                {showBankDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredBanks.map(bank => (
                      <button
                        key={bank.shortName}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-gray-50"
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
                    setShowForm(false);
                    setFormData({
                      accountNumber: '',
                      bankName: '',
                      accountName: ''
                    });
                    setBankSearchTerm('');
                    setSelectedEnvelope(null);
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 relative overflow-hidden">
            {/* Background hoa mai */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 transform -translate-x-1/2">🌸</div>
              <div className="absolute top-0 right-0 transform translate-x-1/2">🌸</div>
              <div className="absolute bottom-0 left-0 transform -translate-x-1/2">🌸</div>
              <div className="absolute bottom-0 right-0 transform translate-x-1/2">🌸</div>
            </div>
            
            {/* Content */}
            <div className="relative">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">🧧</span>
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
                Gửi yêu cầu thành công!
              </h3>
              
              {/* Message */}
              <div className="text-center space-y-3 mb-6">
                <p className="text-gray-600">
                  Vui lòng đợi admin duyệt yêu cầu của bạn.
                </p>
                <p className="text-red-600 font-medium">
                  Đừng quên gửi lời chúc Tết đến mọi người nhé! 🎊
                </p>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/loi-chuc');
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Gửi lời chúc ngay
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HaiLoc; 