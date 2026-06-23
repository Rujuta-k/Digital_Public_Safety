import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const areaData = [
  { time: '00:00', scams: 12, fraud: 8, counterfeit: 3 },
  { time: '04:00', scams: 18, fraud: 11, counterfeit: 5 },
  { time: '08:00', scams: 35, fraud: 22, counterfeit: 8 },
  { time: '12:00', scams: 58, fraud: 34, counterfeit: 12 },
  { time: '16:00', scams: 72, fraud: 45, counterfeit: 18 },
  { time: '20:00', scams: 49, fraud: 31, counterfeit: 11 },
  { time: '23:59', scams: 38, fraud: 26, counterfeit: 9 },
]

const modules = [
  { to: '/scam-detector',  icon: '📞', label: 'Scam Detector',    color: '#e74c3c', alerts: 12, status: 'ACTIVE', desc: 'NLP + Speech AI · Script Classification' },
  { to: '/currency-id',    icon: '💵', label: 'Currency ID',      color: '#f39c12', alerts: 3,  status: 'ACTIVE', desc: 'Computer Vision · UV Simulation' },
  { to: '/fraud-graph',    icon: '🕸️', label: 'Fraud Graph AI',   color: '#9b59f5', alerts: 7,  status: 'ACTIVE', desc: 'Graph AI · Mule Ring Mapping' },
  { to: '/geospatial',     icon: '🗺️', label: 'Geospatial Intel', color: '#2ecc71', alerts: 5,  status: 'ACTIVE', desc: 'GeoAI · Crime Hotspot Maps' },
  { to: '/citizen-shield', icon: '💬', label: 'Citizen Shield',   color: '#39d0d8', alerts: 0,  status: 'ACTIVE', desc: 'Conversational AI · 12 Languages' },
]

const liveAlerts = [
  { id: 1, sev: 'CRITICAL', msg: 'Digital arrest scam detected — Caller spoofing CBI number +91-11-23094011', time: '19:21:03', mod: 'Scam Detector' },
  { id: 2, sev: 'HIGH',     msg: 'Counterfeit ₹500 note cluster — 14 notes flagged at SBI Branch, Pune', time: '19:18:47', mod: 'Currency ID' },
  { id: 3, sev: 'HIGH',     msg: 'Fraud ring identified — 23 accounts linked in money mule network', time: '19:15:12', mod: 'Fraud Graph AI' },
  { id: 4, sev: 'MEDIUM',   msg: 'Crime hotspot surge — Andheri East, 3× baseline complaint rate', time: '19:09:55', mod: 'Geospatial' },
  { id: 5, sev: 'LOW',      msg: 'Citizen reported suspicious UPI request — risk score 87/100', time: '19:07:33', mod: 'Citizen Shield' },
]

const sevColor = { CRITICAL: '#e74c3c', HIGH: '#f39c12', MEDIUM: '#388bfd', LOW: '#2ecc71' }
const sevBadge = { CRITICAL: 'badge-red', HIGH: 'badge-amber', MEDIUM: 'badge-blue', LOW: 'badge-green' }

function AnimatedCounter({ target, duration = 2000 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(timer) }
      else setVal(start)
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <>{val.toLocaleString()}</>
}

export default function Dashboard() {
  return (
    <div className="animate-fadeIn">
      {/* Module Tag */}
      <div className="module-tag" style={{ background: 'rgba(56,139,253,0.1)', color: '#388bfd', border: '1px solid rgba(56,139,253,0.3)' }}>
        ⚡ FUSION ENGINE ACTIVE
      </div>

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">🛡️ SHIELD AI Command Centre</h1>
          <p className="page-subtitle">Multi-agent intelligence platform monitoring digital threats across India in real time</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm">📥 Export Report</button>
          <button className="btn btn-primary btn-sm">🔴 Live Mode</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon: '🚨', val: 1284, label: 'Threats Detected Today', change: '+18%', up: true, accent: '#e74c3c' },
          { icon: '💰', val: 47,   label: 'Crore Fraud Prevented (₹)', change: '+34%', up: true, accent: '#2ecc71' },
          { icon: '👥', val: 3129, label: 'Citizens Protected',    change: '+22%', up: true, accent: '#388bfd' },
          { icon: '🕸️', val: 89,   label: 'Fraud Networks Mapped', change: '+11%', up: true, accent: '#9b59f5' },
          { icon: '💵', val: 412,  label: 'Counterfeit Notes Flagged', change: '+5%', up: true, accent: '#f39c12' },
          { icon: '📍', val: 234,  label: 'Hotspot Zones Active',  change: '-3%', up: false, accent: '#39d0d8' },
        ].map((s, i) => (
          <div key={s.label} className={`stat-card animate-fadeInUp stagger-${i + 1}`} style={{ '--accent': s.accent }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value"><AnimatedCounter target={s.val} /></div>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-change ${s.up ? 'up' : 'down'}`}>
              {s.up ? '▲' : '▼'} {s.change} vs yesterday
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">📈 Threat Activity (24h)</div>
            <span className="badge badge-green">● LIVE</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="gScam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#e74c3c" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gFraud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9b59f5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#9b59f5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gCF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f39c12" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f39c12" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,139,253,0.08)" />
              <XAxis dataKey="time" tick={{ fill: '#8899b4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8899b4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f1e35', border: '1px solid rgba(56,139,253,0.3)', borderRadius: 8, color: '#e8edf5', fontSize: 12 }} />
              <Area type="monotone" dataKey="scams"      stroke="#e74c3c" fill="url(#gScam)"  strokeWidth={2} name="Scam Calls" />
              <Area type="monotone" dataKey="fraud"      stroke="#9b59f5" fill="url(#gFraud)" strokeWidth={2} name="Fraud Txns" />
              <Area type="monotone" dataKey="counterfeit" stroke="#f39c12" fill="url(#gCF)"  strokeWidth={2} name="Counterfeit" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">🏙️ Top Affected Cities</div>
            <button className="btn btn-secondary btn-sm">View Map</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[
              { city: 'Mumbai',    count: 342 },
              { city: 'Delhi',     count: 289 },
              { city: 'Bangalore', count: 218 },
              { city: 'Hyderabad', count: 175 },
              { city: 'Pune',      count: 143 },
              { city: 'Chennai',   count: 121 },
            ]} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,139,253,0.08)" />
              <XAxis type="number" tick={{ fill: '#8899b4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="city" tick={{ fill: '#8899b4', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ background: '#0f1e35', border: '1px solid rgba(56,139,253,0.3)', borderRadius: 8, color: '#e8edf5', fontSize: 12 }} />
              <Bar dataKey="count" name="Threats" fill="#388bfd" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Module Cards */}
      <div className="card-header" style={{ marginBottom: 'var(--space-md)' }}>
        <div className="card-title">🤖 AI Module Status</div>
        <span className="badge badge-green">5/5 Online</span>
      </div>
      <div className="grid-auto" style={{ marginBottom: 'var(--space-xl)' }}>
        {modules.map((m) => (
          <Link to={m.to} key={m.to} className="card" style={{ textDecoration: 'none', borderLeft: `3px solid ${m.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{m.icon}</span>
              <span className="badge badge-green">{m.status}</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>{m.desc}</div>
            {m.alerts > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: m.color, fontWeight: 600 }}>{m.alerts} active alert{m.alerts > 1 ? 's' : ''}</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Live Alerts Feed */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🔴 Live Alert Feed</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge badge-red">7 Critical</span>
            <button className="btn btn-secondary btn-sm">View All</button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {liveAlerts.map((a) => (
            <div key={a.id} className="live-alert" style={{ borderLeftColor: sevColor[a.sev] }}>
              <span className={`badge ${sevBadge[a.sev]}`}>{a.sev}</span>
              <div className="alert-text">
                <div style={{ marginBottom: 2 }}>{a.msg}</div>
                <div className="alert-meta">{a.mod} · {a.time} IST</div>
              </div>
              <button className="btn btn-secondary btn-sm">Review</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
