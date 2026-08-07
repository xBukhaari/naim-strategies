import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: '',
    location: '',
    start_date: '',
    end_date: '',
    price: '',
    early_bird_price: '',
    early_bird_deadline: '',
    capacity: '',
    status: 'upcoming',
    is_published: false,
  });

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    setEvents(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', event_type: '', location: '',
      start_date: '', end_date: '', price: '', early_bird_price: '',
      early_bird_deadline: '', capacity: '', status: 'upcoming', is_published: false,
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (event) => {
    setEditing(event.id);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      event_type: event.event_type || '',
      location: event.location || '',
      start_date: event.start_date ? event.start_date.slice(0, 16) : '',
      end_date: event.end_date ? event.end_date.slice(0, 16) : '',
      price: event.price || '',
      early_bird_price: event.early_bird_price || '',
      early_bird_deadline: event.early_bird_deadline ? event.early_bird_deadline.slice(0, 16) : '',
      capacity: event.capacity || '',
      status: event.status || 'upcoming',
      is_published: event.is_published || false,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    setEvents(events.filter(e => e.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : 0,
      early_bird_price: formData.early_bird_price ? parseFloat(formData.early_bird_price) : null,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      early_bird_deadline: formData.early_bird_deadline || null,
    };

    if (editing) {
      await supabase.from('events').update(payload).eq('id', editing);
    } else {
      await supabase.from('events').insert(payload);
    }

    setSaving(false);
    resetForm();
    getEvents();
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
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>Loading events...</p>
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
            <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#e8e0d0', marginBottom: '0.25rem' }}>Events</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>{events.length} total events</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} style={{
            fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            background: '#c9a96e', border: 'none', color: '#0a0a0a',
            padding: '12px 24px', cursor: 'pointer',
          }}>
            {showForm ? 'Cancel' : '+ Create Event'}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: '#0a0a0a', border: '1px solid #ffffff0d', padding: '2.5rem', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#e8e0d0', marginBottom: '2rem' }}>
              {editing ? 'Edit Event' : 'Create New Event'}
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Event Title *</label>
              <input style={inputStyle} required value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Description</label>
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Event Type</label>
                <select style={inputStyle} value={formData.event_type}
                  onChange={e => setFormData({ ...formData, event_type: e.target.value })}>
                  <option value="">Select type</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Masterclass">Masterclass</option>
                  <option value="Convening">Convening</option>
                  <option value="Keynote">Keynote</option>
                  <option value="Panel">Panel</option>
                  <option value="Retreat">Retreat</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input style={inputStyle} value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Start Date & Time</label>
                <input style={inputStyle} type="datetime-local" value={formData.start_date}
                  onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>End Date & Time</label>
                <input style={inputStyle} type="datetime-local" value={formData.end_date}
                  onChange={e => setFormData({ ...formData, end_date: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Price (₦)</label>
                <input style={inputStyle} type="number" value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Early Bird Price (₦)</label>
                <input style={inputStyle} type="number" value={formData.early_bird_price}
                  onChange={e => setFormData({ ...formData, early_bird_price: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Capacity</label>
                <input style={inputStyle} type="number" value={formData.capacity}
                  onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={labelStyle}>Status</label>
                <select style={inputStyle} value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.5rem' }}>
                <input type="checkbox" id="published" checked={formData.is_published}
                  onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <label htmlFor="published" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>
                  Publish this event
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={saving} style={{
                fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                background: '#c9a96e', border: 'none', color: '#0a0a0a',
                padding: '12px 24px', cursor: 'pointer',
              }}>
                {saving ? 'Saving...' : editing ? 'Update Event' : 'Create Event'}
              </button>
              <button type="button" onClick={resetForm} style={{
                fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                background: 'transparent', border: '1px solid #ffffff0d',
                color: '#504840', padding: '12px 24px', cursor: 'pointer',
              }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* EVENTS LIST */}
        <div style={{ background: '#ffffff08', display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '0.875rem 1.5rem', background: '#0a0a0a' }}>
            {['Title', 'Type', 'Status', 'Published', 'Actions'].map(h => (
              <div key={h} style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#504840' }}>{h}</div>
            ))}
          </div>

          {events.length === 0 ? (
            <div style={{ background: '#0f0f0f', padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>No events yet. Create your first event above.</p>
            </div>
          ) : (
            events.map((event, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '1.25rem 1.5rem', background: '#0f0f0f', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.background = '#141414'}
                onMouseLeave={e => e.currentTarget.style.background = '#0f0f0f'}
              >
                <div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 500, color: '#e8e0d0', marginBottom: '0.2rem' }}>
                    {event.title}
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                    {event.location}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#a09080' }}>
                  {event.event_type || '-'}
                </div>
                <div>
                  <span style={{
                    fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                    textTransform: 'uppercase', padding: '3px 8px',
                    background: event.status === 'completed' ? '#1b5e20' : event.status === 'ongoing' ? '#1565c0' : '#4a3000',
                    color: event.status === 'completed' ? '#a5d6a7' : event.status === 'ongoing' ? '#90caf9' : '#ffcc80',
                  }}>
                    {event.status}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: event.is_published ? '#a5d6a7' : '#504840' }}>
                  {event.is_published ? 'Published' : 'Draft'}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => handleEdit(event)} style={{
                    fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                    textTransform: 'uppercase', background: 'transparent',
                    border: '1px solid #ffffff0d', color: '#c9a96e',
                    padding: '4px 10px', cursor: 'pointer',
                  }}>Edit</button>
                  <button onClick={() => handleDelete(event.id)} style={{
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