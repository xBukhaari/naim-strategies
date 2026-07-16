import { NAV_LINKS, COUNTRIES } from '../data/content';

export default function Footer() {
  const scrollTo = (href) => {
    const el = document.getElementById(href.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: '#080808',
      borderTop: '1px solid var(--border)',
      padding: '5rem 10vw 3rem',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '4rem',
        marginBottom: '4rem',
        maxWidth: '1300px',
        margin: '0 auto 4rem',
      }} className="footer-grid">

        {/* BRAND */}
        <div>
         <div style={{
          fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 600,
           letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.5rem',
           color: '#ffffff',
          }}>
        NAIM <span className="gold">·</span> Strategies
         </div>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '11px', lineHeight: 1.9,
            color: '#cccccc', fontWeight: 300, marginBottom: '1.5rem',
          }}>
          
            A strategic leadership coaching and
            management consultancy building Africa's reference point for
            clarity-driven leadership.
          </p>
          <div style={{
           fontFamily: 'var(--sans)', fontSize: '11px',
           color: '#cccccc', lineHeight: 2,
          }}>
          contact@naimstrategies.com<br />
          +234 809 413 2576<br />
          No. 16D Annur Masjid Shopping Complex, Wuse, Abuja.
          </div>
        </div>

        {/* EXPLORE */}
        <div>
          <div style={{
            fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em',
            textTransform: 'uppercase',  color: 'var(--accent)', marginBottom: '1.25rem',
          }}>Explore</div>
          {NAV_LINKS.map(l => (
            <div key={l.label} onClick={() => scrollTo(l.href)} style={{
              fontFamily: 'var(--sans)', fontSize: '11px', color: '#cccccc',
              marginBottom: '0.6rem', cursor: 'pointer', transition: 'color 0.3s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-mute)'}
            >{l.label}</div>
          ))}
        </div>

        {/* GLOBAL REACH */}
        <div>
          <div style={{
            fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em',
            textTransform: 'uppercase',  color: 'var(--accent)', marginBottom: '1.25rem',
          }}>Global Reach</div>
          {COUNTRIES.slice(0, 8).map(c => (
            <div key={c} style={{
              fontFamily: 'var(--sans)', fontSize: '11px',
              color: '#cccccc', marginBottom: '0.5rem',
            }}>{c}</div>
          ))}
          <div style={{
            fontFamily: 'var(--sans)', fontSize: '10px', color: 'var(--gold-dim)',
            marginTop: '0.25rem',
          }}>+ 12 more</div>
        </div>

        {/* NEWSLETTER */}
        <div>
          <div style={{
            fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em',
            textTransform: 'uppercase',  color: 'var(--accent)', marginBottom: '1.25rem',
          }}>Newsletter</div>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: '11px', lineHeight: 1.8,
            color: '#cccccc', fontWeight: 300, marginBottom: '1.5rem',
          }}>
            Quiet dispatches on clarity, strategy and leadership. No noise.
          </p>
          <input
            className="form-input"
            type="email"
            placeholder="Your email address"
            style={{ marginBottom: '1rem' }}
          />
          <button className="btn btn-gold btn-full" style={{ fontSize: '9px' }}>
            Subscribe →
          </button>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        maxWidth: '1300px',
        margin: '0 auto',
      }}>
        <span style={{
        fontFamily: 'var(--sans)', fontSize: '10px', color: '#cccccc',   
        }}>
          © 2026 NAIM Strategies Nigeria Ltd. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Privacy', 'Terms', 'Press'].map(l => (
            <span key={l} style={{
              fontFamily: 'var(--sans)', fontSize: '10px', color: '#cccccc',
              cursor: 'pointer', transition: 'color 0.3s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-mute)'}
            >{l}</span>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}