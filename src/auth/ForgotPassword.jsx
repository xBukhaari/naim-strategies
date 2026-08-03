import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://naim-strategies.vercel.app/reset-password',
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.5rem' }}>Reset Password</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>
            Enter your email and we will send you a reset link
          </p>
        </div>

        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '3rem' }}>

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '1rem' }}>◇</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.75rem' }}>Check Your Email</h3>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)', lineHeight: 1.8, marginBottom: '2rem' }}>
                We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
              </p>
              <Link to="/login" className="btn btn-gold">Back to Login →</Link>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', padding: '1rem', marginBottom: '1.5rem', fontFamily: 'var(--sans)', fontSize: '13px', color: '#cc0000' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '2rem' }}>
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="your@email.com" required
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <button type="submit" className="btn btn-gold btn-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link →'}
                </button>
              </form>

              <p style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--text-mute)', textAlign: 'center', marginTop: '1.5rem' }}>
                Remember your password? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}