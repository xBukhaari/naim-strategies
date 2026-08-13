import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      let profile = null;
let attempts = 0;

while (!profile && attempts < 5) {
  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profileData) {
    profile = profileData;
  } else {
    attempts++;
    await new Promise(r => setTimeout(r, 500));
  }
}

if (profile?.role === 'admin') {
  navigate('/admin');
} else {
  navigate('/dashboard');
}
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>
            Sign in to your member portal
          </p>
        </div>

        {/* FORM */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '3rem' }}>
          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', padding: '1rem', marginBottom: '1.5rem', fontFamily: 'var(--sans)', fontSize: '13px', color: '#cc0000' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="your@email.com" required
                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Your password" required
                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
              <Link to="/forgot-password" style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn btn-gold btn-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--text-mute)', textAlign: 'center', marginTop: '1.5rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>

        {/* BACK TO SITE */}
        <p style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--text-mute)', textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-mute)', textDecoration: 'none' }}>← Back to main site</Link>
        </p>
      </div>
    </main>
  );
}