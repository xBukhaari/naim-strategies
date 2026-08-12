import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

const COLORS = {
  green: '#0F2E23',
  greenDark: '#09251C',
  greenLight: '#163F31',
  activeGreen: '#294333',

  gold: '#C8A95D',
  goldDark: '#B89545',
  goldLight: '#EAD9A3',

  white: '#FFFFFF',
  background: '#F8F9FA',
  ivory: '#FCFBF7',

  text: '#171A18',
  textSecondary: '#59665F',
  textMuted: '#7A857F',

  border: '#E5E7E5',
  divider: '#E1E5E2',

  success: '#22A06B',
  danger: '#C94B4B',
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) {
        setUsers(data || []);
      }

      setLoading(false);
    };

    getUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (!error) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, role: newRole }
            : user
        )
      );
    }

    setUpdating(null);
  };

  const filtered = users.filter(user => {
    const query = search.toLowerCase();

    return (
      user.full_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.organisation?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <AdminLayout>
        <div
          style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: COLORS.background,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                border: `3px solid ${COLORS.goldLight}`,
                borderTopColor: COLORS.gold,
                borderRadius: '50%',
                margin: '0 auto 1rem',
                animation: 'naimSpin 0.8s linear infinite',
              }}
            />

            <p
              style={{
                margin: 0,
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: COLORS.textSecondary,
              }}
            >
              Loading users...
            </p>

            <style>
              {`
                @keyframes naimSpin {
                  to {
                    transform: rotate(360deg);
                  }
                }
              `}
            </style>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div
        style={{
          minHeight: '100%',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          background: COLORS.background,
          color: COLORS.text,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: COLORS.goldDark,
                marginBottom: '0.65rem',
              }}
            >
              Admin
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--sans)',
                fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                lineHeight: 1.1,
                fontWeight: 600,
                color: COLORS.green,
              }}
            >
              Users
            </h1>

            <p
              style={{
                margin: '0.55rem 0 0',
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: COLORS.textSecondary,
              }}
            >
              {users.length} total member{users.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '460px',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: COLORS.textMuted,
                fontSize: '15px',
                pointerEvents: 'none',
              }}
            >
              ⌕
            </span>

            <input
              type="text"
              aria-label="Search users"
              placeholder="Search by name, email or organisation..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                color: COLORS.text,
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                padding: '13px 16px 13px 42px',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(15, 46, 35, 0.03)',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = COLORS.gold;
                e.currentTarget.style.boxShadow =
                  '0 0 0 3px rgba(200, 169, 93, 0.12)';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = COLORS.border;
                e.currentTarget.style.boxShadow =
                  '0 1px 2px rgba(15, 46, 35, 0.03)';
              }}
            />
          </div>
        </div>

        {/* TABLE CARD */}
        <div
          style={{
            background: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 18px rgba(15, 46, 35, 0.04)',
          }}
        >
          {/* TABLE HEADER */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1.2fr 1fr 1fr',
              gap: '1rem',
              padding: '14px 22px',
              background: COLORS.ivory,
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            {['Name', 'Email', 'Organisation', 'Role', 'Joined'].map(header => (
              <div
                key={header}
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: COLORS.green,
                }}
              >
                {header}
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filtered.length === 0 ? (
            <div
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                background: COLORS.white,
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  margin: '0 auto 1rem',
                  borderRadius: '50%',
                  background: COLORS.ivory,
                  border: `1px solid ${COLORS.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: COLORS.goldDark,
                  fontSize: '20px',
                }}
              >
                ◇
              </div>

              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--sans)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: COLORS.text,
                }}
              >
                No users found.
              </p>

              {search && (
                <p
                  style={{
                    margin: '0.5rem 0 0',
                    fontFamily: 'var(--sans)',
                    fontSize: '12px',
                    color: COLORS.textMuted,
                  }}
                >
                  Try adjusting your search.
                </p>
              )}
            </div>
          ) : (
            filtered.map(user => (
              <div
                key={user.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1.2fr 1fr 1fr',
                  gap: '1rem',
                  padding: '17px 22px',
                  background: COLORS.white,
                  alignItems: 'center',
                  borderBottom: `1px solid ${COLORS.divider}`,
                  transition: 'background 0.18s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = COLORS.ivory;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = COLORS.white;
                }}
              >
                {/* NAME */}
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: COLORS.text,
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.full_name || 'No name'}
                  </div>

                  {user.phone && (
                    <div
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '11px',
                        color: COLORS.textMuted,
                      }}
                    >
                      {user.phone}
                    </div>
                  )}
                </div>

                {/* EMAIL */}
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '12px',
                    fontWeight: 450,
                    color: COLORS.textSecondary,
                    wordBreak: 'break-word',
                  }}
                >
                  {user.email || '—'}
                </div>

                {/* ORGANISATION */}
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '12px',
                    color: COLORS.textSecondary,
                  }}
                >
                  {user.organisation || '—'}
                </div>

                {/* ROLE */}
                <div>
                  <select
                    value={user.role || 'member'}
                    disabled={updating === user.id}
                    onChange={e =>
                      handleRoleChange(user.id, e.target.value)
                    }
                    style={{
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      background:
                        user.role === 'admin'
                          ? COLORS.green
                          : COLORS.ivory,
                      border:
                        user.role === 'admin'
                          ? `1px solid ${COLORS.green}`
                          : `1px solid ${COLORS.border}`,
                      borderRadius: '6px',
                      color:
                        user.role === 'admin'
                          ? COLORS.white
                          : COLORS.text,
                      fontFamily: 'var(--sans)',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '7px 28px 7px 10px',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* JOINED */}
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '12px',
                    color: COLORS.textSecondary,
                  }}
                >
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : '—'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}