import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
    month: 'AUG',
    day: '05',
    year: '2026',
    title: 'A One Day Business Growth Workshop',
    location: 'Abuja, Nigeria',
    type: 'Workshop',
    spots: 'Limited slots available',
    desc: 'A practical workshop designed for women entrepreneurs who want to increase sales, build a powerful brand, and scale sustainably. Gain sales and marketing strategies, personal branding tools, business systems and a 90-day growth action plan.',
    earlyBird: '50,000',
    lateReg: '65,000',
    registerLink:
      'https://wa.me/2347448225848?text=I%20would%20like%20to%20register%20for%20the%20Business%20Growth%20Workshop',
  },
  {
    month: 'SEP',
    day: '18',
    year: '2026',
    title: 'Executive Clarity Masterclass',
    location: 'Lagos, Nigeria',
    type: 'Masterclass',
    spots: 'Limited to 20 participants',
    desc: 'A one-day intensive for senior executives seeking to sharpen their strategic thinking and decision-making frameworks.',
    registerLink: '/contact',
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
    registerLink: '/contact',
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
    registerLink: '/contact',
  },
];

const TYPE_COLORS = {
  Convening: '#2d6a4f',
  Keynote: '#1a2535',
  Masterclass: '#3d1f00',
  Panel: '#2d2040',
  Workshop: '#1a3a2a',
};

export default function Events() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [user, setUser] = useState(null);
  const [registering, setRegistering] = useState(null);
  const [registered, setRegistered] = useState([]);
  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');

  /*
   * AUTHENTICATION
   *
   * Get the current session when the page loads and
   * keep the user state synchronized with Supabase auth.
   */
  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        const { data, error } = await supabase
          .from('registrations')
          .select('event_id')
          .eq('user_id', currentUser.id);

        if (!mounted) return;

        if (!error) {
          setRegistered(data?.map((registration) => registration.event_id) || []);
        }
      } else {
        setRegistered([]);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      const currentUser = session?.user || null;
      setUser(currentUser);

      if (!currentUser) {
        setRegistered([]);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /*
   * Clear old error/success messages whenever
   * the user switches between Upcoming and Past events.
   */
  useEffect(() => {
    setRegSuccess('');
    setRegError('');
  }, [activeTab]);

  /*
   * EVENT REGISTRATION
   */
  const handleRegister = async (event) => {
    setRegSuccess('');
    setRegError('');

    /*
     * External registration links such as WhatsApp
     * do not require an account.
     */
    if (event.registerLink?.startsWith('http')) {
      window.open(event.registerLink, '_blank', 'noopener,noreferrer');
      return;
    }

    /*
     * Internal registrations require authentication.
     */
    if (!user) {
      navigate('/login');
      return;
    }

    /*
     * Prevent multiple clicks while registration
     * is being processed.
     */
    if (registering === event.title) {
      return;
    }

    setRegistering(event.title);

    try {
      /*
       * Find the event in the database.
       */
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('id')
        .eq('title', event.title)
        .single();

      if (eventError || !eventData) {
        setRegError(
          'Event not found in the system. Please contact us directly.'
        );
        return;
      }

      /*
       * Check whether the user has already registered.
       * This avoids unnecessary database errors and gives
       * the user a better experience.
       */
      if (registered.includes(eventData.id)) {
        setRegError('You have already registered for this event.');
        return;
      }

      /*
       * Create registration.
       */
      const { error: registrationError } = await supabase
        .from('registrations')
        .insert({
          event_id: eventData.id,
          user_id: user.id,
          status: 'pending',
          payment_status: 'pending',
        });

      if (registrationError) {
        if (registrationError.code === '23505') {
          setRegError('You have already registered for this event.');
        } else {
          console.error(
            'Registration error:',
            registrationError
          );

          setRegError(
            'Something went wrong while registering. Please try again.'
          );
        }

        return;
      }

      /*
       * Functional state update prevents stale-state
       * problems if multiple state changes happen quickly.
       */
      setRegistered((previous) => [
        ...previous,
        eventData.id,
      ]);

      setRegSuccess(
        `Successfully registered for ${event.title}. Pending payment verification.`
      );
    } catch (error) {
      console.error('Unexpected registration error:', error);

      setRegError(
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setRegistering(null);
    }
  };

  /*
   * Determine whether an event has already been registered for.
   */
  const isRegistered = (eventTitle) => {
    return UPCOMING.some((event) => {
      if (event.title !== eventTitle) return false;

      return false;
    });
  };

  return (
    <main style={{ paddingTop: '6rem' }}>
      {/* HERO */}
      <section
        style={{
          padding: '6rem 10vw 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 70% 50%, #1a120630 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1300px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div className="label">Events & Experiences</div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 600,
              lineHeight: 1.05,
              maxWidth: '700px',
              marginBottom: '1.5rem',
            }}
          >
            Where leaders gather to think clearly.
          </h1>

          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              lineHeight: 1.9,
              color: 'var(--text-mute)',
              maxWidth: '520px',
              fontWeight: 300,
            }}
          >
            From intimate masterclasses to continental convenings,
            every NAIM event is designed as a space for rigorous
            thinking, honest dialogue and transformative connection.
          </p>
        </div>
      </section>

      <div className="divider" />

      {/* TABS */}
      <section className="section">
        <div className="section-inner">
          {/* TAB SWITCHER */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              marginBottom: '4rem',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {['upcoming', 'past'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '1rem 2rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom:
                    activeTab === tab
                      ? '2px solid var(--gold)'
                      : '2px solid transparent',
                  color:
                    activeTab === tab
                      ? 'var(--gold)'
                      : 'var(--text-mute)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  marginBottom: '-1px',
                }}
              >
                {tab === 'upcoming'
                  ? 'Upcoming Events'
                  : 'Past Events'}
              </button>
            ))}
          </div>

          {/* UPCOMING EVENTS */}
          {activeTab === 'upcoming' && (
            <div>
              {/* SUCCESS MESSAGE */}
              {regSuccess && (
                <div
                  style={{
                    background: '#f0fff4',
                    border: '1px solid #b2dfdb',
                    borderLeft: '4px solid #2e7d32',
                    padding: '1rem 1.5rem',
                    marginBottom: '2rem',
                    fontFamily: 'var(--sans)',
                    fontSize: '13px',
                    color: '#1b5e20',
                  }}
                >
                  <div>{regSuccess}</div>

                  <div style={{ marginTop: '0.5rem' }}>
                    <a
                      href="/dashboard/events"
                      style={{
                        color: '#1b5e20',
                        fontWeight: 600,
                      }}
                    >
                      View in Dashboard →
                    </a>
                  </div>
                </div>
              )}

              {/* ERROR MESSAGE */}
              {regError && (
                <div
                  style={{
                    background: '#fff0f0',
                    border: '1px solid #ffcccc',
                    borderLeft: '4px solid #cc0000',
                    padding: '1rem 1.5rem',
                    marginBottom: '2rem',
                    fontFamily: 'var(--sans)',
                    fontSize: '13px',
                    color: '#cc0000',
                  }}
                >
                  {regError}
                </div>
              )}

              {/* EVENT LIST */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                  background: 'var(--border)',
                  marginBottom: '4rem',
                }}
              >
                {UPCOMING.map((event, index) => {
                  const alreadyRegistered =
                    registered.includes(event.id);

                  return (
                    <div
                      key={event.title || index}
                      className="event-row"
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          '100px 1fr auto',
                        gap: '3rem',
                        alignItems: 'center',
                        padding: '2.5rem',
                        background: 'var(--bg-2)',
                        transition: 'background 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'var(--bg-3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'var(--bg-2)';
                      }}
                    >
                      {/* DATE */}
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontFamily: 'var(--sans)',
                            fontSize: '10px',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'var(--accent)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {event.month}
                        </div>

                        <div
                          style={{
                            fontFamily: 'var(--serif)',
                            fontSize: '3rem',
                            fontWeight: 400,
                            lineHeight: 1,
                            color: 'var(--text)',
                          }}
                        >
                          {event.day}
                        </div>

                        <div
                          style={{
                            fontFamily: 'var(--sans)',
                            fontSize: '10px',
                            color: 'var(--text-mute)',
                          }}
                        >
                          {event.year}
                        </div>
                      </div>

                      {/* DETAILS */}
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center',
                            marginBottom: '0.75rem',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--sans)',
                              fontSize: '9px',
                              letterSpacing: '0.15em',
                              textTransform: 'uppercase',
                              padding: '4px 10px',
                              background:
                                TYPE_COLORS[event.type] ||
                                '#1a1a1a',
                              color: '#ffffff',
                            }}
                          >
                            {event.type}
                          </span>

                          <span
                            style={{
                              fontFamily: 'var(--sans)',
                              fontSize: '10px',
                              color: 'var(--text-mute)',
                            }}
                          >
                            {event.location}
                          </span>
                        </div>

                        <h3
                          style={{
                            fontSize: '1.5rem',
                            fontWeight: 500,
                            marginBottom: '0.5rem',
                          }}
                        >
                          {event.title}
                        </h3>

                        <p
                          style={{
                            fontFamily: 'var(--sans)',
                            fontSize: '12px',
                            lineHeight: 1.7,
                            color: 'var(--text-mute)',
                            fontWeight: 300,
                            marginBottom: '0.75rem',
                          }}
                        >
                          {event.desc}
                        </p>

                        {/* PRICING */}
                        {event.earlyBird && (
                          <div
                            style={{
                              display: 'flex',
                              gap: '2rem',
                              margin: '0.75rem 0',
                              flexWrap: 'wrap',
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontFamily: 'var(--sans)',
                                  fontSize: '9px',
                                  letterSpacing: '0.15em',
                                  textTransform:
                                    'uppercase',
                                  color: 'var(--text-mute)',
                                  marginBottom: '2px',
                                }}
                              >
                                Early Bird
                              </div>

                              <div
                                style={{
                                  fontFamily: 'var(--serif)',
                                  fontSize: '1.2rem',
                                  fontWeight: 600,
                                  color: 'var(--accent)',
                                }}
                              >
                                &#8358;{event.earlyBird}
                              </div>
                            </div>

                            <div>
                              <div
                                style={{
                                  fontFamily: 'var(--sans)',
                                  fontSize: '9px',
                                  letterSpacing: '0.15em',
                                  textTransform:
                                    'uppercase',
                                  color: 'var(--text-mute)',
                                  marginBottom: '2px',
                                }}
                              >
                                Late Registration
                              </div>

                              <div
                                style={{
                                  fontFamily: 'var(--serif)',
                                  fontSize: '1.2rem',
                                  fontWeight: 600,
                                  color: 'var(--text-dim)',
                                }}
                              >
                                &#8358;{event.lateReg}
                              </div>
                            </div>
                          </div>
                        )}

                        <div
                          style={{
                            fontFamily: 'var(--sans)',
                            fontSize: '10px',
                            color: 'var(--gold)',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {event.spots}
                        </div>
                      </div>

                      {/* CTA */}
                      <div style={{ flexShrink: 0 }}>
                        <button
                          className="btn btn-gold"
                          style={{
                            fontSize: '9px',
                            whiteSpace: 'nowrap',
                          }}
                          disabled={
                            registering === event.title
                          }
                          onClick={() =>
                            handleRegister(event)
                          }
                        >
                          {registering === event.title
                            ? 'Registering...'
                            : alreadyRegistered
                            ? 'Registered ✓'
                            : 'Register'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PRIVATE SESSION CTA */}
              <div
                style={{
                  border: '1px solid #c9a96e1a',
                  padding: '4rem',
                  background: 'var(--bg-2)',
                  textAlign: 'center',
                }}
              >
                <div
                  className="gold"
                  style={{
                    fontSize: '2rem',
                    marginBottom: '1rem',
                  }}
                >
                  ◇
                </div>

                <h3
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                  }}
                >
                  Need a Private Session?
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '13px',
                    lineHeight: 1.9,
                    color: 'var(--text-mute)',
                    maxWidth: '480px',
                    margin: '0 auto 2rem',
                    fontWeight: 300,
                  }}
                >
                  NAIM Strategies delivers bespoke in-house
                  masterclasses, retreats and strategy sessions
                  for organisations and executive teams.
                </p>

                <a
                  className="btn btn-gold"
                  href="/contact"
                >
                  Request a Private Session
                </a>
              </div>
            </div>
          )}

          {/* PAST EVENTS */}
          {activeTab === 'past' && (
            <div
              className="past-grid"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(3, 1fr)',
                gap: '1px',
                background: 'var(--border)',
              }}
            >
              {PAST_EVENTS.map((event, index) => (
                <div
                  key={`${event.title}-${index}`}
                  style={{
                    background: 'var(--bg-2)',
                    padding: '2.5rem',
                    transition: 'background 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'var(--bg-3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'var(--bg-2)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '9px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        background:
                          TYPE_COLORS[event.type] ||
                          '#1a1a1a',
                        color: '#ffffff',
                      }}
                    >
                      {event.type}
                    </span>

                    <span
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '11px',
                        color: 'var(--text-mute)',
                      }}
                    >
                      {event.year}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 500,
                      lineHeight: 1.3,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {event.title}
                  </h3>

                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '10px',
                      color: 'var(--accent)',
                      letterSpacing: '0.05em',
                      marginBottom: '1rem',
                    }}
                  >
                    {event.location}
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '12px',
                      lineHeight: 1.7,
                      color: 'var(--text-mute)',
                      fontWeight: 300,
                    }}
                  >
                    {event.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 900px) {
          .event-row {
            grid-template-columns: 80px 1fr !important;
          }

          .event-row > div:last-child {
            grid-column: 2;
          }

          .past-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 560px) {
          .event-row {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }

          .event-row > div:last-child {
            grid-column: 1;
          }

          .past-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}