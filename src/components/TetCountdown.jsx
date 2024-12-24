import React, { useState, useEffect, useRef } from "react";
import Fireworks from './Fireworks';
import fireworkSound from '../assets/sound/fireworks.mp3';

function TetCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isNewYear, setIsNewYear] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(fireworkSound));

  useEffect(() => {
    const tetDate = new Date('2025-01-29T00:00:00');
    const timer = setInterval(() => {
      const now = new Date();
      const difference = tetDate - now;

      if (difference <= 0) {
        setIsNewYear(true);
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => {
      clearInterval(timer);
      audioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    audioRef.current.load();
    audioRef.current.volume = 0.6;

    return () => {
      audioRef.current.pause();
    };
  }, []);

  const handleFireworks = () => {
    setIsPlaying(true);
    
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.loop = true;
      audioRef.current.play();
    } catch (err) {
      console.log('Audio failed:', err);
    }
    
    setTimeout(() => {
      setIsPlaying(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }, 15000);
  };

  if (isNewYear) {
    return (
      <>
        {isPlaying && <Fireworks />}
        <div className="fixed inset-0 bg-black/70 z-40" />
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="text-center">
            <h1 
              className="text-4xl sm:text-6xl md:text-8xl font-dancing text-yellow-400 mb-4 sm:mb-8"
              style={{ textShadow: '0 0 10px rgba(0,0,0,0.5), 0 0 20px rgba(255,200,0,0.3)' }}
            >
              🎊 Chúc Mừng Năm Mới 2025 🎊
            </h1>
            <p 
              className="text-xl sm:text-2xl md:text-4xl text-yellow-300 font-dancing mb-6 sm:mb-8"
              style={{ textShadow: '0 0 8px rgba(0,0,0,0.5)' }}
            >
              Năm Giáp Thìn
            </p>
            <button
              onClick={handleFireworks}
              disabled={isPlaying}
              className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-dancing 
                ${isPlaying 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 animate-pulse'} 
                text-white shadow-lg transition-all transform hover:scale-105`}
            >
              {isPlaying ? 'Đang bắn pháo hoa...' : '🎆 Bắn pháo bông 🎆'}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-red-800/10 p-4 sm:p-8 rounded-2xl shadow-lg border-2 border-red-800/20">
      <h2 className="text-2xl sm:text-3xl font-bold text-red-800 mb-4 sm:mb-6 text-center font-dancing">
        🎊 Đếm ngược đến Tết Giáp Thìn 2025 🎊
      </h2>
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        <div className="bg-gradient-to-b from-red-700 to-red-800 p-2 sm:p-6 rounded-xl shadow-lg border-2 border-yellow-500">
          <div className="text-2xl sm:text-5xl font-bold text-yellow-400 font-montserrat">
            {timeLeft.days}
          </div>
          <div className="text-xs sm:text-sm text-yellow-300 mt-1 sm:mt-2 font-medium">
            Ngày
          </div>
        </div>
        <div className="bg-gradient-to-b from-red-700 to-red-800 p-2 sm:p-6 rounded-xl shadow-lg border-2 border-yellow-500">
          <div className="text-2xl sm:text-5xl font-bold text-yellow-400 font-montserrat">
            {timeLeft.hours}
          </div>
          <div className="text-xs sm:text-sm text-yellow-300 mt-1 sm:mt-2 font-medium">
            Giờ
          </div>
        </div>
        <div className="bg-gradient-to-b from-red-700 to-red-800 p-2 sm:p-6 rounded-xl shadow-lg border-2 border-yellow-500">
          <div className="text-2xl sm:text-5xl font-bold text-yellow-400 font-montserrat">
            {timeLeft.minutes}
          </div>
          <div className="text-xs sm:text-sm text-yellow-300 mt-1 sm:mt-2 font-medium">
            Phút
          </div>
        </div>
        <div className="bg-gradient-to-b from-red-700 to-red-800 p-2 sm:p-6 rounded-xl shadow-lg border-2 border-yellow-500">
          <div className="text-2xl sm:text-5xl font-bold text-yellow-400 font-montserrat">
            {timeLeft.seconds}
          </div>
          <div className="text-xs sm:text-sm text-yellow-300 mt-1 sm:mt-2 font-medium">
            Giây
          </div>
        </div>
      </div>
    </div>
  );
}

export default TetCountdown;
