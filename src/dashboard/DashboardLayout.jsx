import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const NAV_ITEMS = [
  { label: 'Overview', path: '/dashboard', icon: '◇' },
  { label: 'My Events', path: '/dashboard/events', icon: '◈' },
  { label: 'Certificates', path: '/dashboard/certificates', icon: '◉' },
  { label: 'Profile', path: '/dashboard/profile', icon: '◎' },
];

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(data);
    };

    getProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: '260px', flexShrink: 0,
        background: 'var(--bg-2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
      }} className="dashboard-sidebar">

        {/* LOGO */}
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img src="https://res.cloudinary.com/djxprptlf/image/upload/logo.png" alt="NAIM Strategies" style={{ height: '45px', width: 'auto' }} />
          </Link>
        </div>

        {/* PROFILE SUMMARY */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--sans)', fontSize: '16px', fontWeight: 600, color: '#ffffff' }}>
              {profile?.full_name?.charAt(0) || '?'}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>
            {profile?.full_name || 'Member'}
          </div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-mute)' }}>
            {profile?.email}
          </div>
        </div>

        {/* NAV LINKS */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {NAV_ITEMS.map(item => (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.875rem 1.5rem', textDecoration: 'none',
              fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 500,
              letterSpacing: '0.05em',
              background: location.pathname === item.path ? 'var(--accent)' : 'transparent',
              color: location.pathname === item.path ? '#ffffff' : 'var(--text-mute)',
              borderLeft: location.pathname === item.path ? '3px solid var(--gold)' : '3px solid transparent',
              transition: 'all 0.2s',
            }}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* SIGN OUT */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={handleSignOut} style={{
            width: '100%', fontFamily: 'var(--sans)', fontSize: '11px',
            fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text-mute)', padding: '0.75rem', cursor: 'pointer',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#cc0000'; e.currentTarget.style.color = '#cc0000'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-mute)'; }}
          >
            Sign Out
          </button>
          <Link to="/" style={{
            display: 'block', textAlign: 'center', marginTop: '0.75rem',
            fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-mute)',
            textDecoration: 'none',
          }}>← Back to main site</Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: '260px', minHeight: '100vh' }} className="dashboard-main">
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-sidebar { transform: translateX(-100%); transition: transform 0.3s; }
          .dashboard-main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}