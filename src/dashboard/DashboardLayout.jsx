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

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      setProfile(data);
    };

    getProfile();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
      }}
    >
      {/* SIDEBAR */}
      <aside
        className="dashboard-sidebar"
        style={{
          width: '260px',
          flexShrink: 0,
          background: 'var(--bg-2)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
        }}
      >
        {/* LOGO */}
        <div
          style={{
            padding: '2rem 1.5rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <img
              src="https://res.cloudinary.com/djxprptlf/image/upload/logo.png"
              alt="NAIM Strategies"
              style={{
                height: '45px',
                width: 'auto',
                display: 'block',
              }}
            />
          </Link>
        </div>

        {/* PROFILE SUMMARY */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '16px',
                fontWeight: 600,
                color: '#ffffff',
              }}
            >
              {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>

          <div
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: '0.25rem',
            }}
          >
            {profile?.full_name || 'Member'}
          </div>

          <div
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '11px',
              color: 'var(--text-mute)',
              wordBreak: 'break-word',
            }}
          >
            {profile?.email || ''}
          </div>
        </div>

        {/* NAV LINKS */}
        <nav
          style={{
            flex: 1,
            padding: '1rem 0',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1.5rem',
                  textDecoration: 'none',
                  fontFamily: 'var(--sans)',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  background: isActive
                    ? 'var(--accent)'
                    : 'transparent',
                  color: isActive
                    ? '#ffffff'
                    : 'var(--text-mute)',
                  borderLeft: isActive
                    ? '3px solid var(--gold)'
                    : '3px solid transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-3)';
                    e.currentTarget.style.color = 'var(--text)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-mute)';
                  }
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    width: '18px',
                    textAlign: 'center',
                  }}
                >
                  {item.icon}
                </span>

                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* SIGN OUT */}
        <div
          style={{
            padding: '1.5rem',
            borderTop: '1px solid var(--border)',
          }}
        >
          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              fontFamily: 'var(--sans)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-mute)',
              padding: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#cc0000';
              e.currentTarget.style.color = '#cc0000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-mute)';
            }}
          >
            Sign Out
          </button>

          <Link
            to="/"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: '0.75rem',
              fontFamily: 'var(--sans)',
              fontSize: '11px',
              color: 'var(--text-mute)',
              textDecoration: 'none',
            }}
          >
            ← Back to main site
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className="dashboard-main"
        style={{
          flex: 1,
          marginLeft: '260px',
          minHeight: '100vh',
          width: 'calc(100% - 260px)',
        }}
      >
        {children}
      </main>

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-sidebar {
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            top: auto !important;
            left: auto !important;
            bottom: auto !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
          }

          .dashboard-main {
            margin-left: 0 !important;
            width: 100% !important;
          }

          .dashboard-sidebar nav {
            display: flex !important;
            overflow-x: auto !important;
            padding: 0.5rem 0 !important;
            flex: none !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }

          .dashboard-sidebar nav::-webkit-scrollbar {
            display: none;
          }

          .dashboard-sidebar nav a {
            flex: 0 0 auto !important;
            border-left: none !important;
            border-bottom: 3px solid transparent;
            padding: 0.875rem 1rem !important;
            white-space: nowrap;
          }

          .dashboard-sidebar nav a:hover {
            background: transparent !important;
          }

          .dashboard-sidebar nav a[style*="var(--accent)"] {
            border-bottom-color: var(--gold) !important;
          }
        }
      `}</style>
    </div>
  );
}