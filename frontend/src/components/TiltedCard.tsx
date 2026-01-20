import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltedCardProps {
  children: React.ReactNode;
  containerHeight?: string | number;
  containerWidth?: string | number;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  className?: string;
}

export default function TiltedCard({
  children,
  containerHeight = "100%",
  containerWidth = "100%",
  scaleOnHover = 1.05,
  rotateAmplitude = 12,
  className = "",
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Springs for smooth movement
  const rotateX = useSpring(useTransform(y, [-100, 100], [rotateAmplitude, -rotateAmplitude]), {
    stiffness: 250,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-rotateAmplitude, rotateAmplitude]), {
    stiffness: 250,
    damping: 20,
  });
  const scale = useSpring(1, { stiffness: 250, damping: 20 });

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to center of card
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    // Normalize for rotation
    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
    x.set(offsetX);
    y.set(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    x.set(0);
    y.set(0);
  }

  return (
    <figure
      ref={ref}
      className={`relative flex flex-col items-center justify-center perspective-[1000px] ${className}`}
      style={{ height: containerHeight, width: containerWidth }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full transform-3d transition-all duration-200 ease-linear"
        style={{
          rotateX,
          rotateY,
          scale,
        }}
      >
        {/* Shadow/Glow Layer that moves slightly behind content */}
        <div className="absolute inset-0 bg-black/60 rounded-3xl transform-[translateZ(-10px)] shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/5" />
        
        {/* Main Content Layer */}
        <div className="relative w-full h-full rounded-3xl overflow-hidden transform-[translateZ(0)]">
           {children}
        </div>
      </motion.div>
    </figure>
  );
}