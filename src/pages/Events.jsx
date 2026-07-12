import { useState } from 'react';

const PAST_EVENTS = [
  {
    year: '2025',
    title: 'Strategic Leadership Forum',
    location: 'Abuja, Nigeria',
    type: 'Convening',
    desc: 'An invitation-only gathering of 80 senior executives and public sector leaders exploring the theme: Building Institutions That Outlast Their Founders.',
  },
  {
    year: '2025',
    title: 'Women as Peace Agents Panel',
    location: 'International Peace Summit',
    type: 'Keynote',
    desc: "Dr. Asma'u delivered a keynote on the strategic role of women in post-conflict institutional rebuilding across the African continent.",
  },
  {
    year: '2024',
    title: 'AIDS 2024 Podium Address',
    location: 'International AIDS Society',
    type: 'Keynote',
    desc: 'A landmark address on leadership, systems thinking and the human dimensions of institutional response to global health challenges.',
  },
  {
    year: '2024',
    title: 'Africa Women Summit',
    location: 'Abuja, Nigeria',
    type: 'Convening',
    desc: "Africa Rising Chapter convening bringing together women leaders across sectors to examine Africa's emerging leadership landscape.",
  },
  {
    year: '2023',
    title: 'Customs Officers Leadership Session',
    location: 'Nigeria Customs Service',
    type: 'Masterclass',
    desc: 'A bespoke leadership masterclass for senior customs officers focused on institutional culture, strategic clarity and public service excellence.',
  },
  {
    year: '2023',
    title: 'African Development Forum',
    location: 'Addis Ababa, Ethiopia',
    type: 'Panel',
    desc: 'Panel moderator and speaker on the theme of strategic human capital development as a driver of continental growth.',
  },
];

const UPCOMING = [
  {
    month: 'SEP',
    day: '18',
    year: '2026',
    title: 'Executive Clarity Masterclass',
    location: 'Lagos, Nigeria',
    type: 'Masterclass',
    spots: 'Limited to 20 participants',
    desc: 'A one-day intensive for senior executives seeking to sharpen their strategic thinking and decision-making frameworks.',
  },
  {
    month: 'OCT',
    day: '09',
    year: '2026',
    title: 'NAIM Annual Leadership Convening',
    location: 'Abuja, Nigeria',
    type: 'Convening',
    spots: 'By invitation only',
    desc: 'The flagship annual gathering of NAIM Strategies alumni, partners and the broader leadership community.',
  },
  {
    month: 'NOV',
    day: '14',
    year: '2026',
    title: 'Commonwealth Business Forum',
    location: 'London, United Kingdom',
    type: 'Keynote',
    spots: 'Open registration',
    desc: "Dr. Asma'u will deliver a keynote address on African institutional leadership and global competitiveness.",
  },
];

const TYPE_COLORS = {
  Convening: '#2d6a4f',
  Keynote: '#1a2535',
  Masterclass: '#3d1f00',
  Panel: '#2d2040',
};

export default function Events() {
  const [activeTab, setActiveTab] = useState('upcoming');

  return (
    <main style={{ paddingTop: '6rem' }}>

      {/* HERO */}
      <section style={{ padding: '6rem 10vw 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, #1a120630 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="label">Events & Experiences</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 600, lineHeight: 1.05, maxWidth: '700px', marginBottom: '1.5rem' }}>
            Where leaders gather to think clearly.
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.9, color: 'var(--text-mute)', maxWidth: '520px', fontWeight: 300 }}>
            From intimate masterclasses to continental convenings  every NAIM event is designed as a space for rigorous thinking, honest dialogue and transformative connection.
          </p>
        </div>
      </section>

      <div className="divider" />

      {/* TABS */}
      <section className="section">
        <div className="section-inner">

          {/* TAB SWITCHER */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '4rem', borderBottom: '1px solid var(--border)' }}>
            {['upcoming', 'past'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                padding: '1rem 2rem', background: 'transparent', border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--gold)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--gold)' : 'var(--text-mute)',
                cursor: 'pointer', transition: 'all 0.3s', marginBottom: '-1px',
              }}>
                {tab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
              </button>
            ))}
          </div>

          {/* UPCOMING EVENTS */}
          {activeTab === 'upcoming' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', marginBottom: '4rem' }}>
                {UPCOMING.map((e, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '100px 1fr auto',
                    gap: '3rem', alignItems: 'center', padding: '2.5rem',
                    background: 'var(--bg-2)', transition: 'background 0.3s',
                  }}
                    onMouseEnter={el => el.currentTarget.style.background = 'var(--bg-3)'}
                    onMouseLeave={el => el.currentTarget.style.background = 'var(--bg-2)'}
                    className="event-row"
                  >
                    {/* DATE */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',  color: 'var(--accent)', marginBottom: '0.25rem' }}>{e.month}</div>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: '3rem', fontWeight: 400, lineHeight: 1, color: 'var(--text)' }}>{e.day}</div>
                      <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: 'var(--text-mute)' }}>{e.year}</div>
                    </div>

                    {/* DETAILS */}
                    <div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{
                          fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.15em',
                          textTransform: 'uppercase', padding: '4px 10px',
                          background: TYPE_COLORS[e.type] || '#1a1a1a', color: 'var(--text-mid)',
                        }}>{e.type}</span>
                        <span style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: 'var(--text-mute)' }}>
                          {e.location}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '0.5rem' }}>{e.title}</h3>
                      <p style={{ fontFamily: 'var(--sans)', fontSize: '12px', lineHeight: 1.7, color: 'var(--text-mute)', fontWeight: 300, marginBottom: '0.5rem' }}>{e.desc}</p>
                      <div style={{ fontFamily: 'var(--sans)', fontSize: '10px',  color: 'var(--accent)', letterSpacing: '0.05em' }}>
                        {e.spots}
                      </div>
                    </div>

                    {/* CTA */}
                    <div style={{ flexShrink: 0 }}>
                      <button className="btn btn-gold" style={{ fontSize: '9px', whiteSpace: 'nowrap' }}>
                        Register →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* PRIVATE SESSION CTA */}
              <div style={{
                border: '1px solid #c9a96e1a', padding: '4rem',
                background: 'var(--bg-2)', textAlign: 'center',
              }}>
                <div className="gold" style={{ fontSize: '2rem', marginBottom: '1rem' }}>◇</div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '1rem' }}>
                  Need a Private Session?
                </h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.9, color: 'var(--text-mute)', maxWidth: '480px', margin: '0 auto 2rem', fontWeight: 300 }}>
                  NAIM Strategies delivers bespoke in-house masterclasses, retreats and strategy sessions for organisations and executive teams.
                </p>
                <button className="btn btn-gold">Request a Private Session →</button>
              </div>
            </div>
          )}

          {/* PAST EVENTS */}
          {activeTab === 'past' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }} className="past-grid">
              {PAST_EVENTS.map((e, i) => (
                <div key={i} style={{ background: 'var(--bg-2)', padding: '2.5rem', transition: 'background 0.3s' }}
                  onMouseEnter={el => el.currentTarget.style.background = 'var(--bg-3)'}
                  onMouseLeave={el => el.currentTarget.style.background = 'var(--bg-2)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <span style={{
                      fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.15em',
                      textTransform: 'uppercase', padding: '4px 10px',
                      background: TYPE_COLORS[e.type] || '#1a1a1a', color: 'var(--text-mid)',
                    }}>{e.type}</span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-mute)' }}>{e.year}</span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 500, lineHeight: 1.3, marginBottom: '0.5rem' }}>{e.title}</h3>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '10px',  color: 'var(--accent)', letterSpacing: '0.05em', marginBottom: '1rem' }}>{e.location}</div>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '12px', lineHeight: 1.7, color: 'var(--text-mute)', fontWeight: 300 }}>{e.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .event-row { grid-template-columns: 80px 1fr !important; }
          .event-row > div:last-child { grid-column: 2; }
          .past-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .event-row { grid-template-columns: 1fr !important; }
          .past-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
