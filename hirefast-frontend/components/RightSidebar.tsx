'use client';

export default function RightSidebar() {
  const news = [
    { title: 'Top tech companies hiring', readers: '21,294 readers', time: '4h ago' },
    { title: 'Remote work trends 2026', readers: '1,276 readers', time: '20h ago' },
    { title: 'Startup accelerator programs', readers: '1,006 readers', time: '21h ago' },
    { title: 'AI skills in demand', readers: '534 readers', time: '21h ago' },
    { title: 'Career development tips', readers: '407 readers', time: '19h ago' }
  ];

  return (
    <div style={{ position: 'sticky', top: '80px', height: 'fit-content' }}>
      {/* News Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          HireFast News
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>ℹ️</span>
        </h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {news.map((item, idx) => (
            <div key={idx} style={{
              paddingBottom: idx < news.length - 1 ? '1rem' : 0,
              borderBottom: idx < news.length - 1 ? '1px solid var(--border)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}>
              <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '0.95rem', fontWeight: 600, color: '#000' }}>
                {item.title}
              </h4>
              <p style={{ margin: '0.25rem 0 0 0', color: 'var(--muted)', fontSize: '0.85rem' }}>
                {item.time} • {item.readers}
              </p>
            </div>
          ))}
        </div>

        <button style={{
          width: '100%',
          marginTop: '1rem',
          padding: '0.6rem',
          border: 'none',
          background: 'transparent',
          color: '#0a66c2',
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: 'pointer',
          borderRadius: '4px',
          transition: 'all 0.2s'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f3f2ef';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}>
          Show more ▼
        </button>
      </div>
    </div>
  );
}
