import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-red-50 to-yellow-50 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24">
          {/* Vòng loading chính */}
          <div className="absolute inset-0 border-8 border-red-200 rounded-full animate-spin" 
               style={{ borderTopColor: '#EF4444' }}>
          </div>
          
          {/* Hình ảnh trang trí */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-bounce">🧧</span>
          </div>

          {/* Các hoa mai xung quanh */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="text-2xl animate-pulse">🌸</span>
          </div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <span className="text-2xl animate-pulse" style={{animationDelay: '0.2s'}}>🌸</span>
          </div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <span className="text-2xl animate-pulse" style={{animationDelay: '0.4s'}}>🌸</span>
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <span className="text-2xl animate-pulse" style={{animationDelay: '0.6s'}}>🌸</span>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xl font-dancing text-red-600 animate-pulse mb-2">
            Đang tải...
          </p>
          <p className="text-sm text-red-500">
            Chúc mừng năm mới 2025 🎊
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading; 