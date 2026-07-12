import { useEffect, useRef } from 'react';

export default function ScrollReveal({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const getTransform = () => {
      if (direction === 'up') return 'translateY(30px)';
      if (direction === 'left') return 'translateX(-30px)';
      if (direction === 'right') return 'translateX(30px)';
      return 'translateY(30px)';
    };

    el.style.opacity = '0';
    el.style.transform = getTransform();
    el.style.transition = `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translate(0)';
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction]);

  return <div ref={ref}>{children}</div>;
}