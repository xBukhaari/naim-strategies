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

  const generateSlug = (title) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80);
  };

  const resetForm = () => {
    setFormData({
      title: '', slug: '', excerpt: '', body: '',
      featured_image: '', category: '', is_published: false,
    });
    setEditing(null);
    setShowForm(false);
  };

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    setPosts(posts.filter(p => p.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      published_at: formData.is_published ? new Date().toISOString() : null,
    };

    if (editing) {
      await supabase.from('blog_posts').update(payload).eq('id', editing);
    } else {
      await supabase.from('blog_posts').insert(payload);
    }

    setSaving(false);
    resetForm();
    getPosts();
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
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>Loading posts...</p>
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
            <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#e8e0d0', marginBottom: '0.25rem' }}>Blog Posts</h1>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>{posts.length} total posts</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }} style={{
            fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            background: '#c9a96e', border: 'none', color: '#0a0a0a',
            padding: '12px 24px', cursor: 'pointer',
          }}>
            {showForm ? 'Cancel' : '+ New Post'}
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: '#0a0a0a', border: '1px solid #ffffff0d', padding: '2.5rem', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#e8e0d0', marginBottom: '2rem' }}>
              {editing ? 'Edit Post' : 'New Blog Post'}
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Title *</label>
              <input style={inputStyle} required value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Slug *</label>
                <input style={inputStyle} required value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <input style={inputStyle} placeholder="e.g. Strategic Leadership"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })} />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Featured Image URL</label>
              <input style={inputStyle} type="url" placeholder="https://res.cloudinary.com/..."
                value={formData.featured_image}
                onChange={e => setFormData({ ...formData, featured_image: e.target.value })} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Excerpt</label>
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3}
                placeholder="Brief summary of the post..."
                value={formData.excerpt}
                onChange={e => setFormData({ ...formData, excerpt: e.target.value })} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Body *</label>
              <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={15} required
                placeholder="Write your full article here..."
                value={formData.body}
                onChange={e => setFormData({ ...formData, body: e.target.value })} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <input type="checkbox" id="is_published" checked={formData.is_published}
                onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label htmlFor="is_published" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>
                Publish this post immediately
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={saving} style={{
                fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                background: '#c9a96e', border: 'none', color: '#0a0a0a',
                padding: '12px 24px', cursor: 'pointer',
              }}>
                {saving ? 'Saving...' : editing ? 'Update Post' : 'Publish Post'}
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

        {/* POSTS TABLE */}
        <div style={{ background: '#ffffff08', display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '0.875rem 1.5rem', background: '#0a0a0a' }}>
            {['Title', 'Category', 'Status', 'Date', 'Actions'].map(h => (
              <div key={h} style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#504840' }}>{h}</div>
            ))}
          </div>

          {posts.length === 0 ? (
            <div style={{ background: '#0f0f0f', padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: '#504840' }}>No posts yet. Write your first post above.</p>
            </div>
          ) : (
            posts.map((post, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '1.25rem 1.5rem', background: '#0f0f0f', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.background = '#141414'}
                onMouseLeave={e => e.currentTarget.style.background = '#0f0f0f'}
              >
                <div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 500, color: '#e8e0d0', marginBottom: '0.2rem' }}>
                    {post.title}
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                    /{post.slug}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#a09080' }}>
                  {post.category || '-'}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: post.is_published ? '#a5d6a7' : '#504840' }}>
                  {post.is_published ? 'Published' : 'Draft'}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: '#504840' }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(post)} style={{
                    fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.1em',
                    textTransform: 'uppercase', background: 'transparent',
                    border: '1px solid #ffffff0d', color: '#c9a96e',
                    padding: '4px 10px', cursor: 'pointer',
                  }}>Edit</button>
                  <button onClick={() => handleDelete(post.id)} style={{
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