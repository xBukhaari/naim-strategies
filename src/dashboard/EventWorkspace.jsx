import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DashboardLayout from './DashboardLayout';

export default function EventWorkspace() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [resources, setResources] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [eventRes, resourceRes, updatesRes, certRes] = await Promise.all([
        supabase.from('events').select('*').eq('id', eventId).single(),
        supabase.from('resources').select('*').eq('event_id', eventId).order('created_at', { ascending: false }),
        supabase.from('event_updates').select('*').eq('event_id', eventId).order('created_at', { ascending: false }),
        supabase.from('certificates').select('*').eq('event_id', eventId).eq('user_id', session.user.id).single(),
      ]);

      setEvent(eventRes.data);
      setResources(resourceRes.data || []);
      setUpdates(updatesRes.data || []);
      setCertificate(certRes.data);
      setLoading(false);
    };

    getData();
  }, [eventId]);

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('word') || fileType?.includes('doc')) return '📝';
    if (fileType?.includes('powerpoint') || fileType?.includes('ppt')) return '📊';
    if (fileType?.includes('image')) return '🖼️';
    if (fileType?.includes('zip')) return '🗜️';
    return '📎';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}>◇</div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>Loading workspace...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Event not found</h2>
          <Link to="/dashboard/events" className="btn btn-gold">Back to My Events</Link>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'updates', label: `Updates ${updates.length > 0 ? `(${updates.length})` : ''}` },
    { value: 'resources', label: `Resources ${resources.length > 0 ? `(${resources.length})` : ''}` },
    { value: 'certificate', label: 'Certificate' },
  ];

  return (
    <DashboardLayout>
      <div style={{ padding: '3rem' }}>

        {/* BACK */}
        <Link to="/dashboard/events" style={{
          fontFamily: 'var(--sans)', fontSize: '11px', letterSpacing: '0.15em',
          textTransform: 'uppercase', color: 'var(--accent)', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem',
        }}>
          ← Back to My Events
        </Link>

        {/* EVENT HEADER */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderTop: '4px solid var(--accent)', padding: '2.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                {event.event_type}
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>{event.title}</h1>
              <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--text-mute)' }}>
                {event.location}
                {event.start_date && ` · ${new Date(event.start_date).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
              </div>
            </div>
            <span style={{
              fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.15em',
              textTransform: 'uppercase', padding: '6px 14px',
              background: event.status === 'completed' ? '#e8f5e9' : event.status === 'ongoing' ? '#e3f2fd' : '#fff8e1',
              color: event.status === 'completed' ? '#2e7d32' : event.status === 'ongoing' ? '#1565c0' : '#f57f17',
            }}>
              {event.status}
            </span>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)} style={{
              fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '0.875rem 1.5rem', background: 'transparent', border: 'none',
              borderBottom: activeTab === tab.value ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === tab.value ? 'var(--accent)' : 'var(--text-mute)',
              cursor: 'pointer', transition: 'all 0.3s', marginBottom: '-1px',
              whiteSpace: 'nowrap',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ maxWidth: '700px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem' }}>About This Programme</h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '14px', lineHeight: 1.9, color: 'var(--text-mute)', marginBottom: '2rem' }}>
              {event.description || 'No description available.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)' }} className="overview-grid">
              {[
                { label: 'Event Type', value: event.event_type || 'N/A' },
                { label: 'Location', value: event.location || 'N/A' },
                { label: 'Start Date', value: event.start_date ? new Date(event.start_date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
                { label: 'End Date', value: event.end_date ? new Date(event.end_date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
                { label: 'Status', value: event.status },
                { label: 'Capacity', value: event.capacity ? `${event.capacity} participants` : 'N/A' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'var(--bg-2)', padding: '1.5rem' }}>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: '0.5rem' }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UPDATES TAB */}
        {activeTab === 'updates' && (
          <div style={{ maxWidth: '700px' }}>
            {updates.length === 0 ? (
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '3rem', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>
                  No updates have been posted yet.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
                {updates.map((update, i) => (
                  <div key={i} style={{ background: 'var(--bg-2)', padding: '2rem', borderLeft: '3px solid var(--accent)' }}>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                      {new Date(update.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>{update.title}</h3>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', lineHeight: 1.8, color: 'var(--text-mute)' }}>{update.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div>
            {resources.length === 0 ? (
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '3rem', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>
                  No resources have been uploaded yet.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'var(--border)' }} className="resources-grid">
                {resources.map((res, i) => (
                  <div key={i} style={{ background: 'var(--bg-2)', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '2rem', flexShrink: 0 }}>{getFileIcon(res.file_type)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>
                        {res.title}
                      </div>
                      {res.description && (
                        <div style={{ fontFamily: 'var(--sans)', fontSize: '11px', color: 'var(--text-mute)', marginBottom: '0.75rem' }}>
                          {res.description}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {res.file_url && (
                          <a href={res.file_url} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ fontSize: '9px' }}>
                            Download →
                          </a>
                        )}
                        {res.external_link && (
                          <a href={res.external_link} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '9px' }}>
                            Open Link →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATE TAB */}
        {activeTab === 'certificate' && (
          <div style={{ maxWidth: '600px' }}>
            {event.status !== 'completed' ? (
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>◉</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>Certificate Not Yet Available</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>
                  Your certificate will be available once this programme is marked as completed.
                </p>
              </div>
            ) : !certificate ? (
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>◉</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>Certificate Being Prepared</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text-mute)' }}>
                  Your certificate is being prepared by the NAIM Strategies team. You will be notified once it is ready.
                </p>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderTop: '4px solid var(--gold)', padding: '3rem' }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>
                  Certificate of Completion
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>{event.title}</h2>
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: '0.25rem' }}>Certificate ID</div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 600 }}>{certificate.certificate_id}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: '0.25rem' }}>Issued</div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 600 }}>
                      {new Date(certificate.issued_date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {certificate.certificate_url && (
                    <a href={certificate.certificate_url} target="_blank" rel="noreferrer" className="btn btn-gold">
                      Download Certificate →
                    </a>
                  )}
                  <a href={`/verify/${certificate.certificate_id}`} target="_blank" rel="noreferrer" className="btn btn-outline">
                    Verify Certificate →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .overview-grid { grid-template-columns: 1fr !important; }
          .resources-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </DashboardLayout>
  );
}