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

  const handleExport = () => {
    const active = subscribers.filter(sub => sub.is_active);

    const csv = [
      'Email,Subscribed Date,Status',
      ...active.map(sub =>
        `"${sub.email}","${new Date(
          sub.subscribed_at
        ).toLocaleDateString()}","Active"`
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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

  const filtered = subscribers.filter(sub =>
    sub.email?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = subscribers.filter(
    sub => sub.is_active
  ).length;

  const inactiveCount = subscribers.length - activeCount;

  const inputStyle = {
    background: '#FFFFFF',
    border: '1px solid #E5E7E5',
    color: '#0F2E23',
    fontFamily: 'var(--sans)',
    fontSize: '13px',
    padding: '12px 16px',
    width: '100%',
    maxWidth: '400px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    borderRadius: '2px',
    boxSizing: 'border-box',
  };

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
              Loading subscribers...
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
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
              Newsletter
            </h1>

            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: '#7A857F',
                margin: 0,
              }}
            >
              {activeCount} active subscribers of{' '}
              {subscribers.length} total
            </p>
          </div>

          <button
            onClick={handleExport}
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: '#C8A95D',
              border: 'none',
              color: '#0F2E23',
              padding: '12px 24px',
              cursor: 'pointer',
              borderRadius: '2px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#B5964C';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#C8A95D';
            }}
          >
            Export CSV
          </button>
        </div>

        {/* STATS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: '#E5E7E5',
            marginBottom: '2.5rem',
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
                  color: '#0F2E23',
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
                  color: '#7A857F',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            style={inputStyle}
            placeholder="Search by email..."
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

        {/* TABLE */}
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
              gridTemplateColumns: '3fr 1fr 1fr 1.5fr',
              gap: '1rem',
              padding: '0.875rem 1.5rem',
              background: '#F8F9FA',
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
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#7A857F',
                }}
              >
                {header}
              </div>
            ))}
          </div>

          {/* TABLE ROWS */}
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
                No subscribers found.
              </p>
            </div>
          ) : (
            filtered.map(subscriber => (
              <div
                key={subscriber.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 1fr 1fr 1.5fr',
                  gap: '1rem',
                  padding: '1rem 1.5rem',
                  background: '#FFFFFF',
                  alignItems: 'center',
                  minWidth: '700px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#F8F9FA';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#FFFFFF';
                }}
              >
                {/* EMAIL */}
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '12px',
                    color: '#0F2E23',
                    fontWeight: 500,
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
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '4px 8px',
                      background: subscriber.is_active
                        ? '#E8F3EA'
                        : '#F5E8E8',
                      color: subscriber.is_active
                        ? '#2E6B35'
                        : '#A33A3A',
                      borderRadius: '2px',
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
                    color: '#7A857F',
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
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      background: 'transparent',
                      border: '1px solid #E5E7E5',
                      color: subscriber.is_active
                        ? '#8A6F32'
                        : '#2E6B35',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      borderRadius: '2px',
                    }}
                  >
                    {subscriber.is_active
                      ? 'Disable'
                      : 'Enable'}
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(subscriber.id)
                    }
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