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
  { label: 'Contact Submissions', path: '/admin/contacts', icon: '✉' },
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

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', display: 'flex', fontFamily: 'var(--sans)' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: '250px', flexShrink: 0,
        background: '#0F2E23',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        boxShadow: '2px 0 12px rgba(0,0,0,0.15)',
      }}>

        {/* LOGO */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #2A4A3D' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'block' }}>
            <img
              src="https://res.cloudinary.com/djxprptlf/image/upload/logo.png"
              alt="NAIM Strategies"
              style={{ height: '42px', width: 'auto' }}
            />
          </Link>
          <div style={{
            fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#C8A95D', marginTop: '0.75rem',
            fontWeight: 600,
          }}>
            Admin Dashboard
          </div>
        </div>

        {/* PROFILE */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #2A4A3D', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#C8A95D', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontFamily: 'var(--sans)', fontSize: '14px', fontWeight: 700, color: '#0F2E23' }}>
              {profile?.full_name?.charAt(0) || 'A'}
            </span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 600, color: '#FFFFFF', marginBottom: '0.1rem' }}>
              {profile?.full_name || 'Admin'}
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: '#7A857F' }}>
              {profile?.email}
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1.5rem', textDecoration: 'none',
              fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 500,
              letterSpacing: '0.03em',
              background: isActive(item.path) ? '#294333' : 'transparent',
              color: isActive(item.path) ? '#C8A95D' : '#FFFFFF',
              borderLeft: isActive(item.path) ? '3px solid #C8A95D' : '3px solid transparent',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = '#163F31';
                  e.currentTarget.style.color = '#EAD9A3';
                }
              }}
              onMouseLeave={e => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#FFFFFF';
                }
              }}
            >
              <span style={{ fontSize: '13px', opacity: 0.8 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* BOTTOM */}
        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #2A4A3D' }}>
          <Link to="/dashboard" style={{
            display: 'block', fontFamily: 'var(--sans)', fontSize: '11px',
            color: '#7A857F', textDecoration: 'none', marginBottom: '0.75rem',
            letterSpacing: '0.05em', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#C8A95D'}
            onMouseLeave={e => e.currentTarget.style.color = '#7A857F'}
          >
            Member Portal →
          </Link>
          <button onClick={handleSignOut} style={{
            width: '100%', fontFamily: 'var(--sans)', fontSize: '11px',
            fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'transparent', border: '1px solid #2A4A3D',
            color: '#7A857F', padding: '0.65rem', cursor: 'pointer',
            transition: 'all 0.3s', borderRadius: '2px',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C94B4B'; e.currentTarget.style.color = '#C94B4B'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A4A3D'; e.currentTarget.style.color = '#7A857F'; }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, marginLeft: '250px', minHeight: '100vh', background: '#F8F9FA' }}>

        {/* TOP BAR */}
        <div style={{
          background: '#FFFFFF', borderBottom: '1px solid #E5E7E5',
          padding: '1rem 2rem', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 40,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: '#7A857F', letterSpacing: '0.05em' }}>
            NAIM Strategies · Admin Panel
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#8A6F32', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C8A95D'}
              onMouseLeave={e => e.currentTarget.style.color = '#8A6F32'}
            >
              View Site →
            </Link>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#0F2E23', display: 'flex', alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 700, color: '#C8A95D' }}>
                {profile?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div style={{ padding: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
}