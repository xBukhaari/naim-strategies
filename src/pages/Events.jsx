import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const TYPE_COLORS = {
  Convening: '#2d6a4f',
  Keynote: '#1a2535',
  Masterclass: '#3d1f00',
  Panel: '#2d2040',
  Workshop: '#1a3a2a',
  Retreat: '#3a2a1a',
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
    price === ''
  ) {
    return '0';
  }

  return Number(price).toLocaleString('en-NG');
};

export default function Events() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [registered, setRegistered] = useState([]);

  const [registering, setRegistering] = useState(null);
  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    loadPageData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);

        if (session?.user) {
          await loadRegistrations(
            session.user.id
          );
        } else {
          setRegistered([]);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadPageData = async () => {
    setLoading(true);

    const {
      data: eventData,
      error: eventError,
    } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('start_date', {
        ascending: true,
      });

    if (eventError) {
      console.error(
        'Error loading events:',
        eventError
      );
      setEvents([]);
      setRegError(
        'Unable to load events. Please refresh the page.'
      );
    } else {
      setEvents(eventData || []);
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    setUser(session?.user || null);

    if (session?.user) {
      await loadRegistrations(
        session.user.id
      );
    }

    setLoading(false);
  };

  const loadRegistrations = async (userId) => {
    const {
      data,
      error,
    } = await supabase
      .from('registrations')
      .select('event_id')
      .eq('user_id', userId);

    if (error) {
      console.error(
        'Error loading registrations:',
        error
      );
      return;
    }

    setRegistered(
      (data || []).map(
        (registration) =>
          registration.event_id
      )
    );
  };

  const handleRegister = async (event) => {
    setRegError('');
    setRegSuccess('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (registered.includes(event.id)) {
      setRegError(
        'You have already registered for this event.'
      );
      return;
    }

    setRegistering(event.id);

    try {
      /*
       * Check Supabase one more time before inserting.
       * This prevents duplicate registrations even if
       * the page state is stale.
       */
      const {
        data: existingRegistration,
        error: existingError,
      } = await supabase
        .from('registrations')
        .select('id')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      if (existingRegistration) {
        setRegistered((current) => [
          ...current,
          event.id,
        ]);

        setRegError(
          'You have already registered for this event.'
        );

        return;
      }

      /*
       * Check capacity if the event has one.
       */
      if (event.capacity) {
        const {
          count,
          error: countError,
        } = await supabase
          .from('registrations')
          .select('id', {
            count: 'exact',
            head: true,
          })
          .eq('event_id', event.id);

        if (countError) {
          throw countError;
        }

        if (
          count !== null &&
          count >= event.capacity
        ) {
          setRegError(
            'This event is currently full.'
          );
          return;
        }
      }

      /*
       * Create the registration.
       */
      const {
        error: registrationError,
      } = await supabase
        .from('registrations')
        .insert({
          event_id: event.id,
          user_id: user.id,
          status: 'pending',
          payment_status:
            Number(event.price || 0) > 0
              ? 'pending'
              : 'not_required',
        });

      if (registrationError) {
        if (
          registrationError.code === '23505'
        ) {
          setRegError(
            'You have already registered for this event.'
          );
        } else {
          throw registrationError;
        }

        return;
      }

      setRegistered((current) => [
        ...current,
        event.id,
      ]);

      setRegSuccess(
        `Successfully registered for ${event.title}.`
      );

      window.setTimeout(() => {
        setRegSuccess('');
      }, 6000);
    } catch (error) {
      console.error(
        'Registration error:',
        error
      );

      setRegError(
        error.message ||
          'Something went wrong while registering. Please try again.'
      );
    } finally {
      setRegistering(null);
    }
  };

  const upcomingEvents = events.filter(
    (event) =>
      event.status === 'upcoming' ||
      event.status === 'ongoing'
  );

  const pastEvents = events.filter(
    (event) =>
      event.status === 'completed'
  );

  const displayedEvents =
    activeTab === 'upcoming'
      ? upcomingEvents
      : pastEvents;

  if (loading) {
    return (
      <main
        style={{
          paddingTop: '6rem',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
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

          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              color: 'var(--text-mute)',
            }}
          >
            Loading events...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        paddingTop: '6rem',
      }}
    >
      {/* HERO */}
      <section
        style={{
          padding:
            '6rem 10vw 4rem',
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
          <div className="label">
            Events & Experiences
          </div>

          <h1
            style={{
              fontSize:
                'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 600,
              lineHeight: 1.05,
              maxWidth: '700px',
              marginBottom: '1.5rem',
            }}
          >
            Where leaders gather to think
            clearly.
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
            From intimate masterclasses to
            continental convenings, every NAIM
            event is designed as a space for
            rigorous thinking, honest dialogue
            and transformative connection.
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
              borderBottom:
                '1px solid var(--border)',
            }}
          >
            {[
              'upcoming',
              'past',
            ].map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() =>
                  setActiveTab(tab)
                }
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding:
                    '1rem 2rem',
                  background:
                    'transparent',
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
                  transition:
                    'all 0.3s',
                  marginBottom: '-1px',
                }}
              >
                {tab === 'upcoming'
                  ? 'Upcoming Events'
                  : 'Past Events'}
              </button>
            ))}
          </div>

          {/* SUCCESS MESSAGE */}
          {activeTab === 'upcoming' &&
            regSuccess && (
              <div
                style={{
                  background: '#f0fff4',
                  border:
                    '1px solid #b2dfdb',
                  borderLeft:
                    '4px solid #2e7d32',
                  padding:
                    '1rem 1.5rem',
                  marginBottom: '2rem',
                  fontFamily:
                    'var(--sans)',
                  fontSize: '13px',
                  color: '#1b5e20',
                }}
              >
                {regSuccess}

                <div
                  style={{
                    marginTop:
                      '0.5rem',
                  }}
                >
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
          {activeTab === 'upcoming' &&
            regError && (
              <div
                style={{
                  background: '#fff0f0',
                  border:
                    '1px solid #ffcccc',
                  borderLeft:
                    '4px solid #cc0000',
                  padding:
                    '1rem 1.5rem',
                  marginBottom: '2rem',
                  fontFamily:
                    'var(--sans)',
                  fontSize: '13px',
                  color: '#cc0000',
                }}
              >
                {regError}
              </div>
            )}

          {/* EVENT LIST */}
          {displayedEvents.length === 0 ? (
            <div
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                background:
                  'var(--bg-2)',
                border:
                  '1px solid var(--border)',
              }}
            >
              <div
                className="gold"
                style={{
                  fontSize: '2rem',
                  marginBottom:
                    '1rem',
                }}
              >
                ◇
              </div>

              <h3
                style={{
                  fontSize: '1.4rem',
                  marginBottom:
                    '0.75rem',
                }}
              >
                {activeTab ===
                'upcoming'
                  ? 'No Upcoming Events'
                  : 'No Past Events'}
              </h3>

              <p
                style={{
                  fontFamily:
                    'var(--sans)',
                  fontSize: '12px',
                  lineHeight: 1.8,
                  color:
                    'var(--text-mute)',
                }}
              >
                {activeTab ===
                'upcoming'
                  ? 'New events and experiences will appear here when they are published.'
                  : 'Completed events will appear here.'}
              </p>
            </div>
          ) : activeTab === 'upcoming' ? (
            <div
              style={{
                display: 'flex',
                flexDirection:
                  'column',
                gap: '1px',
                background:
                  'var(--border)',
                marginBottom:
                  '4rem',
              }}
            >
              {displayedEvents.map(
                (event) => {
                  const date =
                    formatDate(
                      event.start_date
                    );

                  const isRegistered =
                    registered.includes(
                      event.id
                    );

                  return (
                    <div
                      key={event.id}
                      className="event-row"
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          '100px 1fr auto',
                        gap: '3rem',
                        alignItems:
                          'center',
                        padding:
                          '2.5rem',
                        background:
                          'var(--bg-2)',
                        transition:
                          'background 0.3s',
                      }}
                      onMouseEnter={(
                        e
                      ) => {
                        e.currentTarget.style.background =
                          'var(--bg-3)';
                      }}
                      onMouseLeave={(
                        e
                      ) => {
                        e.currentTarget.style.background =
                          'var(--bg-2)';
                      }}
                    >
                      {/* DATE */}
                      <div
                        style={{
                          textAlign:
                            'center',
                        }}
                      >
                        <div
                          style={{
                            fontFamily:
                              'var(--sans)',
                            fontSize:
                              '10px',
                            letterSpacing:
                              '0.2em',
                            textTransform:
                              'uppercase',
                            color:
                              'var(--accent)',
                            marginBottom:
                              '0.25rem',
                          }}
                        >
                          {date.month}
                        </div>

                        <div
                          style={{
                            fontFamily:
                              'var(--serif)',
                            fontSize:
                              '3rem',
                            fontWeight:
                              400,
                            lineHeight:
                              1,
                            color:
                              'var(--text)',
                          }}
                        >
                          {date.day}
                        </div>

                        <div
                          style={{
                            fontFamily:
                              'var(--sans)',
                            fontSize:
                              '10px',
                            color:
                              'var(--text-mute)',
                          }}
                        >
                          {date.year}
                        </div>
                      </div>

                      {/* DETAILS */}
                      <div>
                        <div
                          style={{
                            display:
                              'flex',
                            gap:
                              '1rem',
                            alignItems:
                              'center',
                            marginBottom:
                              '0.75rem',
                            flexWrap:
                              'wrap',
                          }}
                        >
                          <span
                            style={{
                              fontFamily:
                                'var(--sans)',
                              fontSize:
                                '9px',
                              letterSpacing:
                                '0.15em',
                              textTransform:
                                'uppercase',
                              padding:
                                '4px 10px',
                              background:
                                TYPE_COLORS[
                                  event.event_type
                                ] ||
                                '#1a1a1a',
                              color:
                                '#ffffff',
                            }}
                          >
                            {event.event_type ||
                              'Event'}
                          </span>

                          <span
                            style={{
                              fontFamily:
                                'var(--sans)',
                              fontSize:
                                '10px',
                              color:
                                'var(--text-mute)',
                            }}
                          >
                            {event.location ||
                              'Location TBA'}
                          </span>
                        </div>

                        <h3
                          style={{
                            fontSize:
                              '1.5rem',
                            fontWeight:
                              500,
                            marginBottom:
                              '0.5rem',
                          }}
                        >
                          {event.title}
                        </h3>

                        <p
                          style={{
                            fontFamily:
                              'var(--sans)',
                            fontSize:
                              '12px',
                            lineHeight:
                              1.7,
                            color:
                              'var(--text-mute)',
                            fontWeight:
                              300,
                            marginBottom:
                              '0.75rem',
                          }}
                        >
                          {event.description ||
                            'More information about this event will be available soon.'}
                        </p>

                        {/* PRICING */}
                        {(event.price ||
                          event.early_bird_price) && (
                          <div
                            style={{
                              display:
                                'flex',
                              gap:
                                '2rem',
                              margin:
                                '0.75rem 0',
                              flexWrap:
                                'wrap',
                            }}
                          >
                            {event.early_bird_price && (
                              <div>
                                <div
                                  style={{
                                    fontFamily:
                                      'var(--sans)',
                                    fontSize:
                                      '9px',
                                    letterSpacing:
                                      '0.15em',
                                    textTransform:
                                      'uppercase',
                                    color:
                                      'var(--text-mute)',
                                    marginBottom:
                                      '2px',
                                  }}
                                >
                                  Early Bird
                                </div>

                                <div
                                  style={{
                                    fontFamily:
                                      'var(--serif)',
                                    fontSize:
                                      '1.2rem',
                                    fontWeight:
                                      600,
                                    color:
                                      'var(--accent)',
                                  }}
                                >
                                  ₦
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
                                    fontFamily:
                                      'var(--sans)',
                                    fontSize:
                                      '9px',
                                    letterSpacing:
                                      '0.15em',
                                    textTransform:
                                      'uppercase',
                                    color:
                                      'var(--text-mute)',
                                    marginBottom:
                                      '2px',
                                  }}
                                >
                                  Registration
                                </div>

                                <div
                                  style={{
                                    fontFamily:
                                      'var(--serif)',
                                    fontSize:
                                      '1.2rem',
                                    fontWeight:
                                      600,
                                    color:
                                      'var(--text-dim)',
                                  }}
                                >
                                  ₦
                                  {formatPrice(
                                    event.price
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* CAPACITY */}
                        {event.capacity && (
                          <div
                            style={{
                              fontFamily:
                                'var(--sans)',
                              fontSize:
                                '10px',
                              color:
                                'var(--gold)',
                              letterSpacing:
                                '0.05em',
                            }}
                          >
                            Limited to{' '}
                            {
                              event.capacity
                            }{' '}
                            participants
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <div
                        style={{
                          flexShrink: 0,
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-gold"
                          style={{
                            fontSize:
                              '9px',
                            whiteSpace:
                              'nowrap',
                            opacity:
                              isRegistered
                                ? 0.7
                                : 1,
                          }}
                          disabled={
                            registering ===
                              event.id ||
                            isRegistered
                          }
                          onClick={() =>
                            handleRegister(
                              event
                            )
                          }
                        >
                          {registering ===
                          event.id
                            ? 'Registering...'
                            : isRegistered
                            ? 'Registered ✓'
                            : 'Register'}
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            /* PAST EVENTS */
            <div
              className="past-grid"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(3, 1fr)',
                gap: '1px',
                background:
                  'var(--border)',
              }}
            >
              {displayedEvents.map(
                (event) => {
                  const date =
                    formatDate(
                      event.start_date
                    );

                  return (
                    <div
                      key={event.id}
                      style={{
                        background:
                          'var(--bg-2)',
                        padding:
                          '2.5rem',
                        transition:
                          'background 0.3s',
                      }}
                      onMouseEnter={(
                        e
                      ) => {
                        e.currentTarget.style.background =
                          'var(--bg-3)';
                      }}
                      onMouseLeave={(
                        e
                      ) => {
                        e.currentTarget.style.background =
                          'var(--bg-2)';
                      }}
                    >
                      <div
                        style={{
                          display:
                            'flex',
                          justifyContent:
                            'space-between',
                          alignItems:
                            'flex-start',
                          marginBottom:
                            '1.5rem',
                        }}
                      >
                        <span
                          style={{
                            fontFamily:
                              'var(--sans)',
                            fontSize:
                              '9px',
                            letterSpacing:
                              '0.15em',
                            textTransform:
                              'uppercase',
                            padding:
                              '4px 10px',
                            background:
                              TYPE_COLORS[
                                event.event_type
                              ] ||
                              '#1a1a1a',
                            color:
                              '#ffffff',
                          }}
                        >
                          {event.event_type ||
                            'Event'}
                        </span>

                        <span
                          style={{
                            fontFamily:
                              'var(--sans)',
                            fontSize:
                              '11px',
                            color:
                              'var(--text-mute)',
                          }}
                        >
                          {date.year}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize:
                            '1.3rem',
                          fontWeight:
                            500,
                          lineHeight:
                            1.3,
                          marginBottom:
                            '0.5rem',
                        }}
                      >
                        {event.title}
                      </h3>

                      <div
                        style={{
                          fontFamily:
                            'var(--sans)',
                          fontSize:
                            '10px',
                          color:
                            'var(--accent)',
                          letterSpacing:
                            '0.05em',
                          marginBottom:
                            '1rem',
                        }}
                      >
                        {event.location ||
                          'Location TBA'}
                      </div>

                      <p
                        style={{
                          fontFamily:
                            'var(--sans)',
                          fontSize:
                            '12px',
                          lineHeight:
                            1.7,
                          color:
                            'var(--text-mute)',
                          fontWeight:
                            300,
                        }}
                      >
                        {event.description ||
                          'No description available.'}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* PRIVATE SESSION CTA */}
          {activeTab ===
            'upcoming' && (
            <div
              style={{
                border:
                  '1px solid #c9a96e1a',
                padding: '4rem',
                background:
                  'var(--bg-2)',
                textAlign: 'center',
              }}
            >
              <div
                className="gold"
                style={{
                  fontSize: '2rem',
                  marginBottom:
                    '1rem',
                }}
              >
                ◇
              </div>

              <h3
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  marginBottom:
                    '1rem',
                }}
              >
                Need a Private Session?
              </h3>

              <p
                style={{
                  fontFamily:
                    'var(--sans)',
                  fontSize: '13px',
                  lineHeight: 1.9,
                  color:
                    'var(--text-mute)',
                  maxWidth: '480px',
                  margin:
                    '0 auto 2rem',
                  fontWeight: 300,
                }}
              >
                NAIM Strategies delivers
                bespoke in-house masterclasses,
                retreats and strategy sessions
                for organisations and executive
                teams.
              </p>

              <a
                className="btn btn-gold"
                href="/contact"
              >
                Request a Private Session
              </a>
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