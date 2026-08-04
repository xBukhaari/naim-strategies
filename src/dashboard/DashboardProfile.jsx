import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import DashboardLayout from './DashboardLayout';

export default function DashboardProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(data);
      setLoading(false);
    };

    getData();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        organisation: profile.organisation,
      })
      .eq('id', profile.id);

    setSaving(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Profile updated successfully.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword,
    });

    setSaving(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password updated successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}>◇</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>Loading profile...</p>
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
          <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>My Profile</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>
            Manage your personal information and account settings.
          </p>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)' }}>
          {[
            { value: 'profile', label: 'Personal Info' },
            { value: 'password', label: 'Change Password' },
          ].map(tab => (
            <button key={tab.value} onClick={() => { setActiveTab(tab.value); setError(''); setSuccess(''); }} style={{
              fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '0.875rem 1.5rem', background: 'transparent', border: 'none',
              borderBottom: activeTab === tab.value ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === tab.value ? 'var(--accent)' : 'var(--text-mute)',
              cursor: 'pointer', transition: 'all 0.3s', marginBottom: '-1px',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ALERTS */}
        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', padding: '1rem', marginBottom: '1.5rem', fontFamily: 'var(--sans)', fontSize: '13px', color: '#cc0000' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#f0fff4', border: '1px solid #b2dfdb', padding: '1rem', marginBottom: '1.5rem', fontFamily: 'var(--sans)', fontSize: '13px', color: '#1b5e20' }}>
            {success}
          </div>
        )}

        {/* PROFILE FORM */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} style={{ maxWidth: '600px' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" value={profile?.full_name || ''}
                onChange={e => setProfile({ ...profile, full_name: e.target.value })} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={profile?.email || ''} disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-mute)', marginTop: '0.5rem' }}>
                Email cannot be changed. Contact support if needed.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="form-row">
              <div>
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" value={profile?.phone || ''}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Organisation</label>
                <input className="form-input" type="text" value={profile?.organisation || ''}
                  onChange={e => setProfile({ ...profile, organisation: e.target.value })} />
              </div>
            </div>

            <button type="submit" className="btn btn-gold" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes →'}
            </button>
          </form>
        )}

        {/* PASSWORD FORM */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange} style={{ maxWidth: '480px' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" placeholder="Minimum 8 characters"
                value={passwordData.newPassword}
                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" placeholder="Repeat new password"
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
            </div>

            <button type="submit" className="btn btn-gold" disabled={saving}>
              {saving ? 'Updating...' : 'Update Password →'}
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}