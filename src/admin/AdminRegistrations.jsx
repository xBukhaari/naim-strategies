import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

const COLORS = {
  green: '#0F2E23',
  greenDark: '#09251C',
  greenLight: '#163F31',
  greenActive: '#294333',

  gold: '#C8A95D',
  goldDark: '#8A6F32',
  goldLight: '#EAD9A3',

  page: '#F8F9FA',
  white: '#FFFFFF',
  ivory: '#FCFBF7',
  surface: '#F4F6F5',

  text: '#171A18',
  textSecondary: '#59665F',
  textMuted: '#7A857F',
  textLight: '#A7B3AD',

  border: '#E5E7E5',
  borderDark: '#D5DBD7',

  success: '#2F6B4F',
  successBg: '#EAF4EE',

  warning: '#9A7426',
  warningBg: '#FBF4DF',

  danger: '#A94442',
  dangerBg: '#FBECEC',
};

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getRegistrations();
  }, []);

  const getRegistrations = async () => {
    const { data, error } = await supabase
      .from('registrations')
      .select(
        '*, profiles(full_name, email, phone, organisation), events(title, location, start_date)'
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading registrations:', error);
      setRegistrations([]);
    } else {
      setRegistrations(data || []);
    }

    setLoading(false);
  };

  const handleStatusChange = async (id, status) => {
    setUpdating(id);

    const { error } = await supabase
      .from('registrations')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating registration:', error);
      setUpdating(null);
      return;
    }

    setRegistrations((current) =>
      current.map((r) =>
        r.id === id
          ? { ...r, status }
          : r
      )
    );

    setUpdating(null);
  };

  const tabs = [
    {
      value: 'pending',
      label: 'Pending',
    },
    {
      value: 'approved',
      label: 'Approved',
    },
    {
      value: 'rejected',
      label: 'Rejected',
    },
    {
      value: 'all',
      label: 'All',
    },
  ];

  const filtered = registrations.filter((r) => {
    const matchesTab =
      activeTab === 'all' ||
      r.status === activeTab;

    const searchTerm =
      search.toLowerCase().trim();

    const matchesSearch =
      !searchTerm ||
      r.profiles?.full_name
        ?.toLowerCase()
        .includes(searchTerm) ||
      r.profiles?.email
        ?.toLowerCase()
        .includes(searchTerm) ||
      r.events?.title
        ?.toLowerCase()
        .includes(searchTerm) ||
      r.profiles?.organisation
        ?.toLowerCase()
        .includes(searchTerm);

    return matchesTab && matchesSearch;
  });

  const pendingCount = registrations.filter(
    (r) => r.status === 'pending'
  ).length;

  const approvedCount = registrations.filter(
    (r) => r.status === 'approved'
  ).length;

  const rejectedCount = registrations.filter(
    (r) => r.status === 'rejected'
  ).length;

  const getStatusStyle = (status) => {
    if (status === 'approved') {
      return {
        background: COLORS.successBg,
        color: COLORS.success,
        border: '#C9E5D3',
      };
    }

    if (status === 'pending') {
      return {
        background: COLORS.warningBg,
        color: COLORS.warning,
        border: '#EAD9A3',
      };
    }

    if (status === 'rejected') {
      return {
        background: COLORS.dangerBg,
        color: COLORS.danger,
        border: '#E8C7C7',
      };
    }

    return {
      background: COLORS.surface,
      color: COLORS.textMuted,
      border: COLORS.border,
    };
  };

  const getTabCount = (value) => {
    if (value === 'pending') return pendingCount;
    if (value === 'approved') return approvedCount;
    if (value === 'rejected') return rejectedCount;
    return registrations.length;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div
          style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '2rem',
                color: COLORS.gold,
                marginBottom: '1rem',
              }}
            >
              ◇
            </div>

            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: COLORS.textSecondary,
                margin: 0,
              }}
            >
              Loading registrations...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div
        style={{
          maxWidth: '1500px',
          margin: '0 auto',
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '1.5rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: COLORS.goldDark,
                marginBottom: '0.55rem',
              }}
            >
              Admin
            </div>

            <h1
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '2rem',
                fontWeight: 650,
                lineHeight: 1.2,
                color: COLORS.green,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Registrations
            </h1>

            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: COLORS.textSecondary,
                margin: '0.45rem 0 0',
              }}
            >
              Review and manage participant
              registrations.
            </p>
          </div>

          {/* SUMMARY */}

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                background: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                minWidth: '92px',
              }}
            >
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: COLORS.textMuted,
                  marginBottom: '0.2rem',
                }}
              >
                Pending
              </div>

              <div
                style={{
                  fontSize: '19px',
                  fontWeight: 650,
                  color: COLORS.warning,
                }}
              >
                {pendingCount}
              </div>
            </div>

            <div
              style={{
                background: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                minWidth: '92px',
              }}
            >
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: COLORS.textMuted,
                  marginBottom: '0.2rem',
                }}
              >
                Approved
              </div>

              <div
                style={{
                  fontSize: '19px',
                  fontWeight: 650,
                  color: COLORS.success,
                }}
              >
                {approvedCount}
              </div>
            </div>

            <div
              style={{
                background: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                minWidth: '92px',
              }}
            >
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: COLORS.textMuted,
                  marginBottom: '0.2rem',
                }}
              >
                Total
              </div>

              <div
                style={{
                  fontSize: '19px',
                  fontWeight: 650,
                  color: COLORS.green,
                }}
              >
                {registrations.length}
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH */}

        <div
          style={{
            marginBottom: '1.5rem',
          }}
        >
          <input
            style={{
              background: COLORS.white,
              border: `1px solid ${COLORS.borderDark}`,
              borderRadius: '5px',
              color: COLORS.text,
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              padding: '12px 16px',
              width: '100%',
              maxWidth: '430px',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            placeholder="Search by name, email, organisation or event..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onFocus={(e) => {
              e.currentTarget.style.borderColor =
                COLORS.gold;

              e.currentTarget.style.boxShadow =
                '0 0 0 3px rgba(200, 169, 93, 0.10)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor =
                COLORS.borderDark;

              e.currentTarget.style.boxShadow =
                'none';
            }}
          />
        </div>

        {/* TABS */}

        <div
          style={{
            display: 'flex',
            gap: '0',
            marginBottom: '1.5rem',
            borderBottom:
              `1px solid ${COLORS.border}`,
            overflowX: 'auto',
          }}
        >
          {tabs.map((tab) => {
            const active =
              activeTab === tab.value;

            const count =
              getTabCount(tab.value);

            return (
              <button
                key={tab.value}
                onClick={() =>
                  setActiveTab(tab.value)
                }
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '10px',
                  fontWeight: active
                    ? 700
                    : 600,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  padding:
                    '0.85rem 1.25rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: active
                    ? `2px solid ${COLORS.gold}`
                    : '2px solid transparent',
                  color: active
                    ? COLORS.goldDark
                    : COLORS.textMuted,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '-1px',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color =
                      COLORS.green;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color =
                      COLORS.textMuted;
                  }
                }}
              >
                {tab.label}

                {count > 0 && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '18px',
                      height: '18px',
                      marginLeft: '0.45rem',
                      padding: '0 5px',
                      borderRadius: '10px',
                      background: active
                        ? COLORS.green
                        : COLORS.surface,
                      color: active
                        ? COLORS.goldLight
                        : COLORS.textSecondary,
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TABLE */}

        <div
          style={{
            background: COLORS.white,
            border:
              `1px solid ${COLORS.border}`,
            borderRadius: '7px',
            overflow: 'hidden',
            boxShadow:
              '0 2px 10px rgba(15, 46, 35, 0.035)',
          }}
        >
          <div
            style={{
              overflowX: 'auto',
            }}
          >

            {/* TABLE HEADER */}

            <div
              style={{
                minWidth: '900px',
                display: 'grid',
                gridTemplateColumns:
                  '2fr 2fr 1fr 1fr 1.2fr',
                gap: '1rem',
                padding:
                  '0.9rem 1.25rem',
                background:
                  COLORS.surface,
                borderBottom:
                  `1px solid ${COLORS.border}`,
              }}
            >
              {[
                'Participant',
                'Event',
                'Status',
                'Registered',
                'Actions',
              ].map((heading) => (
                <div
                  key={heading}
                  style={{
                    fontFamily:
                      'var(--sans)',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing:
                      '0.15em',
                    textTransform:
                      'uppercase',
                    color:
                      COLORS.textSecondary,
                  }}
                >
                  {heading}
                </div>
              ))}
            </div>

            {/* EMPTY */}

            {filtered.length === 0 ? (
              <div
                style={{
                  padding: '4rem 2rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    margin:
                      '0 auto 1rem',
                    borderRadius: '50%',
                    background:
                      COLORS.surface,
                    display: 'flex',
                    alignItems:
                      'center',
                    justifyContent:
                      'center',
                    color:
                      COLORS.textMuted,
                    fontSize: '18px',
                  }}
                >
                  ◎
                </div>

                <p
                  style={{
                    fontFamily:
                      'var(--sans)',
                    fontSize: '13px',
                    color:
                      COLORS.textSecondary,
                    margin: 0,
                  }}
                >
                  No registrations
                  found.
                </p>

                {search && (
                  <p
                    style={{
                      fontFamily:
                        'var(--sans)',
                      fontSize: '11px',
                      color:
                        COLORS.textMuted,
                      margin:
                        '0.4rem 0 0',
                    }}
                  >
                    Try changing your
                    search or selected
                    tab.
                  </p>
                )}
              </div>
            ) : (
              filtered.map((reg, index) => {
                const statusStyle =
                  getStatusStyle(
                    reg.status
                  );

                return (
                  <div
                    key={reg.id || index}
                    style={{
                      minWidth: '900px',
                      display: 'grid',
                      gridTemplateColumns:
                        '2fr 2fr 1fr 1fr 1.2fr',
                      gap: '1rem',
                      padding:
                        '1.15rem 1.25rem',
                      background:
                        COLORS.white,
                      alignItems:
                        'center',
                      borderBottom:
                        index !==
                        filtered.length - 1
                          ? `1px solid ${COLORS.border}`
                          : 'none',
                      transition:
                        'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        COLORS.ivory;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        COLORS.white;
                    }}
                  >

                    {/* PARTICIPANT */}

                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontFamily:
                            'var(--sans)',
                          fontSize:
                            '12px',
                          fontWeight:
                            650,
                          color:
                            COLORS.text,
                          marginBottom:
                            '0.25rem',
                          wordBreak:
                            'break-word',
                        }}
                      >
                        {reg.profiles
                          ?.full_name ||
                          'Unnamed participant'}
                      </div>

                      <div
                        style={{
                          fontFamily:
                            'var(--sans)',
                          fontSize:
                            '11px',
                          color:
                            COLORS.textSecondary,
                          marginBottom:
                            reg.profiles
                              ?.organisation
                              ? '0.2rem'
                              : 0,
                          wordBreak:
                            'break-word',
                        }}
                      >
                        {reg.profiles
                          ?.email ||
                          '-'}
                      </div>

                      {reg.profiles
                        ?.organisation && (
                        <div
                          style={{
                            fontFamily:
                              'var(--sans)',
                            fontSize:
                              '10px',
                            color:
                              COLORS.textMuted,
                            wordBreak:
                              'break-word',
                          }}
                        >
                          {
                            reg.profiles
                              .organisation
                          }
                        </div>
                      )}
                    </div>

                    {/* EVENT */}

                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontFamily:
                            'var(--sans)',
                          fontSize:
                            '12px',
                          fontWeight:
                            600,
                          color:
                            COLORS.text,
                          marginBottom:
                            '0.25rem',
                          wordBreak:
                            'break-word',
                        }}
                      >
                        {reg.events
                          ?.title ||
                          'Unknown event'}
                      </div>

                      <div
                        style={{
                          fontFamily:
                            'var(--sans)',
                          fontSize:
                            '11px',
                          color:
                            COLORS.textMuted,
                          wordBreak:
                            'break-word',
                        }}
                      >
                        {reg.events
                          ?.location ||
                          '-'}
                      </div>
                    </div>

                    {/* STATUS */}

                    <div>
                      <span
                        style={{
                          display:
                            'inline-flex',
                          alignItems:
                            'center',
                          fontFamily:
                            'var(--sans)',
                          fontSize:
                            '9px',
                          fontWeight:
                            700,
                          letterSpacing:
                            '0.08em',
                          textTransform:
                            'uppercase',
                          padding:
                            '4px 9px',
                          background:
                            statusStyle.background,
                          color:
                            statusStyle.color,
                          border:
                            `1px solid ${statusStyle.border}`,
                          borderRadius:
                            '20px',
                          whiteSpace:
                            'nowrap',
                        }}
                      >
                        {reg.status}
                      </span>
                    </div>

                    {/* REGISTERED */}

                    <div
                      style={{
                        fontFamily:
                          'var(--sans)',
                        fontSize:
                          '11px',
                        color:
                          COLORS.textSecondary,
                      }}
                    >
                      {reg.created_at
                        ? new Date(
                            reg.created_at
                          ).toLocaleDateString(
                            'en-GB',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }
                          )
                        : '-'}
                    </div>

                    {/* ACTIONS */}

                    <div
                      style={{
                        display:
                          'flex',
                        gap:
                          '0.5rem',
                        flexWrap:
                          'wrap',
                      }}
                    >
                      {reg.status !==
                        'approved' && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              reg.id,
                              'approved'
                            )
                          }
                          disabled={
                            updating ===
                            reg.id
                          }
                          style={{
                            fontFamily:
                              'var(--sans)',
                            fontSize:
                              '9px',
                            fontWeight:
                              700,
                            letterSpacing:
                              '0.08em',
                            textTransform:
                              'uppercase',
                            background:
                              COLORS.green,
                            border:
                              `1px solid ${COLORS.green}`,
                            color:
                              COLORS.white,
                            borderRadius:
                              '4px',
                            padding:
                              '6px 9px',
                            cursor:
                              updating ===
                              reg.id
                                ? 'not-allowed'
                                : 'pointer',
                            opacity:
                              updating ===
                              reg.id
                                ? 0.55
                                : 1,
                            transition:
                              'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            if (
                              updating !==
                              reg.id
                            ) {
                              e.currentTarget.style.background =
                                COLORS.greenLight;
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              COLORS.green;
                          }}
                        >
                          {updating ===
                          reg.id
                            ? '...'
                            : 'Approve'}
                        </button>
                      )}

                      {reg.status !==
                        'rejected' && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              reg.id,
                              'rejected'
                            )
                          }
                          disabled={
                            updating ===
                            reg.id
                          }
                          style={{
                            fontFamily:
                              'var(--sans)',
                            fontSize:
                              '9px',
                            fontWeight:
                              700,
                            letterSpacing:
                              '0.08em',
                            textTransform:
                              'uppercase',
                            background:
                              COLORS.white,
                            border:
                              '1px solid #E8C7C7',
                            color:
                              COLORS.danger,
                            borderRadius:
                              '4px',
                            padding:
                              '6px 9px',
                            cursor:
                              updating ===
                              reg.id
                                ? 'not-allowed'
                                : 'pointer',
                            opacity:
                              updating ===
                              reg.id
                                ? 0.55
                                : 1,
                            transition:
                              'all 0.2s',
                          }}
                        >
                          {updating ===
                          reg.id
                            ? '...'
                            : 'Reject'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <style>{`
          input::placeholder {
            color: #7A857F;
            opacity: 1;
          }

          @media (max-width: 700px) {
            input {
              max-width: 100% !important;
            }
          }
        `}</style>
      </div>
    </AdminLayout>
  );
}