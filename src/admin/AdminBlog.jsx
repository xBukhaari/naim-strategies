import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLayout from './AdminLayout';

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    featured_image: '',
    category: '',
    is_published: false,
  });

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    setPosts(data || []);
    setLoading(false);
  };

  /* =========================
     SLUG GENERATOR
  ========================= */

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80);
  };

  /* =========================
     RESET FORM
  ========================= */

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      featured_image: '',
      category: '',
      is_published: false,
    });

    setEditing(null);
    setShowForm(false);
  };

  /* =========================
     EDIT POST
  ========================= */

  const handleEdit = (post) => {
    setEditing(post.id);

    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      body: post.body || '',
      featured_image: post.featured_image || '',
      category: post.category || '',
      is_published: post.is_published || false,
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /* =========================
     DELETE POST
  ========================= */

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;

    await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    setPosts(posts.filter((post) => post.id !== id));

    if (editing === id) {
      resetForm();
    }
  };

  /* =========================
     SAVE POST
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    const payload = {
      ...formData,
      published_at: formData.is_published
        ? new Date().toISOString()
        : null,
    };

    if (editing) {
      await supabase
        .from('blog_posts')
        .update(payload)
        .eq('id', editing);
    } else {
      await supabase
        .from('blog_posts')
        .insert(payload);
    }

    setSaving(false);

    resetForm();
    getPosts();
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
              Loading posts...
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
              Blog Posts
            </h1>

            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '13px',
                color: '#53605A',
                margin: 0,
              }}
            >
              {posts.length} posts published
            </p>
          </div>

          {/* ADD BLOG POST BUTTON */}

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
            {showForm ? 'Cancel' : '+ Add Blog Post'}
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
                {editing ? 'Edit Blog Post' : 'Add New Blog Post'}
              </h2>

              <p
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '12px',
                  color: '#718078',
                  margin: 0,
                }}
              >
                {editing
                  ? 'Update the content, category or publication status of this post.'
                  : 'Create and publish a new article for your audience.'}
              </p>
            </div>

            {/* TITLE + CATEGORY */}

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
                      slug: generateSlug(e.target.value),
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

              <div>
                <label style={labelStyle}>
                  Category
                </label>

                <input
                  style={inputStyle}
                  placeholder="e.g. Strategic Leadership"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
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

            {/* SLUG + FEATURED IMAGE */}

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
                  Slug *
                </label>

                <input
                  style={inputStyle}
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value,
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

              <div>
                <label style={labelStyle}>
                  Featured Image URL
                </label>

                <input
                  style={inputStyle}
                  type="url"
                  placeholder="https://res.cloudinary.com/..."
                  value={formData.featured_image}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      featured_image: e.target.value,
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

            {/* EXCERPT */}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>
                Excerpt
              </label>

              <textarea
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '90px',
                  lineHeight: 1.6,
                }}
                rows={3}
                placeholder="Brief summary of the post..."
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    excerpt: e.target.value,
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

            {/* BODY */}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>
                Body *
              </label>

              <textarea
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '360px',
                  lineHeight: 1.7,
                }}
                rows={15}
                required
                placeholder="Write your full article here..."
                value={formData.body}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    body: e.target.value,
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
                id="is_published"
                checked={formData.is_published}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_published: e.target.checked,
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
                htmlFor="is_published"
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '11px',
                  color: '#34463E',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Publish this post immediately
              </label>
            </div>

            {/* SAVE BUTTON */}

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
                  background: saving ? '#718078' : '#C8A95D',
                  border: 'none',
                  color: '#0F2E23',
                  padding: '12px 24px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  borderRadius: '3px',
                  transition: 'all 0.25s ease',
                }}
              >
                {saving
                  ? 'Saving...'
                  : editing
                    ? 'Update Post'
                    : 'Publish Post'}
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
                  e.currentTarget.style.borderColor = '#C8A95D';
                  e.currentTarget.style.color = '#8A6F32';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#DDE4DF';
                  e.currentTarget.style.color = '#53605A';
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* =========================
            BLOG POSTS TABLE
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
              gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr',
              gap: '1rem',
              padding: '1rem 1.5rem',
              background: '#0F2E23',
            }}
          >
            {[
              'Title',
              'Category',
              'Status',
              'Date',
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

          {posts.length === 0 ? (
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
                No blog posts yet.
              </p>
            </div>
          ) : (

            /* POST ROWS */

            posts.map((post, i) => (
              <div
                key={post.id || i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr',
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
                    {post.title}
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '11px',
                      lineHeight: 1.5,
                      color: '#718078',
                    }}
                  >
                    /{post.slug}
                  </div>
                </div>

                {/* CATEGORY */}

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '12px',
                    color: '#34463E',
                    fontWeight: 500,
                  }}
                >
                  {post.category || '-'}
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
                      background: post.is_published
                        ? '#E7F3EC'
                        : '#F1F3F2',
                      color: post.is_published
                        ? '#246B45'
                        : '#53605A',
                      fontWeight: 600,
                    }}
                  >
                    {post.is_published
                      ? 'Published'
                      : 'Draft'}
                  </span>
                </div>

                {/* DATE */}

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '11px',
                    color: '#53605A',
                  }}
                >
                  {new Date(
                    post.created_at
                  ).toLocaleDateString()}
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
                    onClick={() => handleEdit(post)}
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
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(post.id)
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