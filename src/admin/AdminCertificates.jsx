import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    event_id: '',
    certificate_url: '',
    issued_date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const [certRes, usersRes, eventsRes] = await Promise.all([
      supabase.from('certificates').select('*, profiles(full_name, email), events(title)').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, full_name, email').order('full_name'),
      supabase.from('events').select('id, title').order('title'),
    ]);

    setCertificates(certRes.data || []);
    setUsers(usersRes.data || []);
    setEvents(eventsRes.data || []);
    setLoading(false);
  };

  const generateCertId = () => {
    const year = new Date().getFullYear();
    const num = Math.floor(Math.random() * 90000) + 10000;
    return `NAIM-${year}-${num}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from('certificates').insert({
      ...formData,
      certificate_id: generateCertId(),
    });

    setSaving(false);

    if (!error) {
      setShowForm(false);
      setFormData({
        user_id: '',
        event_id: '',
        certificate_url: '',
        issued_date: new Date().toISOString().slice(0, 10),
      });
      getData();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    await supabase.from('certificates').delete().eq('id', id);
    setCertificates(certificates.filter(c => c.id !== id));
  };

  const inputStyle = {
    background: '#0a0a0a', border: '1px solid #ffffff0d',
    color: '#e8e0d0', fontFamily: 'var(--sans)', fontSize: '13px',
    padding: '10px 14px', width: '100%', outline: 'none',
  };

  const labelStyle = {
    fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em',
    textTransform: 'uppercase', color: '#504840', display: 'block', marginBottom: '0.5rem',
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#c9a96e', marginBottom: '1rem' }}>◇</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>Loading certificates...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '3rem' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.5rem' }}>Admin</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#e8e0d0', marginBottom: '0.25rem' }}>Certificates</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>{certificates.length} certificates issued</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            background: '#c9a96e', border: 'none', color: '#0a0a0a',
            padding: '12px 24px', cursor: 'pointer',
          }}>
            {showForm ? 'Cancel' : '+ Issue Certificate'}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: '#0a0a0a', border: '1px solid #ffffff0d', padding: '2.5rem', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#e8e0d0', marginBottom: '2rem' }}>Issue New Certificate</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Participant *</label>
                <select style={inputStyle} required value={formData.user_id}
                  onChange={e => setFormData({ ...formData, user_id: e.target.value })}>
                  <option value="">Select participant</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Event *</label>
                <select style={inputStyle} required value={formData.event_id}
                  onChange={e => setFormData({ ...formData, event_id: e.target.value })}>
                  <option value="">Select event</option>
                  {events.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={labelStyle}>Certificate File URL</label>
                <input style={inputStyle} type="url" placeholder="https://..."
                  value={formData.certificate_url}
                  onChange={e => setFormData({ ...formData, certificate_url: e.target.value })} />
                <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: '#504840', marginTop: '0.5rem' }}>
                  Upload to Cloudinary first, then paste URL here.
                </div>
              </div>
              <div>
                <label style={labelStyle}>Issue Date *</label>
                <input style={inputStyle} type="date" required value={formData.issued_date}
                  onChange={e => setFormData({ ...formData, issued_date: e.target.value })} />
              </div>
            </div>

            <button type="submit" disabled={saving} style={{
              fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              background: '#c9a96e', border: 'none', color: '#0a0a0a',
              padding: '12px 24px', cursor: 'pointer',
            }}>
              {saving ? 'Issuing...' : 'Issue Certificate'}
            </button>
          </form>
        )}

        {/* CERTIFICATES TABLE */}
        <div style={{ background: '#ffffff08', display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 2fr 1fr 1fr', gap: '1rem', padding: '0.875rem 1.5rem', background: '#0a0a0a' }}>
            {['Certificate ID', 'Participant', 'Event', 'Issued', 'Actions'].map(h => (
              <div key={h} style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#504840' }}>{h}</div>
            ))}
          </div>

          {certificates.length === 0 ? (
            <div style={{ background: '#0f0f0f', padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>No certificates issued yet.</p>
            </div>
          ) : (
            certificates.map((cert, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 2fr 1fr 1fr', gap: '1rem', padding: '1.25rem 1.5rem', background: '#0f0f0f', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.background = '#141414'}
                onMouseLeave={e => e.currentTarget.style.background = '#0f0f0f'}
              >
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#c9a96e', fontWeight: 600 }}>
                  {cert.certificate_id}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: '#e8e0d0' }}>{cert.profiles?.full_name}</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>{cert.profiles?.email}</div>
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: '#a09080' }}>
                  {cert.events?.title}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                  {new Date(cert.issued_date).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {cert.certificate_url && (
                    <a href={cert.certificate_url} target="_blank" rel="noreferrer" style={{
                      fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                      textTransform: 'uppercase', background: 'transparent',
                      border: '1px solid #ffffff0d', color: '#c9a96e',
                      padding: '4px 10px', cursor: 'pointer', textDecoration: 'none',
                    }}>View</a>
                  )}
                  <button onClick={() => handleDelete(cert.id)} style={{
                    fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                    textTransform: 'uppercase', background: 'transparent',
                    border: '1px solid #ffffff0d', color: '#ef9a9a',
                    padding: '4px 10px', cursor: 'pointer',
                  }}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}