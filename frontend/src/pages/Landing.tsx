import { useRef, useLayoutEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// COMPONENTS
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hyperspeed from '../components/Hyperspeed/Hyperspeed';
import { hyperspeedPresets } from '../components/Hyperspeed/HyperspeedPresets';
import VariableProximity from '../components/VariableProximity';
import SmoothScroll from '../components/SmoothScroll';
import FluxScene from '../components/FluxScene';
import TiltedCard from '../components/TiltedCard';
import CardSwap, { Card } from '../components/CardSwap';
import ScrollFloat from '../components/ScrollFloat';

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const gradientTextRef = useRef<HTMLHeadingElement>(null); // Ref for "ANYWHERE"

  useLayoutEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;
    
    const ctx = gsap.context(() => {
      // 1. Hero Animations
      gsap.from(titleRef.current, { y: 100, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.2 });
      gsap.from(subtitleRef.current, { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.5 });

      // 2. Feature Sections
      gsap.utils.toArray<HTMLElement>('.feature-section').forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%", 
            toggleActions: "play none none reverse"
          },
          y: 30,
          opacity: 0,
          duration: 0.8
        });
      });

      // 3. SPECIAL FIX: Gradient Text Animation
      // We animate the whole word "ANYWHERE" together to preserve the gradient
      if (gradientTextRef.current) {
        gsap.from(gradientTextRef.current, {
          scrollTrigger: {
            trigger: gradientTextRef.current,
            start: "top bottom-=10%",
            end: "bottom center",
            scrub: 1,
          },
          yPercent: 100, // Slide up from bottom
          opacity: 0,
          scaleY: 1.5,
          transformOrigin: "50% 100%",
          ease: "back.out(1.7)"
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // IMAGES FOR CARD SWAP
  const galleryImages = [
    { src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop", title: "Strength", subtitle: "Build Power" },
    { src: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1000&auto=format&fit=crop", title: "Endurance", subtitle: "Push Limits" },
    { src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop", title: "Flexibility", subtitle: "Stay Agile" },
    { src: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1000&auto=format&fit=crop", title: "Cardio", subtitle: "Heart Health" },
  ];

  return (
    <SmoothScroll>
      <div ref={containerRef} className="relative w-full bg-black text-white selection:bg-[#ff00aa] selection:text-white">
        
        {/* --- 1. FIXED BACKGROUNDS --- */}
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
          <div className="absolute inset-0 opacity-40">
            <Hyperspeed 
              effectOptions={{
                ...hyperspeedPresets.one,
                colors: {
                  roadColor: 0x080808,
                  islandColor: 0x0a0a0a,
                  background: 0x000000,
                  shoulderLines: 0x131318,
                  brokenLines: 0x131318,
                  leftCars: [0xff00aa, 0xc247ac, 0xe00095], 
                  rightCars: [0x00f3ff, 0x0e5ea5, 0x00c2cc],
                  sticks: 0x00f3ff
                }
              }} 
            />
          </div>
          <div className="absolute inset-0">
            <Canvas gl={{ alpha: true, antialias: true }}>
              <FluxScene /> 
            </Canvas>
          </div>
        </div>

        {/* --- 2. SCROLLABLE CONTENT --- */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />

          <div className="grow">
            
            {/* HERO */}
            <section className="h-screen flex flex-col items-center justify-center text-center p-4">
              <div ref={titleRef} className="flex items-center justify-center gap-2 md:gap-4 pointer-events-auto mb-6">
                <VariableProximity
                  label="FLUX"
                  className="text-7xl md:text-9xl font-black text-white tracking-tighter"
                  fromFontVariationSettings="'wght' 800, 'wdth' 100"
                  toFontVariationSettings="'wght' 1000, 'wdth' 110"
                  containerRef={containerRef}
                  radius={100}
                  falloff="linear"
                />
                <VariableProximity
                  label="FIT"
                  className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#00f3ff] to-[#ff00aa] tracking-tighter"
                  fromFontVariationSettings="'wght' 800, 'wdth' 100"
                  toFontVariationSettings="'wght' 1000, 'wdth' 110"
                  containerRef={containerRef}
                  radius={100}
                  falloff="linear"
                />
              </div>
              <p ref={subtitleRef} className="text-gray-400 text-lg md:text-2xl font-light tracking-[0.5em] uppercase border-b border-white/10 pb-4">
                Biological Data Visualization
              </p>
              <div className="absolute bottom-10 animate-bounce text-gray-500 text-xs tracking-widest">
                SCROLL TO INITIALIZE
              </div>
            </section>

            {/* CARD 1 LEFT */}
            <section className="feature-section min-h-screen flex items-center p-8 md:p-20 py-32">
              <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="hidden md:block"></div>
                <TiltedCard className="w-full" containerHeight="auto" rotateAmplitude={15} scaleOnHover={1.05}>
                  <div className="bg-black/40 backdrop-blur-xl p-10 h-full w-full border border-white/5 rounded-3xl">
                    <h2 className="text-5xl font-bold text-white mb-6 transform-[translateZ(50px)]" style={{ textShadow: '0 10px 30px rgba(0,243,255,0.3)' }}>
                      SYNCHRONIZED <br/><span className="text-[#00f3ff]">REALITY</span>
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-8 transform-[translateZ(30px)]">
                      The Core builds a digital twin of your metabolism. Watch your biometric state evolve in real-time as you move through the void.
                    </p>
                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 transform-[translateZ(20px)]">
                      <div><div className="text-3xl font-bold text-[#00f3ff]">98%</div><div className="text-xs text-gray-500 tracking-wider">ACCURACY</div></div>
                      <div><div className="text-3xl font-bold text-[#00f3ff]">0.02s</div><div className="text-xs text-gray-500 tracking-wider">LATENCY</div></div>
                    </div>
                  </div>
                </TiltedCard>
              </div>
            </section>

            {/* CARD 2 RIGHT */}
            <section className="feature-section min-h-screen flex items-center justify-end p-8 md:p-20 py-32">
              <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <TiltedCard className="w-full" containerHeight="auto" rotateAmplitude={15} scaleOnHover={1.05}>
                  <div className="bg-black/40 backdrop-blur-xl p-10 h-full w-full text-right border border-white/5 rounded-3xl">
                    <h2 className="text-5xl font-bold text-white mb-6 transform-[translateZ(50px)]" style={{ textShadow: '0 10px 30px rgba(255,0,170,0.3)' }}>
                      NEURAL <br/><span className="text-[#ff00aa]">PREDICTION</span>
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-8 transform-[translateZ(30px)]">
                      Our AI doesn't just record history; it writes the future. By analyzing micro-patterns in your heart rate variability, we predict exhaustion.
                    </p>
                    <button className="relative z-50 px-8 py-3 bg-[#ff00aa] text-white font-bold rounded-full hover:bg-white hover:text-[#ff00aa] transition-all shadow-[0_0_20px_rgba(255,0,170,0.4)] transform-[translateZ(60px)] cursor-pointer">
                      START TRACKING
                    </button>
                  </div>
                </TiltedCard>
                <div className="hidden md:block"></div>
              </div>
            </section>

            {/* --- CARD SWAP GALLERY --- */}
            <section className="feature-section min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
              <div className="text-center mb-16 relative z-10 flex flex-col items-center">
                
                {/* 1. TITLE: MIXED ANIMATION */}
                <div className="flex justify-center gap-3 flex-wrap mb-4 overflow-hidden">
                  
                  {/* TRAIN (Character Float) */}
                  <ScrollFloat 
                    textClassName="text-4xl md:text-6xl font-black text-white tracking-tighter"
                    containerClassName="my-0"
                  >
                    TRAIN
                  </ScrollFloat>
                  
                  {/* ANYWHERE (Whole Word Slide + Fade) - PRESERVES GRADIENT */}
                  <h2 
                    ref={gradientTextRef}
                    className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#00f3ff] to-[#ff00aa] tracking-tighter pb-2"
                  >
                    ANYWHERE
                  </h2>
                </div>

                {/* 2. SUBTITLE */}
                <ScrollFloat 
                  animationDuration={1.2} 
                  ease='power2.out'
                  stagger={0.02}
                  textClassName="text-gray-400 text-lg tracking-widest uppercase"
                  containerClassName="my-0"
                >
                  The Void Adapts To You
                </ScrollFloat>

              </div>

              {/* CARD SWAP */}
              <div style={{ height: '600px', width: '100%', position: 'relative' }} className="flex justify-center items-center">
                <CardSwap
                  cardDistance={30}
                  verticalDistance={35}
                  delay={3500}
                  pauseOnHover={true}
                  width={320}
                  height={450}
                >
                  {galleryImages.map((img, i) => (
                    <Card key={i} className="group cursor-pointer">
                      <div className="relative w-full h-full">
                        <img 
                          src={img.src} 
                          alt={img.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-90" />
                        <div className="absolute bottom-6 left-6">
                          <h3 className="text-3xl font-bold text-white mb-1">{img.title}</h3>
                          <p className="text-[#00f3ff] text-sm tracking-widest font-bold">{img.subtitle}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            </section>

          </div>

          <div className="relative z-50 bg-black/80 backdrop-blur-xl border-t border-white/10">
             <Footer />
          </div>

        </div>
      </div>
    </SmoothScroll>
  );
}