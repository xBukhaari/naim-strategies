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
    const { data } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    setSubscribers(data || []);
    setLoading(false);
  };

  const handleToggle = async (id, currentStatus) => {
    await supabase
      .from('newsletter_subscribers')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    setSubscribers(subscribers.map(s =>
      s.id === id ? { ...s, is_active: !currentStatus } : s
    ));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return;
    await supabase.from('newsletter_subscribers').delete().eq('id', id);
    setSubscribers(subscribers.filter(s => s.id !== id));
  };

  const handleExport = () => {
    const active = subscribers.filter(s => s.is_active);
    const csv = [
      'Email,Subscribed Date,Status',
      ...active.map(s => `${s.email},${new Date(s.subscribed_at).toLocaleDateString()},Active`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `naim-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter(s =>
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = subscribers.filter(s => s.is_active).length;

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#c9a96e', marginBottom: '1rem' }}>◇</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>Loading subscribers...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '3rem' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.5rem' }}>Admin</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.25rem' }}>Newsletter</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>
              {activeCount} active subscribers of {subscribers.length} total
            </p>
          </div>
          <button onClick={handleExport} style={{
            fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            background: '#c9a96e', border: 'none', color: '#0a0a0a',
            padding: '12px 24px', cursor: 'pointer',
          }}>
            Export CSV
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#ffffff08', marginBottom: '3rem' }}>
          {[
            { label: 'Total Subscribers', value: subscribers.length },
            { label: 'Active', value: activeCount },
            { label: 'Unsubscribed', value: subscribers.length - activeCount },
          ].map((s, i) => (
            <div key={i} style={{ background: '#0a0a0a', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '2.5rem', fontWeight: 600, color: '#c9a96e', marginBottom: '0.5rem' }}>{s.value}</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#504840' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div style={{ marginBottom: '2rem' }}>
          <input
            style={{
              background: '#0a0a0a', border: '1px solid #ffffff0d',
              color: '#1a1a1a', fontFamily: 'var(--sans)', fontSize: '13px',
              padding: '12px 16px', width: '100%', maxWidth: '400px',
              outline: 'none', transition: 'border-color 0.3s',
            }}
            placeholder="Search by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={e => e.target.style.borderColor = '#c9a96e'}
            onBlur={e => e.target.style.borderColor = '#ffffff0d'}
          />
        </div>

        {/* TABLE */}
        <div style={{ background: '#ffffff08', display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', gap: '1rem', padding: '0.875rem 1.5rem', background: '#0a0a0a' }}>
            {['Email', 'Status', 'Subscribed', 'Actions'].map(h => (
              <div key={h} style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#504840' }}>{h}</div>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ background: '#0f0f0f', padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>No subscribers found.</p>
            </div>
          ) : (
            filtered.map((sub, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', gap: '1rem', padding: '1rem 1.5rem', background: '#0f0f0f', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.background = '#141414'}
                onMouseLeave={e => e.currentTarget.style.background = '#0f0f0f'}
              >
                <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: '#1a1a1a' }}>
                  {sub.email}
                </div>
                <div>
                  <span style={{
                    fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                    textTransform: 'uppercase', padding: '3px 8px',
                    background: sub.is_active ? '#1b5e20' : '#4a0000',
                    color: sub.is_active ? '#a5d6a7' : '#ef9a9a',
                  }}>
                    {sub.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                  {new Date(sub.subscribed_at).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleToggle(sub.id, sub.is_active)} style={{
                    fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                    textTransform: 'uppercase', background: 'transparent',
                    border: '1px solid #ffffff0d',
                    color: sub.is_active ? '#ffcc80' : '#a5d6a7',
                    padding: '4px 10px', cursor: 'pointer',
                  }}>
                    {sub.is_active ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => handleDelete(sub.id)} style={{
                    fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                    textTransform: 'uppercase', background: 'transparent',
                    border: '1px solid #ffffff0d', color: '#ef9a9a',
                    padding: '4px 10px', cursor: 'pointer',
                  }}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}