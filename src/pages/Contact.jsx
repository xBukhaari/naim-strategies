import { useState } from 'react';
import { supabase } from '../lib/supabase';


const OFFICES = [
  {
    city: 'Abuja',
    country: 'Nigeria',
    address: 'No16D Annur Masjid Shopping Complex\nWuse, Abuja, FCT',
    phone: '+234 809 413 2576',
    email: 'contact@naimstrategies.com',
    primary: true,
  },
];

const ENQUIRY_TYPES = [
  'Executive Coaching',
  'Management Consulting',
  'Training & Human Capital',
  'Strategic Advisory',
  'Speaking & Keynotes',
  'Book Orders',
  'Media & Press',
  'Other',
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    org: '',
    role: '',
    enquiry: '',
    challenge: '',
    outcome: '',
  });
  const [submitted, setSubmitted] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const [formspreeRes] = await Promise.all([
        fetch('https://formspree.io/f/mlgkpblk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }),
        supabase.from('contact_submissions').insert({
          name: formData.name,
          email: formData.email,
          organisation: formData.org,
          enquiry_type: formData.enquiry,
          challenge: formData.challenge,
          desired_outcome: formData.outcome,
        }),
      ]);

      if (formspreeRes.ok) {
        setSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <main style={{ paddingTop: '6rem' }}>

      {/* HERO */}
      <section style={{ padding: '6rem 10vw 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, #1a120630 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="label">Begin</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 600, lineHeight: 1.05, maxWidth: '700px', marginBottom: '1.5rem' }}>
            Begin Your Transformation.
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.9, color: 'var(--text-mute)', maxWidth: '520px', fontWeight: 300 }}>
            Every engagement begins with a conversation. Tell us about your challenge and what you are seeking. We respond personally within two business days.
          </p>
        </div>
      </section>

      <div className="divider" />

      {/* MAIN CONTENT */}
      <section className="section">
        <div className="section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '6rem', alignItems: 'start' }} className="contact-layout">

            {/* LEFT: INFO */}
            <div>
              <div className="label">Our Offices</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', marginBottom: '4rem' }}>
                {OFFICES.map((o, i) => (
                  <div key={i} style={{
                    padding: '2rem', background: 'var(--bg-2)',
                    borderLeft: o.primary ? '2px solid var(--gold)' : '2px solid transparent',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: '1.3rem', fontWeight: 500 }}>{o.city}</div>
                        <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.1em',  color: 'var(--accent)' }}>{o.country}</div>
                      </div>
                      {o.primary && (
                        <span style={{ fontFamily: 'var(--sans)', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--bg)', background: 'var(--gold)', padding: '4px 10px' }}>
                          HQ
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', lineHeight: 1.8, color: 'var(--text-mute)', whiteSpace: 'pre-line', marginBottom: '0.75rem' }}>
                      {o.address}
                    </div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-dim)', lineHeight: 1.8 }}>
                      {o.phone}<br />{o.email}
                    </div>
                  </div>
                ))}
              </div>

              {/* SOCIAL */}
              <div className="label">Follow Along</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { platform: 'LinkedIn', handle: '@naimstrategies' },
                  { platform: 'Instagram', handle: '@naimstrategies' },
                  { platform: 'X / Twitter', handle: '@naimstrategies' },
                  { platform: 'YouTube', handle: 'NAIM Strategies' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-mute)' }}>{s.platform}</span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '11px',  color: 'var(--accent)' }}>{s.handle}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: FORM */}
            <div>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', border: '1px solid #c9a96e1a', background: 'var(--bg-2)' }}>
                  <div className="gold" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>◇</div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1rem' }}>Message Received.</h2>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.9, color: 'var(--text-mute)', fontWeight: 300, maxWidth: '380px', margin: '0 auto 2rem' }}>
                    Thank you for reaching out. A member of our team will respond personally within two business days.
                  </p>
                  <button className="btn btn-gold" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="label">Your Details</div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }} className="form-row">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" type="text" placeholder="Your full name" required
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Email Address *</label>
                      <input className="form-input" type="email" placeholder="your@email.com" required
                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }} className="form-row">
                    <div>
                      <label className="form-label">Organisation</label>
                      <input className="form-input" type="text" placeholder="Your organisation"
                        value={formData.org} onChange={e => setFormData({ ...formData, org: e.target.value })} />
                    </div>
                    <div>
                      <label className="form-label">Your Role</label>
                      <input className="form-input" type="text" placeholder="e.g. CEO, Director"
                        value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                    </div>
                  </div>

                  <div className="label">Your Enquiry</div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label className="form-label">Type of Enquiry</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {ENQUIRY_TYPES.map(type => (
                        <button key={type} type="button" onClick={() => setFormData({ ...formData, enquiry: type })} style={{
                          fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.12em',
                          textTransform: 'uppercase', padding: '8px 14px', cursor: 'pointer',
                          transition: 'all 0.3s',
                          background: formData.enquiry === type ? 'var(--gold)' : 'transparent',
                          color: formData.enquiry === type ? 'var(--bg)' : 'var(--text-mute)',
                          border: '1px solid', borderColor: formData.enquiry === type ? 'var(--gold)' : '#ffffff0f',
                        }}>{type}</button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label className="form-label">The Challenge</label>
                    <textarea className="form-input" rows={4} placeholder="Describe the challenge or situation you are navigating..." style={{ resize: 'vertical' }}
                      value={formData.challenge} onChange={e => setFormData({ ...formData, challenge: e.target.value })} />
                  </div>

                  <div style={{ marginBottom: '3rem' }}>
                    <label className="form-label">Desired Outcome</label>
                    <textarea className="form-input" rows={3} placeholder="What would a successful outcome look like for you?" style={{ resize: 'vertical' }}
                      value={formData.outcome} onChange={e => setFormData({ ...formData, outcome: e.target.value })} />
                  </div>

                  <button type="submit" className="btn btn-gold btn-full">
                    Begin Your Transformation →
                  </button>

                  <p style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: 'var(--text-mute)', textAlign: 'center', marginTop: '1.5rem', lineHeight: 1.7 }}>
                    All enquiries are treated with complete confidentiality.<br />We respond personally within two business days.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contact-layout { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
