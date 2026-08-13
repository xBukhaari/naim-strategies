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

  /* =========================
     LOAD DATA
  ========================= */

  const getAnnouncements = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    setAnnouncements(data || []);
    setLoading(false);
  };

  /* =========================
     RESET FORM
  ========================= */

  const resetForm = () => {
    setFormData({
      title: '',
      body: '',
      is_published: false,
      scheduled_at: '',
      expires_at: '',
    });

    setEditing(null);
    setShowForm(false);
  };

  /* =========================
     EDIT ANNOUNCEMENT
  ========================= */

  const handleEdit = (item) => {
    setEditing(item.id);

    setFormData({
      title: item.title || '',
      body: item.body || '',
      is_published: item.is_published || false,
      scheduled_at: item.scheduled_at
        ? item.scheduled_at.slice(0, 16)
        : '',
      expires_at: item.expires_at
        ? item.expires_at.slice(0, 16)
        : '',
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;

    await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    setAnnouncements(
      announcements.filter(
        (announcement) => announcement.id !== id
      )
    );
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      scheduled_at: formData.scheduled_at || null,
      expires_at: formData.expires_at || null,
    };

    if (editing) {
      await supabase
        .from('announcements')
        .update(payload)
        .eq('id', editing);
    } else {
      await supabase
        .from('announcements')
        .insert(payload);
    }

    setSaving(false);

    resetForm();
    getAnnouncements();
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
              Loading announcements...
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
              Announcements
            </h1>

            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: '#53605A',
                margin: 0,
              }}
            >
              {announcements.length} announcements
            </p>
          </div>

          {/* ADD ANNOUNCEMENT BUTTON */}

          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setEditing(null);
                setShowForm(true);
              }
            }}
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
            {showForm
              ? 'Cancel'
              : '+ Add Announcement'}
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
              boxShadow:
                '0 8px 30px rgba(15, 46, 35, 0.06)',
            }}
          >

            {/* FORM HEADER */}

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
                {editing
                  ? 'Edit Announcement'
                  : 'Add New Announcement'}
              </h2>

              <p
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '12px',
                  color: '#718078',
                  margin: 0,
                }}
              >
                Create an announcement for your members
                and control when it is published.
              </p>
            </div>

            {/* TITLE */}

            <div
              style={{
                marginBottom: '1.5rem',
              }}
            >
              <label style={labelStyle}>
                Title *
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
                  e.currentTarget.style.borderColor =
                    '#C8A95D';

                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px rgba(200,169,93,0.12)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    '#DDE4DF';

                  e.currentTarget.style.boxShadow =
                    'none';
                }}
              />
            </div>

            {/* BODY */}

            <div
              style={{
                marginBottom: '1.5rem',
              }}
            >
              <label style={labelStyle}>
                Announcement Body *
              </label>

              <textarea
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '150px',
                  lineHeight: 1.6,
                }}
                rows={6}
                required
                placeholder="Write your announcement here..."
                value={formData.body}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    body: e.target.value,
                  })
                }
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    '#C8A95D';

                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px rgba(200,169,93,0.12)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    '#DDE4DF';

                  e.currentTarget.style.boxShadow =
                    'none';
                }}
              />
            </div>

            {/* SCHEDULE + EXPIRY */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >

              {/* SCHEDULE */}

              <div>
                <label style={labelStyle}>
                  Schedule Date & Time
                </label>

                <input
                  style={inputStyle}
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      scheduled_at:
                        e.target.value,
                    })
                  }
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      '#C8A95D';

                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(200,169,93,0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      '#DDE4DF';

                    e.currentTarget.style.boxShadow =
                      'none';
                  }}
                />

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '10px',
                    color: '#718078',
                    marginTop: '0.5rem',
                  }}
                >
                  Leave empty to publish immediately.
                </div>
              </div>

              {/* EXPIRY */}

              <div>
                <label style={labelStyle}>
                  Expiry Date & Time
                </label>

                <input
                  style={inputStyle}
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expires_at:
                        e.target.value,
                    })
                  }
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      '#C8A95D';

                    e.currentTarget.style.boxShadow =
                      '0 0 0 3px rgba(200,169,93,0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      '#DDE4DF';

                    e.currentTarget.style.boxShadow =
                      'none';
                  }}
                />

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '10px',
                    color: '#718078',
                    marginTop: '0.5rem',
                  }}
                >
                  Leave empty to keep indefinitely.
                </div>
              </div>
            </div>

            {/* PUBLISH CHECKBOX */}

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
                id="ann_published"
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
                  accentColor: '#0F2E23',
                }}
              />

              <label
                htmlFor="ann_published"
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '11px',
                  color: '#34463E',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Publish this announcement
              </label>
            </div>

            {/* ACTIONS */}

            <div
              style={{
                display: 'flex',
                gap: '1rem',
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
                  background: saving
                    ? '#718078'
                    : '#C8A95D',
                  border: 'none',
                  color: '#0F2E23',
                  padding: '12px 24px',
                  cursor: saving
                    ? 'not-allowed'
                    : 'pointer',
                  borderRadius: '3px',
                  transition: 'all 0.25s ease',
                }}
              >
                {saving
                  ? 'Saving...'
                  : editing
                  ? 'Update Announcement'
                  : 'Add Announcement'}
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
                  border: '1px solid #DDE4DF',
                  color: '#53605A',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  borderRadius: '3px',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    '#F3F5F3';

                  e.currentTarget.style.borderColor =
                    '#C8A95D';

                  e.currentTarget.style.color =
                    '#0F2E23';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'transparent';

                  e.currentTarget.style.borderColor =
                    '#DDE4DF';

                  e.currentTarget.style.color =
                    '#53605A';
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* =========================
            ANNOUNCEMENTS TABLE
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
            boxShadow:
              '0 6px 24px rgba(15, 46, 35, 0.04)',
          }}
        >

          {/* TABLE HEADER */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '3fr 1fr 1fr 1fr 1fr',
              gap: '1rem',
              padding: '1rem 1.5rem',
              background: '#0F2E23',
            }}
          >
            {[
              'Title',
              'Status',
              'Scheduled',
              'Expires',
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

          {announcements.length === 0 ? (
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
                No announcements yet.
              </p>
            </div>
          ) : (

            /* ANNOUNCEMENT ROWS */

            announcements.map((ann, i) => (
              <div
                key={ann.id || i}
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '3fr 1fr 1fr 1fr 1fr',
                  gap: '1rem',
                  padding: '1.25rem 1.5rem',
                  background: '#FFFFFF',
                  alignItems: 'center',
                  transition:
                    'background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    '#F3F5F3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    '#FFFFFF';
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
                    {ann.title}
                  </div>

                  {ann.body && (
                    <div
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '11px',
                        lineHeight: 1.5,
                        color: '#718078',
                      }}
                    >
                      {ann.body.length > 60
                        ? `${ann.body.slice(
                            0,
                            60
                          )}...`
                        : ann.body}
                    </div>
                  )}
                </div>

                {/* STATUS */}

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
                      background:
                        ann.is_published
                          ? '#E7F3EC'
                          : '#F1F3F2',
                      color:
                        ann.is_published
                          ? '#246B45'
                          : '#53605A',
                      fontWeight: 600,
                    }}
                  >
                    {ann.is_published
                      ? 'Published'
                      : 'Draft'}
                  </span>
                </div>

                {/* SCHEDULED */}

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '11px',
                    color: '#53605A',
                  }}
                >
                  {ann.scheduled_at
                    ? new Date(
                        ann.scheduled_at
                      ).toLocaleDateString()
                    : '-'}
                </div>

                {/* EXPIRES */}

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '11px',
                    color: '#53605A',
                  }}
                >
                  {ann.expires_at
                    ? new Date(
                        ann.expires_at
                      ).toLocaleDateString()
                    : '-'}
                </div>

                {/* ACTIONS */}

                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    onClick={() =>
                      handleEdit(ann)
                    }
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '9px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      background: 'transparent',
                      border:
                        '1px solid #C8A95D',
                      color: '#8A6F32',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      fontWeight: 600,
                      transition:
                        'all 0.2s ease',
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
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(ann.id)
                    }
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '9px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      background: 'transparent',
                      border:
                        '1px solid #E5CACA',
                      color: '#A33A3A',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      fontWeight: 600,
                      transition:
                        'all 0.2s ease',
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