import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function LuxuryCursor() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on pointer: fine (mouse) devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf;
    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) setVisible(true);

      if (innerRef.current) {
        innerRef.current.style.left = `${mouseX}px`;
        innerRef.current.style.top  = `${mouseY}px`;
      }
    };

    const animate = () => {
      outerX += (mouseX - outerX) * 0.12;
      outerY += (mouseY - outerY) * 0.12;
      if (outerRef.current) {
        outerRef.current.style.left = `${outerX}px`;
        outerRef.current.style.top  = `${outerY}px`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onMouseEnter = (e) => {
      if (e.target.closest('a, button, [data-cursor-hover]')) setHovering(true);
    };
    const onMouseLeave = (e) => {
      if (e.target.closest('a, button, [data-cursor-hover]')) setHovering(false);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseEnter);
    document.addEventListener('mouseout', onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseEnter);
      document.removeEventListener('mouseout', onMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div
        ref={outerRef}
        className={`luxury-cursor-outer ${hovering ? 'hovering' : ''}`}
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        ref={innerRef}
        className="luxury-cursor-inner"
        style={{ opacity: visible ? 1 : 0 }}
      />
    </>
  );
}
