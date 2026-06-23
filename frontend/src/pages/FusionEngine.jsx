import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ScatterChart, Scatter, ZAxis } from 'recharts'

const MODULES = [
  { id: 'scam',     name: 'Scam Detector',     color: '#e74c3c', signals: 312, threatScore: 97, status: 'ACTIVE' },
  { id: 'currency', name: 'Currency ID',        color: '#f39c12', signals: 89,  threatScore: 72, status: 'ACTIVE' },
  { id: 'fraud',    name: 'Fraud Graph AI',     color: '#9b59f5', signals: 178, threatScore: 88, status: 'ACTIVE' },
  { id: 'geo',      name: 'Geospatial Intel',   color: '#2ecc71', signals: 234, threatScore: 65, status: 'ACTIVE' },
  { id: 'citizen',  name: 'Citizen Shield',     color: '#39d0d8', signals: 3129,threatScore: 54, status: 'ACTIVE' },
]

const FUSION_EVENTS = [
  { id: 1, title: 'Digital Arrest Ring — Mumbai/Delhi',       modules: ['scam', 'fraud', 'geo'],      score: 97, action: 'MHA Alert Issued',   time: '19:21' },
  { id: 2, title: 'Counterfeit ₹500 Distribution Network',   modules: ['currency', 'fraud', 'geo'],  score: 89, action: 'RBI & Police Alerted',time: '19:15' },
  { id: 3, title: 'UPI Mule Ring — 23 Accounts Linked',       modules: ['fraud', 'citizen'],          score: 84, action: 'Accounts Frozen',    time: '19:08' },
  { id: 4, title: 'Scam Call Hotspot — Jamtara Cluster',      modules: ['scam', 'geo'],               score: 91, action: 'Patrol Deployed',    time: '19:02' },
  { id: 5, title: 'KYC Phishing Campaign — 12 States',        modules: ['scam', 'citizen', 'fraud'],  score: 78, action: 'Domain Blacklisted', time: '18:55' },
]

const radarData = [
  { module: 'Scam', value: 97 },
  { module: 'Currency', value: 72 },
  { module: 'Fraud', value: 88 },
  { module: 'Geospatial', value: 65 },
  { module: 'Citizen', value: 54 },
]

const fusionTimeline = [
  { t: '18:00', events: 12, fused: 3 },
  { t: '18:30', events: 18, fused: 5 },
  { t: '19:00', events: 34, fused: 11 },
  { t: '19:10', events: 28, fused: 8 },
  { t: '19:15', events: 45, fused: 14 },
  { t: '19:21', events: 52, fused: 18 },
]

const modColor = { scam: '#e74c3c', currency: '#f39c12', fraud: '#9b59f5', geo: '#2ecc71', citizen: '#39d0d8' }

export default function FusionEngine() {
  const [processing, setProcessing] = useState(false)
  const [fusionScore, setFusionScore] = useState(91)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    const interval = setInterval(() => {
      setFusionScore(prev => {
        const delta = (Math.random() - 0.5) * 4
        return Math.max(70, Math.min(99, prev + delta))
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const runFusion = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      toast.success('⚡ Fusion cycle complete — 3 new intelligence packages generated!', { duration: 5000 })
    }, 3000)
  }

  return (
    <div className="animate-fadeIn">
      <div className="module-tag" style={{ background: 'rgba(56,139,253,0.1)', color: '#388bfd', border: '1px solid rgba(56,139,253,0.3)' }}>
        ⚡ AGENTIC FUSION ENGINE
      </div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Agentic Fusion Engine</h1>
          <p className="page-subtitle">Multi-source intelligence fusion — correlates signals across all 5 modules, deduplicates alerts, assigns threat scores, generates evidence packages, and routes to correct output channels in near real time.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-blue" style={{ animation: 'blink 2s infinite' }}>● FUSING</span>
          <button className="btn btn-primary btn-sm" onClick={runFusion} disabled={processing}>
            {processing ? <><div className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> Processing...</> : '⚡ Run Fusion Cycle'}
          </button>
        </div>
      </div>

      {/* Fusion Score Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56,139,253,0.08), rgba(155,89,245,0.08))',
        border: '1px solid rgba(56,139,253,0.3)',
        borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)',
        marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-xl)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: '#388bfd', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{Math.round(fusionScore)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>THREAT INDEX</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>⚡ Agentic AI — Multi-Source Intelligence Fusion</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            Correlates signals across all five modules · Deduplicates alerts · Assigns threat scores · 
            Generates evidence packages · Routes to the correct output channel in near real time
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Signals Processed', val: '3,942', color: '#388bfd' },
            { label: 'Fused Events', val: '59', color: '#9b59f5' },
            { label: 'Deduplication Rate', val: '94%', color: '#2ecc71' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tabs">
        {['overview', 'events', 'outputs', 'infrastructure'].map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ overview: '📊 Overview', events: '⚡ Fused Events', outputs: '📤 Outputs', infrastructure: '🔧 Infrastructure' }[t]}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="grid-2">
            {/* Radar */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>📡 Module Threat Radar</div>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(56,139,253,0.15)" />
                  <PolarAngleAxis dataKey="module" tick={{ fill: '#8899b4', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar name="Threat" dataKey="value" stroke="#388bfd" fill="#388bfd" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Timeline */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>📈 Fusion Activity (Last 90 min)</div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={fusionTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,139,253,0.08)" />
                  <XAxis dataKey="t" tick={{ fill: '#8899b4', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8899b4', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f1e35', border: '1px solid rgba(56,139,253,0.3)', borderRadius: 8, color: '#e8edf5', fontSize: 12 }} />
                  <Line type="monotone" dataKey="events" stroke="#388bfd" strokeWidth={2} name="Raw Signals" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="fused"  stroke="#9b59f5" strokeWidth={2} name="Fused Events" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Module Feed */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>🤖 Module Signal Feed</div>
            <div className="grid-auto">
              {MODULES.map((m) => (
                <div key={m.id} style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: `1px solid ${m.color}33`, background: `${m.color}08` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</span>
                    <span className="badge badge-green">{m.status}</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: m.color, fontFamily: 'var(--font-mono)' }}>{m.signals.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>signals today</div>
                  <div className="progress" style={{ marginTop: 8, height: 4 }}>
                    <div className="progress-bar" style={{ width: `${m.threatScore}%`, background: m.color }} />
                  </div>
                  <div style={{ fontSize: 11, color: m.color, fontWeight: 700, marginTop: 4 }}>Threat: {m.threatScore}/100</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {FUSION_EVENTS.map((ev) => (
            <div key={ev.id} className="card" style={{ borderLeft: '3px solid #388bfd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{ev.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Fusion Event {ev.id.toString().padStart(3, '0')} · {ev.time} IST</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: ev.score > 90 ? '#e74c3c' : ev.score > 75 ? '#f39c12' : '#388bfd', fontFamily: 'var(--font-mono)' }}>{ev.score}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>THREAT</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Sources:</span>
                {ev.modules.map((m) => (
                  <span key={m} className="badge" style={{ background: `${modColor[m]}20`, color: modColor[m], border: `1px solid ${modColor[m]}40` }}>
                    {MODULES.find(x => x.id === m)?.name}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="badge badge-green">✅ {ev.action}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm">📊 Details</button>
                  <button className="btn btn-sm" style={{ background: 'linear-gradient(135deg,#388bfd,#1f5fd4)', color: '#fff' }} onClick={() => toast.success('Evidence package created!')}>📦 Create Evidence</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'outputs' && (
        <div className="grid-2">
          {[
            { icon: '🏛️', name: 'MHA Alert', desc: 'Auto-generated alerts transmitted to Ministry of Home Affairs cybercrime division.', count: 47, color: '#e74c3c' },
            { icon: '📱', name: 'Field Officer App', desc: 'Mobile app verdicts pushed to field officers and bank tellers for immediate action.', count: 128, color: '#f39c12' },
            { icon: '⚖️', name: 'Evidence Package', desc: 'Court-admissible digital evidence packages with metadata, chain of custody, and signatures.', count: 23, color: '#9b59f5' },
            { icon: '🗺️', name: 'Command Centre', desc: 'Live map dashboard updates at district and state command centres.', count: 89, color: '#2ecc71' },
            { icon: '🏢', name: 'NCRB Portal', desc: 'Automated FIR filing and complaint submission to the National Crime Records Bureau.', count: 312, color: '#388bfd' },
            { icon: '📡', name: 'Telecom Block', desc: 'Immediate number blocking requests transmitted to Airtel, Jio, Vi, BSNL.', count: 67, color: '#39d0d8' },
          ].map((o) => (
            <div key={o.name} className="card" style={{ borderTop: `3px solid ${o.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{o.icon}</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{o.name}</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: o.color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{o.count}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>today</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{o.desc}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'infrastructure' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>🔧 AI Capability Stack</div>
            {[
              { name: 'NLP / LLMs', desc: 'Scam script classification · Multilingual NLP', icon: '🧠', color: '#388bfd' },
              { name: 'Computer Vision', desc: 'Currency authentication · Deepfake detection', icon: '👁️', color: '#f39c12' },
              { name: 'Graph AI', desc: 'Fraud ring mapping · Network analysis', icon: '🕸️', color: '#9b59f5' },
              { name: 'Speech AI', desc: 'Voice spoof detection · Call analysis', icon: '🎤', color: '#e74c3c' },
              { name: 'GeoAI', desc: 'Hotspot mapping · Patrol optimisation', icon: '🗺️', color: '#2ecc71' },
            ].map((c) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 24 }}>{c.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: c.color }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.desc}</div>
                </div>
                <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Active</span>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>🏗️ Cross-Cutting Infrastructure</div>
            {[
              { name: 'Privacy & Compliance', desc: 'IT Act 2000 · DPDP 2023 · Data localisation', icon: '🔒', color: '#388bfd' },
              { name: '12-Language NLP', desc: 'Hindi, English, Marathi, Tamil, Telugu + 7 more', icon: '🌐', color: '#2ecc71' },
              { name: 'Federated Learning', desc: 'On-device & edge ML — no raw data sharing', icon: '🔁', color: '#9b59f5' },
              { name: 'API Layer', desc: 'Inter-agency REST APIs · MHA, NCRB, RBI, Telecom', icon: '📡', color: '#39d0d8' },
              { name: 'Audit Logging', desc: 'Immutable audit trail for court submissions', icon: '📋', color: '#f39c12' },
            ].map((c) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 24 }}>{c.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: c.color }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.desc}</div>
                </div>
                <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Online</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
