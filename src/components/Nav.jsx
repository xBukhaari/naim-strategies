import { supabase } from '../lib/supabase';
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
  const [user, setUser] = useState(null);

  const location = useLocation();

  // ============================================================
  // AUTHENTICATION
  // ============================================================
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user || null);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ============================================================
  // NAVBAR SCROLL BEHAVIOUR
  // ============================================================
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Add background once the user scrolls down
      setScrolled(currentScrollY > 50);

      // Hide navbar when scrolling down
      // Show navbar when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ============================================================
  // CLOSE MOBILE MENU WHEN ROUTE CHANGES
  // ============================================================
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // ============================================================
  // NAVIGATION TO HOMEPAGE SECTIONS
  // ============================================================
  const handleClick = (href) => {
    setMenuOpen(false);

    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        window.location.href = href;
      } else {
        const id = href.replace('/#', '');
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    }
  };

  // ============================================================
  // ACTIVE NAVIGATION ITEM
  // ============================================================
  const isActive = (href) => {
    if (href.startsWith('/#')) {
      return location.pathname === '/';
    }

    return location.pathname === href;
  };

  return (
    <>
      {/* ========================================================
          MOBILE MENU
      ======================================================== */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg)',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5rem',
            animation: 'menuFadeIn 0.35s ease forwards',
          }}
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '6vw',
              background: 'none',
              border: 'none',
              color: 'var(--text)',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>

          {/* MOBILE NAVIGATION LINKS */}
          {LINKS.map((link, index) =>
            link.href.startsWith('/#') ? (
              <span
                key={link.label}
                onClick={() => handleClick(link.href)}
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--text-mid)',
                  cursor: 'pointer',
                  animation: `menuItemSlide 0.4s ${
                    index * 0.07
                  }s ease both`,
                  opacity: 0,
                }}
              >
                {link.label}
              </span>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: isActive(link.href)
                    ? 'var(--accent)'
                    : 'var(--text-mid)',
                  textDecoration: 'none',
                  animation: `menuItemSlide 0.4s ${
                    index * 0.07
                  }s ease both`,
                  opacity: 0,
                }}
              >
                {link.label}
              </Link>
            )
          )}

          {/* ======================================================
              MOBILE AUTH / CTA
          ====================================================== */}
          {user ? (
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="btn btn-gold"
              style={{
                animation: 'menuItemSlide 0.4s 0.5s ease both',
                opacity: 0,
              }}
            >
              My Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--text-mid)',
                  textDecoration: 'none',
                  animation:
                    'menuItemSlide 0.4s 0.5s ease both',
                  opacity: 0,
                }}
              >
                Member Login
              </Link>

              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="btn btn-gold"
                style={{
                  animation:
                    'menuItemSlide 0.4s 0.57s ease both',
                  opacity: 0,
                }}
              >
                Begin Conversation
              </Link>
            </>
          )}

          {/* MOBILE MENU ANIMATIONS */}
          <style>{`
            @keyframes menuFadeIn {
              from {
                opacity: 0;
              }

              to {
                opacity: 1;
              }
            }

            @keyframes menuItemSlide {
              from {
                opacity: 0;
                transform: translateY(20px);
              }

              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}

      {/* ========================================================
          NAV BAR
      ======================================================== */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '1.5rem 6vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled
            ? 'rgba(10,10,10,0.95)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled
            ? '1px solid var(--border)'
            : '1px solid transparent',
          transition: 'all 0.4s',
          transform: hidden
            ? 'translateY(-100%)'
            : 'translateY(0)',
        }}
      >
        {/* ======================================================
            LOGO
        ====================================================== */}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src="https://res.cloudinary.com/djxprptlf/image/upload/logo.png"
            alt="NAIM Strategies"
            style={{
              height: '50px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </Link>

        {/* ======================================================
            DESKTOP NAVIGATION
        ====================================================== */}
        <div
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem',
          }}
        >
          {/* MAIN NAVIGATION LINKS */}
          {LINKS.map((link) =>
            link.href.startsWith('/#') ? (
              <span
                key={link.label}
                onClick={() => handleClick(link.href)}
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: isActive(link.href)
                    ? 'var(--accent)'
                    : 'var(--text-mid)',
                  cursor: 'pointer',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--gold)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive(
                    link.href
                  )
                    ? 'var(--accent)'
                    : 'var(--text-mid)';
                }}
              >
                {link.label}
              </span>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: isActive(link.href)
                    ? 'var(--gold)'
                    : 'var(--text-mid)',
                  transition: 'color 0.3s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--gold)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive(
                    link.href
                  )
                    ? 'var(--gold)'
                    : 'var(--text-mid)';
                }}
              >
                {link.label}
              </Link>
            )
          )}

          {/* ====================================================
              DESKTOP AUTHENTICATION / CTA
          ==================================================== */}
          {user ? (
            <Link
              to="/dashboard"
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                background: 'var(--accent)',
                color: '#ffffff',
                padding: '10px 20px',
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.85';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              My Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--text-mid)',
                  transition: 'color 0.3s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--gold)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    'var(--text-mid)';
                }}
              >
                Member Login
              </Link>

              <Link
                to="/contact"
                className="btn btn-gold"
              >
                Begin Conversation
              </Link>
            </>
          )}
        </div>

        {/* ======================================================
            HAMBURGER
        ====================================================== */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text)',
            fontSize: '22px',
            cursor: 'pointer',
          }}
          className="hamburger"
        >
          ☰
        </button>
      </nav>

      {/* ========================================================
          RESPONSIVE STYLES
      ======================================================== */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }

          .hamburger {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}