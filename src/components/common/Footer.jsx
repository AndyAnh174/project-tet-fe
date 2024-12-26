import React from 'react';
import logoDSC from '../../assets/logo-dsc.png';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-red-600 to-red-700 py-4 text-white mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-center font-dancing text-3xl flex items-center gap-2 text-yellow-300 font-bold">
            🧧 Chúc mừng năm mới 2025
            <a href="https://www.facebook.com/hcmute.dsc" target="_blank" rel="noopener noreferrer">
              <img 
                src={logoDSC}
                alt="DSC Logo" 
                className="w-auto h-24 object-contain hover:scale-110 transition-transform duration-300"
              />
            </a>
            🎊
          </p>
          <p className="text-center text-sm opacity-90">
            Developed with ❤️ by{' '}
            <span className="font-semibold">
              <a 
                href="https://myportfolio-andyanh.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-yellow-200 underline transition-colors duration-300"
              >
                AndyAnh
              </a>
              {' '}- Quốc Anh - Minh Quân
            </span>
          </p>
          <p className="text-center text-xs opacity-75">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 