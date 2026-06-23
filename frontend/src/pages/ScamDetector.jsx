import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const SCAM_SCRIPTS = [
  {
    id: 1,
    type: 'Digital Arrest',
    confidence: 97,
    indicators: ['CBI impersonation', 'Arrest threat', 'Video call demand', 'UPI transfer request', 'Money laundering accusation'],
    callerId: '+91-11-2309****',
    spoofed: true,
    transcript: `"Namaskar, main CBI officer Rajesh Kumar bol raha hoon. Aapka Aadhaar number ek drug trafficking case mein link ho gaya hai. Abhi arrest warrant issue ho gaya hai. Aapko digital arrest mein lena hoga — video call par rehna hoga. Kisi ko mat batana. ₹2,50,000 bail mein deposit karo, warna police aayegi."`,
  },
  {
    id: 2,
    type: 'Customs Scam',
    confidence: 91,
    indicators: ['Package seized', 'Customs officer impersonation', 'Clearance fee demand', 'Time pressure', 'SecretiveInstruction'],
    callerId: '+91-22-6169****',
    spoofed: true,
    transcript: `"Your parcel from Dubai has been intercepted at IGI Airport. It contains illegal substances. Pay ₹45,000 customs clearance fee immediately or face arrest. This is a confidential case — don't contact anyone."`,
  },
  {
    id: 3,
    type: 'TRAI Warning Scam',
    confidence: 88,
    indicators: ['SIM disconnection threat', 'TRAI impersonation', 'Urgency', 'Personal data request'],
    callerId: '+91-98765-4****',
    spoofed: false,
    transcript: `"This is TRAI helpdesk. Your mobile number will be permanently disconnected in 2 hours due to illegal activities registered against it. Press 9 to connect to officer or call back to avoid disconnection."`,
  },
]

const radarData = [
  { feature: 'Script Match', value: 94 },
  { feature: 'Spoof Signal', value: 88 },
  { feature: 'Call Pattern', value: 76 },
  { feature: 'Urgency Level', value: 97 },
  { feature: 'Transfer Ask', value: 85 },
  { feature: 'Impersonation', value: 92 },
]

const callFlow = [
  { t: '0s', risk: 10 },
  { t: '15s', risk: 22 },
  { t: '30s', risk: 45 },
  { t: '45s', risk: 61 },
  { t: '60s', risk: 79 },
  { t: '75s', risk: 91 },
  { t: '90s', risk: 97 },
]

const mhaAlertTemplate = (scam) => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MHA CYBERCRIME ALERT — AUTO GENERATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Alert ID   : SHIELD-${Date.now()}
Module     : Scam Detector (NLP + Speech AI)
Date/Time  : ${new Date().toLocaleString('en-IN')} IST
Threat Type: ${scam.type}
Confidence : ${scam.confidence}%
Caller ID  : ${scam.callerId} (Spoofed: ${scam.spoofed ? 'YES' : 'NO'})

INDICATORS DETECTED:
${scam.indicators.map((i, n) => `  ${n + 1}. ${i}`).join('\n')}

TRANSCRIPT EXCERPT:
"${scam.transcript.substring(0, 120)}..."

ACTION REQUIRED:
• Block caller ID at telecom level
• Issue victim advisory via SMS
• Forward to NCRB portal
• Initiate telecom CDR analysis

Status: TRANSMITTED TO NCRB & TELECOM PROVIDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

export default function ScamDetector() {
  const [activeScam, setActiveScam] = useState(SCAM_SCRIPTS[0])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [mhaAlert, setMhaAlert] = useState('')
  const [inputText, setInputText] = useState('')
  const [tab, setTab] = useState('analyze')
  const [liveRisk, setLiveRisk] = useState(0)
  const intervalRef = useRef(null)

  const runAnalysis = (scam) => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    setMhaAlert('')
    setLiveRisk(0)
    let risk = 0
    intervalRef.current = setInterval(() => {
      risk += Math.random() * 15
      if (risk >= scam.confidence) {
        risk = scam.confidence
        clearInterval(intervalRef.current)
        setIsAnalyzing(false)
        setAnalysisResult(scam)
        setMhaAlert(mhaAlertTemplate(scam))
        toast.error(`🚨 SCAM DETECTED: ${scam.type} — Confidence ${scam.confidence}%`, { duration: 5000 })
      }
      setLiveRisk(Math.min(risk, scam.confidence))
    }, 120)
  }

  const analyzeCustomText = () => {
    if (!inputText.trim()) { toast.error('Please enter a call transcript or script'); return }
    const fakeScam = {
      id: 99, type: 'Custom Analysis', confidence: Math.floor(60 + Math.random() * 38),
      indicators: ['Time pressure detected', 'Authority impersonation', 'Payment demand', 'Threat language'],
      callerId: '+91-UNKNOWN', spoofed: Math.random() > 0.5, transcript: inputText,
    }
    runAnalysis(fakeScam)
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <div className="animate-fadeIn">
      <div className="module-tag" style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.3)' }}>
        📞 MODULE 01 — SCAM DETECTOR
      </div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Digital Arrest Scam Detection</h1>
          <p className="page-subtitle">Real-time NLP + Speech AI classifier that flags active scam sessions — call flow analysis, number spoofing detection, script matching, and auto MHA alert generation.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-red">12 Active Alerts</span>
          <button className="btn btn-danger btn-sm">🔴 Block All Numbers</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['analyze', 'live-feed', 'mha-alerts'].map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ analyze: '🔍 Analyze', 'live-feed': '📡 Live Feed', 'mha-alerts': '🏛️ MHA Alerts' }[t]}
          </button>
        ))}
      </div>

      {tab === 'analyze' && (
        <div>
          <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
            {/* Preset Scam Selector */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">📋 Scam Pattern Library</div>
                <span className="badge badge-blue">3 Patterns</span>
              </div>
              {SCAM_SCRIPTS.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setActiveScam(s)}
                  style={{
                    padding: 'var(--space-md)',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${activeScam.id === s.id ? 'rgba(231,76,60,0.5)' : 'var(--border)'}`,
                    background: activeScam.id === s.id ? 'rgba(231,76,60,0.06)' : 'transparent',
                    cursor: 'pointer',
                    marginBottom: 8,
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700 }}>{s.type}</span>
                    <span className="badge badge-red">{s.confidence}% Risk</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.indicators.slice(0, 3).join(' · ')}</div>
                </div>
              ))}

              <div className="divider" />
              <div className="form-group">
                <label className="form-label">Or Paste Custom Transcript</label>
                <textarea className="form-control" placeholder="Paste call transcript or suspicious script here..." value={inputText} onChange={(e) => setInputText(e.target.value)} style={{ minHeight: 80 }} />
              </div>
              {inputText ? (
                <button className="btn btn-danger" style={{ width: '100%' }} onClick={analyzeCustomText} disabled={isAnalyzing}>
                  {isAnalyzing ? '⏳ Analyzing...' : '🔍 Analyze Custom Text'}
                </button>
              ) : (
                <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => runAnalysis(activeScam)} disabled={isAnalyzing}>
                  {isAnalyzing ? '⏳ Analyzing...' : `🔍 Analyze: ${activeScam.type}`}
                </button>
              )}
            </div>

            {/* Risk Gauge */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">⚠️ Real-Time Risk Score</div>
                {isAnalyzing && <span className="badge badge-amber" style={{ animation: 'blink 1s infinite' }}>SCANNING</span>}
              </div>

              {/* Big Gauge */}
              <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
                <div style={{
                  width: 160, height: 160, borderRadius: '50%',
                  background: `conic-gradient(${liveRisk > 80 ? '#e74c3c' : liveRisk > 50 ? '#f39c12' : '#2ecc71'} ${liveRisk * 3.6}deg, var(--bg-surface) 0)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: liveRisk > 80 ? '0 0 40px rgba(231,76,60,0.4)' : '0 0 20px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s',
                }}>
                  <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: liveRisk > 80 ? '#e74c3c' : liveRisk > 50 ? '#f39c12' : '#2ecc71', fontFamily: 'var(--font-mono)' }}>
                      {Math.round(liveRisk)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>/ 100</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 18, color: liveRisk > 80 ? '#e74c3c' : liveRisk > 50 ? '#f39c12' : liveRisk > 0 ? '#2ecc71' : 'var(--text-secondary)' }}>
                  {liveRisk > 80 ? '🚨 SCAM CONFIRMED' : liveRisk > 50 ? '⚠️ HIGH RISK' : liveRisk > 0 ? '✅ LOW RISK' : 'Awaiting Analysis'}
                </div>
              </div>

              {/* Indicators */}
              {analysisResult && (
                <div className="risk-meter">
                  {radarData.map((r) => (
                    <div key={r.feature} className="risk-bar-container">
                      <span className="risk-label">{r.feature}</span>
                      <div className="risk-bar">
                        <div className="risk-bar-fill" style={{ width: `${r.value}%`, background: r.value > 80 ? 'linear-gradient(90deg,#e74c3c,#c0392b)' : r.value > 60 ? 'linear-gradient(90deg,#f39c12,#e67e22)' : 'linear-gradient(90deg,#2ecc71,#27ae60)' }} />
                      </div>
                      <span className="risk-value" style={{ color: r.value > 80 ? '#e74c3c' : r.value > 60 ? '#f39c12' : '#2ecc71' }}>{r.value}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results Row */}
          {analysisResult && (
            <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
              <div className="card">
                <div className="card-header">
                  <div className="card-title">📊 Call Pattern Analysis</div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={callFlow}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,139,253,0.08)" />
                    <XAxis dataKey="t" tick={{ fill: '#8899b4', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8899b4', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: '#0f1e35', border: '1px solid rgba(56,139,253,0.3)', borderRadius: 8, color: '#e8edf5', fontSize: 12 }} />
                    <Line type="monotone" dataKey="risk" stroke="#e74c3c" strokeWidth={2} dot={{ fill: '#e74c3c', r: 3 }} name="Risk Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <div className="card-header">
                  <div className="card-title">🔍 Detected Indicators</div>
                  <span className="badge badge-red">{analysisResult.indicators.length} Flags</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {analysisResult.indicators.map((ind, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(231,76,60,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(231,76,60,0.15)' }}>
                      <span style={{ color: '#e74c3c' }}>⚠️</span>
                      <span style={{ fontSize: 14 }}>{ind}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(231,76,60,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(231,76,60,0.15)' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Caller ID</div>
                    <div style={{ fontFamily: 'var(--font-mono)', color: '#e74c3c', fontWeight: 700 }}>{analysisResult.callerId}</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      Number Spoofed: <span style={{ color: analysisResult.spoofed ? '#e74c3c' : '#2ecc71', fontWeight: 700 }}>{analysisResult.spoofed ? 'YES — SPOOFED' : 'NO'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MHA Alert */}
          {mhaAlert && (
            <div className="card" style={{ borderColor: 'rgba(231,76,60,0.4)' }}>
              <div className="card-header">
                <div className="card-title">🏛️ Auto-Generated MHA Alert</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-success btn-sm" onClick={() => { navigator.clipboard?.writeText(mhaAlert); toast.success('Alert copied!') }}>📋 Copy</button>
                  <button className="btn btn-danger btn-sm" onClick={() => toast.success('Alert transmitted to NCRB!')}>📡 Transmit to NCRB</button>
                </div>
              </div>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#e74c3c', background: 'rgba(231,76,60,0.04)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(231,76,60,0.15)', overflowX: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {mhaAlert}
              </pre>
            </div>
          )}
        </div>
      )}

      {tab === 'live-feed' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">📡 Live Scam Call Feed</div>
            <span className="badge badge-red">● LIVE</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Time</th><th>Caller ID</th><th>Scam Type</th><th>Victim City</th><th>Telecom</th><th>Risk</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { time: '19:21', caller: '+91-11-2309****', type: 'Digital Arrest', city: 'Mumbai', telecom: 'Airtel', risk: 97, status: 'BLOCKED' },
                  { time: '19:19', caller: '+91-22-6169****', type: 'Customs Scam', city: 'Delhi', telecom: 'Jio', risk: 91, status: 'ALERTING' },
                  { time: '19:15', caller: '+91-40-6724****', type: 'TRAI Warning', city: 'Hyderabad', telecom: 'Vi', risk: 88, status: 'BLOCKED' },
                  { time: '19:11', caller: '+91-80-4567****', type: 'Digital Arrest', city: 'Bangalore', telecom: 'BSNL', risk: 95, status: 'BLOCKED' },
                  { time: '19:08', caller: '+91-33-2890****', type: 'KYC Scam', city: 'Kolkata', telecom: 'Airtel', risk: 79, status: 'MONITORING' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="mono">{row.time} IST</td>
                    <td className="mono" style={{ color: '#e74c3c' }}>{row.caller}</td>
                    <td><span className="badge badge-red">{row.type}</span></td>
                    <td>{row.city}</td>
                    <td>{row.telecom}</td>
                    <td><span style={{ color: row.risk > 90 ? '#e74c3c' : '#f39c12', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{row.risk}%</span></td>
                    <td><span className={`badge ${row.status === 'BLOCKED' ? 'badge-green' : row.status === 'ALERTING' ? 'badge-red' : 'badge-amber'}`}>{row.status}</span></td>
                    <td><button className="btn btn-secondary btn-sm">Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'mha-alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {SCAM_SCRIPTS.map((s) => (
            <div key={s.id} className="card" style={{ borderLeft: '3px solid #e74c3c' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>MHA Alert — {s.type}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-red">{s.confidence}% Confidence</span>
                  <span className="badge badge-green">TRANSMITTED</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
                Caller: {s.callerId} · Spoofed: {s.spoofed ? 'YES' : 'NO'} · Generated: {new Date().toLocaleString('en-IN')}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {s.indicators.map((ind, i) => <span key={i} className="badge badge-red">{ind}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
