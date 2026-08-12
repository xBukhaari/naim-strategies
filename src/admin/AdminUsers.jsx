import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      setUsers(data || []);
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
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    setUpdating(null);
  };

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.organisation?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#c9a96e', marginBottom: '1rem' }}>◇</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '3rem' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.5rem' }}>
              Admin
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#f0f0f0', marginBottom: '0.25rem' }}>Users</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>
              {users.length} total members
            </p>
          </div>
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
            placeholder="Search by name, email or organisation..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={e => e.target.style.borderColor = '#c9a96e'}
            onBlur={e => e.target.style.borderColor = '#ffffff0d'}
          />
        </div>

        {/* TABLE */}
        <div style={{ background: '#f5f5f5', display: 'flex', flexDirection: 'column', gap: '1px' }}>

          {/* HEADER ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: '1rem', padding: '0.875rem 1.5rem', background: '#f9f9f9' }}>
            {['Name', 'Email', 'Organisation', 'Role', 'Joined'].map(h => (
              <div key={h} style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#504840' }}>{h}</div>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ background: '#ffffff', padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>No users found.</p>
            </div>
          ) : (
            filtered.map((user, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: '1rem', padding: '1.25rem 1.5rem', background: '#ffffff', alignItems: 'center', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
                onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
              >
                <div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 500, color: '#f0f0f0', marginBottom: '0.2rem' }}>
                    {user.full_name || 'No name'}
                  </div>
                  {user.phone && (
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>{user.phone}</div>
                  )}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: '#a09080', wordBreak: 'break-all' }}>
                  {user.email}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: '#504840' }}>
                  {user.organisation || '-'}
                </div>
                <div>
                  <select
                    value={user.role}
                    disabled={updating === user.id}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                    style={{
                      background: '#f0f0f0', border: '1px solid #e0e0e0',
                      color: user.role === 'admin' ? '#c9a96e' : '#a09080',
                      fontFamily: 'var(--sans)', fontSize: '10px',
                      padding: '4px 8px', cursor: 'pointer', outline: 'none',
                    }}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}