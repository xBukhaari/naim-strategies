import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session) {
        setSession(null);
        setLoading(false);
        return;
      }

      setSession(session);

      // Retry up to 3 times in case profile isn't ready yet
      let profile = null;
      let attempts = 0;

      while (!profile && attempts < 3) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (data) {
          profile = data;
        } else {
          attempts++;
          await new Promise(r => setTimeout(r, 500));
        }
      }

      if (mounted) {
        setProfile(profile);
        setLoading(false);
      }
    };

    getSessionAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        if (!session) {
          setProfile(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '1rem' }}>◇</div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>Loading...</p>
        </div>
      </main>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  if (adminOnly && profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}