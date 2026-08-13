import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

export default function AdminContacts() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) {
        setSubmissions(data || []);
      }

      setLoading(false);
    };

    getData();
  }, []);

  /* =========================
     DELETE SUBMISSION
  ========================= */

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission?')) return;

    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (!error) {
      setSubmissions((prev) =>
        prev.filter((submission) => submission.id !== id)
      );

      if (selected?.id === id) {
        setSelected(null);
      }
    }
  };

  /* =========================
     SEARCH
  ========================= */

  const filtered = submissions.filter((submission) => {
    const query = search.toLowerCase();

    return (
      submission.name?.toLowerCase().includes(query) ||
      submission.email?.toLowerCase().includes(query) ||
      submission.organisation?.toLowerCase().includes(query) ||
      submission.enquiry_type?.toLowerCase().includes(query)
    );
  });

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <AdminLayout>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '2rem',
                color: '#C8A95D',
                marginBottom: '1rem',
              }}
            >
              ◇
            </div>

            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: '#53605A',
                margin: 0,
              }}
            >
              Loading submissions...
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
          padding: '3rem',
          maxWidth: '1500px',
          margin: '0 auto',
        }}
      >
        {/* =========================
            HEADER
        ========================= */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#C8A95D',
                marginBottom: '0.6rem',
                fontWeight: 600,
              }}
            >
              Admin
            </div>

            <h1
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '2rem',
                fontWeight: 600,
                color: '#17231E',
                margin: 0,
                marginBottom: '0.5rem',
              }}
            >
              Contact Submissions
            </h1>

            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: '#53605A',
                margin: 0,
              }}
            >
              {submissions.length} submissions received
            </p>
          </div>
        </div>

        {/* =========================
            SEARCH
        ========================= */}

        <div
          style={{
            marginBottom: '1.5rem',
          }}
        >
          <input
            type="text"
            placeholder="Search by name, email, organisation or enquiry type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: '#FFFFFF',
              border: '1px solid #DDE4DF',
              color: '#17231E',
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              padding: '11px 14px',
              width: '100%',
              maxWidth: '500px',
              outline: 'none',
              borderRadius: '3px',
              boxSizing: 'border-box',
              transition:
                'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor =
                '#C8A95D';

              e.currentTarget.style.boxShadow =
                '0 0 0 3px rgba(200,169,93,0.12)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor =
                '#DDE4DF';

              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* =========================
            CONTENT AREA
        ========================= */}

        <div
          className="contact-content-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: selected
              ? 'minmax(0, 1.4fr) minmax(360px, 0.8fr)'
              : '1fr',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* =========================
              SUBMISSIONS TABLE
          ========================= */}

          <div
            style={{
              background: '#DDE4DF',
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
              border: '1px solid #DDE4DF',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow:
                '0 6px 24px rgba(15, 46, 35, 0.04)',
            }}
          >
            {/* TABLE HEADER */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1.6fr 2fr 1.2fr 1fr',
                gap: '1rem',
                padding: '1rem 1.5rem',
                background: '#0F2E23',
                minWidth: '700px',
              }}
            >
              {[
                'Name',
                'Email',
                'Date',
                'Actions',
              ].map((heading) => (
                <div
                  key={heading}
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#EAD9A3',
                    fontWeight: 600,
                  }}
                >
                  {heading}
                </div>
              ))}
            </div>

            {/* EMPTY STATE */}

            {filtered.length === 0 ? (
              <div
                style={{
                  background: '#FFFFFF',
                  padding: '4rem 2rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    color: '#C8A95D',
                    marginBottom: '0.75rem',
                  }}
                >
                  ◇
                </div>

                <p
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '13px',
                    color: '#53605A',
                    margin: 0,
                  }}
                >
                  No submissions found.
                </p>
              </div>
            ) : (
              filtered.map((submission) => {
                const isSelected =
                  selected?.id === submission.id;

                return (
                  <div
                    key={submission.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        '1.6fr 2fr 1.2fr 1fr',
                      gap: '1rem',
                      padding: '1.25rem 1.5rem',
                      background: isSelected
                        ? '#F3F5F3'
                        : '#FFFFFF',
                      alignItems: 'center',
                      minWidth: '700px',
                      cursor: 'pointer',
                      borderLeft: isSelected
                        ? '3px solid #C8A95D'
                        : '3px solid transparent',
                      transition:
                        'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background =
                          '#F3F5F3';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background =
                          '#FFFFFF';
                      }
                    }}
                    onClick={() =>
                      setSelected(submission)
                    }
                  >
                    {/* NAME */}

                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--sans)',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#17231E',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {submission.name}
                      </div>

                      {submission.organisation && (
                        <div
                          style={{
                            fontFamily: 'var(--sans)',
                            fontSize: '11px',
                            lineHeight: 1.5,
                            color: '#718078',
                          }}
                        >
                          {submission.organisation}
                        </div>
                      )}
                    </div>

                    {/* EMAIL */}

                    <div
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '12px',
                        color: '#34463E',
                        fontWeight: 500,
                        wordBreak: 'break-word',
                      }}
                    >
                      {submission.email}
                    </div>

                    {/* DATE */}

                    <div
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '11px',
                        color: '#718078',
                      }}
                    >
                      {submission.created_at
                        ? new Date(
                            submission.created_at
                          ).toLocaleDateString(
                            'en-NG',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(submission);
                        }}
                        style={{
                          fontFamily: 'var(--sans)',
                          fontSize: '9px',
                          letterSpacing: '0.1em',
                          textTransform:
                            'uppercase',
                          background: 'transparent',
                          border:
                            '1px solid #C8A95D',
                          color: '#8A6F32',
                          padding: '5px 10px',
                          cursor: 'pointer',
                          borderRadius: '2px',
                          fontWeight: 600,
                          transition:
                            'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            '#C8A95D';

                          e.currentTarget.style.color =
                            '#0F2E23';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            'transparent';

                          e.currentTarget.style.color =
                            '#8A6F32';
                        }}
                      >
                        View
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(
                            submission.id
                          );
                        }}
                        style={{
                          fontFamily: 'var(--sans)',
                          fontSize: '9px',
                          letterSpacing: '0.1em',
                          textTransform:
                            'uppercase',
                          background: 'transparent',
                          border:
                            '1px solid #E5CACA',
                          color: '#A33A3A',
                          padding: '5px 10px',
                          cursor: 'pointer',
                          borderRadius: '2px',
                          fontWeight: 600,
                          transition:
                            'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            '#F9EAEA';

                          e.currentTarget.style.borderColor =
                            '#A33A3A';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            'transparent';

                          e.currentTarget.style.borderColor =
                            '#E5CACA';
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* =========================
              DETAIL PANEL
          ========================= */}

          {selected && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #DDE4DF',
                borderRadius: '4px',
                padding: '2rem',
                boxShadow:
                  '0 8px 30px rgba(15, 46, 35, 0.06)',
                position: 'sticky',
                top: '2rem',
                alignSelf: 'start',
                boxSizing: 'border-box',
              }}
            >
              {/* DETAIL HEADER */}

              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  borderBottom:
                    '1px solid #E5EBE7',
                  paddingBottom: '1.25rem',
                  marginBottom: '2rem',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform:
                        'uppercase',
                      color: '#C8A95D',
                      marginBottom: '0.4rem',
                    }}
                  >
                    Submission Detail
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '13px',
                      color: '#53605A',
                    }}
                  >
                    Contact enquiry
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelected(null)
                  }
                  style={{
                    background: '#F3F5F3',
                    border:
                      '1px solid #DDE4DF',
                    color: '#53605A',
                    cursor: 'pointer',
                    fontSize: '14px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '3px',
                    transition:
                      'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      '#0F2E23';
                    e.currentTarget.style.color =
                      '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      '#F3F5F3';
                    e.currentTarget.style.color =
                      '#53605A';
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* BASIC DETAILS */}

              {[
                {
                  label: 'Name',
                  value:
                    selected.name ||
                    'Not provided',
                },
                {
                  label: 'Email',
                  value:
                    selected.email ||
                    'Not provided',
                },
                {
                  label: 'Organisation',
                  value:
                    selected.organisation ||
                    'Not provided',
                },
                {
                  label: 'Enquiry Type',
                  value:
                    selected.enquiry_type ||
                    'Not specified',
                },
                {
                  label: 'Date',
                  value: selected.created_at
                    ? new Date(
                        selected.created_at
                      ).toLocaleDateString(
                        'en-NG',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )
                    : 'Not available',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '1.25rem',
                    paddingBottom: '1.25rem',
                    borderBottom:
                      '1px solid #E5EBE7',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform:
                        'uppercase',
                      color: '#718078',
                      marginBottom: '0.45rem',
                    }}
                  >
                    {item.label}
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '13px',
                      color: '#17231E',
                      lineHeight: 1.6,
                      wordBreak:
                        'break-word',
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}

              {/* CHALLENGE */}

              {selected.challenge && (
                <div
                  style={{
                    marginBottom: '1.5rem',
                    paddingBottom: '1.5rem',
                    borderBottom:
                      '1px solid #E5EBE7',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform:
                        'uppercase',
                      color: '#718078',
                      marginBottom: '0.55rem',
                    }}
                  >
                    The Challenge
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '13px',
                      color: '#34463E',
                      lineHeight: 1.75,
                    }}
                  >
                    {selected.challenge}
                  </div>
                </div>
              )}

              {/* DESIRED OUTCOME */}

              {selected.desired_outcome && (
                <div
                  style={{
                    marginBottom: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform:
                        'uppercase',
                      color: '#718078',
                      marginBottom: '0.55rem',
                    }}
                  >
                    Desired Outcome
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '13px',
                      color: '#34463E',
                      lineHeight: 1.75,
                    }}
                  >
                    {selected.desired_outcome}
                  </div>
                </div>
              )}

              {/* REPLY */}

              <a
                href={`mailto:${selected.email}?subject=Re: Your enquiry to NAIM Strategies`}
                style={{
                  display: 'block',
                  fontFamily: 'var(--sans)',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform:
                    'uppercase',
                  textAlign: 'center',
                  background: '#C8A95D',
                  color: '#0F2E23',
                  padding: '13px 24px',
                  textDecoration: 'none',
                  marginTop: '1.5rem',
                  borderRadius: '3px',
                  transition:
                    'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    '#0F2E23';
                  e.currentTarget.style.color =
                    '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    '#C8A95D';
                  e.currentTarget.style.color =
                    '#0F2E23';
                }}
              >
                Reply via Email →
              </a>

              {/* DELETE */}

              <button
                onClick={() =>
                  handleDelete(selected.id)
                }
                style={{
                  width: '100%',
                  marginTop: '0.75rem',
                  fontFamily: 'var(--sans)',
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform:
                    'uppercase',
                  background: 'transparent',
                  border:
                    '1px solid #E5CACA',
                  color: '#A33A3A',
                  padding: '11px 24px',
                  cursor: 'pointer',
                  borderRadius: '3px',
                  transition:
                    'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    '#F9EAEA';
                  e.currentTarget.style.borderColor =
                    '#A33A3A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'transparent';
                  e.currentTarget.style.borderColor =
                    '#E5CACA';
                }}
              >
                Delete Submission
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================
          RESPONSIVE STYLES
      ========================= */}

      <style>{`
        @media (max-width: 1000px) {
          .contact-content-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 700px) {
          .contact-content-grid {
            display: block !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}