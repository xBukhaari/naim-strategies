import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DashboardLayout from './DashboardLayout';

export default function DashboardEvents() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('registrations')
        .select('*, events(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      setRegistrations(data || []);
      setLoading(false);
    };

    getData();
  }, []);

  const tabs = [
    { value: 'all', label: 'All' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending Approval' },
  ];

  const filtered = registrations.filter(r => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return r.status === 'pending';
    return r.events?.status === activeTab && r.status === 'approved';
  });

  const getStatusColor = (status) => {
    if (status === 'approved') return { bg: '#e8f5e9', color: '#2e7d32' };
    if (status === 'pending') return { bg: '#fff8e1', color: '#f57f17' };
    if (status === 'rejected') return { bg: '#ffebee', color: '#c62828' };
    return { bg: 'var(--bg-3)', color: 'var(--text-mute)' };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}>◇</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>Loading your events...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '3rem' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem' }}>
            Member Portal
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>My Events</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>
            All your registered programmes and their current status.
          </p>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)} style={{
              fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '0.875rem 1.5rem', background: 'transparent', border: 'none',
              borderBottom: activeTab === tab.value ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === tab.value ? 'var(--accent)' : 'var(--text-mute)',
              cursor: 'pointer', transition: 'all 0.3s', marginBottom: '-1px',
              whiteSpace: 'nowrap',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* EVENTS LIST */}
        {filtered.length === 0 ? (
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '4rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: 'var(--text-mute)', marginBottom: '1rem' }}>◇</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)', marginBottom: '1.5rem' }}>
              No events found in this category.
            </p>
            <Link to="/events" className="btn btn-gold">Browse Events →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
            {filtered.map((reg, i) => {
              const statusStyle = getStatusColor(reg.status);
              return (
                <div key={i} style={{ background: 'var(--bg-2)', padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.25rem' }}>{reg.events?.title}</h3>
                      <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-mute)' }}>
                        {reg.events?.location} · {reg.events?.event_type}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.15em',
                        textTransform: 'uppercase', padding: '4px 10px',
                        background: statusStyle.bg, color: statusStyle.color,
                      }}>
                        {reg.status === 'pending' ? 'Pending Approval' : reg.events?.status}
                      </span>
                      {reg.status === 'approved' && (
                        <Link to={`/dashboard/events/${reg.event_id}`} className="btn btn-gold" style={{ fontSize: '9px' }}>
                          Open Workspace →
                        </Link>
                      )}
                    </div>
                  </div>

                  {reg.events?.start_date && (
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-mute)' }}>
                      Date: {new Date(reg.events.start_date).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  )}

                  {reg.status === 'pending' && (
                    <div style={{ marginTop: '1rem', fontFamily: 'var(--sans)', fontSize: '12px', color: '#f57f17', background: '#fff8e1', padding: '0.75rem 1rem', borderLeft: '3px solid #f57f17' }}>
                      Your registration is pending payment verification. You will receive a confirmation once approved.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}