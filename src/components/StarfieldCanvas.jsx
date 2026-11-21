import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function StarfieldCanvas({ className = '' }) {
  const canvasRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const starCount = isMobile ? 65 : 145;

    const palette = ['#f9f6ff', '#e9d5ff', '#f5d08a', '#fbcfe8'];

    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.65 + 0.4,
      alpha: Math.random() * 0.7 + 0.25,
      twinkleSpeed: (Math.random() * 0.018 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      driftY: Math.random() * 0.08 + 0.02,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        if (!prefersReducedMotion) {
          star.alpha += star.twinkleSpeed;
          if (star.alpha > 0.95 || star.alpha < 0.18) {
            star.twinkleSpeed *= -1;
          }
          star.y -= star.driftY;
          if (star.y < -4) {
            star.y = height + 4;
            star.x = Math.random() * width;
          }
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.15, Math.min(1, star.alpha));
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 h-full w-full ${className}`}
    />
  );
}