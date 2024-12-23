import React, { useEffect, useRef } from 'react';

const Fireworks = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    class Firework {
      constructor(canvas, x) {
        // Bắn từ vị trí cố định ở dưới
        this.x = x || canvas.width / 2;
        this.y = canvas.height;
        
        // Điểm đích có kiểm soát hơn
        const angle = Math.random() * Math.PI;
        const distance = canvas.height * 0.4 + Math.random() * canvas.height * 0.2;
        this.targetX = this.x + Math.cos(angle) * distance;
        this.targetY = canvas.height - distance;
        
        this.speed = 2; // Giảm tốc độ
        this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        this.velocity = {
          x: Math.cos(this.angle) * this.speed,
          y: Math.sin(this.angle) * this.speed
        };
        
        this.particles = [];
        this.alive = true;
        this.colors = ['#ff0', '#f00', '#0ff', '#0f0', '#f0f'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      }

      update() {
        if (this.alive) {
          this.x += this.velocity.x;
          this.y += this.velocity.y;

          // Kiểm tra xem đã đến điểm đích chưa
          if (Math.abs(this.x - this.targetX) < 5 && Math.abs(this.y - this.targetY) < 5) {
            this.explode();
            this.alive = false;
          }
        }

        // Cập nhật các particle
        this.particles.forEach((particle, i) => {
          particle.update();
          if (particle.alpha <= 0) {
            this.particles.splice(i, 1);
          }
        });
      }

      draw() {
        if (this.alive) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }

        this.particles.forEach(particle => particle.draw());
      }

      explode() {
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount;
          const speed = Math.random() * 5 + 2;
          this.particles.push(
            new Particle(
              this.x,
              this.y,
              Math.cos(angle) * speed,
              Math.sin(angle) * speed,
              this.color
            )
          );
        }
      }
    }

    class Particle {
      constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.alpha = 1;
        this.color = color;
        this.gravity = 0.05;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= 0.008;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    const fireworks = [];
    let lastFireworkTime = 0;
    const FIREWORK_INTERVAL = 1000; // 1 giây giữa mỗi quả pháo

    const animate = (currentTime) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Thêm pháo hoa mới theo thời gian
      if (currentTime - lastFireworkTime > FIREWORK_INTERVAL) {
        // Bắn từ 3 vị trí cố định
        const positions = [
          canvas.width * 0.2,
          canvas.width * 0.5,
          canvas.width * 0.8
        ];
        const randomPosition = positions[Math.floor(Math.random() * positions.length)];
        fireworks.push(new Firework(canvas, randomPosition));
        lastFireworkTime = currentTime;
      }

      // Cập nhật và vẽ tất cả pháo hoa
      fireworks.forEach((firework, i) => {
        firework.update();
        firework.draw();
        
        // Xóa pháo hoa đã tắt
        if (!firework.alive && firework.particles.length === 0) {
          fireworks.splice(i, 1);
        }
      });

      requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', setSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

export default Fireworks; 