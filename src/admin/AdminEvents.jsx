import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

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
    setLoading(true);

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } else {
      setEvents(data || []);
    }

    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
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

    setEditing(null);
    setShowForm(false);
    setFormError('');
  };

  const handleEdit = (event) => {
    setEditing(event.id);

    setFormData({
      title: event.title || '',
      description: event.description || '',
      event_type: event.event_type || '',
      location: event.location || '',
      start_date: event.start_date
        ? event.start_date.slice(0, 16)
        : '',
      end_date: event.end_date
        ? event.end_date.slice(0, 16)
        : '',
      price: event.price ?? '',
      early_bird_price: event.early_bird_price ?? '',
      early_bird_deadline: event.early_bird_deadline
        ? event.early_bird_deadline.slice(0, 16)
        : '',
      capacity: event.capacity ?? '',
      status: event.status || 'upcoming',
      is_published: event.is_published || false,
    });

    setFormError('');
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this event?'
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      setFormError('Unable to delete this event. Please try again.');
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setFormError('');

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      event_type: formData.event_type || null,
      location: formData.location.trim() || null,

      price: formData.price
        ? parseFloat(formData.price)
        : 0,

      early_bird_price: formData.early_bird_price
        ? parseFloat(formData.early_bird_price)
        : null,

      capacity: formData.capacity
        ? parseInt(formData.capacity, 10)
        : null,

      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      early_bird_deadline:
        formData.early_bird_deadline || null,

      status: formData.status,
      is_published: formData.is_published,
    };

    let error = null;

    if (editing) {
      const result = await supabase
        .from('events')
        .update(payload)
        .eq('id', editing);

      error = result.error;
    } else {
      const result = await supabase
        .from('events')
        .insert(payload);

      error = result.error;
    }

    setSaving(false);

    if (error) {
      console.error('Error saving event:', error);
      setFormError(
        error.message ||
          'Unable to save event. Please try again.'
      );
      return;
    }

    resetForm();
    await getEvents();
  };

  const inputStyle = {
    background: '#f9f9f9',
    border: '1px solid #e0e0e0',
    color: '#f0f0f0',
    fontFamily: 'var(--sans)',
    fontSize: '13px',
    padding: '10px 14px',
    width: '100%',
    outline: 'none',
  };

  const labelStyle = {
    fontFamily: 'var(--sans)',
    fontSize: '9px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#504840',
    display: 'block',
    marginBottom: '0.5rem',
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#f9f9f9',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '2rem',
              color: '#c9a96e',
              marginBottom: '1rem',
            }}
          >
            ◇
          </div>

          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              color: '#504840',
            }}
          >
            Loading events...
          </p>
        </div>
      </div>
    );
  }

 return (
  <AdminLayout>
    <div
      style={{
        padding: '3rem',
        background: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#c9a96e',
              marginBottom: '0.5rem',
            }}
          >
            Admin
          </div>

          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 600,
              color: '#f0f0f0',
              marginBottom: '0.25rem',
            }}
          >
            Events
          </h1>

          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              color: '#504840',
            }}
          >
            {events.length} total events
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          style={{
            fontFamily: 'var(--sans)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            background: '#c9a96e',
            border: 'none',
            color: '#f9f9f9',
            padding: '12px 24px',
            cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancel' : '+ Create Event'}
        </button>
      </div>

      {/* ERROR */}
      {formError && (
        <div
          style={{
            background: '#2a1010',
            border: '1px solid #5c2020',
            borderLeft: '4px solid #cc0000',
            color: '#ef9a9a',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            fontFamily: 'var(--sans)',
            fontSize: '13px',
          }}
        >
          {formError}
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#ffffff',
            border: '1px solid #e0e0e0',
            padding: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.3rem',
              fontWeight: 600,
              color: '#f0f0f0',
              marginBottom: '2rem',
            }}
          >
            {editing ? 'Edit Event' : 'Create New Event'}
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>
              Event Title *
            </label>

            <input
              style={inputStyle}
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>
              Description
            </label>

            <textarea
              style={{
                ...inputStyle,
                resize: 'vertical',
              }}
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <label style={labelStyle}>
                Event Type
              </label>

              <select
                style={inputStyle}
                value={formData.event_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    event_type: e.target.value,
                  })
                }
              >
                <option value="">Select type</option>
                <option value="Workshop">
                  Workshop
                </option>
                <option value="Masterclass">
                  Masterclass
                </option>
                <option value="Convening">
                  Convening
                </option>
                <option value="Keynote">
                  Keynote
                </option>
                <option value="Panel">Panel</option>
                <option value="Retreat">
                  Retreat
                </option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Location
              </label>

              <input
                style={inputStyle}
                value={formData.location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <label style={labelStyle}>
                Start Date & Time
              </label>

              <input
                style={inputStyle}
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    start_date: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>
                End Date & Time
              </label>

              <input
                style={inputStyle}
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    end_date: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr 1fr',
              gap: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <label style={labelStyle}>
                Price (₦)
              </label>

              <input
                style={inputStyle}
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>
                Early Bird Price (₦)
              </label>

              <input
                style={inputStyle}
                type="number"
                min="0"
                value={formData.early_bird_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    early_bird_price:
                      e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>
                Capacity
              </label>

              <input
                style={inputStyle}
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <div>
              <label style={labelStyle}>
                Early Bird Deadline
              </label>

              <input
                style={inputStyle}
                type="datetime-local"
                value={
                  formData.early_bird_deadline
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    early_bird_deadline:
                      e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label style={labelStyle}>
                Status
              </label>

              <select
                style={inputStyle}
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
              >
                <option value="upcoming">
                  Upcoming
                </option>
                <option value="ongoing">
                  Ongoing
                </option>
                <option value="completed">
                  Completed
                </option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}
          >
            <input
              type="checkbox"
              id="published"
              checked={formData.is_published}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_published:
                    e.target.checked,
                })
              }
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer',
              }}
            />

            <label
              htmlFor="published"
              style={{
                ...labelStyle,
                marginBottom: 0,
                cursor: 'pointer',
              }}
            >
              Publish this event
            </label>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                background: '#c9a96e',
                border: 'none',
                color: '#f9f9f9',
                padding: '12px 24px',
                cursor: saving
                  ? 'not-allowed'
                  : 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving
                ? 'Saving...'
                : editing
                ? 'Update Event'
                : 'Create Event'}
            </button>

            <button
              type="button"
              onClick={resetForm}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                background: 'transparent',
                border:
                  '1px solid #e0e0e0',
                color: '#504840',
                padding: '12px 24px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* EVENTS LIST */}
      <div
        style={{
          background: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          gap: '1px',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            minWidth: '800px',
            display: 'grid',
            gridTemplateColumns:
              '2fr 1fr 1fr 1fr 1fr',
            gap: '1rem',
            padding:
              '0.875rem 1.5rem',
            background: '#f9f9f9',
          }}
        >
          {[
            'Title',
            'Type',
            'Status',
            'Published',
            'Actions',
          ].map((heading) => (
            <div
              key={heading}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#504840',
              }}
            >
              {heading}
            </div>
          ))}
        </div>

        {events.length === 0 ? (
          <div
            style={{
              background: '#ffffff',
              padding: '3rem',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: '#504840',
              }}
            >
              No events yet. Create your
              first event above.
            </p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              style={{
                minWidth: '800px',
                display: 'grid',
                gridTemplateColumns:
                  '2fr 1fr 1fr 1fr 1fr',
                gap: '1rem',
                padding:
                  '1.25rem 1.5rem',
                background: '#ffffff',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  '#ffffff';
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#f0f0f0',
                    marginBottom: '0.2rem',
                  }}
                >
                  {event.title}
                </div>

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '11px',
                    color: '#504840',
                  }}
                >
                  {event.location || '-'}
                </div>
              </div>

              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '11px',
                  color: '#a09080',
                }}
              >
                {event.event_type || '-'}
              </div>

              <div>
                <span
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '9px',
                    letterSpacing: '0.1em',
                    textTransform:
                      'uppercase',
                    padding: '3px 8px',
                    background:
                      event.status ===
                      'completed'
                        ? '#1b5e20'
                        : event.status ===
                          'ongoing'
                        ? '#1565c0'
                        : '#4a3000',
                    color:
                      event.status ===
                      'completed'
                        ? '#a5d6a7'
                        : event.status ===
                          'ongoing'
                        ? '#90caf9'
                        : '#ffcc80',
                  }}
                >
                  {event.status}
                </span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '11px',
                  color: event.is_published
                    ? '#a5d6a7'
                    : '#504840',
                }}
              >
                {event.is_published
                  ? 'Published'
                  : 'Draft'}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={() =>
                    handleEdit(event)
                  }
                  style={{
                    fontFamily:
                      'var(--sans)',
                    fontSize: '9px',
                    letterSpacing:
                      '0.1em',
                    textTransform:
                      'uppercase',
                    background:
                      'transparent',
                    border:
                      '1px solid #e0e0e0',
                    color: '#c9a96e',
                    padding: '4px 10px',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(event.id)
                  }
                  style={{
                    fontFamily:
                      'var(--sans)',
                    fontSize: '9px',
                    letterSpacing:
                      '0.1em',
                    textTransform:
                      'uppercase',
                    background:
                      'transparent',
                    border:
                      '1px solid #e0e0e0',
                    color: '#ef9a9a',
                    padding: '4px 10px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="padding: 3rem"] {
            padding: 1.5rem !important;
          }

          form {
            padding: 1.5rem !important;
          }
        }
      `}</style>
       </div>
  </AdminLayout>
);
}