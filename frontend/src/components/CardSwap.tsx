import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useState,
  useEffect,
  useMemo,
  useRef
} from 'react';
import gsap from 'gsap';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
  'data-cardswap-card'?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    // Added 'cursor-pointer' to indicate interactivity
    className={`absolute top-1/2 left-1/2 border border-white/10 bg-black/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl transform-3d will-change-transform backface-hidden cursor-pointer ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card.displayName = 'Card';

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap: React.FC<CardSwapProps> = ({
  width = 300,
  height = 400,
  cardDistance = 40,
  verticalDistance = 50,
  delay = 4000,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 2,
  easing = 'elastic',
  children
}) => {
  const config = useMemo(() => 
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        }
  , [easing]);

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const elementsRef = useRef<HTMLDivElement[]>([]);
  const swapFnRef = useRef<(() => void) | null>(null);
  const [manualSwapNonce, setManualSwapNonce] = useState(0);

  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  // --- 2. SETUP & INTERVAL ---
  useEffect(() => {
    // Rebuild element list after render (no refs during render).
    const node = container.current;
    if (!node) return;
    elementsRef.current = Array.from(node.querySelectorAll('[data-cardswap-card="true"]')) as HTMLDivElement[];

    // Reset order when the card list changes.
    order.current = Array.from({ length: elementsRef.current.length }, (_, i) => i);

    const total = elementsRef.current.length;
    elementsRef.current.forEach((el, i) => placeNow(el, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    // Build swap function (kept inside the effect to satisfy "no refs during render" lint rules).
    swapFnRef.current = () => {
      // Prevent overlapping animations
      if (tlRef.current && tlRef.current.isActive()) return;
      if (order.current.length < 2) return;
      if (elementsRef.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = elementsRef.current[front];
      if (!elFront) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      // Animation: Drop front card down
      tl.to(elFront, {
        y: '+=300',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);

      // Animation: Move stack forward
      rest.forEach((idx, i) => {
        const el = elementsRef.current[idx];
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, elementsRef.current.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      // Animation: Return front card to back
      const backSlot = makeSlot(
        elementsRef.current.length - 1,
        cardDistance,
        verticalDistance,
        elementsRef.current.length
      );
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    // Start Timer
    const startTimer = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => swapFnRef.current?.(), delay);
    };

    startTimer();

    // Hover Handling
    if (node && pauseOnHover) {
        const handleEnter = () => {
            isHovering.current = true;
            clearInterval(intervalRef.current);
        };
        const handleLeave = () => {
            isHovering.current = false;
            startTimer();
        };
        node.addEventListener('mouseenter', handleEnter);
        node.addEventListener('mouseleave', handleLeave);
        
        return () => {
            node.removeEventListener('mouseenter', handleEnter);
            node.removeEventListener('mouseleave', handleLeave);
            clearInterval(intervalRef.current);
        };
    }

    return () => clearInterval(intervalRef.current);
  }, [delay, pauseOnHover, cardDistance, verticalDistance, skewAmount, childArr.length, config]);

  // --- 3. MANUAL CLICK HANDLER (signal-based to avoid ref access during render) ---
  useEffect(() => {
    if (manualSwapNonce === 0) return;
    swapFnRef.current?.();

    // Only restart timer if we aren't currently hovering (to respect pauseOnHover)
    if (!isHovering.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => swapFnRef.current?.(), delay);
    }
  }, [manualSwapNonce, delay]);

  // Inject onClick to children
  const rendered = childArr.map((child, i) => {
    if (!isValidElement<CardProps>(child)) return child;

    const props: React.Attributes & CardProps = {
      key: i,
      'data-cardswap-card': 'true',
      style: { width, height, ...(child.props.style ?? {}) },
      onClick: (e) => {
        // Trigger the swap manually (handled in an effect)
        setManualSwapNonce((n) => n + 1);
        // Call original handlers if they exist
        child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
        onCardClick?.(i);
      }
    };

    return cloneElement(child, props);
  });

  return (
    <div
      ref={container}
      className="relative perspective-[1000px] w-full h-full flex items-center justify-center"
    >
      <div className="relative w-full h-full flex items-center justify-center translate-y-10">
         {rendered}
      </div>
    </div>
  );
};

export default CardSwap;