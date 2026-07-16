import { useState, useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { useNavigate } from 'react-router-dom';
import {
  COUNTRIES, SERVICES, BOOKS, INSIGHTS,
  TESTIMONIALS, STATS, CREDENTIALS
} from '../data/content';

const BASE = 'https://res.cloudinary.com/djxprptlf/image/upload';

const GALLERY_CATEGORIES = [
  {
    label: 'Awards & Recognition',
    color: '#1a1a2e',
    photos: [`${BASE}/awards-1.jpg`],
  },
  {
    label: 'Business Geeks Book Launch',
    color: '#3d1f00',
    photos: Array.from({ length: 7 }, (_, i) => `${BASE}/businessgeek-${i + 1}.jpg`),
  },
  {
    label: "Facilitator's Edge Launch",
    color: '#4a2500',
    photos: Array.from({ length: 11 }, (_, i) => `${BASE}/facilitatorsedge-${i + 1}.jpg`),
  },
  {
    label: 'Speaking & Keynotes',
    color: '#16213e',
    photos: Array.from({ length: 7 }, (_, i) => `${BASE}/events-${i + 1}.jpg`),
  },
  {
    label: 'Convenings & Events',
    color: '#2d2040',
    photos: Array.from({ length: 6 }, (_, i) => `${BASE}/events-${i + 8}.jpg`),
  },
  {
    label: 'International Engagements',
    color: '#2d6a4f',
    photos: Array.from({ length: 6 }, (_, i) => `${BASE}/events-${i + 14}.jpg`),
  },
{
    label: 'Mentorship & Network',
    color: '#1a3040',
    photos: Array.from({ length: 6 }, (_, i) => `${BASE}/events-${i + 19}.jpg`),
  },
  {
    label: 'Press & Media',
    color: '#2a1a0a',
    photos: [`${BASE}/events-20.jpg`],
  },
];

export default function Home() {
  const [openCategory, setOpenCategory] = useState(null);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);           
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [formData, setFormData] = useState({ name: '', org: '', challenge: '', outcome: '' });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Swipe support for lightbox
useEffect(() => {
  if (!lightboxPhoto) return;
  let startX = 0;
  const onTouchStart = e => { startX = e.touches[0].clientX; };
  const onTouchEnd = e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    const photos = openCategory.photos;
    const idx = photos.indexOf(lightboxPhoto);
    if (diff > 0) {
      setLightboxPhoto(photos[(idx + 1) % photos.length]);
    } else {
      setLightboxPhoto(photos[(idx - 1 + photos.length) % photos.length]);
    }
  };
  window.addEventListener('touchstart', onTouchStart);
  window.addEventListener('touchend', onTouchEnd);
  return () => {
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchend', onTouchEnd);
  };
}, [lightboxPhoto, openCategory]);

// Keyboard navigation for lightbox
useEffect(() => {
  if (!lightboxPhoto) return;
  const onKey = e => {
    const photos = openCategory.photos;
    const idx = photos.indexOf(lightboxPhoto);
    if (e.key === 'ArrowRight') setLightboxPhoto(photos[(idx + 1) % photos.length]);
    if (e.key === 'ArrowLeft') setLightboxPhoto(photos[(idx - 1 + photos.length) % photos.length]);
    if (e.key === 'Escape') setLightboxPhoto(null);
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, [lightboxPhoto, openCategory]);

  const scrollTo = (href) => {
    const el = document.getElementById(href.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://formspree.io/f/mlgkpblk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({ name: '', org: '', challenge: '', outcome: '' });
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    }
  };
  return (
    <main>

 {/* HERO */}
<section style={{
  minHeight: '100vh', display: 'flex', flexDirection: 'column',
  justifyContent: 'center', padding: '8rem 10vw 4rem',
  position: 'relative', overflow: 'hidden',
  textAlign: 'center', alignItems: 'center',
}}>
  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, #1a3a2a08 0%, transparent 65%)', pointerEvents: 'none' }} />

  <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', width: '100%' }}>
    <p style={{
  fontFamily: 'var(--sans)', fontSize: '15px', lineHeight: 1.9,
  color: 'var(--text-mute)', fontWeight: 300, maxWidth: '520px',
  margin: '0 auto 3.5rem', animation: 'fadeUp 0.8s 0.75s ease both', textAlign: 'center',
    }}>Africa's Authority in Strategic Leadership</p>

    <h1 style={{
      fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 600,
      lineHeight: 1.0, letterSpacing: '-0.03em',
      marginBottom: '0.15rem', animation: 'fadeUp 0.8s 0.4s ease both',
    }}>Think Clearly.</h1>

    <h1 style={{
      fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 600,
      lineHeight: 1.0, letterSpacing: '-0.03em', color: 'var(--gold)',
      marginBottom: '3rem', animation: 'fadeUp 0.8s 0.55s ease both',
    }}>Lead Strategically.</h1>

   <p style={{
  fontFamily: 'var(--sans)', fontSize: '15px', lineHeight: 1.9,
  color: 'var(--text-mute)', fontWeight: 300, maxWidth: '520px',
  margin: '0 auto 3.5rem', animation: 'fadeUp 0.8s 0.75s ease both',
  textAlign: 'center', width: '100%',
   }}> 
      Leadership transformation, strategic advisory, and executive coaching
      for leaders and institutions building Africa's future and shaping its
      standing in the world.
    </p>

    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeUp 0.8s 0.95s ease both' }}>
      <button className="btn btn-gold" onClick={() => scrollTo('#contact')}>
        Work With Dr. Asma'u →
      </button>
      <button className="btn btn-outline" onClick={() => scrollTo('#insights')}>
        Explore Our Thinking
      </button>
    </div>

    {/* STATS ROW */}
    <div style={{
      display: 'flex', gap: '4rem', marginTop: '6rem',
      paddingTop: '3rem', borderTop: '1px solid var(--border)',
      animation: 'fadeUp 0.8s 1.1s ease both', flexWrap: 'wrap',
    }}>
    </div>
  </div>
</section>
      {/* ── TICKER ── */}
      <div style={{
        padding: '1.4rem 0', background: 'var(--bg-2)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        overflow: 'hidden', whiteSpace: 'nowrap',
      }}>
        <div style={{ display: 'inline-flex', animation: 'ticker 32s linear infinite' }}>
          {[...COUNTRIES, ...COUNTRIES].map((c, i) => (
            <span key={i} style={{
              fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--text-ghost)', padding: '0 2.5rem',
            }}>
              {c} <span className="gold">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── FOUNDER ── */}
      <section className="section" id="founder">
        <div className="section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="two-col">
            <ScrollReveal direction="left">
          <div>
            <div className="label">The Founder</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, lineHeight: 1.1, marginBottom: '0.25rem' }}>
                Meet Dr. Asma'u Isah Maibasira
              </h2>
              <div style={{ width: 'rem', height: '2px', background: 'var(--gold)', margin: '2rem 0' }} />
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.9, color: 'var(--text-mute)', fontWeight: 300, marginBottom: '1.25rem' }}>
                Dr. Asma'u Isah Maibasira is a strategic leadership coach and management consultant whose work is dedicated to solving one of the most critical challenges facing leaders and institutions today: the absence of strategic clarity.
              </p>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.9, color: 'var(--text-mute)', fontWeight: 300, marginBottom: '1.25rem' }}>
                As Founder and Chief Executive of NAIM Strategies, she leads a high-impact consultancy platform focused on coaching leaders, strengthening institutions, and transforming organisational performance through clarity, structure, and mindset re-engineering.
              </p>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.9, color: 'var(--text-mute)', fontWeight: 300 }}>
                With a foundation in computer science, enterprise systems and business strategy, she brings a systems-thinking sensibility to leadership growth  translating vision into structured, executable strategy.
              </p>
              <div style={{ borderLeft: '1px solid #c9a96e33', paddingLeft: '1.5rem', marginTop: '2.5rem' }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',  color: 'var(--accent)', marginBottom: '1rem' }}>
                  Credentials & Affiliations
                </div>
                {CREDENTIALS.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                    <span className="gold" style={{ fontSize: '7px', marginTop: '5px', flexShrink: 0 }}>◆</span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '11px', lineHeight: 1.6, color: 'var(--text-dim)', fontWeight: 300 }}>{c}</span>
                  </div>
                ))}
              </div>
      </div>
</ScrollReveal>
            

            {/* PORTRAIT */}
            {/* PORTRAIT */}
<ScrollReveal direction="right">
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'linear-gradient(135deg, #1a1206, #0f0f0f)',
                border: '1px solid #c9a96e1a', aspectRatio: '3/4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: '0.75rem', position: 'relative', overflow: 'hidden',
              }}>
                  <img
                    src="https://res.cloudinary.com/djxprptlf/image/upload/founder.png"
                    alt="Dr. Asma'u Isah Maibasira"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        position: 'absolute',
                        inset: 0,
                    }}
                    />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                  padding: '3rem 2rem 2rem',
                }}>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase',  color: 'var(--accent)', marginBottom: '0.25rem' }}>
                    Founder & CEO
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 500 }}>NAIM Strategies</div>
                </div>
              </div>
             <div style={{ position: 'absolute', top: '-1.5rem', right: '-1.5rem', width: '100%', height: '100%', border: '1px solid #c9a96e0a', zIndex: -1 }} />
            </div>
</ScrollReveal>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── SERVICES ── */}
      <section className="section" id="services">
        <div className="section-inner">
          <ScrollReveal>
          <div className="label">Services</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, lineHeight: 1.1, marginBottom: '1rem' }}>
            Four practices. One discipline.
          </h2>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.9, color: 'var(--text-mute)', maxWidth: '580px', fontWeight: 300, marginBottom: '4rem' }}>
            Every engagement is bespoke. We do not deliver one-size-fits-all programmes. We enter as strategic partners  listening, diagnosing, co-designing and delivering frameworks that unlock sustainable growth.
          </p>

          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)' }} className="services-grid">
            {SERVICES.map((s, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', padding: '2.5rem', transition: 'background 0.4s, border 0.4s', border: '1px solid transparent', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.borderColor = '#c9a96e22'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.style.borderColor = 'transparent'; }}
              >
                <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase',  color: 'var(--accent)', marginBottom: '1.5rem' }}>
                  {s.roman} Practice
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 500, lineHeight: 1.2, marginBottom: '1rem' }}>{s.title}</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '12px', lineHeight: 1.8, color: 'var(--text-mute)', fontWeight: 300, marginBottom: '1.5rem' }}>{s.desc}</p>
                <ul style={{ listStyle: 'none', marginBottom: '2rem' }}>
                  {s.items.map((item, j) => (
                    <li key={j} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem' }}>
                      <span className="gold" style={{ fontSize: '7px', marginTop: '5px', flexShrink: 0 }}>◆</span>
                      <span style={{ fontFamily: 'var(--sans)', fontSize: '11px', lineHeight: 1.7, color: 'var(--text-dim)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="btn btn-gold" style={{ fontSize: '9px' }} onClick={() => scrollTo('#contact')}>
                  Apply for Engagement →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── BOOKS ── */}
      <section className="section" id="books" style={{ textAlign: 'center' }}>
        <div className="section-inner">
          <div className="label">The Library</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, lineHeight: 1.1, marginBottom: '4rem' }}>
            A library written for leaders of consequence.
          </h2>
          <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            {BOOKS.map((b, i) => (
              <div key={i} style={{ flexShrink: 0, width: '200px', cursor: 'pointer', transition: 'transform 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                onClick={() => navigate(`/books?book=${i}`)}
>
                <div style={{
                  width: '200px', height: '280px', background: b.color,
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  padding: '1.5rem', position: 'relative', overflow: 'hidden',
                }}>
                <img src={b.cover || `https://via.placeholder.com/200x280/1a1a1a/c9a96e?text=${encodeURIComponent(b.title)}`} alt={b.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            <button className="btn btn-gold" onClick={() => navigate('/books')}>Enter the Library →</button>
            <button className="btn btn-outline" onClick={() => scrollTo('#contact')}>Request Signed Copy</button>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── EVENTS ── */}
      <section className="section" id="events" style={{ textAlign: 'center' }}>
        <div className="section-inner">
          <div className="label" style={{ justifyContent: 'center' }}>Events & Experiences</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Where leaders gather to think clearly.
          </h2>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.9, color: 'var(--text-mute)', maxWidth: '480px', margin: '0 auto 3rem', fontWeight: 300 }}>
            The 2026 calendar is being curated. Masterclasses, keynotes and invitation-only convenings across Africa, Europe and North America.
          </p>
          <div style={{ border: '1px solid #c9a96e1a', padding: '4rem 2rem', background: 'var(--bg-2)', maxWidth: '500px', margin: '0 auto 3rem' }}>
            <div className="gold" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>◇</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-mute)' }}>
              Calendar Coming Soon
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-gold">View Calendar →</button>
            <button className="btn btn-outline" onClick={() => scrollTo('#contact')}>Request a Private Session</button>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── INSIGHTS ── */}
      <section className="section" id="insights">
        <div className="section-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="label">Insights</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600 }}>Our Journal.</h2>
            </div>
            <button className="btn btn-outline">Read All Stories →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }} className="insights-grid">
            {INSIGHTS.map((ins, i) => (
              <div key={i} style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.querySelector('h3').style.color = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.querySelector('h3').style.color = 'var(--text)'}
              >
                <div style={{ aspectRatio: '16/9', background: '#1a1206', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="gold" style={{ fontSize: '1.5rem' }}>◇</span>
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.15em',  color: 'var(--accent)', marginBottom: '0.75rem' }}>{ins.date}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.3, marginBottom: '0.75rem', transition: 'color 0.3s' }}>{ins.title}</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '12px', lineHeight: 1.8, color: 'var(--text-mute)', fontWeight: 300 }}>{ins.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

{/* GALLERY */}
<section className="section" id="gallery">
  <div className="section-inner">
    <div className="label">The Gallery</div>
    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, lineHeight: 1.1, marginBottom: '2.5rem' }}>
      A documentary of a body of work.
    </h2>

    {/* CATEGORY CARDS */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#ffffff04' }} className="gallery-grid">
      {GALLERY_CATEGORIES.map((cat, i) => (
        <div key={i}
          onClick={() => setOpenCategory(cat)}
          style={{
            aspectRatio: '4/3', position: 'relative', cursor: 'pointer',
            overflow: 'hidden', display: 'flex', alignItems: 'flex-end',
            padding: '1.5rem',
            background: cat.photos[0]
              ? `url(${cat.photos[0]}) center/cover no-repeat`
              : cat.color,
            transition: 'transform 0.4s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
          <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase',  color: 'var(--accent)', marginBottom: '4px' }}>
              {cat.photos.length} photos
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500, color: '#ffffff', lineHeight: 1.3, marginBottom: '6px' }}>
              {cat.label}
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a96e88' }}>
              View all →
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* LIGHTBOX MODAL */}
  {openCategory && (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)',
      zIndex: 300, overflowY: 'auto', padding: '2rem',
    }}
      onClick={e => { if (e.target === e.currentTarget) setOpenCategory(null); }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* MODAL HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',  color: 'var(--accent)', marginBottom: '0.25rem' }}>
              Gallery
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 600 }}>{openCategory.label}</h3>
          </div>
          <button onClick={() => setOpenCategory(null)} style={{
            background: 'none', border: '1px solid #ffffff22', color: 'var(--text)',
            width: '44px', height: '44px', fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'border-color 0.3s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#ffffff22'}
          >✕</button>
        </div>

        {/* MODAL PHOTOS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#ffffff08' }} className="modal-grid">
          {openCategory.photos.map((photo, i) => (
            <div key={i} style={{
              aspectRatio: '4/3', overflow: 'hidden', cursor: 'pointer',
            }}
              onClick={() => setLightboxPhoto(photo)}
            >
              <img src={photo} alt={`${openCategory.label} ${i + 1}`} style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.4s',
              }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )}

  {/* SINGLE PHOTO LIGHTBOX */}
{/* SINGLE PHOTO LIGHTBOX */}
{lightboxPhoto && (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.97)',
    zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '2rem',
  }}
    onClick={() => setLightboxPhoto(null)}
  >
    {/* PREV ARROW */}
    <button
      onClick={e => {
        e.stopPropagation();
        const photos = openCategory.photos;
        const idx = photos.indexOf(lightboxPhoto);
        setLightboxPhoto(photos[(idx - 1 + photos.length) % photos.length]);
      }}
      style={{
        position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
        color: '#ffffff', width: '48px', height: '48px', fontSize: '20px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s', zIndex: 10,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
    >‹</button>

    {/* IMAGE */}
    <img
      src={lightboxPhoto}
      alt="Gallery"
      onClick={e => e.stopPropagation()}
      style={{
        maxWidth: '85vw', maxHeight: '85vh', objectFit: 'contain',
        userSelect: 'none',
      }}
    />

    {/* NEXT ARROW */}
    <button
      onClick={e => {
        e.stopPropagation();
        const photos = openCategory.photos;
        const idx = photos.indexOf(lightboxPhoto);
        setLightboxPhoto(photos[(idx + 1) % photos.length]);
      }}
      style={{
        position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
        color: '#ffffff', width: '48px', height: '48px', fontSize: '20px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s', zIndex: 10,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
    >›</button>

    {/* CLOSE */}
    <button onClick={() => setLightboxPhoto(null)} style={{
      position: 'absolute', top: '1.5rem', right: '1.5rem',
      background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#ffffff',
      width: '44px', height: '44px', fontSize: '18px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>✕</button>

    {/* COUNTER */}
    <div style={{
      position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
      fontFamily: 'var(--sans)', fontSize: '11px', color: 'rgba(255,255,255,0.5)',
      letterSpacing: '0.1em',
    }}>
      {openCategory.photos.indexOf(lightboxPhoto) + 1} / {openCategory.photos.length}
    </div>
  </div>
)}

  <style>{`
    @media (max-width: 900px) { .gallery-grid { grid-template-columns: 1fr 1fr !important; } .modal-grid { grid-template-columns: 1fr 1fr !important; } }
    @media (max-width: 560px) { .gallery-grid { grid-template-columns: 1fr 1fr !important; } .modal-grid { grid-template-columns: 1fr !important; } }
  `}</style>
</section>

      <div className="divider" />

      {/* ── ENDORSEMENTS ── */}
      <section style={{ padding: '5rem 10vw', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-mute)', textAlign: 'center', marginBottom: '3rem' }}>
            Endorsed By
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5rem', flexWrap: 'wrap' }}>
            {['endorsement1', 'endorsement2', 'endorsement3', 'endorsement4'].map((name, i) => (
              <div key={i} style={{ opacity: 0.7, transition: 'opacity 0.3s', filter: 'grayscale(30%)' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.filter = 'grayscale(0%)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.filter = 'grayscale(30%)'; }}
              >
                <img
                  src={`https://res.cloudinary.com/djxprptlf/image/upload/${name}.png`}
                  alt={`Endorsement ${i + 1}`}
                  style={{ height: '120px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── TESTIMONIALS ── */}

      {/* ── STATS ── */}
      <section className="section">
        <div className="section-inner">
          <div className="label">Impact</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.0rem)', fontWeight: 600, lineHeight: 1.1, marginBottom: '4rem' }}>
            Measured in outcomes. Felt across institutions.
          </h2>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)' }} className="stats-grid">
            {STATS.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
              <div style={{ background: 'var(--bg)', padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '3.5rem', fontWeight: 400,  color: 'var(--accent)', marginBottom: '0.5rem' }}>{s.number}</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-mute)' }}>{s.label}</div>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <div className="section-inner">
          <div className="label" style={{ justifyContent: 'center' }}>In Their Words</div>
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', color: '#c9a96e18', lineHeight: 0.6, marginBottom: '2rem', fontFamily: 'Georgia, serif' }}>"</div>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 400, lineHeight: 1.55, color: 'var(--text)', marginBottom: '2rem' }}>
              {TESTIMONIALS[testimonialIdx].quote}
            </p>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',  color: 'var(--accent)', marginBottom: '0.25rem' }}>
              {TESTIMONIALS[testimonialIdx].author}
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-mute)', marginBottom: '2.5rem' }}>
              {TESTIMONIALS[testimonialIdx].org}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)} style={{
                  height: '3px', width: i === testimonialIdx ? '2rem' : '0.4rem',
                  background: i === testimonialIdx ? 'var(--gold)' : 'var(--text-mute)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.35s',
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── CONTACT ── */}
      <section className="section" id="contact">
        <div className="section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }} className="two-col">
            <div>
              <div className="label">Begin</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                Begin Your Transformation.
              </h2>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.9, color: 'var(--text-mute)', fontWeight: 300 }}>
                A confidential conversation with our practice. We respond personally within two business days.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }} className="form-row">
                <div>
                  <label className="form-label">Name</label>
                  <input className="form-input" type="text" placeholder="Your full name" required
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Organisation</label>
                  <input className="form-input" type="text" placeholder="Your organisation"
                    value={formData.org} onChange={e => setFormData({ ...formData, org: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label className="form-label">The Challenge</label>
                <textarea className="form-input" rows={3} placeholder="Describe the challenge you're facing..." style={{ resize: 'vertical' }}
                  value={formData.challenge} onChange={e => setFormData({ ...formData, challenge: e.target.value })} />
              </div>
              <div style={{ marginBottom: '3rem' }}>
                <label className="form-label">Desired Outcome</label>
                <textarea className="form-input" rows={2} placeholder="What outcome are you seeking?" style={{ resize: 'vertical' }}
                  value={formData.outcome} onChange={e => setFormData({ ...formData, outcome: e.target.value })} />
              </div>
             {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid #c9a96e22', background: 'var(--bg-2)' }}>
                  <div style={{ color: 'var(--accent)', fontSize: '2rem', marginBottom: '1rem' }}>◇</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Message Received.</h3>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>We will be in touch within two business days.</p>
                </div>
              ) : (
                <button type="submit" className="btn btn-gold btn-full">
                  Begin Your Transformation →
                </button>
              )}
            </form>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .two-col { grid-template-columns: 1fr !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .insights-grid { grid-template-columns: 1fr !important; }
          .gallery-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </main>
  );
}
