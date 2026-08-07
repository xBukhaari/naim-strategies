import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    event_id: '',
    title: '',
    description: '',
    file_url: '',
    file_type: '',
    external_link: '',
    is_public: false,
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const [resRes, eventsRes] = await Promise.all([
      supabase.from('resources').select('*, events(title)').order('created_at', { ascending: false }),
      supabase.from('events').select('id, title').order('title'),
    ]);

    setResources(resRes.data || []);
    setEvents(eventsRes.data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from('resources').insert(formData);

    setSaving(false);

    if (!error) {
      setShowForm(false);
      setFormData({
        event_id: '', title: '', description: '',
        file_url: '', file_type: '', external_link: '', is_public: false,
      });
      getData();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    await supabase.from('resources').delete().eq('id', id);
    setResources(resources.filter(r => r.id !== id));
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
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>Loading resources...</p>
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
            <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#e8e0d0', marginBottom: '0.25rem' }}>Resources</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>{resources.length} resources uploaded</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            background: '#c9a96e', border: 'none', color: '#0a0a0a',
            padding: '12px 24px', cursor: 'pointer',
          }}>
            {showForm ? 'Cancel' : '+ Add Resource'}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: '#0a0a0a', border: '1px solid #ffffff0d', padding: '2.5rem', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#e8e0d0', marginBottom: '2rem' }}>Add New Resource</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
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
              <div>
                <label style={labelStyle}>Resource Title *</label>
                <input style={inputStyle} required value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>File URL (Cloudinary)</label>
                <input style={inputStyle} type="url" placeholder="https://res.cloudinary.com/..."
                  value={formData.file_url}
                  onChange={e => setFormData({ ...formData, file_url: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>File Type</label>
                <select style={inputStyle} value={formData.file_type}
                  onChange={e => setFormData({ ...formData, file_type: e.target.value })}>
                  <option value="">Select type</option>
                  <option value="pdf">PDF</option>
                  <option value="word">Word Document</option>
                  <option value="powerpoint">PowerPoint</option>
                  <option value="image">Image</option>
                  <option value="zip">ZIP File</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>External Link (Google Drive, YouTube etc.)</label>
              <input style={inputStyle} type="url" placeholder="https://..."
                value={formData.external_link}
                onChange={e => setFormData({ ...formData, external_link: e.target.value })} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <input type="checkbox" id="is_public" checked={formData.is_public}
                onChange={e => setFormData({ ...formData, is_public: e.target.checked })}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label htmlFor="is_public" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>
                Make this resource publicly accessible
              </label>
            </div>

            <button type="submit" disabled={saving} style={{
              fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              background: '#c9a96e', border: 'none', color: '#0a0a0a',
              padding: '12px 24px', cursor: 'pointer',
            }}>
              {saving ? 'Saving...' : 'Add Resource'}
            </button>
          </form>
        )}

        {/* RESOURCES TABLE */}
        <div style={{ background: '#ffffff08', display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: '1rem', padding: '0.875rem 1.5rem', background: '#0a0a0a' }}>
            {['Title', 'Event', 'Type', 'Access', 'Actions'].map(h => (
              <div key={h} style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#504840' }}>{h}</div>
            ))}
          </div>

          {resources.length === 0 ? (
            <div style={{ background: '#0f0f0f', padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>No resources yet.</p>
            </div>
          ) : (
            resources.map((res, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: '1rem', padding: '1.25rem 1.5rem', background: '#0f0f0f', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.background = '#141414'}
                onMouseLeave={e => e.currentTarget.style.background = '#0f0f0f'}
              >
                <div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 500, color: '#e8e0d0', marginBottom: '0.2rem' }}>
                    {res.title}
                  </div>
                  {res.description && (
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                      {res.description.slice(0, 50)}...
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: '#a09080' }}>
                  {res.events?.title}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840', textTransform: 'uppercase' }}>
                  {res.file_type || '-'}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: res.is_public ? '#a5d6a7' : '#504840' }}>
                  {res.is_public ? 'Public' : 'Members only'}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(res.file_url || res.external_link) && (
                    <a href={res.file_url || res.external_link} target="_blank" rel="noreferrer" style={{
                      fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                      textTransform: 'uppercase', background: 'transparent',
                      border: '1px solid #ffffff0d', color: '#c9a96e',
                      padding: '4px 10px', cursor: 'pointer', textDecoration: 'none',
                    }}>View</a>
                  )}
                  <button onClick={() => handleDelete(res.id)} style={{
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