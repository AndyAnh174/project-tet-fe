import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTetDropdownOpen, setIsTetDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const tetDropdownRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path ? "text-yellow-300 font-bold" : "text-yellow-100 hover:text-yellow-300";
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (tetDropdownRef.current && !tetDropdownRef.current.contains(event.target)) {
        setIsTetDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Trang chủ' },
    { path: '/mon-an', icon: '🍜', label: 'Món ăn' },
    { path: '/hoi-dap', icon: '🤖', label: 'Hỏi đáp' },
  ];

  const tetMenuItems = [
    { path: '/loi-chuc', icon: '✉️', label: 'Lời chúc Tết' },
    { path: '/thiep', icon: '🧧', label: 'Thiệp Tết' },
    { path: '/hai-loc', icon: '🌸', label: 'Hái lộc' },
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
            <div className="hidden md:flex items-center space-x-8 font-['Be_Vietnam_Pro'] text-base font-semibold">
              {menuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${isActive(item.path)} transition-colors duration-200 flex items-center tracking-wide`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                </Link>
              ))}

              {/* Tết 2025 Dropdown */}
              <div className="relative" ref={tetDropdownRef}>
                <button
                  onClick={() => setIsTetDropdownOpen(!isTetDropdownOpen)}
                  className={`${
                    tetMenuItems.some(item => location.pathname === item.path)
                      ? "text-yellow-300 font-bold"
                      : "text-yellow-100 hover:text-yellow-300"
                  } transition-colors duration-200 flex items-center tracking-wide font-['Be_Vietnam_Pro'] font-semibold`}
                >
                  <span className="mr-1.5">🎊</span>
                  <span>Tết 2025</span>
                  <span className="ml-1.5">▼</span>
                </button>

                {isTetDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 font-['Be_Vietnam_Pro']
                    animate-dropdown origin-top transform-gpu">
                    {tetMenuItems.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-2 text-gray-800 hover:bg-red-50 flex items-center font-semibold"
                        onClick={() => setIsTetDropdownOpen(false)}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Login/Admin Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-red-900 rounded-full font-medium transition-colors duration-200 flex items-center"
                >
                  <span className="mr-1.5">{user ? '👑' : '🔐'}</span>
                  {user ? 'Admin' : 'Login'}
                  <span className="ml-1.5">▼</span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50
                    animate-dropdown origin-top transform-gpu">
                    {user ? (
                      <>
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-gray-800 hover:bg-yellow-50 flex items-center"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="mr-2">📊</span>
                          Dashboard
                        </Link>
                        <Link
                          to="/admin/lucky-draws"
                          className="block px-4 py-2 text-gray-800 hover:bg-yellow-50 flex items-center"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="mr-2">🎯</span>
                          Quản lý hái lộc
                        </Link>
                        <Link
                          to="/admin/chats"
                          className="block px-4 py-2 text-gray-800 hover:bg-yellow-50 flex items-center"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="mr-2">💬</span>
                          Quản lý chat
                        </Link>
                        <hr className="my-1 border-gray-200" />
                        <button
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <span className="mr-2">🚪</span>
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/admin/login"
                        className="block px-4 py-2 text-gray-800 hover:bg-yellow-50 flex items-center"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="mr-2">🔑</span>
                        Đăng nhập Admin
                      </Link>
                    )}
                  </div>
                )}
              </div>
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
              <div className="flex flex-col space-y-3 py-4 font-['Be_Vietnam_Pro'] font-semibold">
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

                {/* Tết 2025 Menu Items for Mobile */}
                <div className="py-2 px-3">
                  <div className="text-yellow-300 font-medium mb-2 flex items-center">
                    <span className="mr-2">🎊</span>
                    Tết 2025
                  </div>
                  <div className="pl-8 space-y-3">
                    {tetMenuItems.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`${isActive(item.path)} transition-colors duration-200 py-1 flex items-center tracking-wide`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="mr-2">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Login/Admin Button Mobile */}
                <Link
                  to={user ? '/admin/dashboard' : '/admin/login'}
                  className="py-2 px-3 bg-yellow-500 hover:bg-yellow-600 text-red-900 rounded-lg font-medium transition-colors duration-200 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-3 text-xl">{user ? '👑' : '🔐'}</span>
                  <span className="font-medium">{user ? 'Admin' : 'Login'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar; 