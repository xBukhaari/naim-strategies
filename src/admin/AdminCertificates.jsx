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

  danger: '#A94442',
  dangerBg: '#FBECEC',
};

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    user_id: '',
    event_id: '',
    certificate_url: '',
    issued_date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const [certRes, usersRes, eventsRes] = await Promise.all([
      supabase
        .from('certificates')
        .select(
          '*, profiles(full_name, email), events(title)'
        )
        .order('created_at', { ascending: false }),

      supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name'),

      supabase
        .from('events')
        .select('id, title')
        .order('title'),
    ]);

    setCertificates(certRes.data || []);
    setUsers(usersRes.data || []);
    setEvents(eventsRes.data || []);
    setLoading(false);
  };

  const generateCertId = () => {
    const year = new Date().getFullYear();
    const num =
      Math.floor(Math.random() * 90000) + 10000;

    return `NAIM-${year}-${num}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('certificates')
      .insert({
        ...formData,
        certificate_id: generateCertId(),
      });

    setSaving(false);

    if (error) {
      console.error(
        'Error issuing certificate:',
        error
      );
      return;
    }

    setShowForm(false);

    setFormData({
      user_id: '',
      event_id: '',
      certificate_url: '',
      issued_date: new Date()
        .toISOString()
        .slice(0, 10),
    });

    getData();
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Delete this certificate?'
      )
    ) {
      return;
    }

    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(
        'Error deleting certificate:',
        error
      );
      return;
    }

    setCertificates((current) =>
      current.filter(
        (certificate) =>
          certificate.id !== id
      )
    );
  };

  const inputStyle = {
    background: COLORS.white,
    border: `1px solid ${COLORS.borderDark}`,
    borderRadius: '5px',
    color: COLORS.text,
    fontFamily: 'var(--sans)',
    fontSize: '13px',
    padding: '11px 13px',
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  };

  const labelStyle = {
    fontFamily: 'var(--sans)',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
    display: 'block',
    marginBottom: '0.55rem',
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
              Loading certificates...
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
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
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
              Certificates
            </h1>

            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: COLORS.textSecondary,
                margin: '0.45rem 0 0',
              }}
            >
              Issue, manage and verify participant
              certificates.
            </p>
          </div>

          {/* SUMMARY */}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                background: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                minWidth: '90px',
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
                Issued
              </div>

              <div
                style={{
                  fontSize: '19px',
                  fontWeight: 650,
                  color: COLORS.green,
                }}
              >
                {certificates.length}
              </div>
            </div>

            <button
              onClick={() =>
                setShowForm(!showForm)
              }
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                background: showForm
                  ? COLORS.white
                  : COLORS.green,
                border: showForm
                  ? `1px solid ${COLORS.borderDark}`
                  : `1px solid ${COLORS.green}`,
                color: showForm
                  ? COLORS.textSecondary
                  : COLORS.white,
                borderRadius: '4px',
                padding: '12px 18px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {showForm
                ? 'Cancel'
                : '+ Issue Certificate'}
            </button>
          </div>
        </div>

        {/* FORM */}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderTop:
                `3px solid ${COLORS.gold}`,
              borderRadius: '6px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow:
                '0 3px 15px rgba(15, 46, 35, 0.04)',
            }}
          >
            <div
              style={{
                marginBottom: '1.75rem',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: COLORS.goldDark,
                  marginBottom: '0.4rem',
                }}
              >
                Certificate Management
              </div>

              <h2
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '1.3rem',
                  fontWeight: 650,
                  color: COLORS.green,
                  margin: 0,
                }}
              >
                Issue New Certificate
              </h2>
            </div>

            {/* PARTICIPANT + EVENT */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(2, minmax(0, 1fr))',
                gap: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <label style={labelStyle}>
                  Participant *
                </label>

                <select
                  style={inputStyle}
                  required
                  value={formData.user_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      user_id:
                        e.target.value,
                    })
                  }
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      COLORS.gold;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      COLORS.borderDark;
                  }}
                >
                  <option value="">
                    Select participant
                  </option>

                  {users.map((u) => (
                    <option
                      key={u.id}
                      value={u.id}
                    >
                      {u.full_name ||
                        'Unnamed user'}{' '}
                      ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Event *
                </label>

                <select
                  style={inputStyle}
                  required
                  value={formData.event_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      event_id:
                        e.target.value,
                    })
                  }
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      COLORS.gold;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      COLORS.borderDark;
                  }}
                >
                  <option value="">
                    Select event
                  </option>

                  {events.map((event) => (
                    <option
                      key={event.id}
                      value={event.id}
                    >
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* URL + DATE */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(2, minmax(0, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <div>
                <label style={labelStyle}>
                  Certificate File URL
                </label>

                <input
                  style={inputStyle}
                  type="url"
                  placeholder="https://..."
                  value={
                    formData.certificate_url
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      certificate_url:
                        e.target.value,
                    })
                  }
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      COLORS.gold;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      COLORS.borderDark;
                  }}
                />

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '10px',
                    color: COLORS.textMuted,
                    marginTop: '0.5rem',
                  }}
                >
                  Upload the certificate to
                  Cloudinary first, then paste
                  the URL here.
                </div>
              </div>

              <div>
                <label style={labelStyle}>
                  Issue Date *
                </label>

                <input
                  style={inputStyle}
                  type="date"
                  required
                  value={
                    formData.issued_date
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      issued_date:
                        e.target.value,
                    })
                  }
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      COLORS.gold;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      COLORS.borderDark;
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
              }}
            >
              <button
                type="submit"
                disabled={saving}
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  background: COLORS.green,
                  border:
                    `1px solid ${COLORS.green}`,
                  color: COLORS.white,
                  borderRadius: '4px',
                  padding: '12px 20px',
                  cursor: saving
                    ? 'not-allowed'
                    : 'pointer',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving
                  ? 'Issuing...'
                  : 'Issue Certificate'}
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background: COLORS.white,
                  border:
                    `1px solid ${COLORS.borderDark}`,
                  color: COLORS.textSecondary,
                  borderRadius: '4px',
                  padding: '12px 18px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* CERTIFICATES TABLE */}

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
                  '1.5fr 2fr 2fr 1fr 1.2fr',
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
                'Certificate ID',
                'Participant',
                'Event',
                'Issued',
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

            {/* EMPTY STATE */}

            {certificates.length === 0 ? (
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
                  ❐
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
                  No certificates issued
                  yet.
                </p>
              </div>
            ) : (
              certificates.map(
                (cert, index) => (
                  <div
                    key={cert.id || index}
                    style={{
                      minWidth: '900px',
                      display: 'grid',
                      gridTemplateColumns:
                        '1.5fr 2fr 2fr 1fr 1.2fr',
                      gap: '1rem',
                      padding:
                        '1.15rem 1.25rem',
                      background:
                        COLORS.white,
                      alignItems:
                        'center',
                      borderBottom:
                        index !==
                        certificates.length -
                          1
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

                    {/* CERTIFICATE ID */}

                    <div
                      style={{
                        fontFamily:
                          'var(--sans)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color:
                          COLORS.goldDark,
                        letterSpacing:
                          '0.03em',
                        wordBreak:
                          'break-word',
                      }}
                    >
                      {cert.certificate_id ||
                        '-'}
                    </div>

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
                        }}
                      >
                        {cert.profiles
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
                          wordBreak:
                            'break-word',
                        }}
                      >
                        {cert.profiles
                          ?.email ||
                          '-'}
                      </div>
                    </div>

                    {/* EVENT */}

                    <div
                      style={{
                        fontFamily:
                          'var(--sans)',
                        fontSize:
                          '12px',
                        fontWeight: 550,
                        color:
                          COLORS.text,
                        wordBreak:
                          'break-word',
                      }}
                    >
                      {cert.events?.title ||
                        '-'}
                    </div>

                    {/* DATE */}

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
                      {cert.issued_date
                        ? new Date(
                            cert.issued_date
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
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      {cert.certificate_url && (
                        <a
                          href={
                            cert.certificate_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontFamily:
                              'var(--sans)',
                            fontSize: '9px',
                            fontWeight: 700,
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
                              '6px 10px',
                            cursor:
                              'pointer',
                            textDecoration:
                              'none',
                            display:
                              'inline-block',
                          }}
                        >
                          View
                        </a>
                      )}

                      <button
                        onClick={() =>
                          handleDelete(
                            cert.id
                          )
                        }
                        style={{
                          fontFamily:
                            'var(--sans)',
                          fontSize: '9px',
                          fontWeight: 700,
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
                            '6px 10px',
                          cursor:
                            'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>

        <style>{`
          select,
          input {
            color-scheme: light;
          }

          input::placeholder {
            color: #7A857F;
            opacity: 1;
          }

          @media (max-width: 700px) {
            form > div {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </AdminLayout>
  );
}