import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate('/login?reset=success');
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '460px', width: '100%' }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Link to="/">
            <img src="https://res.cloudinary.com/djxprptlf/image/upload/logo.png" alt="NAIM Strategies" style={{ height: '60px', width: 'auto' }} />
          </Link>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.5rem' }}>Set New Password</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>
            Choose a strong password for your account
          </p>
        </div>

        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '3rem' }}>
          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', padding: '1rem', marginBottom: '1.5rem', fontFamily: 'var(--sans)', fontSize: '13px', color: '#cc0000' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" placeholder="Minimum 8 characters" required
                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" placeholder="Repeat your new password" required
                value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
            </div>

            <button type="submit" className="btn btn-gold btn-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password →'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}