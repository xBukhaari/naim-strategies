import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

export default function AdminHome() {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    registrations: 0,
    pending: 0,
    certificates: 0,
    subscribers: 0,
  });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const [
        usersRes,
        eventsRes,
        regRes,
        pendingRes,
        certRes,
        subRes,
        recentRegRes,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('registrations').select('id', { count: 'exact' }),
        supabase.from('registrations').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('certificates').select('id', { count: 'exact' }),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('registrations').select('*, profiles(full_name, email), events(title)').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        users: usersRes.count || 0,
        events: eventsRes.count || 0,
        registrations: regRes.count || 0,
        pending: pendingRes.count || 0,
        certificates: certRes.count || 0,
        subscribers: subRes.count || 0,
      });

      setRecentRegistrations(recentRegRes.data || []);
      setLoading(false);
    };

    getData();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.users, color: '#c9a96e', path: '/admin/users' },
    { label: 'Total Events', value: stats.events, color: '#c9a96e', path: '/admin/events' },
    { label: 'Registrations', value: stats.registrations, color: '#c9a96e', path: '/admin/registrations' },
    { label: 'Pending Approval', value: stats.pending, color: '#f57f17', path: '/admin/registrations' },
    { label: 'Certificates Issued', value: stats.certificates, color: '#c9a96e', path: '/admin/certificates' },
    { label: 'Newsletter Subscribers', value: stats.subscribers, color: '#c9a96e', path: '/admin/newsletter' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#c9a96e', marginBottom: '1rem' }}>◇</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>Loading dashboard...</p>
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
            Admin Dashboard
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#e8e0d0', marginBottom: '0.5rem' }}>
            Overview
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>
            Welcome to the NAIM Strategies admin panel.
          </p>
        </div>

        {/* STATS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#ffffff08', marginBottom: '3rem' }} className="admin-stats">
          {statCards.map((s, i) => (
            <Link key={i} to={s.path} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#0a0a0a', padding: '2rem', transition: 'background 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#141414'}
                onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}
              >
                <div style={{ fontFamily: 'var(--sans)', fontSize: '2.5rem', fontWeight: 600, color: s.color, marginBottom: '0.5rem' }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#504840' }}>
                  {s.label}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* PENDING ALERT */}
        {stats.pending > 0 && (
          <div style={{ background: '#1a1500', border: '1px solid #f57f17', borderLeft: '4px solid #f57f17', padding: '1.25rem 1.5rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 600, color: '#f57f17', marginBottom: '0.25rem' }}>
                {stats.pending} Registration{stats.pending > 1 ? 's' : ''} Awaiting Approval
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: '#806000' }}>
                Review and approve pending participant registrations.
              </div>
            </div>
            <Link to="/admin/registrations" style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f57f17', textDecoration: 'none', border: '1px solid #f57f17', padding: '8px 16px' }}>
              Review Now →
            </Link>
          </div>
        )}

        {/* RECENT REGISTRATIONS */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#e8e0d0' }}>Recent Registrations</h2>
            <Link to="/admin/registrations" style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#c9a96e', textDecoration: 'none' }}>
              View All →
            </Link>
          </div>

          {recentRegistrations.length === 0 ? (
            <div style={{ background: '#0a0a0a', border: '1px solid #ffffff08', padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>No registrations yet.</p>
            </div>
          ) : (
            <div style={{ background: '#ffffff08', display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {/* TABLE HEADER */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: '1rem', padding: '0.875rem 1.5rem', background: '#0a0a0a' }}>
                {['Participant', 'Event', 'Status', 'Date'].map(h => (
                  <div key={h} style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#504840' }}>{h}</div>
                ))}
              </div>

              {recentRegistrations.map((reg, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: '1rem', padding: '1rem 1.5rem', background: '#0f0f0f', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 500, color: '#e8e0d0', marginBottom: '0.2rem' }}>
                      {reg.profiles?.full_name}
                    </div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                      {reg.profiles?.email}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: '#a09080' }}>
                    {reg.events?.title}
                  </div>
                  <div>
                    <span style={{
                      fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                      textTransform: 'uppercase', padding: '3px 8px',
                      background: reg.status === 'approved' ? '#1b5e20' : reg.status === 'pending' ? '#4a3000' : '#4a0000',
                      color: reg.status === 'approved' ? '#a5d6a7' : reg.status === 'pending' ? '#ffcc80' : '#ef9a9a',
                    }}>
                      {reg.status}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                    {new Date(reg.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#e8e0d0', marginBottom: '1.5rem' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Create Event', path: '/admin/events/new' },
              { label: 'Write Blog Post', path: '/admin/blog/new' },
              { label: 'Post Announcement', path: '/admin/announcements/new' },
              { label: 'Issue Certificate', path: '/admin/certificates' },
            ].map((action, i) => (
              <Link key={i} to={action.path} style={{
                fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '12px 20px', border: '1px solid #ffffff0d',
                color: '#a09080', textDecoration: 'none', transition: 'all 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a96e'; e.currentTarget.style.color = '#c9a96e'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#ffffff0d'; e.currentTarget.style.color = '#a09080'; }}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-stats { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .admin-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AdminLayout>
  );
}