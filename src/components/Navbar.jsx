import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? "text-yellow-300 font-bold" : "text-yellow-100 hover:text-yellow-300";
  };

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Trang chủ' },
    { path: '/loi-chuc', icon: '✉️', label: 'Lời chúc' },
    { path: '/thiep', icon: '🧧', label: 'Thiệp' },
    { path: '/hai-loc', icon: '🌸', label: 'Hái lộc' },
    { path: '/mon-an', icon: '🍜', label: 'Món ăn' },
    { path: '/hoi-dap', icon: '🤖', label: 'Hỏi đáp' },
  ];

  return (
    <>
      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-red-900 to-red-800 shadow-lg border-b-4 border-yellow-500">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 flex items-center font-dancing"
            >
              <span className="mr-2">🏮</span>
              Tết 2025
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 font-montserrat text-base">
              {menuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${isActive(item.path)} transition-colors duration-200 flex items-center tracking-wide`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-yellow-400 hover:text-yellow-300 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`${
              isMenuOpen ? 'block' : 'hidden'
            } md:hidden pb-4 absolute left-0 right-0 bg-gradient-to-b from-red-900 to-red-800 border-b-4 border-yellow-500`}
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col space-y-3 py-4">
                {menuItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${isActive(item.path)} transition-colors duration-200 py-2 px-3 rounded-lg flex items-center tracking-wide`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar; 