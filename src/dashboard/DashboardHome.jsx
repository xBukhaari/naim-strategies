import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DashboardLayout from './DashboardLayout';

export default function DashboardHome() {
  const [profile, setProfile] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [profileRes, regRes, certRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('registrations').select('*, events(*)').eq('user_id', session.user.id),
        supabase.from('certificates').select('*').eq('user_id', session.user.id),
      ]);

      setProfile(profileRes.data);
      setRegistrations(regRes.data || []);
      setCertificates(certRes.data || []);
      setLoading(false);
    };

    getData();
  }, []);

  const upcoming = registrations.filter(r => r.events?.status === 'upcoming' && r.status === 'approved');
  const ongoing = registrations.filter(r => r.events?.status === 'ongoing' && r.status === 'approved');
  const completed = registrations.filter(r => r.events?.status === 'completed' && r.status === 'approved');
  const pending = registrations.filter(r => r.status === 'pending');

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}>◇</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>Loading your dashboard...</p>
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
          <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Member'}.
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>
            Here is an overview of your activity with NAIM Strategies.
          </p>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)', marginBottom: '3rem' }} className="dash-stats">
          {[
            { label: 'Upcoming Events', value: upcoming.length, color: 'var(--accent)' },
            { label: 'Ongoing Programmes', value: ongoing.length, color: 'var(--gold)' },
            { label: 'Completed', value: completed.length, color: 'var(--text-dim)' },
            { label: 'Certificates', value: certificates.length, color: 'var(--accent)' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-2)', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', fontWeight: 600, color: s.color, marginBottom: '0.5rem' }}>{s.value}</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-mute)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* PENDING REGISTRATIONS */}
        {pending.length > 0 && (
          <div style={{ background: '#fffbf0', border: '1px solid #f0d080', padding: '1.5rem', marginBottom: '2rem', borderLeft: '3px solid var(--gold)' }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 600, color: '#806000', marginBottom: '0.5rem' }}>
              {pending.length} Registration{pending.length > 1 ? 's' : ''} Pending Approval
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: '#806000' }}>
              Your registration is being reviewed. You will be notified once approved.
            </div>
          </div>
        )}

        {/* MY EVENTS */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600 }}>My Events</h2>
            <Link to="/dashboard/events" style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--accent)', textDecoration: 'none', letterSpacing: '0.1em' }}>
              View All →
            </Link>
          </div>

          {registrations.length === 0 ? (
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'var(--text-mute)', marginBottom: '1rem' }}>◇</div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)', marginBottom: '1.5rem' }}>
                You have not registered for any events yet.
              </p>
              <Link to="/events" className="btn btn-gold">Browse Events →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
              {registrations.slice(0, 3).map((reg, i) => (
                <div key={i} style={{ background: 'var(--bg-2)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>
                      {reg.events?.title}
                    </div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-mute)' }}>
                      {reg.events?.location}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{
                      fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.15em',
                      textTransform: 'uppercase', padding: '4px 10px',
                      background: reg.status === 'approved' ? '#e8f5e9' : '#fff8e1',
                      color: reg.status === 'approved' ? '#2e7d32' : '#f57f17',
                    }}>{reg.status}</span>
                    {reg.status === 'approved' && (
                      <Link to={`/dashboard/events/${reg.event_id}`} style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--accent)', textDecoration: 'none' }}>
                        View Workspace →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CERTIFICATES */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600 }}>My Certificates</h2>
            <Link to="/dashboard/certificates" style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--accent)', textDecoration: 'none', letterSpacing: '0.1em' }}>
              View All →
            </Link>
          </div>

          {certificates.length === 0 ? (
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'var(--text-mute)', marginBottom: '1rem' }}>◉</div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>
                You have not earned any certificates yet. Complete a programme to receive yours.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }} className="cert-grid">
              {certificates.map((cert, i) => (
                <div key={i} style={{ background: 'var(--bg-2)', padding: '2rem', borderTop: '3px solid var(--gold)' }}>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
                    Certificate
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                    {cert.certificate_id}
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-mute)', marginBottom: '1rem' }}>
                    Issued: {new Date(cert.issued_date).toLocaleDateString()}
                  </div>
                  {cert.certificate_url && (
                    <a href={cert.certificate_url} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ fontSize: '9px' }}>
                      Download →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dash-stats { grid-template-columns: 1fr 1fr !important; }
          .cert-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </DashboardLayout>
  );
}