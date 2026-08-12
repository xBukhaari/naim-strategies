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

const COLORS = {
  green: '#0F2E23',
  greenDark: '#09251C',
  greenLight: '#163F31',
  activeGreen: '#294333',

  gold: '#C8A95D',
  goldLight: '#EAD9A3',
  goldDark: '#B89545',

  white: '#FFFFFF',
  background: '#F8F9FA',
  ivory: '#FCFBF7',

  text: '#171A18',
  textSecondary: '#59665F',
  textMuted: '#7A857F',

  border: '#E5E7E5',
};

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

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
    <>
      {/* GLOBAL ADMIN STYLES */}
      <style>
        {`
          .admin-sidebar-scroll {
            scrollbar-width: thin;
            scrollbar-color: #2A4A3D #0F2E23;
          }

          .admin-sidebar-scroll::-webkit-scrollbar {
            width: 6px;
          }

          .admin-sidebar-scroll::-webkit-scrollbar-track {
            background: #0F2E23;
          }

          .admin-sidebar-scroll::-webkit-scrollbar-thumb {
            background: #2A4A3D;
            border-radius: 999px;
            border: 1px solid #0F2E23;
          }

          .admin-sidebar-scroll::-webkit-scrollbar-thumb:hover {
            background: #C8A95D;
          }

          .admin-nav-link {
            position: relative;
          }

          .admin-nav-link::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: transparent;
            transition: background 0.2s ease;
          }

          .admin-nav-link.active::before {
            background: #C8A95D;
          }

          .admin-nav-link:hover {
            background: #163F31 !important;
          }

          .admin-nav-link.active:hover {
            background: #294333 !important;
          }

          .admin-view-site {
            transition: color 0.2s ease;
          }

          .admin-view-site:hover {
            color: #C8A95D !important;
          }

          .admin-signout {
            transition: all 0.2s ease;
          }

          .admin-signout:hover {
            color: #FFFFFF !important;
            border-color: #C8A95D !important;
            background: rgba(200, 169, 93, 0.08) !important;
          }

          @media (max-width: 900px) {
            .admin-sidebar {
              width: 220px !important;
            }

            .admin-main {
              margin-left: 220px !important;
            }
          }

          @media (max-width: 700px) {
            .admin-sidebar {
              width: 210px !important;
            }

            .admin-main {
              margin-left: 210px !important;
            }

            .admin-topbar {
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }

            .admin-page-content {
              padding: 1.25rem !important;
            }
          }
        `}
      </style>

      <div
        style={{
          minHeight: '100vh',
          background: COLORS.background,
          display: 'flex',
          fontFamily: 'var(--sans)',
          color: COLORS.text,
        }}
      >
        {/* =========================================
            SIDEBAR
        ========================================= */}
        <aside
          className="admin-sidebar"
          style={{
            width: '250px',
            flexShrink: 0,
            background: COLORS.green,
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 50,
            boxShadow: '3px 0 18px rgba(9, 37, 28, 0.16)',
            color: COLORS.white,
          }}
        >
          {/* LOGO */}
          <div
            style={{
              padding: '1.4rem 1.5rem 1.25rem 2.25rem',
              borderBottom: '1px solid #2A4A3D',
              flexShrink: 0,
            }}
          >
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                display: 'block',
              }}
            >
              <img
                src="https://res.cloudinary.com/djxprptlf/image/upload/logo.png"
                alt="NAIM Strategies"
                style={{
                  height: '42px',
                  width: 'auto',
                  display: 'block',
                }}
              />
            </Link>

            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '9px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: COLORS.gold,
                marginTop: '0.8rem',
                fontWeight: 700,
              }}
            >
              Admin Dashboard
            </div>
          </div>

          {/* PROFILE */}
          <div
            style={{
              padding: '1.15rem 1.5rem',
              borderBottom: '1px solid #2A4A3D',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: COLORS.gold,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 0 0 3px rgba(200, 169, 93, 0.12)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: COLORS.green,
                }}
              >
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '12px',
                  fontWeight: 650,
                  color: COLORS.white,
                  marginBottom: '0.2rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {profile?.full_name || 'Admin'}
              </div>

              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '10px',
                  color: '#A7B3AD',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {profile?.email || ''}
              </div>
            </div>
          </div>

          {/* NAVIGATION - ONLY THIS AREA SCROLLS */}
          <nav
            className="admin-sidebar-scroll"
            style={{
              flex: 1,
              minHeight: 0,
              padding: '0.65rem 0',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-nav-link ${active ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    minHeight: '45px',
                    boxSizing: 'border-box',
                    padding: '0.7rem 1.5rem',
                    textDecoration: 'none',
                    fontFamily: 'var(--sans)',
                    fontSize: '12px',
                    fontWeight: active ? 650 : 500,
                    letterSpacing: '0.025em',
                    background: active
                      ? COLORS.activeGreen
                      : 'transparent',
                    color: active
                      ? COLORS.goldLight
                      : '#FFFFFF',
                    transition:
                      'background 0.2s ease, color 0.2s ease',
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      color: active
                        ? COLORS.gold
                        : '#A7B3AD',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* BOTTOM */}
          <div
            style={{
              padding: '1rem 1.5rem 1.25rem',
              borderTop: '1px solid #2A4A3D',
              flexShrink: 0,
              background: COLORS.green,
            }}
          >
            <Link
              to="/dashboard"
              style={{
                display: 'block',
                fontFamily: 'var(--sans)',
                fontSize: '11px',
                fontWeight: 500,
                color: '#A7B3AD',
                textDecoration: 'none',
                marginBottom: '0.8rem',
                letterSpacing: '0.05em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = COLORS.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#A7B3AD';
              }}
            >
              Member Portal →
            </Link>

            <button
              className="admin-signout"
              onClick={handleSignOut}
              style={{
                width: '100%',
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                fontWeight: 650,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: 'transparent',
                border: '1px solid #2A4A3D',
                borderRadius: '5px',
                color: '#A7B3AD',
                padding: '0.68rem',
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* =========================================
            MAIN
        ========================================= */}
        <main
          className="admin-main"
          style={{
            flex: 1,
            marginLeft: '250px',
            minHeight: '100vh',
            background: COLORS.background,
            minWidth: 0,
          }}
        >
          {/* TOP BAR */}
          <div
            className="admin-topbar"
            style={{
              height: '64px',
              boxSizing: 'border-box',
              background: COLORS.white,
              borderBottom: `1px solid ${COLORS.border}`,
              padding: '0 2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              zIndex: 40,
              boxShadow: '0 1px 6px rgba(15, 46, 35, 0.04)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '12px',
                fontWeight: 500,
                color: COLORS.textSecondary,
                letterSpacing: '0.045em',
              }}
            >
              <span style={{ color: COLORS.green, fontWeight: 650 }}>
                NAIM Strategies
              </span>

              <span
                style={{
                  color: '#B5BBB8',
                  margin: '0 0.5rem',
                }}
              >
                ·
              </span>

              Admin Panel
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <Link
                className="admin-view-site"
                to="/"
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#8A6F32',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                }}
              >
                View Site →
              </Link>

              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: COLORS.green,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    '0 0 0 3px rgba(15, 46, 35, 0.06)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: COLORS.gold,
                  }}
                >
                  {profile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
            </div>
          </div>

          {/* PAGE CONTENT */}
          <div
            className="admin-page-content"
            style={{
              padding: '2.25rem',
              color: COLORS.text,
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </>
  );
}