import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

export default function AdminContacts() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      setSubmissions(data || []);
      setLoading(false);
    };

    getData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission?')) return;
    await supabase.from('contact_submissions').delete().eq('id', id);
    setSubmissions(submissions.filter(s => s.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = submissions.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.organisation?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#c9a96e', marginBottom: '1rem' }}>◇</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>Loading submissions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '3rem' }}>

        {/* HEADER */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.5rem' }}>Admin</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#e8e0d0', marginBottom: '0.25rem' }}>Contact Submissions</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>
            {submissions.length} total submissions
          </p>
        </div>

        {/* SEARCH */}
        <div style={{ marginBottom: '2rem' }}>
          <input
            style={{
              background: '#0a0a0a', border: '1px solid #ffffff0d',
              color: '#e8e0d0', fontFamily: 'var(--sans)', fontSize: '13px',
              padding: '12px 16px', width: '100%', maxWidth: '400px', outline: 'none',
            }}
            placeholder="Search by name, email or organisation..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={e => e.target.style.borderColor = '#c9a96e'}
            onBlur={e => e.target.style.borderColor = '#ffffff0d'}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '2rem' }} className="contact-grid">

          {/* LIST */}
          <div style={{ background: '#ffffff08', display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: '1rem', padding: '0.875rem 1.5rem', background: '#0a0a0a' }}>
              {['Name', 'Email', 'Date', 'Actions'].map(h => (
                <div key={h} style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#504840' }}>{h}</div>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ background: '#0f0f0f', padding: '3rem', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>No submissions yet.</p>
              </div>
            ) : (
              filtered.map((sub, i) => (
                <div key={i}
                  style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: '1rem', padding: '1rem 1.5rem', background: selected?.id === sub.id ? '#1a1a1a' : '#0f0f0f', alignItems: 'center', cursor: 'pointer', borderLeft: selected?.id === sub.id ? '2px solid #c9a96e' : '2px solid transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#141414'}
                  onMouseLeave={e => e.currentTarget.style.background = selected?.id === sub.id ? '#1a1a1a' : '#0f0f0f'}
                  onClick={() => setSelected(sub)}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 500, color: '#e8e0d0', marginBottom: '0.2rem' }}>{sub.name}</div>
                    {sub.organisation && <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>{sub.organisation}</div>}
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: '#a09080', wordBreak: 'break-all' }}>{sub.email}</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>{new Date(sub.created_at).toLocaleDateString()}</div>
                  <button onClick={e => { e.stopPropagation(); handleDelete(sub.id); }} style={{
                    fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                    textTransform: 'uppercase', background: 'transparent',
                    border: '1px solid #ffffff0d', color: '#ef9a9a',
                    padding: '4px 10px', cursor: 'pointer',
                  }}>Delete</button>
                </div>
              ))
            )}
          </div>

          {/* DETAIL VIEW */}
          {selected && (
            <div style={{ background: '#0a0a0a', border: '1px solid #ffffff0d', padding: '2rem', position: 'sticky', top: '2rem', alignSelf: 'start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e' }}>
                  Submission Detail
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#504840', cursor: 'pointer', fontSize: '18px' }}>✕</button>
              </div>

              {[
                { label: 'Name', value: selected.name },
                { label: 'Email', value: selected.email },
                { label: 'Organisation', value: selected.organisation || 'Not provided' },
                { label: 'Enquiry Type', value: selected.enquiry_type || 'Not specified' },
                { label: 'Date', value: new Date(selected.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }) },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #ffffff08' }}>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#504840', marginBottom: '0.4rem' }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#e8e0d0' }}>{item.value}</div>
                </div>
              ))}

              {selected.challenge && (
                <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #ffffff08' }}>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#504840', marginBottom: '0.4rem' }}>The Challenge</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#a09080', lineHeight: 1.7 }}>{selected.challenge}</div>
                </div>
              )}

              {selected.desired_outcome && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#504840', marginBottom: '0.4rem' }}>Desired Outcome</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#a09080', lineHeight: 1.7 }}>{selected.desired_outcome}</div>
                </div>
              )}

              <a href={`mailto:${selected.email}?subject=Re: Your enquiry to NAIM Strategies`} style={{
                display: 'block', fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center',
                background: '#c9a96e', color: '#0a0a0a', padding: '12px 24px',
                textDecoration: 'none', marginTop: '1rem',
              }}>
                Reply via Email →
              </a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AdminLayout>
  );
}