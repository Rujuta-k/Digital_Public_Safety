import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  {
    section: 'COMMAND CENTRE',
    items: [
      { to: '/dashboard', icon: '🛡️', label: 'SHIELD Dashboard', dot: '#388bfd' },
      { to: '/fusion-engine', icon: '⚡', label: 'Fusion Engine', dot: '#388bfd', badge: '3' },
    ],
  },
  {
    section: 'AI MODULES',
    items: [
      { to: '/scam-detector',   icon: '📞', label: 'Scam Detector',      dot: '#e74c3c', badge: '12' },
      { to: '/currency-id',     icon: '💵', label: 'Currency ID',         dot: '#f39c12' },
      { to: '/fraud-graph',     icon: '🕸️', label: 'Fraud Graph AI',      dot: '#9b59f5' },
      { to: '/geospatial',      icon: '🗺️', label: 'Geospatial Intel',    dot: '#2ecc71' },
      { to: '/citizen-shield',  icon: '💬', label: 'Citizen Shield',      dot: '#39d0d8' },
    ],
  },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🛡️</div>
        <div className="logo-text">
          <h1>SHIELD AI</h1>
          <span>Digital Public Safety</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div key={section.section}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-dot" style={{ background: item.dot }} />
                <span className="nav-icon">{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <div className="pulse-dot" />
          <span>All Systems Operational</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', paddingLeft: 4 }}>
          v2.1.0 · MHA Compliant · IT Act 2000
        </div>
      </div>
    </aside>
  )
}
