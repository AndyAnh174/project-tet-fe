import React, { useEffect, useState } from 'react';
import bongHoaDao1 from '../assets/effect/bong-hoa-dao1.png';
import bongHoaDao2 from '../assets/effect/bong-hoa-dao2.png';
import canhHoaDao1 from '../assets/effect/canh-hoa-dao1.png';
import canhHoaDao2 from '../assets/effect/canh-hoa-dao2.png';
import canhHoaDao3 from '../assets/effect/canh-hoa-dao3.png';
import canhHoaDao4 from '../assets/effect/canh-hoa-dao4.png';

// Mảng chứa các hình ảnh hoa
const FLOWER_IMAGES = [
  { src: canhHoaDao1, type: 'canh' },
  { src: canhHoaDao2, type: 'canh' },
  { src: canhHoaDao3, type: 'canh' },
  { src: canhHoaDao4, type: 'canh' },
  { src: bongHoaDao1, type: 'bong' },
  { src: bongHoaDao2, type: 'bong' }
];

function FallingFlowers() {
  // State để lưu trữ các hoa đang rơi
  const [flowers, setFlowers] = useState([]);

  // Hàm tạo một hoa mới
  const createFlower = () => {
    const i = Math.floor(Math.random() * FLOWER_IMAGES.length);
    const isBong = FLOWER_IMAGES[i].type === 'bong';
    
    const startOffset = Math.random() * 100;
    
    return {
      id: Math.random(),
      image: FLOWER_IMAGES[i].src,
      top: -50 - Math.random() * 300,
      left: (window.innerWidth * startOffset) / 100,
      startTime: Date.now() + Math.random() * 2000,
      speed: 50 + Math.random() * 100,
      width: isBong ? 35 : 18,
      height: isBong ? 35 : 18,
      rotation: Math.random() * 360,
      swayAmplitude: 20 + Math.random() * 20,
      swayFrequency: 0.5 + Math.random() * 1.5,
      rotationSpeed: (Math.random() - 0.5) * 100
    };
  };

  useEffect(() => {
    // Giảm số lượng hoa ban đầu xuống
    const initialFlowers = Array.from(
      { length: 4 + Math.floor(Math.random() * 5) }, // Giảm từ 8-18 xuống 4-9 hoa
      createFlower
    );
    setFlowers(initialFlowers);

    let animationFrameId;
    let lastTime = Date.now();

    // Hàm animate để cập nhật vị trí của các hoa
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setFlowers(prevFlowers => {
        return prevFlowers.map(flower => {
          if (currentTime < flower.startTime) {
            return flower;
          }

          const timeElapsed = (currentTime - flower.startTime) / 1000;
          const newTop = flower.top + flower.speed * deltaTime;
          const sway = Math.sin(timeElapsed * flower.swayFrequency) * flower.swayAmplitude;
          
          if (newTop > window.innerHeight) {
            return {
              ...createFlower(),
              startTime: currentTime
            };
          }

          return {
            ...flower,
            top: newTop,
            left: flower.left + sway * deltaTime,
            rotation: flower.rotation + flower.rotationSpeed * deltaTime
          };
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Giảm tần suất thêm hoa mới
    const intervalId = setInterval(() => {
      if (flowers.length < 20) { // Giảm giới hạn từ 35 xuống 20
        setFlowers(prev => [...prev, createFlower()]);
      }
    }, 2000 + Math.random() * 3000); // Tăng khoảng thời gian giữa các lần thêm hoa

    // Cleanup để dừng animation và interval khi component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {flowers.map(flower => (
        <img
          key={flower.id}
          src={flower.image}
          alt="flower"
          style={{
            position: 'absolute',
            width: `${flower.width}px`,
            height: `${flower.height}px`,
            top: `${flower.top}px`,
            left: `${flower.left}px`,
            transform: `rotate(${flower.rotation}deg)`,
            opacity: 0.8, // Giảm độ đục xuống
            transition: 'transform 0.3s linear',
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.1))'
          }}
        />
      ))}
    </div>
  );
}

export default FallingFlowers; 