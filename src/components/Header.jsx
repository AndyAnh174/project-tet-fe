import React from "react";
import mobileBanner from "../assets/banner/mobile.png";
import pcBanner from "../assets/banner/pc.png";

function Header() {
  return (
    <header className="relative text-center w-full pt-16">
      <div className="relative aspect-square md:aspect-[2.5/1] w-full overflow-hidden">
        {/* Banner cho Mobile */}
        <img 
          src={mobileBanner}
          alt="Tết 2025" 
          className="w-full h-full object-cover md:hidden"
        />
        
        {/* Banner cho PC */}
        <img 
          src={pcBanner}
          alt="Tết 2025" 
          className="hidden md:block w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        <div className="absolute bottom-[15%] left-0 right-0 p-4 md:p-8 text-white">
          <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6 text-yellow-400 drop-shadow-lg font-dancing">
            {/* Chào Xuân Giáp Thìn 2025 */}
          </h1>
          <p className="text-xl md:text-3xl text-yellow-200 max-w-3xl mx-auto leading-relaxed drop-shadow font-medium">
            {/* Chúc mừng năm mới - An khang thịnh vượng */}
          </p>
        </div>

        {/* Trang trí */}
        {/* Đảm bảo rằng các phần tử được đặt đúng vị trí và có kích thước phù hợp trên các màn hình khác nhau 
        <div className="absolute top-4 md:top-8 left-4 md:left-8 text-5xl md:text-7xl animate-bounce">🏮</div>
        <div className="absolute top-4 md:top-8 right-4 md:right-8 text-5xl md:text-7xl animate-bounce delay-100">🏮</div>
        <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 text-5xl md:text-7xl">🌸</div>
        <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 text-5xl md:text-7xl">🌸</div> */}
      </div>
    </header>
  );
}

export default Header;
