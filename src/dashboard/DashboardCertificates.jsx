import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import DashboardLayout from './DashboardLayout';

export default function DashboardCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('certificates')
        .select('*, events(*)')
        .eq('user_id', session.user.id)
        .order('issued_date', { ascending: false });

      setCertificates(data || []);
      setLoading(false);
    };

    getData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}>◇</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>Loading certificates...</p>
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
          <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>My Certificates</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>
            Download and verify your earned certificates from NAIM Strategies programmes.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', color: 'var(--text-mute)', marginBottom: '1.5rem' }}>◉</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.75rem' }}>No Certificates Yet</h3>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)', maxWidth: '400px', margin: '0 auto' }}>
              Complete a NAIM Strategies programme to earn your certificate. They will appear here once issued.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }} className="cert-grid">
            {certificates.map((cert, i) => (
              <div key={i} style={{
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                borderTop: '4px solid var(--gold)', padding: '2.5rem',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* DECORATIVE */}
                <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', fontSize: '3rem', color: 'var(--gold)', opacity: 0.15 }}>◉</div>

                <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>
                  Certificate of Completion
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.3, marginBottom: '0.5rem' }}>
                  {cert.events?.title || 'NAIM Strategies Programme'}
                </h3>

                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-mute)', marginBottom: '1.5rem' }}>
                  {cert.events?.location}
                </div>

                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: '0.25rem' }}>
                      Certificate ID
                    </div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>
                      {cert.certificate_id}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: '0.25rem' }}>
                      Issued Date
                    </div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>
                      {new Date(cert.issued_date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                 {cert.certificate_url ? (
                        <a
                            href={cert.certificate_url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-gold"
                            style={{ fontSize: '9px' }}
                        >
                            Download Certificate →
                        </a>
                        ) : (
                        <span
                            style={{
                            fontFamily: 'var(--sans)',
                            fontSize: '11px',
                            color: 'var(--text-mute)',
                            fontStyle: 'italic'
                            }}
                        >
                            Certificate file being prepared...
                        </span>
                        )}

                        <a
                        href={`/verify/${cert.certificate_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline"
                        style={{ fontSize: '9px' }}
                        >
                        Verify →
                        </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cert-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </DashboardLayout>
  );
}