import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const BOOK_DETAILS = [
  {
    title: "Facilitator's Edge",
    year: '2026',
    color: '#f0f0f0',
    cover: 'https://res.cloudinary.com/djxprptlf/image/upload/facilitatorsedgecover.png', 
    pages: '317',
    selarLink: 'https://selar.com/4v1t25s437',
    category: 'Leadership Symposium',
    description: "Facilitator's Edge is a practical and philosophical guide for anyone who leads groups, teams or conversations toward meaningful outcomes. Dr. Asma'u Isah Maibasira draws from over a decade of facilitation experience across boardrooms, government chambers and development forums to offer a framework that transforms the art of facilitation into a strategic leadership discipline.",
    themes: ['Strategic facilitation', 'Group dynamics', 'Leadership presence', 'Outcome design'],
  },
  {
    title: 'Business Geeks',
    year: '2024',
    color: '#1c2d1e',
    cover: 'https://res.cloudinary.com/djxprptlf/image/upload/businessgeekcoverr.png',
    pages: '288',
    selarLink: 'https://selar.com/70w0736ar6',
    category: 'Business Innovation and Strategy',
    description: "Business Geek is your practical roadmap to starting a profitable business, even with little or no capital. Whether you are a fresh graduate, a stay at home parent, or someone tired of waiting for the perfect job, this book gives you 100 actionable business ideas across agriculture, online services, fashion, food, health, and more. No fluff. No unrealistic promises. Just real opportunities you can start today with what you already have. If you have ever felt stuck or doubted your ability to become an entrepreneur, let this book show you how to turn your skills, passion, and even spare time into a sustainable source of income.",
    themes: ['Strategic clarity', 'Decision-making', 'Communication', 'Organisational thinking'],
  },
  {
    title: 'From Complexity to Clarity',
    year: '2021',
    color: '#1a2535',
    pages: '224',
    category: 'Organisational Strategy',
    description: 'A step-by-step guide to untangling organisational complexity and building systems that perform with consistency. This book has become required reading in several executive development programmes across Nigeria and Kenya, offering both diagnostic tools and implementation frameworks.',
    themes: ['Systems thinking', 'Organisational design', 'Strategy execution', 'Change management'],
  },
  {
    title: 'The Women Who Build',
    year: '2020',
    color: '#2d1a22',
    pages: '196',
    category: 'Women in Leadership',
    description: "A landmark collection of conversations, reflections and frameworks celebrating women who are quietly building Africa's future. Dr. Asma'u profiles fifteen women leaders across sectors and extracts transferable principles of resilience, strategy and impact for the next generation.",
    themes: ['Women leadership', 'Resilience', 'African development', 'Mentorship'],
  },
  {
    title: 'Strategic Africa',
    year: '2019',
    color: '#251d10',
    pages: '240',
    category: 'Continental Strategy',
    description: "Strategic Africa is Dr. Asma'u's first major work  a bold reimagining of how African leaders and institutions must think about strategy in the 21st century. Written at the intersection of geopolitics, business and leadership, it has been described as essential reading for anyone serious about Africa's global standing.",
    themes: ['African strategy', 'Geopolitics', 'Institutional leadership', 'Vision'],
  },
];

  export default function Books() {
  const [selected, setSelected] = useState(0);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const book = searchParams.get('book');
    if (book !== null) setSelected(parseInt(book));
  }, [searchParams]);

  return (
    <main style={{ paddingTop: '6rem' }}>

      {/* HERO */}
      <section style={{ padding: '6rem 10vw 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, #1a120630 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="label">The Library</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 600, lineHeight: 1.05, maxWidth: '1220px', marginBottom: '1.5rem' }}>
            A body of work built for leaders of consequence.
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.9, color: 'var(--text-mute)', maxWidth: '1220px', fontWeight: 300 }}>
            Each book is a distillation of years of practice, research and direct engagement with leaders and institutions across Africa and the world.
          </p>
        </div>
      </section>

      <div className="divider" />

      {/* BOOKS BROWSER */}
      <section className="section">
        <div className="section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '5rem', alignItems: 'start' }} className="books-layout">

            {/* BOOK LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
              {BOOK_DETAILS.map((b, i) => (
                <div key={i} onClick={() => setSelected(i)} style={{
                  display: 'flex', gap: '1.5rem', alignItems: 'center',
                  padding: '1.5rem', background: selected === i ? 'var(--bg-3)' : 'var(--bg-2)',
                  borderLeft: selected === i ? '2px solid var(--gold)' : '2px solid transparent',
                  cursor: 'pointer', transition: 'all 0.3s',
                }}>
                  <div style={{
                    width: '50px', height: '70px', background: b.color, flexShrink: 0,
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--gold)' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.25rem', color: selected === i ? 'var(--text)' : 'var(--text-mid)' }}>
                      {b.title}
                    </div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: 'var(--text-mute)', letterSpacing: '0.1em' }}>
                      {b.year} · {b.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BOOK DETAIL */}
            <div>
             <div style={{
                  width: '180px', height: '250px', background: BOOK_DETAILS[selected].color,
                  position: 'relative', overflow: 'hidden', marginBottom: '2.5rem',
                  boxShadow: '20px 20px 60px rgba(0,0,0,0.5)',
                }}>
                  {BOOK_DETAILS[selected].cover ? (
                    <img src={BOOK_DETAILS[selected].cover} alt={BOOK_DETAILS[selected].title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gold)' }} />
                      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                        <div style={{ fontFamily: 'var(--sans)', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a96e66', marginBottom: '0.4rem' }}>NAIM Strategies</div>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 500, lineHeight: 1.3, color: 'var(--text)', marginBottom: '0.4rem' }}>{BOOK_DETAILS[selected].title}</div>
                        <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: 'var(--text-mute)' }}>{BOOK_DETAILS[selected].year}</div>
                         </div>
                          </>
                        )}
                      </div>

              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.9, color: 'var(--text-mute)', fontWeight: 300, marginBottom: '2rem' }}>
                {BOOK_DETAILS[selected].description}
              </p>

              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',  color: 'var(--accent)', marginBottom: '1rem' }}>
                  Key Themes
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {BOOK_DETAILS[selected].themes.map((t, i) => (
                    <span key={i} style={{
                      fontFamily: 'var(--sans)', fontSize: '10px', padding: '6px 14px',
                      border: '1px solid var(--border-mid)', color: 'var(--text-mute)',
                      letterSpacing: '0.05em',
                    }}>{t}</span>
                  ))}
                </div>
              </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
  {BOOK_DETAILS[selected].selarLink ? (
    <a className="btn btn-gold" href={BOOK_DETAILS[selected].selarLink} target="_blank" rel="noreferrer">
      Buy Now →
              </a>
            ) : (
              <span className="btn btn-gold" style={{ opacity: 0.5, cursor: 'default' }}>
                Coming Soon
              </span>
            )}
            <a className="btn btn-outline" href="/contact">Request Signed Copy</a>
          </div>
        </div>
      </div>
    </div>
      </section>

      <style>{`
        @media (max-width: 800px) {
          .books-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
