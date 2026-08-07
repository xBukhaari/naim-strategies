import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const NAV_ITEMS = [
  { label: 'Overview', path: '/admin', icon: '◇' },
  { label: 'Users', path: '/admin/users', icon: '◎' },
  { label: 'Events', path: '/admin/events', icon: '◈' },
  { label: 'Registrations', path: '/admin/registrations', icon: '◉' },
  { label: 'Certificates', path: '/admin/certificates', icon: '❐' },
  { label: 'Resources', path: '/admin/resources', icon: '❏' },
  { label: 'Blog Posts', path: '/admin/blog', icon: '✦' },
  { label: 'Announcements', path: '/admin/announcements', icon: '✧' },
  { label: 'Newsletter', path: '/admin/newsletter', icon: '✉' },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);

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
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', color: '#e8e0d0' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: '240px', flexShrink: 0,
        background: '#0a0a0a', borderRight: '1px solid #ffffff0d',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
      }}>

        {/* LOGO */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #ffffff0d' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img src="https://res.cloudinary.com/djxprptlf/image/upload/logo.png" alt="NAIM Strategies" style={{ height: '40px', width: 'auto' }} />
          </Link>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e', marginTop: '0.75rem' }}>
            Admin Dashboard
          </div>
        </div>

        {/* PROFILE */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #ffffff0d' }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 600, color: '#e8e0d0', marginBottom: '0.2rem' }}>
            {profile?.full_name || 'Admin'}
          </div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: '#504840' }}>
            {profile?.email}
          </div>
        </div>

        {/* NAV */}
        <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1.5rem', textDecoration: 'none',
              fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.05em',
              background: location.pathname === item.path ? '#1a1a1a' : 'transparent',
              color: location.pathname === item.path ? '#c9a96e' : '#504840',
              borderLeft: location.pathname === item.path ? '2px solid #c9a96e' : '2px solid transparent',
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* BOTTOM */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid #ffffff0d' }}>
          <Link to="/dashboard" style={{
            display: 'block', fontFamily: 'var(--sans)', fontSize: '10px',
            color: '#504840', textDecoration: 'none', marginBottom: '0.75rem',
            letterSpacing: '0.1em',
          }}>
            Member Portal →
          </Link>
          <button onClick={handleSignOut} style={{
            width: '100%', fontFamily: 'var(--sans)', fontSize: '10px',
            fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'transparent', border: '1px solid #ffffff0d',
            color: '#504840', padding: '0.65rem', cursor: 'pointer',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#cc0000'; e.currentTarget.style.color = '#cc0000'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#ffffff0d'; e.currentTarget.style.color = '#504840'; }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, marginLeft: '240px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}