import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getSubscribers();
  }, []);

  const getSubscribers = async () => {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (!error) {
      setSubscribers(data || []);
    }

    setLoading(false);
  };

  /* =========================
     TOGGLE SUBSCRIBER
  ========================= */

  const handleToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: newStatus })
      .eq('id', id);

    if (!error) {
      setSubscribers(prev =>
        prev.map(sub =>
          sub.id === id
            ? { ...sub, is_active: newStatus }
            : sub
        )
      );
    }
  };

  /* =========================
     DELETE SUBSCRIBER
  ========================= */

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return;

    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);

    if (!error) {
      setSubscribers(prev =>
        prev.filter(sub => sub.id !== id)
      );
    }
  };

  /* =========================
     EXPORT CSV
  ========================= */

  const handleExport = () => {
    const active = subscribers.filter(
      sub => sub.is_active
    );

    const csv = [
      'Email,Subscribed Date,Status',
      ...active.map(sub =>
        `"${sub.email}","${new Date(
          sub.subscribed_at
        ).toLocaleDateString()}","Active"`
      ),
    ].join('\n');

    const blob = new Blob(
      [csv],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download = `naim-subscribers-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =========================
     FILTER
  ========================= */

  const filtered = subscribers.filter(sub =>
    sub.email
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeCount = subscribers.filter(
    sub => sub.is_active
  ).length;

  const inactiveCount =
    subscribers.length - activeCount;

  /* =========================
     INPUT STYLE
  ========================= */

  const inputStyle = {
    background: '#FFFFFF',
    border: '1px solid #DDE4DF',
    color: '#17231E',
    fontFamily: 'var(--sans)',
    fontSize: '13px',
    padding: '11px 14px',
    width: '100%',
    maxWidth: '420px',
    outline: 'none',
    borderRadius: '3px',
    boxSizing: 'border-box',
    transition:
      'border-color 0.2s, box-shadow 0.2s',
  };

  /* =========================
     LABEL STYLE
  ========================= */

  const labelStyle = {
    fontFamily: 'var(--sans)',
    fontSize: '9px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#53605A',
    display: 'block',
    marginBottom: '0.55rem',
    fontWeight: 600,
  };

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
              Loading subscribers...
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
                marginBottom: '0.4rem',
              }}
            >
              Newsletter
            </h1>

            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: '#53605A',
                margin: 0,
              }}
            >
              {activeCount} active subscribers of{' '}
              {subscribers.length} total
            </p>
          </div>

          {/* EXPORT BUTTON */}

          <button
            onClick={handleExport}
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: '#0F2E23',
              border: '1px solid #0F2E23',
              color: '#FFFFFF',
              padding: '12px 24px',
              cursor: 'pointer',
              borderRadius: '3px',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background =
                '#C8A95D';

              e.currentTarget.style.borderColor =
                '#C8A95D';

              e.currentTarget.style.color =
                '#0F2E23';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background =
                '#0F2E23';

              e.currentTarget.style.borderColor =
                '#0F2E23';

              e.currentTarget.style.color =
                '#FFFFFF';
            }}
          >
            Export CSV
          </button>
        </div>

        {/* =========================
            STATS
        ========================= */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(3, 1fr)',
            gap: '1px',
            background: '#DDE4DF',
            marginBottom: '2.5rem',
            border: '1px solid #DDE4DF',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow:
              '0 6px 24px rgba(15, 46, 35, 0.04)',
          }}
        >
          {[
            {
              label: 'Total Subscribers',
              value: subscribers.length,
            },
            {
              label: 'Active',
              value: activeCount,
            },
            {
              label: 'Unsubscribed',
              value: inactiveCount,
            },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: '#FFFFFF',
                padding: '1.75rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: '#17231E',
                  marginBottom: '0.5rem',
                }}
              >
                {stat.value}
              </div>

              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#718078',
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* =========================
            SEARCH
        ========================= */}

        <div
          style={{
            marginBottom: '1.5rem',
          }}
        >
          <label style={labelStyle}>
            Search Subscribers
          </label>

          <input
            style={inputStyle}
            placeholder="Search by email..."
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
            onFocus={e => {
              e.currentTarget.style.borderColor =
                '#C8A95D';

              e.currentTarget.style.boxShadow =
                '0 0 0 3px rgba(200,169,93,0.12)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor =
                '#DDE4DF';

              e.currentTarget.style.boxShadow =
                'none';
            }}
          />
        </div>

        {/* =========================
            SUBSCRIBERS TABLE
        ========================= */}

        <div
          style={{
            background: '#DDE4DF',
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            border: '1px solid #DDE4DF',
            borderRadius: '4px',
            overflowX: 'auto',
            boxShadow:
              '0 6px 24px rgba(15, 46, 35, 0.04)',
          }}
        >

          {/* TABLE HEADER */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '3fr 1fr 1.2fr 1.5fr',
              gap: '1rem',
              padding: '1rem 1.5rem',
              background: '#0F2E23',
              minWidth: '700px',
            }}
          >
            {[
              'Email',
              'Status',
              'Subscribed',
              'Actions',
            ].map(header => (
              <div
                key={header}
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#EAD9A3',
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
                No subscribers found.
              </p>
            </div>
          ) : (

            /* SUBSCRIBER ROWS */

            filtered.map(subscriber => (
              <div
                key={subscriber.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '3fr 1fr 1.2fr 1.5fr',
                  gap: '1rem',
                  padding: '1.25rem 1.5rem',
                  background: '#FFFFFF',
                  alignItems: 'center',
                  minWidth: '700px',
                  transition:
                    'background 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background =
                    '#F3F5F3';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background =
                    '#FFFFFF';
                }}
              >

                {/* EMAIL */}

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '12px',
                    color: '#17231E',
                    fontWeight: 600,
                  }}
                >
                  {subscriber.email}
                </div>

                {/* STATUS */}

                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--sans)',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '5px 8px',
                      borderRadius: '2px',
                      background:
                        subscriber.is_active
                          ? '#E7F3EC'
                          : '#F9EAEA',
                      color:
                        subscriber.is_active
                          ? '#246B45'
                          : '#A33A3A',
                    }}
                  >
                    {subscriber.is_active
                      ? 'Active'
                      : 'Inactive'}
                  </span>
                </div>

                {/* DATE */}

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '11px',
                    color: '#53605A',
                  }}
                >
                  {subscriber.subscribed_at
                    ? new Date(
                        subscriber.subscribed_at
                      ).toLocaleDateString()
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

                  {/* ENABLE / DISABLE */}

                  <button
                    onClick={() =>
                      handleToggle(
                        subscriber.id,
                        subscriber.is_active
                      )
                    }
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      background: 'transparent',
                      border:
                        '1px solid #C8A95D',
                      color:
                        subscriber.is_active
                          ? '#8A6F32'
                          : '#246B45',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      borderRadius: '2px',
                      transition:
                        'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background =
                        '#C8A95D';

                      e.currentTarget.style.color =
                        '#0F2E23';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background =
                        'transparent';

                      e.currentTarget.style.color =
                        subscriber.is_active
                          ? '#8A6F32'
                          : '#246B45';
                    }}
                  >
                    {subscriber.is_active
                      ? 'Disable'
                      : 'Enable'}
                  </button>

                  {/* REMOVE */}

                  <button
                    onClick={() =>
                      handleDelete(
                        subscriber.id
                      )
                    }
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      background: 'transparent',
                      border:
                        '1px solid #E5CACA',
                      color: '#A33A3A',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      transition:
                        'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background =
                        '#F9EAEA';

                      e.currentTarget.style.borderColor =
                        '#A33A3A';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background =
                        'transparent';

                      e.currentTarget.style.borderColor =
                        '#E5CACA';
                    }}
                  >
                    Remove
                  </button>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}