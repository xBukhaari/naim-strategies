import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: '2rem', right: '2rem',
        width: '48px', height: '48px',
        background: 'var(--accent)', border: 'none',
        color: '#ffffff', fontSize: '20px',
        cursor: 'pointer', zIndex: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(26,58,42,0.3)',
        transition: 'all 0.3s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#0f2419'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}