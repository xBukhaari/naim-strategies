import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

const COLORS = {
  green: '#0F2E23',
  greenDark: '#09251C',
  greenLight: '#163F31',
  greenActive: '#294333',

  gold: '#C8A95D',
  goldDark: '#8A6F32',
  goldLight: '#EAD9A3',

  page: '#F8F9FA',
  white: '#FFFFFF',
  ivory: '#FCFBF7',
  surface: '#F4F6F5',

  text: '#171A18',
  textSecondary: '#59665F',
  textMuted: '#7A857F',
  textLight: '#A7B3AD',

  border: '#E5E7E5',
  borderDark: '#D5DBD7',

  success: '#2F6B4F',
  successBg: '#EAF4EE',

  warning: '#9A7426',
  warningBg: '#FBF4DF',

  danger: '#A94442',
  dangerBg: '#FBECEC',

  info: '#426B68',
  infoBg: '#EAF3F2',
};

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

      early_bird_price:
        event.early_bird_price ?? '',

      early_bird_deadline:
        event.early_bird_deadline
          ? event.early_bird_deadline.slice(0, 16)
          : '',

      capacity: event.capacity ?? '',

      status: event.status || 'upcoming',

      is_published:
        event.is_published || false,
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
      setFormError(
        'Unable to delete this event. Please try again.'
      );
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.filter(
        (event) => event.id !== id
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setFormError('');

    const payload = {
      title: formData.title.trim(),

      description:
        formData.description.trim() || null,

      event_type:
        formData.event_type || null,

      location:
        formData.location.trim() || null,

      price: formData.price
        ? parseFloat(formData.price)
        : 0,

      early_bird_price:
        formData.early_bird_price
          ? parseFloat(formData.early_bird_price)
          : null,

      capacity:
        formData.capacity
          ? parseInt(formData.capacity, 10)
          : null,

      start_date:
        formData.start_date || null,

      end_date:
        formData.end_date || null,

      early_bird_deadline:
        formData.early_bird_deadline || null,

      status: formData.status,

      is_published:
        formData.is_published,
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
      console.error(
        'Error saving event:',
        error
      );

      setFormError(
        error.message ||
          'Unable to save event. Please try again.'
      );

      return;
    }

    resetForm();
    await getEvents();
  };

  /* ============================================
     SHARED STYLES
  ============================================ */

  const inputStyle = {
    background: COLORS.white,
    border: `1px solid ${COLORS.borderDark}`,
    borderRadius: '5px',
    color: COLORS.text,
    fontFamily: 'var(--sans)',
    fontSize: '13px',
    padding: '11px 14px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const labelStyle = {
    fontFamily: 'var(--sans)',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
    display: 'block',
    marginBottom: '0.55rem',
  };

  const focusInput = (e) => {
    e.currentTarget.style.borderColor =
      COLORS.gold;

    e.currentTarget.style.boxShadow =
      '0 0 0 3px rgba(200, 169, 93, 0.10)';
  };

  const blurInput = (e) => {
    e.currentTarget.style.borderColor =
      COLORS.borderDark;

    e.currentTarget.style.boxShadow =
      'none';
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return {
          background: COLORS.successBg,
          color: COLORS.success,
          border: '#C9E5D3',
        };

      case 'ongoing':
        return {
          background: COLORS.infoBg,
          color: COLORS.info,
          border: '#CBE1DF',
        };

      case 'upcoming':
      default:
        return {
          background: COLORS.warningBg,
          color: COLORS.warning,
          border: '#EAD9A3',
        };
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div
          style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '2rem',
                color: COLORS.gold,
                marginBottom: '1rem',
              }}
            >
              ◇
            </div>

            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: COLORS.textSecondary,
                margin: 0,
              }}
            >
              Loading events...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div
        style={{
          maxWidth: '1500px',
          margin: '0 auto',
        }}
      >

        {/* ========================================
            HEADER
        ======================================== */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                fontWeight: 650,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: COLORS.goldDark,
                marginBottom: '0.55rem',
              }}
            >
              Admin
            </div>

            <h1
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '2rem',
                lineHeight: 1.2,
                fontWeight: 650,
                color: COLORS.green,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Events
            </h1>

            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: COLORS.textSecondary,
                margin: '0.45rem 0 0',
              }}
            >
              Create, edit and manage NAIM
              Strategies programmes.
            </p>
          </div>

          {/* EVENT COUNT */}

          <div
            style={{
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '6px',
              padding: '0.8rem 1.1rem',
              minWidth: '110px',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontWeight: 650,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: COLORS.textMuted,
                marginBottom: '0.25rem',
              }}
            >
              Events
            </div>

            <div
              style={{
                fontSize: '20px',
                fontWeight: 650,
                color: COLORS.green,
              }}
            >
              {events.length}
            </div>
          </div>

          {/* CREATE BUTTON */}

          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
                setFormError('');
              }
            }}
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              background: showForm
                ? COLORS.white
                : COLORS.green,
              border: showForm
                ? `1px solid ${COLORS.borderDark}`
                : `1px solid ${COLORS.green}`,
              color: showForm
                ? COLORS.textSecondary
                : COLORS.white,
              borderRadius: '5px',
              padding: '12px 20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!showForm) {
                e.currentTarget.style.background =
                  COLORS.greenLight;
              }
            }}
            onMouseLeave={(e) => {
              if (!showForm) {
                e.currentTarget.style.background =
                  COLORS.green;
              }
            }}
          >
            {showForm
              ? 'Cancel'
              : '+ Create Event'}
          </button>
        </div>

        {/* ========================================
            ERROR
        ======================================== */}

        {formError && (
          <div
            style={{
              background: COLORS.dangerBg,
              border: '1px solid #E8C7C7',
              borderLeft: `4px solid ${COLORS.danger}`,
              color: COLORS.danger,
              padding: '0.9rem 1.1rem',
              marginBottom: '1.5rem',
              borderRadius: '5px',
              fontFamily: 'var(--sans)',
              fontSize: '13px',
            }}
          >
            {formError}
          </div>
        )}

        {/* ========================================
            CREATE / EDIT FORM
        ======================================== */}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '7px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow:
                '0 2px 10px rgba(15, 46, 35, 0.035)',
            }}
          >
            {/* FORM HEADER */}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                marginBottom: '1.75rem',
                paddingBottom: '1.25rem',
                borderBottom:
                  `1px solid ${COLORS.border}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: COLORS.goldDark,
                    marginBottom: '0.35rem',
                  }}
                >
                  Programme Management
                </div>

                <h2
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '1.3rem',
                    fontWeight: 650,
                    color: COLORS.green,
                    margin: 0,
                  }}
                >
                  {editing
                    ? 'Edit Event'
                    : 'Create New Event'}
                </h2>
              </div>

              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: COLORS.green,
                  color: COLORS.gold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                }}
              >
                ◈
              </div>
            </div>

            {/* TITLE */}

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
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>

            {/* DESCRIPTION */}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>
                Description
              </label>

              <textarea
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '110px',
                  lineHeight: 1.6,
                }}
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description:
                      e.target.value,
                  })
                }
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>

            {/* TYPE / LOCATION */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: '1.25rem',
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
                      event_type:
                        e.target.value,
                    })
                  }
                  onFocus={focusInput}
                  onBlur={blurInput}
                >
                  <option value="">
                    Select type
                  </option>

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

                  <option value="Panel">
                    Panel
                  </option>

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
                      location:
                        e.target.value,
                    })
                  }
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
            </div>

            {/* DATES */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: '1.25rem',
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
                      start_date:
                        e.target.value,
                    })
                  }
                  onFocus={focusInput}
                  onBlur={blurInput}
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
                      end_date:
                        e.target.value,
                    })
                  }
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
            </div>

            {/* PRICE / EARLY BIRD / CAPACITY */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr 1fr',
                gap: '1.25rem',
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
                      price:
                        e.target.value,
                    })
                  }
                  onFocus={focusInput}
                  onBlur={blurInput}
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
                  value={
                    formData.early_bird_price
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      early_bird_price:
                        e.target.value,
                    })
                  }
                  onFocus={focusInput}
                  onBlur={blurInput}
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
                      capacity:
                        e.target.value,
                    })
                  }
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
            </div>

            {/* DEADLINE / STATUS */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: '1.25rem',
                marginBottom: '1.5rem',
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
                  onFocus={focusInput}
                  onBlur={blurInput}
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
                      status:
                        e.target.value,
                    })
                  }
                  onFocus={focusInput}
                  onBlur={blurInput}
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

            {/* PUBLISH */}

            <div
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '5px',
                padding: '0.9rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.75rem',
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
                  accentColor:
                    COLORS.green,
                  cursor: 'pointer',
                }}
              />

              <label
                htmlFor="published"
                style={{
                  fontFamily:
                    'var(--sans)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: COLORS.text,
                  cursor: 'pointer',
                }}
              >
                Publish this event
              </label>
            </div>

            {/* FORM ACTIONS */}

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="submit"
                disabled={saving}
                style={{
                  fontFamily:
                    'var(--sans)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.13em',
                  textTransform:
                    'uppercase',
                  background:
                    COLORS.green,
                  border:
                    `1px solid ${COLORS.green}`,
                  color: COLORS.white,
                  borderRadius: '5px',
                  padding:
                    '11px 20px',
                  cursor: saving
                    ? 'not-allowed'
                    : 'pointer',
                  opacity: saving
                    ? 0.65
                    : 1,
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
                  fontFamily:
                    'var(--sans)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.13em',
                  textTransform:
                    'uppercase',
                  background:
                    COLORS.white,
                  border:
                    `1px solid ${COLORS.borderDark}`,
                  color:
                    COLORS.textSecondary,
                  borderRadius: '5px',
                  padding:
                    '11px 20px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* ========================================
            EVENTS LIST
        ======================================== */}

        <div
          style={{
            background: COLORS.white,
            border:
              `1px solid ${COLORS.border}`,
            borderRadius: '7px',
            overflow: 'hidden',
            boxShadow:
              '0 2px 10px rgba(15, 46, 35, 0.035)',
          }}
        >

          {/* TABLE HEADER */}

          <div
            style={{
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
                  '0.9rem 1.25rem',
                background:
                  COLORS.surface,
                borderBottom:
                  `1px solid ${COLORS.border}`,
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
                    fontFamily:
                      'var(--sans)',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing:
                      '0.15em',
                    textTransform:
                      'uppercase',
                    color:
                      COLORS.textSecondary,
                  }}
                >
                  {heading}
                </div>
              ))}
            </div>

            {/* EMPTY */}

            {events.length === 0 ? (
              <div
                style={{
                  padding: '4rem 2rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    margin:
                      '0 auto 1rem',
                    borderRadius: '50%',
                    background:
                      COLORS.surface,
                    display: 'flex',
                    alignItems:
                      'center',
                    justifyContent:
                      'center',
                    color:
                      COLORS.textMuted,
                    fontSize: '18px',
                  }}
                >
                  ◈
                </div>

                <p
                  style={{
                    fontFamily:
                      'var(--sans)',
                    fontSize: '13px',
                    color:
                      COLORS.textSecondary,
                    margin: 0,
                  }}
                >
                  No events yet.
                  Create your first
                  event above.
                </p>
              </div>
            ) : (
              events.map((event, index) => {
                const statusStyle =
                  getStatusStyle(
                    event.status
                  );

                return (
                  <div
                    key={event.id}
                    style={{
                      minWidth:
                        '800px',
                      display: 'grid',
                      gridTemplateColumns:
                        '2fr 1fr 1fr 1fr 1fr',
                      gap: '1rem',
                      padding:
                        '1.15rem 1.25rem',
                      background:
                        COLORS.white,
                      alignItems:
                        'center',
                      borderBottom:
                        index !==
                        events.length - 1
                          ? `1px solid ${COLORS.border}`
                          : 'none',
                      transition:
                        'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        COLORS.ivory;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        COLORS.white;
                    }}
                  >

                    {/* TITLE */}

                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontFamily:
                            'var(--sans)',
                          fontSize:
                            '12px',
                          fontWeight:
                            650,
                          color:
                            COLORS.text,
                          marginBottom:
                            '0.25rem',
                          wordBreak:
                            'break-word',
                        }}
                      >
                        {event.title}
                      </div>

                      <div
                        style={{
                          fontFamily:
                            'var(--sans)',
                          fontSize:
                            '11px',
                          color:
                            COLORS.textMuted,
                          wordBreak:
                            'break-word',
                        }}
                      >
                        {event.location ||
                          '-'}
                      </div>
                    </div>

                    {/* TYPE */}

                    <div
                      style={{
                        fontFamily:
                          'var(--sans)',
                        fontSize:
                          '11px',
                        color:
                          COLORS.textSecondary,
                      }}
                    >
                      {event.event_type ||
                        '-'}
                    </div>

                    {/* STATUS */}

                    <div>
                      <span
                        style={{
                          display:
                            'inline-flex',
                          alignItems:
                            'center',
                          fontFamily:
                            'var(--sans)',
                          fontSize:
                            '9px',
                          fontWeight:
                            700,
                          letterSpacing:
                            '0.08em',
                          textTransform:
                            'uppercase',
                          padding:
                            '4px 8px',
                          background:
                            statusStyle.background,
                          color:
                            statusStyle.color,
                          border:
                            `1px solid ${statusStyle.border}`,
                          borderRadius:
                            '20px',
                        }}
                      >
                        {event.status}
                      </span>
                    </div>

                    {/* PUBLISHED */}

                    <div>
                      <span
                        style={{
                          display:
                            'inline-flex',
                          alignItems:
                            'center',
                          gap: '0.4rem',
                          fontFamily:
                            'var(--sans)',
                          fontSize:
                            '11px',
                          fontWeight:
                            600,
                          color:
                            event.is_published
                              ? COLORS.success
                              : COLORS.textMuted,
                        }}
                      >
                        <span
                          style={{
                            width:
                              '6px',
                            height:
                              '6px',
                            borderRadius:
                              '50%',
                            background:
                              event.is_published
                                ? COLORS.success
                                : COLORS.textLight,
                          }}
                        />

                        {event.is_published
                          ? 'Published'
                          : 'Draft'}
                      </span>
                    </div>

                    {/* ACTIONS */}

                    <div
                      style={{
                        display:
                          'flex',
                        gap:
                          '0.5rem',
                        flexWrap:
                          'wrap',
                      }}
                    >
                      <button
                        onClick={() =>
                          handleEdit(
                            event
                          )
                        }
                        style={{
                          fontFamily:
                            'var(--sans)',
                          fontSize:
                            '9px',
                          fontWeight:
                            700,
                          letterSpacing:
                            '0.1em',
                          textTransform:
                            'uppercase',
                          background:
                            COLORS.white,
                          border:
                            `1px solid ${COLORS.borderDark}`,
                          color:
                            COLORS.goldDark,
                          borderRadius:
                            '4px',
                          padding:
                            '5px 9px',
                          cursor:
                            'pointer',
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            event.id
                          )
                        }
                        style={{
                          fontFamily:
                            'var(--sans)',
                          fontSize:
                            '9px',
                          fontWeight:
                            700,
                          letterSpacing:
                            '0.1em',
                          textTransform:
                            'uppercase',
                          background:
                            COLORS.white,
                          border:
                            '1px solid #E8C7C7',
                          color:
                            COLORS.danger,
                          borderRadius:
                            '4px',
                          padding:
                            '5px 9px',
                          cursor:
                            'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================
            RESPONSIVE
        ======================================== */}

        <style>{`
          input::placeholder,
          textarea::placeholder {
            color: #7A857F;
            opacity: 1;
          }

          select option {
            color: #171A18;
            background: #FFFFFF;
          }

          input[type="date"],
          input[type="datetime-local"],
          input[type="number"] {
            color-scheme: light;
          }

          @media (max-width: 900px) {
            form {
              padding: 1.5rem !important;
            }
          }

          @media (max-width: 700px) {
            form > div[style*="grid-template-columns: 1fr 1fr"],
            form > div[style*="grid-template-columns: 1fr 1fr 1fr"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </AdminLayout>
  );
}