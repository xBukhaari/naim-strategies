import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function VerifyCertificate() {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*, profiles(full_name), events(title, location, start_date)')
        .eq('certificate_id', certificateId)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setCertificate(data);
      }

      setLoading(false);
    };

    verify();
  }, [certificateId]);

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '1rem' }}>◇</div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>Verifying certificate...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Link to="/">
            <img src="https://res.cloudinary.com/djxprptlf/image/upload/logo.png" alt="NAIM Strategies" style={{ height: '55px', width: 'auto' }} />
          </Link>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-mute)', marginTop: '1rem' }}>
            Certificate Verification
          </div>
        </div>

        {notFound ? (
          <div style={{ background: 'var(--bg-2)', border: '1px solid #ffcccc', borderTop: '4px solid #cc0000', padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✗</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#cc0000' }}>
              Certificate Not Found
            </h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.8, color: 'var(--text-mute)', marginBottom: '2rem' }}>
              The certificate ID <strong>{certificateId}</strong> could not be verified. This certificate may be invalid, revoked, or the ID may be incorrect.
            </p>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--text-mute)', marginBottom: '2rem' }}>
              If you believe this is an error, please contact NAIM Strategies at contact@naimstrategies.com
            </p>
            <Link to="/" className="btn btn-gold">Return to Main Site</Link>
          </div>
        ) : (
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderTop: '4px solid var(--gold)', padding: '3rem' }}>

            {/* VERIFIED BADGE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', padding: '1rem 1.5rem', background: '#f0fff4', border: '1px solid #b2dfdb' }}>
              <div style={{ fontSize: '1.5rem', color: '#2e7d32' }}>✓</div>
              <div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 600, color: '#2e7d32', marginBottom: '0.2rem' }}>
                  Certificate Verified
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#2e7d32' }}>
                  This is an authentic NAIM Strategies certificate.
                </div>
              </div>
            </div>

            {/* CERTIFICATE DETAILS */}
            <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>
              Certificate of Completion
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              {certificate.events?.title}
            </h2>

            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)', marginBottom: '2.5rem' }}>
              {certificate.events?.location}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)', marginBottom: '2.5rem' }}>
              {[
                { label: 'Awarded To', value: certificate.profiles?.full_name },
                { label: 'Certificate ID', value: certificate.certificate_id },
                { label: 'Issue Date', value: new Date(certificate.issued_date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }) },
                { label: 'Issued By', value: 'NAIM Strategies Nigeria Ltd' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'var(--bg)', padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: '0.4rem' }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {certificate.certificate_url && (
              <div style={{ marginBottom: '2rem' }}>
                <a href={certificate.certificate_url} target="_blank" rel="noreferrer" className="btn btn-gold">
                  Download Certificate →
                </a>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-mute)', lineHeight: 1.7 }}>
                This certificate was issued by NAIM Strategies Nigeria Ltd. For enquiries contact <strong>contact@naimstrategies.com</strong> or call <strong>+234 809 413 2576</strong>.
              </p>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--text-mute)', textDecoration: 'none' }}>
            ← Return to NAIM Strategies
          </Link>
        </div>
      </div>
    </main>
  );
}