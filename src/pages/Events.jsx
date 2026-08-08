import { useCallback, useEffect, useState } from 'react';
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

const TYPE_COLORS = {
  Convening: '#2d6a4f',
  Keynote: '#1a2535',
  Masterclass: '#3d1f00',
  Panel: '#2d2040',
  Workshop: '#1a3a2a',
};

export default function Events() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);
  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');

  const navigate = useNavigate();

  const loadPageData = useCallback(async () => {
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user || null;
      setUser(currentUser);

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('start_date', { ascending: true });

      if (eventError) {
        console.error('Error loading events:', eventError);
        setEvents([]);
      } else {
        setEvents(eventData || []);
      }

      if (currentUser) {
        const { data: registrationData, error: registrationError } =
          await supabase
            .from('registrations')
            .select('event_id')
            .eq('user_id', currentUser.id);

        if (registrationError) {
          console.error(
            'Error loading registrations:',
            registrationError
          );
          setRegistered([]);
        } else {
          setRegistered(
            (registrationData || []).map(
              (registration) => registration.event_id
            )
          );
        }
      } else {
        setRegistered([]);
      }
    } catch (error) {
      console.error('Error loading events page:', error);
      setEvents([]);
      setRegistered([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const handleRegister = async (event) => {
    setRegSuccess('');
    setRegError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!event?.id) {
      setRegError(
        'This event is not properly configured. Please contact us.'
      );
      return;
    }

    if (registered.includes(event.id)) {
      setRegError('You have already registered for this event.');
      return;
    }

    setRegistering(event.id);

    try {
      const { error } = await supabase
        .from('registrations')
        .insert({
          event_id: event.id,
          user_id: user.id,
          status: 'pending',
          payment_status: 'pending',
        });

      if (error) {
        console.error('Registration error:', error);

        if (error.code === '23505') {
          setRegError(
            'You have already registered for this event.'
          );
        } else {
          setRegError(
            error.message ||
              'Something went wrong while registering. Please try again.'
          );
        }

        return;
      }

      setRegistered((current) => [...current, event.id]);

      setRegSuccess(
        `Successfully registered for ${event.title}. Pending payment verification.`
      );

      setTimeout(() => {
        setRegSuccess('');
      }, 6000);
    } catch (error) {
      console.error('Unexpected registration error:', error);
      setRegError(
        'Something went wrong while registering. Please try again.'
      );
    } finally {
      setRegistering(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return {
        month: '',
        day: '',
        year: '',
      };
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return {
        month: '',
        day: '',
        year: '',
      };
    }

    return {
      month: date
        .toLocaleDateString('en-US', {
          month: 'short',
        })
        .toUpperCase(),
      day: date
        .toLocaleDateString('en-US', {
          day: '2-digit',
        }),
      year: date.getFullYear(),
    };
  };

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === '' ||
      Number(price) === 0
    ) {
      return 'Free';
    }

    return `₦${Number(price).toLocaleString('en-NG')}`;
  };

  const upcomingEvents = events.filter(
    (event) =>
      event.status === 'upcoming' ||
      event.status === 'ongoing' ||
      !event.status
  );

  const isPastEvent = (event) =>
    event.status === 'completed' ||
    (event.start_date &&
      new Date(event.start_date).getTime() < Date.now());

  const databasePastEvents = events.filter(isPastEvent);

  if (loading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          paddingTop: '6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            color: 'var(--text-mute)',
            fontFamily: 'var(--sans)',
            fontSize: '13px',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              color: 'var(--accent)',
              marginBottom: '1rem',
            }}
          >
            ◇
          </div>
          Loading events...
        </div>
      </main>
    );
  }

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
                  {regSuccess}

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

              {upcomingEvents.length === 0 ? (
                <div
                  style={{
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--border)',
                    marginBottom: '4rem',
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
                      fontSize: '1.5rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    No Upcoming Events
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '13px',
                      color: 'var(--text-mute)',
                    }}
                  >
                    New events will appear here when they are
                    announced.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1px',
                    background: 'var(--border)',
                    marginBottom: '4rem',
                  }}
                >
                  {upcomingEvents.map((event) => {
                    const date = formatDate(event.start_date);
                    const isRegistered =
                      registered.includes(event.id);
                    const isRegistering =
                      registering === event.id;

                    return (
                      <div
                        key={event.id}
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
                            {date.month}
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
                            {date.day}
                          </div>

                          <div
                            style={{
                              fontFamily: 'var(--sans)',
                              fontSize: '10px',
                              color: 'var(--text-mute)',
                            }}
                          >
                            {date.year}
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
                                  TYPE_COLORS[
                                    event.event_type
                                  ] || '#1a1a1a',
                                color: '#ffffff',
                              }}
                            >
                              {event.event_type || 'Event'}
                            </span>

                            <span
                              style={{
                                fontFamily: 'var(--sans)',
                                fontSize: '10px',
                                color: 'var(--text-mute)',
                              }}
                            >
                              {event.location || 'Location TBA'}
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
                            {event.description ||
                              'Join us for an engaging leadership experience designed to promote strategic thinking, meaningful dialogue and growth.'}
                          </p>

                          {(event.early_bird_price ||
                            event.price) && (
                            <div
                              style={{
                                display: 'flex',
                                gap: '2rem',
                                margin: '0.75rem 0',
                                flexWrap: 'wrap',
                              }}
                            >
                              {event.early_bird_price && (
                                <div>
                                  <div
                                    style={{
                                      fontFamily: 'var(--sans)',
                                      fontSize: '9px',
                                      letterSpacing: '0.15em',
                                      textTransform:
                                        'uppercase',
                                      color:
                                        'var(--text-mute)',
                                      marginBottom: '2px',
                                    }}
                                  >
                                    Early Bird
                                  </div>

                                  <div
                                    style={{
                                      fontFamily:
                                        'var(--serif)',
                                      fontSize: '1.2rem',
                                      fontWeight: 600,
                                      color: 'var(--accent)',
                                    }}
                                  >
                                    {formatPrice(
                                      event.early_bird_price
                                    )}
                                  </div>
                                </div>
                              )}

                              {event.price > 0 && (
                                <div>
                                  <div
                                    style={{
                                      fontFamily: 'var(--sans)',
                                      fontSize: '9px',
                                      letterSpacing: '0.15em',
                                      textTransform:
                                        'uppercase',
                                      color:
                                        'var(--text-mute)',
                                      marginBottom: '2px',
                                    }}
                                  >
                                    Registration
                                  </div>

                                  <div
                                    style={{
                                      fontFamily:
                                        'var(--serif)',
                                      fontSize: '1.2rem',
                                      fontWeight: 600,
                                      color:
                                        'var(--text-dim)',
                                    }}
                                  >
                                    {formatPrice(
                                      event.price
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {event.capacity && (
                            <div
                              style={{
                                fontFamily: 'var(--sans)',
                                fontSize: '10px',
                                color: 'var(--gold)',
                                letterSpacing: '0.05em',
                              }}
                            >
                              Limited to {event.capacity}{' '}
                              participants
                            </div>
                          )}
                        </div>

                        {/* CTA */}
                        <div style={{ flexShrink: 0 }}>
                          <button
                            className="btn btn-gold"
                            style={{
                              fontSize: '9px',
                              whiteSpace: 'nowrap',
                              opacity:
                                isRegistered ||
                                isRegistering
                                  ? 0.65
                                  : 1,
                            }}
                            disabled={
                              isRegistered ||
                              isRegistering
                            }
                            onClick={() =>
                              handleRegister(event)
                            }
                          >
                            {isRegistering
                              ? 'Registering...'
                              : isRegistered
                              ? 'Registered ✓'
                              : 'Register'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

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
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(3, 1fr)',
                  gap: '1px',
                  background: 'var(--border)',
                }}
                className="past-grid"
              >
                {[
                  ...databasePastEvents,
                  ...(databasePastEvents.length === 0
                    ? PAST_EVENTS
                    : []),
                ].map((event, index) => {
                  const isDatabaseEvent =
                    Boolean(event.id);

                  return (
                    <div
                      key={
                        isDatabaseEvent
                          ? event.id
                          : `${event.title}-${index}`
                      }
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
                          alignItems:
                            'flex-start',
                          marginBottom: '1.5rem',
                        }}
                      >
                        <span
                          style={{
                            fontFamily:
                              'var(--sans)',
                            fontSize: '9px',
                            letterSpacing:
                              '0.15em',
                            textTransform:
                              'uppercase',
                            padding: '4px 10px',
                            background:
                              TYPE_COLORS[
                                event.event_type ||
                                  event.type
                              ] ||
                              '#1a1a1a',
                            color: '#ffffff',
                          }}
                        >
                          {event.event_type ||
                            event.type ||
                            'Event'}
                        </span>

                        <span
                          style={{
                            fontFamily:
                              'var(--sans)',
                            fontSize: '11px',
                            color:
                              'var(--text-mute)',
                          }}
                        >
                          {event.year ||
                            (event.start_date
                              ? new Date(
                                  event.start_date
                                ).getFullYear()
                              : '')}
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
                          fontFamily:
                            'var(--sans)',
                          fontSize: '10px',
                          color:
                            'var(--accent)',
                          letterSpacing:
                            '0.05em',
                          marginBottom: '1rem',
                        }}
                      >
                        {event.location ||
                          'Location TBA'}
                      </div>

                      <p
                        style={{
                          fontFamily:
                            'var(--sans)',
                          fontSize: '12px',
                          lineHeight: 1.7,
                          color:
                            'var(--text-mute)',
                          fontWeight: 300,
                        }}
                      >
                        {event.description ||
                          event.desc ||
                          ''}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

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