import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

// --- CONFIGURATION: MENU CARDS ---
const NAV_ITEMS = [
  {
    label: "Home",
    bgColor: "#0a0a0a", // Neutral Dark
    textColor: "#ffffff",
    links: [
      { label: "Overview", href: "/" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Login / Register", href: "/login" }
    ]
  },
  {
    label: "Features",
    bgColor: "#051014", // Very dark Cyan tint
    textColor: "#00f3ff", // Cyan Accent
    links: [
      { label: "Real-time Tracking", href: "#tracking" },
      { label: "Neural Predictions", href: "#ai" },
      { label: "Biometric Data", href: "#data" }
    ]
  },
  {
    label: "About",
    bgColor: "#120a1a", // Very dark Magenta tint
    textColor: "#ff00aa", // Magenta Accent
    links: [
      { label: "Our Mission", href: "#mission" },
      { label: "The Team", href: "#team" },
      { label: "Contact Us", href: "#contact" }
    ]
  }
];

// --- COMPONENT: ARROW ICON ---
const ArrowIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const navigate = useNavigate();

  // --- ANIMATION LOGIC ---
  const calculateHeight = () => {
    // Height of top bar (80px) + Content Height + Padding
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    return isMobile ? 650 : 300; // Taller for mobile stack, shorter for desktop row
  };

  useLayoutEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    // Set initial state
    gsap.set(navEl, { height: 80 }); // Default closed height
    gsap.set(cardsRef.current, { y: 20, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    // 1. Expand the Container
    tl.to(navEl, {
      height: () => calculateHeight(), // Function ensures it recalculates on resize
      duration: 0.5,
      ease: "power3.inOut"
    });

    // 2. Fade in the Cards (Staggered)
    tl.to(cardsRef.current, { 
      y: 0, 
      opacity: 1, 
      duration: 0.4, 
      ease: "power3.out", 
      stagger: 0.1 
    }, "-=0.3"); // Start slightly before container finishes expanding

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;

    if (!isExpanded) {
      setIsExpanded(true);
      tl.play();
    } else {
      setIsExpanded(false);
      tl.reverse();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 px-4">
      <nav
        ref={navRef}
        className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
        style={{ 
          // Glassmorphism background
          backgroundColor: 'rgba(5, 5, 5, 0.85)', 
          backdropFilter: 'blur(16px)' 
        }}
      >
        {/* --- TOP HEADER ROW (Always Visible) --- */}
        <div className="relative w-full h-20 flex items-center justify-between px-6 z-20">
          
          {/* 1. HAMBURGER (Left) */}
          <button 
            onClick={toggleMenu}
            className="group flex flex-col justify-center gap-1.5 w-10 h-10 cursor-pointer z-30 p-2 hover:bg-white/5 rounded-full transition-colors"
            aria-label="Toggle Menu"
          >
            {/* Animated Lines */}
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isExpanded ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isExpanded ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isExpanded ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

          {/* 2. LOGO (Center) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 cursor-pointer group">
            <svg 
              viewBox="0 0 40 40" 
              className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(0,243,255,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(255,0,170,0.8)] transition-all duration-300"
              fill="none"
            >
              <path 
                d="M8 34C8 34 12 18 26 10C32 6.5 36 8 36 8L30 22C30 22 26 26 18 28C10 30 8 34 8 34Z" 
                fill="url(#flux-gradient-nav)" 
              />
              <path 
                d="M6 24C6 24 18 18 30 20" 
                stroke="white" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                className="opacity-90"
              />
              <defs>
                <linearGradient id="flux-gradient-nav" x1="6" y1="34" x2="36" y2="8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00f3ff" /> 
                  <stop offset="1" stopColor="#ff00aa" /> 
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xl font-bold text-white tracking-widest hidden md:block">
              FLUX<span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f3ff] to-[#ff00aa]">FIT</span>
            </span>
          </div>

          {/* 3. CTA BUTTON (Right) */}
          <button onClick={() => navigate("/login")} className="hidden md:block px-6 py-2 rounded-full bg-[#00f3ff] text-black font-bold hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.5)] transition-all text-sm tracking-wide z-30">
            GET STARTED
          </button>
          {/* Mobile CTA Icon */}
          <button className="md:hidden text-[#00f3ff] font-bold z-30 text-sm">
            LOGIN
          </button>
        </div>

        {/* --- EXPANDABLE CARD CONTENT --- */}
        {/* Only visible when expanding */}
        <div 
          className={`relative w-full px-4 pb-6 flex flex-col md:flex-row gap-4 ${isExpanded ? 'visible' : 'invisible'}`}
        >
          {NAV_ITEMS.map((item, idx) => (
            <div
              key={idx}
              ref={el => { if (el) cardsRef.current[idx] = el }}
              className="flex-1 rounded-xl p-6 flex flex-col justify-between min-h-35 md:min-h-45 border border-white/5 transition-transform hover:scale-[1.02] hover:shadow-lg cursor-pointer"
              style={{ backgroundColor: item.bgColor }}
            >
              <div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight" style={{ color: item.textColor }}>
                  {item.label}
                </h3>
              </div>
              
              <div className="flex flex-col gap-2">
                {item.links.map((link, linkIdx) => (
                  <a 
                    key={linkIdx} 
                    href={link.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group/link text-sm"
                  >
                    <ArrowIcon className="w-4 h-4 text-gray-600 group-hover/link:text-white transition-colors" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}