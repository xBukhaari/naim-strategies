import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    is_published: false,
    scheduled_at: '',
    expires_at: '',
  });

  useEffect(() => {
    getAnnouncements();
  }, []);

  const getAnnouncements = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    setAnnouncements(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '', body: '', is_published: false,
      scheduled_at: '', expires_at: '',
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setFormData({
      title: item.title || '',
      body: item.body || '',
      is_published: item.is_published || false,
      scheduled_at: item.scheduled_at ? item.scheduled_at.slice(0, 16) : '',
      expires_at: item.expires_at ? item.expires_at.slice(0, 16) : '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    await supabase.from('announcements').delete().eq('id', id);
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      scheduled_at: formData.scheduled_at || null,
      expires_at: formData.expires_at || null,
    };

    if (editing) {
      await supabase.from('announcements').update(payload).eq('id', editing);
    } else {
      await supabase.from('announcements').insert(payload);
    }

    setSaving(false);
    resetForm();
    getAnnouncements();
  };

  const inputStyle = {
    background: '#f9f9f9', border: '1px solid #e0e0e0',
    color: '#f0f0f0', fontFamily: 'var(--sans)', fontSize: '13px',
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
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>Loading announcements...</p>
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
            <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#f0f0f0', marginBottom: '0.25rem' }}>Announcements</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>{announcements.length} total announcements</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} style={{
            fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            background: '#c9a96e', border: 'none', color: '#f9f9f9',
            padding: '12px 24px', cursor: 'pointer',
          }}>
            {showForm ? 'Cancel' : '+ New Announcement'}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', border: '1px solid #e0e0e0', padding: '2.5rem', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#f0f0f0', marginBottom: '2rem' }}>
              {editing ? 'Edit Announcement' : 'New Announcement'}
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Title *</label>
              <input style={inputStyle} required value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Body *</label>
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={6} required
                placeholder="Write your announcement here..."
                value={formData.body}
                onChange={e => setFormData({ ...formData, body: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Schedule Date & Time (optional)</label>
                <input style={inputStyle} type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={e => setFormData({ ...formData, scheduled_at: e.target.value })} />
                <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: '#504840', marginTop: '0.5rem' }}>
                  Leave empty to publish immediately.
                </div>
              </div>
              <div>
                <label style={labelStyle}>Expiry Date & Time (optional)</label>
                <input style={inputStyle} type="datetime-local"
                  value={formData.expires_at}
                  onChange={e => setFormData({ ...formData, expires_at: e.target.value })} />
                <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', color: '#504840', marginTop: '0.5rem' }}>
                  Leave empty to keep indefinitely.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <input type="checkbox" id="ann_published" checked={formData.is_published}
                onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label htmlFor="ann_published" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>
                Publish this announcement
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={saving} style={{
                fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                background: '#c9a96e', border: 'none', color: '#f9f9f9',
                padding: '12px 24px', cursor: 'pointer',
              }}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Create Announcement'}
              </button>
              <button type="button" onClick={resetForm} style={{
                fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                background: 'transparent', border: '1px solid #e0e0e0',
                color: '#504840', padding: '12px 24px', cursor: 'pointer',
              }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* ANNOUNCEMENTS LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#f5f5f5' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '0.875rem 1.5rem', background: '#f9f9f9' }}>
            {['Title', 'Status', 'Scheduled', 'Expires', 'Actions'].map(h => (
              <div key={h} style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#504840' }}>{h}</div>
            ))}
          </div>

          {announcements.length === 0 ? (
            <div style={{ background: '#ffffff', padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>No announcements yet.</p>
            </div>
          ) : (
            announcements.map((ann, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '1.25rem 1.5rem', background: '#ffffff', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
                onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
              >
                <div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 500, color: '#f0f0f0', marginBottom: '0.2rem' }}>
                    {ann.title}
                  </div>
                  {ann.body && (
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                      {ann.body.slice(0, 60)}...
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: ann.is_published ? '#a5d6a7' : '#504840' }}>
                  {ann.is_published ? 'Published' : 'Draft'}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                  {ann.scheduled_at ? new Date(ann.scheduled_at).toLocaleDateString() : '-'}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                  {ann.expires_at ? new Date(ann.expires_at).toLocaleDateString() : '-'}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(ann)} style={{
                    fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                    textTransform: 'uppercase', background: 'transparent',
                    border: '1px solid #e0e0e0', color: '#c9a96e',
                    padding: '4px 10px', cursor: 'pointer',
                  }}>Edit</button>
                  <button onClick={() => handleDelete(ann.id)} style={{
                    fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                    textTransform: 'uppercase', background: 'transparent',
                    border: '1px solid #e0e0e0', color: '#ef9a9a',
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