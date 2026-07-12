import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
const LINKS = [
  { label: 'Founder', href: '/#founder' },
  { label: 'Services', href: '/#services' },
  { label: 'Books', href: '/books' },
  { label: 'Events', href: '/events' },
  { label: 'Insights', href: '/insights' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Contact', href: '/contact' },
];

export default function Nav() {
const [scrolled, setScrolled] = useState(false);
const [hidden, setHidden] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  

useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 40);
      setHidden(currentY > lastY && currentY > 100);
      lastY = currentY;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (href) => {
    setMenuOpen(false);
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        window.location.href = href;
      } else {
        const id = href.replace('/#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isActive = (href) => {
    if (href.startsWith('/#')) return location.pathname === '/';
    return location.pathname === href;
  };

  return (
    <>
          {menuOpen && (
            <div style={{
              position: 'fixed', inset: 0, background: 'var(--bg)',
              zIndex: 200, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '2.5rem',
              animation: 'menuFadeIn 0.35s ease forwards',
            }}>
              <button onClick={() => setMenuOpen(false)} style={{
                position: 'absolute', top: '1.5rem', right: '6vw',
                background: 'none', border: 'none', color: 'var(--text)',
                fontSize: '24px', cursor: 'pointer',
              }}>✕</button>

              {LINKS.map((l, i) => (
                l.href.startsWith('/#') ? (
                  <span key={l.label} onClick={() => handleClick(l.href)} style={{
                    fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'var(--text-mid)', cursor: 'pointer',
                    animation: `menuItemSlide 0.4s ${i * 0.07}s ease both`,
                    opacity: 0,
                  }}>{l.label}</span>
                ) : (
                  <Link key={l.label} to={l.href} onClick={() => setMenuOpen(false)} style={{
                    fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: isActive(l.href) ? 'var(--accent)' : 'var(--text-mid)',
                    textDecoration: 'none',
                    animation: `menuItemSlide 0.4s ${i * 0.07}s ease both`,
                    opacity: 0,
                  }}>{l.label}</Link>
                )
              ))}

              <Link to="/contact" onClick={() => setMenuOpen(false)} className="btn btn-gold"
                style={{ animation: 'menuItemSlide 0.4s 0.5s ease both', opacity: 0 }}>
                Begin Conversation
              </Link>

              <style>{`
                @keyframes menuFadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                @keyframes menuItemSlide {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </div>
          )}

      {/* NAV BAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1.5rem 6vw',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.4s',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img
              src="https://res.cloudinary.com/djxprptlf/image/upload/logo.png"
              alt="NAIM Strategies"
              style={{ height: '50px', width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </Link>

        {/* DESKTOP LINKS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="desktop-nav">
          {LINKS.map(l => (
            l.href.startsWith('/#') ? (
              <span key={l.label} onClick={() => handleClick(l.href)} style={{
                fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 500,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: isActive(l.href) ? 'var(--accent)' : 'var(--text-mid)',
                cursor: 'pointer', transition: 'color 0.3s',
              }}
                onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                onMouseLeave={e => e.target.style.color = isActive(l.href) ? 'var(--accent)' : 'var(--text-mid)'}
              >{l.label}</span>
            ) : (
              <Link key={l.label} to={l.href} style={{
                fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 500,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: isActive(l.href) ? 'var(--gold)' : 'var(--text-mid)',
                transition: 'color 0.3s', textDecoration: 'none',
              }}
                onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                onMouseLeave={e => e.target.style.color = isActive(l.href) ? 'var(--gold)' : 'var(--text-mid)'}
              >{l.label}</Link>
            )
          ))}
          <Link to="/contact" className="btn btn-gold">
            Begin Conversation
          </Link>
        </div>

        {/* HAMBURGER */}
        <button onClick={() => setMenuOpen(true)} style={{
          display: 'none', background: 'none', border: 'none',
          color: 'var(--text)', fontSize: '22px', cursor: 'pointer',
        }} className="hamburger">☰</button>
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
}