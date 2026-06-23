import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const routeMeta = {
  '/dashboard':      { title: 'SHIELD Dashboard',        subtitle: 'Multi-Agent Intelligence Command Centre' },
  '/scam-detector':  { title: 'Digital Arrest Scam Detector', subtitle: 'NLP + Speech AI · Real-time Classification' },
  '/currency-id':    { title: 'Counterfeit Currency ID', subtitle: 'Computer Vision · Microprint & UV Analysis' },
  '/fraud-graph':    { title: 'Fraud Network Graph AI',  subtitle: 'Graph AI · Money Mule & Ring Mapping' },
  '/geospatial':     { title: 'Geospatial Crime Intel',  subtitle: 'GeoAI · Crime Hotspot Maps · Patrol Optimisation' },
  '/citizen-shield': { title: 'Citizen Fraud Shield',    subtitle: 'Conversational AI · 12 Regional Languages' },
  '/fusion-engine':  { title: 'Agentic Fusion Engine',   subtitle: 'Multi-Source Intelligence Fusion · Threat Scoring' },
}

export default function Topbar() {
  const { pathname } = useLocation()
  const meta = routeMeta[pathname] || { title: 'SHIELD AI', subtitle: '' }
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="topbar">
      <div style={{ flex: 1 }}>
        <div className="topbar-title">{meta.title}</div>
        <div className="topbar-subtitle">{meta.subtitle}</div>
      </div>

      <div className="topbar-right">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right' }}>
          <div>{time.toLocaleTimeString('en-IN', { hour12: false })}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>IST</div>
        </div>

        <div className="alert-badge" title="Active Alerts">
          🔔
          <span className="count">7</span>
        </div>

        <div className="alert-badge" title="System Settings">⚙️</div>

        <div className="avatar" title="Admin Officer">AO</div>
      </div>
    </header>
  )
}
