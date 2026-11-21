import { useEffect, useRef } from 'react';

export function usePointerParallax(containerRef, enabled = true) {
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    let rafId;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const normX = (clientX / window.innerWidth) * 2 - 1;
      const normY = (clientY / window.innerHeight) * 2 - 1;

      const dampFactor = isTouchDevice ? 0.35 : 1;
      target.current.x = normX * dampFactor;
      target.current.y = normY * dampFactor;
    };

    const handlePointerLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    const updateFrame = () => {
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--px', current.current.x.toFixed(4));
        containerRef.current.style.setProperty('--py', current.current.y.toFixed(4));
      }
      rafId = requestAnimationFrame(updateFrame);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);
    rafId = requestAnimationFrame(updateFrame);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef, enabled]);
}