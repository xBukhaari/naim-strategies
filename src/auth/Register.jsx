```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    organisation: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError(
        'Password must be at least 8 characters.'
      );
      return;
    }

    setLoading(true);

    const { error: signUpError } =
      await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            phone: formData.phone,
            organisation:
              formData.organisation,
          },
        },
      });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'var(--bg)',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '3rem',
              color: 'var(--accent)',
              marginBottom: '1.5rem',
            }}
          >
            ◇
          </div>

          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            Check Your Email
          </h2>

          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '14px',
              lineHeight: 1.8,
              color: 'var(--text-mute)',
              marginBottom: '2rem',
            }}
          >
            We sent a verification link to{' '}
            <strong>
              {formData.email}
            </strong>
            . Click the link to activate
            your account.
          </p>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="btn btn-gold"
          >
            Go to Login →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
        }}
      >
        {/* LOGO */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
          }}
        >
          <Link to="/">
            <img
              src="https://res.cloudinary.com/djxprptlf/image/upload/logo.png"
              alt="NAIM Strategies"
              style={{
                height: '60px',
                width: 'auto',
              }}
            />
          </Link>

          <h1
            style={{
              fontSize: '1.8rem',
              fontWeight: 600,
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            }}
          >
            Create Your Account
          </h1>

          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              color: 'var(--text-mute)',
            }}
          >
            Join the NAIM Strategies member
            portal
          </p>
        </div>

        {/* FORM */}
        <div
          style={{
            background: 'var(--bg-2)',
            border:
              '1px solid var(--border)',
            padding: '3rem',
          }}
        >
          {error && (
            <div
              style={{
                background: '#fff0f0',
                border:
                  '1px solid #ffcccc',
                padding: '1rem',
                marginBottom: '1.5rem',
                fontFamily:
                  'var(--sans)',
                fontSize: '13px',
                color: '#cc0000',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div
              style={{
                marginBottom: '1.5rem',
              }}
            >
              <label className="form-label">
                Full Name *
              </label>

              <input
                className="form-input"
                type="text"
                placeholder="Your full name"
                required
                value={
                  formData.full_name
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    full_name:
                      e.target.value,
                  })
                }
              />
            </div>

            <div
              style={{
                marginBottom: '1.5rem',
              }}
            >
              <label className="form-label">
                Email Address *
              </label>

              <input
                className="form-input"
                type="email"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email:
                      e.target.value,
                  })
                }
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: '1.5rem',
                marginBottom: '1.5rem',
              }}
              className="register-contact-grid"
            >
              <div>
                <label className="form-label">
                  Phone
                </label>

                <input
                  className="form-input"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={
                    formData.phone
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="form-label">
                  Organisation
                </label>

                <input
                  className="form-input"
                  type="text"
                  placeholder="Your organisation"
                  value={
                    formData.organisation
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organisation:
                        e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div
              style={{
                marginBottom: '1.5rem',
              }}
            >
              <label className="form-label">
                Password *
              </label>

              <input
                className="form-input"
                type="password"
                placeholder="Minimum 8 characters"
                required
                minLength={8}
                value={
                  formData.password
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password:
                      e.target.value,
                  })
                }
              />
            </div>

            <div
              style={{
                marginBottom: '2rem',
              }}
            >
              <label className="form-label">
                Confirm Password *
              </label>

              <input
                className="form-input"
                type="password"
                placeholder="Repeat your password"
                required
                minLength={8}
                value={
                  formData.confirmPassword
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword:
                      e.target.value,
                  })
                }
              />
            </div>

            <button
              type="submit"
              className="btn btn-gold btn-full"
              disabled={loading}
            >
              {loading
                ? 'Creating Account...'
                : 'Create Account →'}
            </button>
          </form>

          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '12px',
              color: 'var(--text-mute)',
              textAlign: 'center',
              marginTop: '1.5rem',
            }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .register-contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
```
