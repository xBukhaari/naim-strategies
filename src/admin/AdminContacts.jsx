import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

export default function AdminContacts() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission?')) return;

    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (!error) {
      setSubmissions(prev =>
        prev.filter(submission => submission.id !== id)
      );

      if (selected?.id === id) {
        setSelected(null);
      }
    }
  };

  const filtered = submissions.filter(submission => {
    const query = search.toLowerCase();

    return (
      submission.name?.toLowerCase().includes(query) ||
      submission.email?.toLowerCase().includes(query) ||
      submission.organisation?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <AdminLayout>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
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
                color: '#7A857F',
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
      <div style={{ padding: '2rem' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C8A95D',
              marginBottom: '0.5rem',
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
              color: '#0F2E23',
              margin: 0,
              marginBottom: '0.4rem',
            }}
          >
            Contact Submissions
          </h1>

          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              color: '#7A857F',
              margin: 0,
            }}
          >
            {submissions.length} total submissions
          </p>
        </div>

        {/* SEARCH */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7E5',
              color: '#0F2E23',
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              padding: '12px 16px',
              width: '100%',
              maxWidth: '420px',
              outline: 'none',
              boxSizing: 'border-box',
              borderRadius: '2px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            placeholder="Search by name, email or organisation..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#C8A95D';
              e.currentTarget.style.boxShadow =
                '0 0 0 2px rgba(200, 169, 93, 0.12)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#E5E7E5';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* CONTENT GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: selected
              ? 'minmax(0, 1.2fr) minmax(320px, 0.8fr)'
              : '1fr',
            gap: '1.5rem',
            alignItems: 'start',
          }}
          className="contact-grid"
        >

          {/* SUBMISSIONS LIST */}
          <div
            style={{
              background: '#E5E7E5',
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
              overflowX: 'auto',
            }}
          >

            {/* TABLE HEADER */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 1fr',
                gap: '1rem',
                padding: '0.875rem 1.5rem',
                background: '#F8F9FA',
                minWidth: '650px',
              }}
            >
              {['Name', 'Email', 'Date', 'Actions'].map(header => (
                <div
                  key={header}
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '9px',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#7A857F',
                  }}
                >
                  {header}
                </div>
              ))}
            </div>

            {/* EMPTY STATE */}
            {filtered.length === 0 ? (
              <div
                style={{
                  background: '#FFFFFF',
                  padding: '3rem',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '13px',
                    color: '#7A857F',
                    margin: 0,
                  }}
                >
                  No submissions found.
                </p>
              </div>
            ) : (
              filtered.map(submission => {
                const isSelected =
                  selected?.id === submission.id;

                return (
                  <div
                    key={submission.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 2fr 1fr 1fr',
                      gap: '1rem',
                      padding: '1rem 1.5rem',
                      background: isSelected
                        ? '#F8F9FA'
                        : '#FFFFFF',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderLeft: isSelected
                        ? '3px solid #C8A95D'
                        : '3px solid transparent',
                      minWidth: '650px',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background =
                          '#F8F9FA';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background =
                          '#FFFFFF';
                      }
                    }}
                    onClick={() => setSelected(submission)}
                  >
                    {/* NAME */}
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--sans)',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#0F2E23',
                          marginBottom: '0.2rem',
                        }}
                      >
                        {submission.name}
                      </div>

                      {submission.organisation && (
                        <div
                          style={{
                            fontFamily: 'var(--sans)',
                            fontSize: '11px',
                            color: '#7A857F',
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
                        color: '#0F2E23',
                        wordBreak: 'break-all',
                      }}
                    >
                      {submission.email}
                    </div>

                    {/* DATE */}
                    <div
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '11px',
                        color: '#7A857F',
                      }}
                    >
                      {submission.created_at
                        ? new Date(
                            submission.created_at
                          ).toLocaleDateString()
                        : '-'}
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(submission.id);
                      }}
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '9px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        background: 'transparent',
                        border: '1px solid #E5E7E5',
                        color: '#A33A3A',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        borderRadius: '2px',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* DETAIL VIEW */}
          {selected && (
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7E5',
                padding: '2rem',
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
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#C8A95D',
                  }}
                >
                  Submission Detail
                </div>

                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#7A857F',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '2px 5px',
                  }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* BASIC DETAILS */}
              {[
                {
                  label: 'Name',
                  value: selected.name,
                },
                {
                  label: 'Email',
                  value: selected.email,
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
                      ).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Not available',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '1.25rem',
                    paddingBottom: '1.25rem',
                    borderBottom:
                      '1px solid #E5E7E5',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: '#7A857F',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {item.label}
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '13px',
                      color: '#0F2E23',
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
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
                    marginBottom: '1.25rem',
                    paddingBottom: '1.25rem',
                    borderBottom:
                      '1px solid #E5E7E5',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: '#7A857F',
                      marginBottom: '0.5rem',
                    }}
                  >
                    The Challenge
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '13px',
                      color: '#30453B',
                      lineHeight: 1.7,
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
                      textTransform: 'uppercase',
                      color: '#7A857F',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Desired Outcome
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '13px',
                      color: '#30453B',
                      lineHeight: 1.7,
                    }}
                  >
                    {selected.desired_outcome}
                  </div>
                </div>
              )}

              {/* REPLY BUTTON */}
              <a
                href={`mailto:${selected.email}?subject=Re: Your enquiry to NAIM Strategies`}
                style={{
                  display: 'block',
                  fontFamily: 'var(--sans)',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  background: '#C8A95D',
                  color: '#0F2E23',
                  padding: '12px 24px',
                  textDecoration: 'none',
                  marginTop: '1.5rem',
                  borderRadius: '2px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background =
                    '#B5964C';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background =
                    '#C8A95D';
                }}
              >
                Reply via Email →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 650px) {
          .contact-grid {
            display: block !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}