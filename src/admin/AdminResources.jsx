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

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const [resRes, eventsRes] = await Promise.all([
      supabase
        .from('resources')
        .select('*, events(title)')
        .order('created_at', { ascending: false }),

      supabase
        .from('events')
        .select('id, title')
        .order('title'),
    ]);

    setResources(resRes.data || []);
    setEvents(eventsRes.data || []);
    setLoading(false);
  };

  /* =========================
     ADD RESOURCE
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('resources')
      .insert(formData);

    setSaving(false);

    if (!error) {
      setShowForm(false);

      setFormData({
        event_id: '',
        title: '',
        description: '',
        file_url: '',
        file_type: '',
        external_link: '',
        is_public: false,
      });

      getData();
    }
  };

  /* =========================
     DELETE RESOURCE
  ========================= */

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;

    await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    setResources(
      resources.filter(resource => resource.id !== id)
    );
  };

  /* =========================
     PREMIUM FORM STYLES
  ========================= */

  const inputStyle = {
    background: '#FFFFFF',
    border: '1px solid #DDE4DF',
    color: '#17231E',
    fontFamily: 'var(--sans)',
    fontSize: '13px',
    padding: '11px 14px',
    width: '100%',
    outline: 'none',
    borderRadius: '3px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelStyle = {
    fontFamily: 'var(--sans)',
    fontSize: '9px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#53605A',
    display: 'block',
    marginBottom: '0.55rem',
    fontWeight: 600,
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <AdminLayout>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '2rem',
                color: '#C8A95D',
                marginBottom: '1rem',
              }}
            >
              ◇
            </div>

            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: '#53605A',
                margin: 0,
              }}
            >
              Loading resources...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  /* =========================
     PAGE
  ========================= */

  return (
    <AdminLayout>
      <div
        style={{
          padding: '3rem',
          maxWidth: '1500px',
          margin: '0 auto',
        }}
      >

        {/* =========================
            HEADER
        ========================= */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#C8A95D',
                marginBottom: '0.6rem',
                fontWeight: 600,
              }}
            >
              Admin
            </div>

<h1
  style={{
    fontFamily: 'var(--sans)',
    fontSize: '2rem',
    fontWeight: 600,
    color: '#0F2E23',
    margin: '0 0 0.35rem',
    lineHeight: 1.2,
  }}
>
  Resources
</h1>

            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: '#53605A',
                margin: 0,
              }}
            >
              {resources.length} resources uploaded
            </p>
          </div>

          {/* ADD RESOURCE BUTTON */}

          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: '#0F2E23',
              border: '1px solid #0F2E23',
              color: '#FFFFFF',
              padding: '12px 24px',
              cursor: 'pointer',
              borderRadius: '3px',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#C8A95D';
              e.currentTarget.style.borderColor = '#C8A95D';
              e.currentTarget.style.color = '#0F2E23';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0F2E23';
              e.currentTarget.style.borderColor = '#0F2E23';
              e.currentTarget.style.color = '#FFFFFF';
            }}
          >
            {showForm ? 'Cancel' : '+ Add Resource'}
          </button>
        </div>

        {/* =========================
            FORM
        ========================= */}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#FFFFFF',
              border: '1px solid #DDE4DF',
              padding: '2.5rem',
              marginBottom: '3rem',
              borderRadius: '4px',
              boxShadow: '0 8px 30px rgba(15, 46, 35, 0.06)',
            }}
          >

            <div
              style={{
                borderBottom: '1px solid #E5EBE7',
                paddingBottom: '1.25rem',
                marginBottom: '2rem',
              }}
            >
<h2
  style={{
    fontFamily: 'var(--sans)',
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#0F2E23',
    margin: '0 0 0.35rem',
  }}
>
  Add New Resource
</h2>

              <p
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '12px',
                  color: '#718078',
                  margin: 0,
                }}
              >
                Add programme materials, documents or external resources.
              </p>
            </div>

            {/* EVENT + TITLE */}

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
                  Event *
                </label>

                <select
                  style={inputStyle}
                  required
                  value={formData.event_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      event_id: e.target.value,
                    })
                  }
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#C8A95D';
                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(200,169,93,0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#DDE4DF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select event</option>

                  {events.map((event) => (
                    <option
                      key={event.id}
                      value={event.id}
                    >
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Resource Title *
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
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#C8A95D';
                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(200,169,93,0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#DDE4DF';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
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
                  minHeight: '90px',
                  lineHeight: 1.6,
                }}
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#C8A95D';
                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px rgba(200,169,93,0.12)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#DDE4DF';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* FILE URL + TYPE */}

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
                  File URL (Cloudinary)
                </label>

                <input
                  style={inputStyle}
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  value={formData.file_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      file_url: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>
                  File Type
                </label>

                <select
                  style={inputStyle}
                  value={formData.file_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      file_type: e.target.value,
                    })
                  }
                >
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

            {/* EXTERNAL LINK */}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>
                External Link (Google Drive, YouTube etc.)
              </label>

              <input
                style={inputStyle}
                type="url"
                placeholder="https://..."
                value={formData.external_link}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    external_link: e.target.value,
                  })
                }
              />
            </div>

            {/* PUBLIC CHECKBOX */}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '2rem',
                padding: '0.9rem 1rem',
                background: '#F3F5F3',
                border: '1px solid #E5EBE7',
                borderRadius: '3px',
              }}
            >
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_public: e.target.checked,
                  })
                }
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                  accentColor: '#0F2E23',
                }}
              />

              <label
                htmlFor="is_public"
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '11px',
                  color: '#34463E',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Make this resource publicly accessible
              </label>
            </div>

            {/* SAVE BUTTON */}

            <button
              type="submit"
              disabled={saving}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                background: saving ? '#718078' : '#C8A95D',
                border: 'none',
                color: '#0F2E23',
                padding: '12px 24px',
                cursor: saving ? 'not-allowed' : 'pointer',
                borderRadius: '3px',
                transition: 'all 0.25s ease',
              }}
            >
              {saving ? 'Saving...' : 'Add Resource'}
            </button>
          </form>
        )}

        {/* =========================
            RESOURCES TABLE
        ========================= */}

        <div
          style={{
            background: '#DDE4DF',
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            border: '1px solid #DDE4DF',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 6px 24px rgba(15, 46, 35, 0.04)',
          }}
        >

          {/* TABLE HEADER */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
              gap: '1rem',
              padding: '1rem 1.5rem',
              background: '#0F2E23',
            }}
          >
            {[
              'Title',
              'Event',
              'Type',
              'Access',
              'Actions',
            ].map((heading) => (
              <div
                key={heading}
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#EAD9A3',
                  fontWeight: 600,
                }}
              >
                {heading}
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}

          {resources.length === 0 ? (
            <div
              style={{
                background: '#FFFFFF',
                padding: '4rem 2rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  color: '#C8A95D',
                  marginBottom: '0.75rem',
                }}
              >
                ◇
              </div>

              <p
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '13px',
                  color: '#53605A',
                  margin: 0,
                }}
              >
                No resources yet.
              </p>
            </div>
          ) : (

            /* RESOURCE ROWS */

            resources.map((res, i) => (
              <div
                key={res.id || i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                  gap: '1rem',
                  padding: '1.25rem 1.5rem',
                  background: '#FFFFFF',
                  alignItems: 'center',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F3F5F3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                }}
              >

                {/* TITLE */}

                <div>
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#17231E',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {res.title}
                  </div>

                  {res.description && (
                    <div
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '11px',
                        lineHeight: 1.5,
                        color: '#718078',
                      }}
                    >
                      {res.description.length > 50
                        ? `${res.description.slice(0, 50)}...`
                        : res.description}
                    </div>
                  )}
                </div>

                {/* EVENT */}

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '12px',
                    color: '#34463E',
                    fontWeight: 500,
                  }}
                >
                  {res.events?.title || '-'}
                </div>

                {/* TYPE */}

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '10px',
                    color: '#53605A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                  }}
                >
                  {res.file_type || '-'}
                </div>

                {/* ACCESS */}

                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontFamily: 'var(--sans)',
                      fontSize: '9px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '5px 8px',
                      borderRadius: '2px',
                      background: res.is_public
                        ? '#E7F3EC'
                        : '#F1F3F2',
                      color: res.is_public
                        ? '#246B45'
                        : '#53605A',
                      fontWeight: 600,
                    }}
                  >
                    {res.is_public
                      ? 'Public'
                      : 'Members only'}
                  </span>
                </div>

                {/* ACTIONS */}

                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {(res.file_url || res.external_link) && (
                    <a
                      href={
                        res.file_url ||
                        res.external_link
                      }
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '9px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        background: 'transparent',
                        border: '1px solid #C8A95D',
                        color: '#8A6F32',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        borderRadius: '2px',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          '#C8A95D';
                        e.currentTarget.style.color =
                          '#0F2E23';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'transparent';
                        e.currentTarget.style.color =
                          '#8A6F32';
                      }}
                    >
                      View
                    </a>
                  )}

                  <button
                    onClick={() =>
                      handleDelete(res.id)
                    }
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '9px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      background: 'transparent',
                      border: '1px solid #E5CACA',
                      color: '#A33A3A',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        '#F9EAEA';
                      e.currentTarget.style.borderColor =
                        '#A33A3A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'transparent';
                      e.currentTarget.style.borderColor =
                        '#E5CACA';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}