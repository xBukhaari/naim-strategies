import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        navigate('/login');
        return;
      }

      // Retry profile fetch up to 5 times
      let profile = null;
      let attempts = 0;

      while (!profile && attempts < 5) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();

        if (profileData) {
          profile = profileData;
        } else {
          attempts++;
          await new Promise(r => setTimeout(r, 600));
        }
      }

      if (profile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '1rem', animation: 'fadeUp 0.8s ease both' }}>◇</div>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)', letterSpacing: '0.1em' }}>
          Verifying your account...
        </p>
      </div>
    </main>
  );
}