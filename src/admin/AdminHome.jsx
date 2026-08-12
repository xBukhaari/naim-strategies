import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';
import { colors, pageTitle, pageSubtitle, sectionLabel, card, tableHeaderCell, statusBadge, btnPrimary } from './adminStyles';

export default function AdminHome() {
  const [stats, setStats] = useState({
    users: 0, events: 0, registrations: 0,
    pending: 0, certificates: 0, subscribers: 0,
  });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const [usersRes, eventsRes, regRes, pendingRes, certRes, subRes, recentRegRes] = await Promise.all([
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
    { label: 'Total Users', value: stats.users, path: '/admin/users', icon: '◎' },
    { label: 'Total Events', value: stats.events, path: '/admin/events', icon: '◈' },
    { label: 'Registrations', value: stats.registrations, path: '/admin/registrations', icon: '◉' },
    { label: 'Pending Approval', value: stats.pending, path: '/admin/registrations', icon: '⚠', urgent: true },
    { label: 'Certificates Issued', value: stats.certificates, path: '/admin/certificates', icon: '❐' },
    { label: 'Newsletter Subscribers', value: stats.subscribers, path: '/admin/newsletter', icon: '✉' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: colors.gold, marginBottom: '1rem' }}>◇</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: colors.textMuted }}>Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      {/* PAGE HEADER */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={sectionLabel}>Admin Dashboard</div>
        <h1 style={pageTitle}>Overview</h1>
        <p style={pageSubtitle}>Welcome to the NAIM Strategies admin panel.</p>
      </div>

      {/* PENDING ALERT */}
      {stats.pending > 0 && (
        <div style={{ background: colors.pendingLight, border: `1px solid ${colors.pending}`, borderLeft: `4px solid ${colors.pending}`, padding: '1rem 1.5rem', marginBottom: '2rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 600, color: colors.pending, marginBottom: '0.25rem' }}>
              {stats.pending} Registration{stats.pending > 1 ? 's' : ''} Awaiting Approval
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: '#8a6a00' }}>
              Review and approve pending participant registrations.
            </div>
          </div>
          <Link to="/admin/registrations" style={{ fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.pending, textDecoration: 'none', border: `1px solid ${colors.pending}`, padding: '8px 16px', borderRadius: '2px' }}>
            Review Now →
          </Link>
        </div>
      )}

      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }} className="admin-stats">
        {statCards.map((s, i) => (
          <Link key={i} to={s.path} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#FFFFFF', border: `1px solid ${colors.border}`, borderRadius: '6px', padding: '1.5rem', transition: 'all 0.2s', borderTop: s.urgent && stats.pending > 0 ? `3px solid ${colors.pending}` : `3px solid ${colors.gold}` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: colors.textSecondary }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '1.2rem', color: s.urgent ? colors.pending : colors.gold }}>{s.icon}</div>
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', fontWeight: 700, color: s.urgent && stats.pending > 0 ? colors.pending : colors.green }}>
                {s.value}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* RECENT REGISTRATIONS */}
      <div style={{ ...card, marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: colors.textPrimary }}>Recent Registrations</h2>
          <Link to="/admin/registrations" style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: colors.gold, textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
        </div>

        {recentRegistrations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: colors.textMuted, fontFamily: 'var(--sans)', fontSize: '13px' }}>
            No registrations yet.
          </div>
        ) : (
          <div style={{ border: `1px solid ${colors.border}`, borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: '1rem', padding: '0.75rem 1.25rem', background: '#F8F9FA', borderBottom: `1px solid ${colors.border}` }}>
              {['Participant', 'Event', 'Status', 'Date'].map(h => (
                <div key={h} style={tableHeaderCell}>{h}</div>
              ))}
            </div>
            {recentRegistrations.map((reg, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: '1rem', padding: '1rem 1.25rem', background: '#FFFFFF', borderBottom: i < recentRegistrations.length - 1 ? `1px solid ${colors.border}` : 'none', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 600, color: colors.textPrimary, marginBottom: '0.15rem' }}>{reg.profiles?.full_name}</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: colors.textMuted }}>{reg.profiles?.email}</div>
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: colors.textSecondary }}>{reg.events?.title}</div>
                <div><span style={statusBadge(reg.status)}>{reg.status}</span></div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: colors.textMuted }}>{new Date(reg.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div style={card}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: colors.textPrimary, marginBottom: '1.5rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: '+ Create Event', path: '/admin/events' },
            { label: '+ Write Blog Post', path: '/admin/blog' },
            { label: '+ Post Announcement', path: '/admin/announcements' },
            { label: '+ Issue Certificate', path: '/admin/certificates' },
          ].map((action, i) => (
            <Link key={i} to={action.path} style={{ ...btnPrimary, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = colors.goldHover}
              onMouseLeave={e => e.currentTarget.style.background = colors.gold}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .admin-stats { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .admin-stats { grid-template-columns: 1fr !important; } }
      `}</style>
    </AdminLayout>
  );
}