import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Move the inner dot instantly
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0, // Instant
      });
      
      // 2. Move the outer ring with a slight delay (smooth lag)
      gsap.to(followerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1, // Adjust this for more/less "floaty" feel
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <>
      {/* The Small Inner Dot (Cyan) */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-[#00f3ff] rounded-full pointer-events-none z-9999 -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      
      {/* The Larger Trailing Ring (Magenta Glow) */}
      <div 
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-[#ff00aa] rounded-full pointer-events-none z-9998 -translate-x-1/2 -translate-y-1/2 opacity-60 shadow-[0_0_10px_rgba(255,0,170,0.5)] transition-transform duration-300"
      />
    </>
  );
}