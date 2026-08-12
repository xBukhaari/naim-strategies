import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

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
    const { data } = await supabase
      .from('registrations')
      .select('*, profiles(full_name, email, phone, organisation), events(title, location, start_date)')
      .order('created_at', { ascending: false });

    setRegistrations(data || []);
    setLoading(false);
  };

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    await supabase
      .from('registrations')
      .update({ status })
      .eq('id', id);

    setRegistrations(registrations.map(r =>
      r.id === id ? { ...r, status } : r
    ));
    setUpdating(null);
  };

  const tabs = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'all', label: 'All' },
  ];

  const filtered = registrations.filter(r => {
    const matchesTab = activeTab === 'all' || r.status === activeTab;
    const matchesSearch =
      r.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.events?.title?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusStyle = (status) => {
    if (status === 'approved') return { bg: '#1b5e20', color: '#a5d6a7' };
    if (status === 'pending') return { bg: '#4a3000', color: '#ffcc80' };
    if (status === 'rejected') return { bg: '#4a0000', color: '#ef9a9a' };
    return { bg: '#f0f0f0', color: '#a09080' };
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#c9a96e', marginBottom: '1rem' }}>◇</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>Loading registrations...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '3rem' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.5rem' }}>
            Admin
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#f0f0f0', marginBottom: '0.25rem' }}>Registrations</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>
            {registrations.filter(r => r.status === 'pending').length} pending approval
          </p>
        </div>

        {/* SEARCH */}
        <div style={{ marginBottom: '2rem' }}>
          <input
            style={{
              background: '#f9f9f9', border: '1px solid #e0e0e0',
              color: '#f0f0f0', fontFamily: 'var(--sans)', fontSize: '13px',
              padding: '12px 16px', width: '100%', maxWidth: '400px',
              outline: 'none', transition: 'border-color 0.3s',
            }}
            placeholder="Search by name, email or event..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={e => e.target.style.borderColor = '#c9a96e'}
            onBlur={e => e.target.style.borderColor = '#ffffff0d'}
          />
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', borderBottom: '1px solid #e0e0e0' }}>
          {tabs.map(tab => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)} style={{
              fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '0.875rem 1.5rem', background: 'transparent', border: 'none',
              borderBottom: activeTab === tab.value ? '2px solid #c9a96e' : '2px solid transparent',
              color: activeTab === tab.value ? '#c9a96e' : '#504840',
              cursor: 'pointer', transition: 'all 0.3s', marginBottom: '-1px',
            }}>
              {tab.label}
              {tab.value === 'pending' && registrations.filter(r => r.status === 'pending').length > 0 && (
                <span style={{ marginLeft: '0.5rem', background: '#f57f17', color: '#f9f9f9', borderRadius: '10px', padding: '1px 6px', fontSize: '9px' }}>
                  {registrations.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div style={{ background: '#f5f5f5', display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: '1rem', padding: '0.875rem 1.5rem', background: '#f9f9f9' }}>
            {['Participant', 'Event', 'Status', 'Registered', 'Actions'].map(h => (
              <div key={h} style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#504840' }}>{h}</div>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ background: '#ffffff', padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>No registrations found.</p>
            </div>
          ) : (
            filtered.map((reg, i) => {
              const statusStyle = getStatusStyle(reg.status);
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: '1rem', padding: '1.25rem 1.5rem', background: '#ffffff', alignItems: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 500, color: '#f0f0f0', marginBottom: '0.2rem' }}>
                      {reg.profiles?.full_name}
                    </div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                      {reg.profiles?.email}
                    </div>
                    {reg.profiles?.organisation && (
                      <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: '#302820' }}>
                        {reg.profiles.organisation}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: '#a09080', marginBottom: '0.2rem' }}>
                      {reg.events?.title}
                    </div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                      {reg.events?.location}
                    </div>
                  </div>

                  <div>
                    <span style={{
                      fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                      textTransform: 'uppercase', padding: '3px 8px',
                      background: statusStyle.bg, color: statusStyle.color,
                    }}>
                      {reg.status}
                    </span>
                  </div>

                  <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                    {new Date(reg.created_at).toLocaleDateString()}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {reg.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(reg.id, 'approved')}
                        disabled={updating === reg.id}
                        style={{
                          fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                          textTransform: 'uppercase', background: '#1b5e20',
                          border: 'none', color: '#a5d6a7',
                          padding: '4px 10px', cursor: 'pointer',
                        }}
                      >
                        Approve
                      </button>
                    )}
                    {reg.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(reg.id, 'rejected')}
                        disabled={updating === reg.id}
                        style={{
                          fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                          textTransform: 'uppercase', background: '#4a0000',
                          border: 'none', color: '#ef9a9a',
                          padding: '4px 10px', cursor: 'pointer',
                        }}
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}