export const colors = {
  bg: '#F8F9FA',
  bgCard: '#FFFFFF',
  bgSecondary: '#FCFBF7',
  sidebar: '#0F2E23',
  sidebarActive: '#294333',
  green: '#0F2E23',
  greenSecondary: '#163F31',
  gold: '#C8A95D',
  goldLight: '#EAD9A3',
  goldHover: '#B89545',
  textPrimary: '#171A18',
  textSecondary: '#59665F',
  textMuted: '#7A857F',
  border: '#E5E7E5',
  divider: '#E1E5E2',
  success: '#22A06B',
  successLight: '#E8F7EF',
  pending: '#D99A24',
  pendingLight: '#FFF5D9',
  danger: '#C94B4B',
  dangerLight: '#FCECEC',
  draft: '#718096',
  draftLight: '#F0F2F3',
  info: '#3B82B6',
  infoLight: '#EAF3FA',
};

export const inputStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E7E5',
  color: '#171A18',
  fontFamily: 'var(--sans)',
  fontSize: '13px',
  padding: '10px 14px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.3s',
  borderRadius: '2px',
};

export const labelStyle = {
  fontFamily: 'var(--sans)',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.05em',
  color: '#59665F',
  display: 'block',
  marginBottom: '0.5rem',
};

export const btnPrimary = {
  fontFamily: 'var(--sans)',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  background: '#C8A95D',
  border: 'none',
  color: '#0F2E23',
  padding: '10px 20px',
  cursor: 'pointer',
  borderRadius: '2px',
  transition: 'background 0.2s',
};

export const btnDanger = {
  fontFamily: 'var(--sans)',
  fontSize: '10px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  background: '#FCECEC',
  border: '1px solid #C94B4B',
  color: '#C94B4B',
  padding: '5px 12px',
  cursor: 'pointer',
  borderRadius: '2px',
};

export const btnOutline = {
  fontFamily: 'var(--sans)',
  fontSize: '10px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  background: 'transparent',
  border: '1px solid #E5E7E5',
  color: '#59665F',
  padding: '5px 12px',
  cursor: 'pointer',
  borderRadius: '2px',
};

export const tableHeader = {
  display: 'grid',
  gap: '1rem',
  padding: '0.875rem 1.5rem',
  background: '#F0F2F3',
  borderBottom: '2px solid #E5E7E5',
};

export const tableRow = {
  display: 'grid',
  gap: '1rem',
  padding: '1rem 1.5rem',
  background: '#FFFFFF',
  borderBottom: '1px solid #E5E7E5',
  alignItems: 'center',
  transition: 'background 0.2s',
};

export const tableHeaderCell = {
  fontFamily: 'var(--sans)',
  fontSize: '10px',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#7A857F',
  fontWeight: 600,
};

export const card = {
  background: '#FFFFFF',
  border: '1px solid #E5E7E5',
  borderRadius: '4px',
  padding: '2rem',
};

export const pageTitle = {
  fontSize: '1.8rem',
  fontWeight: 700,
  color: '#171A18',
  marginBottom: '0.25rem',
};

export const pageSubtitle = {
  fontFamily: 'var(--sans)',
  fontSize: '13px',
  color: '#7A857F',
};

export const sectionLabel = {
  fontFamily: 'var(--sans)',
  fontSize: '10px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: '#C8A95D',
  marginBottom: '0.5rem',
  fontWeight: 600,
};

export const statusBadge = (status) => {
  const map = {
    published: { bg: '#E8F7EF', color: '#22A06B', label: 'Published' },
    draft: { bg: '#F0F2F3', color: '#718096', label: 'Draft' },
    approved: { bg: '#E8F7EF', color: '#22A06B', label: 'Approved' },
    pending: { bg: '#FFF5D9', color: '#D99A24', label: 'Pending' },
    rejected: { bg: '#FCECEC', color: '#C94B4B', label: 'Rejected' },
    upcoming: { bg: '#EAF3FA', color: '#3B82B6', label: 'Upcoming' },
    ongoing: { bg: '#E8F7EF', color: '#22A06B', label: 'Ongoing' },
    completed: { bg: '#F0F2F3', color: '#718096', label: 'Completed' },
    active: { bg: '#E8F7EF', color: '#22A06B', label: 'Active' },
    inactive: { bg: '#FCECEC', color: '#C94B4B', label: 'Inactive' },
    admin: { bg: '#EAF3FA', color: '#3B82B6', label: 'Admin' },
    member: { bg: '#F0F2F3', color: '#718096', label: 'Member' },
  };
  const s = map[status?.toLowerCase()] || { bg: '#F0F2F3', color: '#718096', label: status };
  return {
    fontFamily: 'var(--sans)', fontSize: '10px', fontWeight: 600,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    padding: '3px 10px', borderRadius: '20px',
    background: s.bg, color: s.color,
    display: 'inline-block',
  };
};