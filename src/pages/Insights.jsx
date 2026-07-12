import { useState } from 'react';

const ARTICLES = [
  {
    date: 'May 7, 2026',
    category: 'Recognition & Culture',
    title: 'The Three Words That Make Recognition Actually Stick',
    excerpt: 'Vague praise does not teach anyone anything. And we wonder why recognition never seems to land the way we hope it would.',
    readTime: '4 min read',
    featured: true,
  },
  {
    date: 'May 6, 2026',
    category: 'Leadership & Communication',
    title: 'How to End an Argument That Refuses to End',
    excerpt: 'Most debates that go in circles are not really about the options being debated. They are about the absence of a shared frame.',
    readTime: '5 min read',
    featured: true,
  },
  {
    date: 'May 6, 2026',
    category: 'Leadership & Restraint',
    title: 'The Hardest Thing a Leader Can Do Is Nothing',
    excerpt: 'The more authority we carry, the heavier our words land. Sometimes the most generous thing we can offer is restraint.',
    readTime: '3 min read',
    featured: true,
  },
  {
    date: 'Apr 29, 2026',
    category: 'Strategic Clarity',
    title: 'Why Most Strategy Documents Are Actually Confusion Documents',
    excerpt: 'A strategy that requires a glossary to understand is not a strategy. It is a signal that the thinking has not been completed.',
    readTime: '6 min read',
    featured: false,
  },
  {
    date: 'Apr 22, 2026',
    category: 'Organisational Culture',
    title: 'The Meeting That Should Have Been an Email Was Actually a Power Play',
    excerpt: 'Time is the currency of authority. How leaders spend it, and how they ask others to spend it, says everything about culture.',
    readTime: '4 min read',
    featured: false,
  },
  {
    date: 'Apr 15, 2026',
    category: 'Executive Coaching',
    title: 'What Coaches Get Wrong About Accountability',
    excerpt: 'Accountability without clarity is just pressure. And pressure, applied without direction, rarely produces anything useful.',
    readTime: '5 min read',
    featured: false,
  },
  {
    date: 'Apr 8, 2026',
    category: 'Women in Leadership',
    title: 'The Confidence Gap Is Not the Problem. The Clarity Gap Is.',
    excerpt: 'We have spent years telling women to be more confident. What they actually needed was better tools for strategic thinking.',
    readTime: '7 min read',
    featured: false,
  },
  {
    date: 'Apr 1, 2026',
    category: 'Strategic Clarity',
    title: 'Three Questions That Reveal Whether Your Vision Is Real',
    excerpt: 'Most organisations have a vision statement. Very few have a vision. The difference shows up in the decisions leaders make under pressure.',
    readTime: '4 min read',
    featured: false,
  },
  {
    date: 'Mar 25, 2026',
    category: 'African Leadership',
    title: 'What African Institutions Can Teach the World About Resilience',
    excerpt: 'Resilience built under constraint is a different kind of strength. Africa has been developing that muscle for decades.',
    readTime: '8 min read',
    featured: false,
  },
];

const CATEGORIES = ['All', 'Strategic Clarity', 'Leadership & Communication', 'Organisational Culture', 'Executive Coaching', 'Women in Leadership', 'African Leadership'];

export default function Insights() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory);

  const featured = ARTICLES.filter(a => a.featured).slice(0, 3);
  const rest = filtered.filter(a => !a.featured);

  return (
    <main style={{ paddingTop: '6rem' }}>

      {/* HERO */}
      <section style={{ padding: '6rem 10vw 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, #1a120630 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="label">Insights</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 600, lineHeight: 1.05, maxWidth: '700px', marginBottom: '1.5rem' }}>
            Our Journal.
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.9, color: 'var(--text-mute)', maxWidth: '520px', fontWeight: 300 }}>
            Thinking on leadership, strategy, clarity and the invisible architecture of high-performing organisations. Written for leaders who take ideas seriously.
          </p>
        </div>
      </section>

      <div className="divider" />

      {/* FEATURED */}
      {activeCategory === 'All' && (
        <section className="section">
          <div className="section-inner">
            <div className="label">Featured</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1px', background: 'var(--border)', marginBottom: '1px' }} className="featured-grid">

              {/* MAIN FEATURED */}
              <div style={{ background: 'var(--bg-2)', padding: '3rem', cursor: 'pointer', transition: 'background 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-2)'}
              >
                <div style={{ aspectRatio: '16/9', background: '#1a1206', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="gold" style={{ fontSize: '2rem' }}>◇</span>
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.15em',  color: 'var(--accent)', marginBottom: '0.75rem' }}>
                  {featured[0].date} · {featured[0].category}
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 600, lineHeight: 1.25, marginBottom: '1rem' }}>{featured[0].title}</h2>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.8, color: 'var(--text-mute)', fontWeight: 300, marginBottom: '1.5rem' }}>{featured[0].excerpt}</p>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: 'var(--text-dim)' }}>{featured[0].readTime}</div>
              </div>

              {/* SIDE FEATURED */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
                {featured.slice(1).map((a, i) => (
                  <div key={i} style={{ background: 'var(--bg-2)', padding: '2rem', flex: 1, cursor: 'pointer', transition: 'background 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-2)'}
                  >
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.15em',  color: 'var(--accent)', marginBottom: '0.5rem' }}>
                      {a.date} · {a.category}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 500, lineHeight: 1.3, marginBottom: '0.75rem' }}>{a.title}</h3>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '12px', lineHeight: 1.7, color: 'var(--text-mute)', fontWeight: 300, marginBottom: '0.75rem' }}>{a.excerpt}</p>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: 'var(--text-dim)' }}>{a.readTime}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="divider" />

      {/* ALL ARTICLES */}
      <section className="section">
        <div className="section-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="label" style={{ marginBottom: 0 }}>All Stories</div>
          </div>

          {/* CATEGORY FILTERS */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.15em',
                textTransform: 'uppercase', padding: '8px 16px', cursor: 'pointer',
                transition: 'all 0.3s', background: activeCategory === cat ? 'var(--gold)' : 'transparent',
                color: activeCategory === cat ? 'var(--bg)' : 'var(--text-mute)',
                border: '1px solid', borderColor: activeCategory === cat ? 'var(--gold)' : '#ffffff0f',
              }}>{cat}</button>
            ))}
          </div>

          {/* ARTICLES GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }} className="articles-grid">
            {(activeCategory === 'All' ? rest : filtered).map((a, i) => (
              <div key={i} style={{ background: 'var(--bg-2)', padding: '2.5rem', cursor: 'pointer', transition: 'background 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.querySelector('h3').style.color = 'var(--gold)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.querySelector('h3').style.color = 'var(--text)'; }}
              >
                <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.15em',  color: 'var(--accent)', marginBottom: '0.75rem' }}>
                  {a.date}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: '0.75rem' }}>
                  {a.category}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 500, lineHeight: 1.3, marginBottom: '0.75rem', transition: 'color 0.3s' }}>{a.title}</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '12px', lineHeight: 1.7, color: 'var(--text-mute)', fontWeight: 300, marginBottom: '1rem' }}>{a.excerpt}</p>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: 'var(--text-dim)' }}>{a.readTime}</div>
              </div>
            ))}
          </div>

          {/* LOAD MORE */}
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <button className="btn btn-outline">Load More Stories</button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: '6rem 10vw', background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div className="label" style={{ justifyContent: 'center' }}>Stay Sharp</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 600, marginBottom: '1rem' }}>
            Get the Journal delivered.
          </h2>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.9, color: 'var(--text-mute)', fontWeight: 300, marginBottom: '2.5rem' }}>
            Quiet dispatches on leadership, strategy and clarity. No noise. No filler. Just thinking worth your time.
          </p>
          <div style={{ display: 'flex', gap: '1rem', maxWidth: '420px', margin: '0 auto' }} className="newsletter-row">
            <input className="form-input" type="email" placeholder="Your email address" style={{ flex: 1 }} />
            <button className="btn btn-gold" style={{ flexShrink: 0 }}>Subscribe →</button>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .featured-grid { grid-template-columns: 1fr !important; }
          .articles-grid { grid-template-columns: 1fr 1fr !important; }
          .newsletter-row { flex-direction: column !important; }
        }
        @media (max-width: 560px) {
          .articles-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
