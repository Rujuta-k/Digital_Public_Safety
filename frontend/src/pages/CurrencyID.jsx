import { useState, useRef } from 'react'
import toast from 'react-hot-toast'

const DENOMINATIONS = [
  { value: '₹2000', color: '#9b59f5', checks: ['Magenta security thread', 'Latent image', 'Micro-lettering RBI', 'Color-shifting ink', 'Intaglio printing', 'Watermark Gandhi', 'Fluorescent fibers'] },
  { value: '₹500', color: '#388bfd', checks: ['Green security thread', 'INDIA & 500 text', 'Ashoka Pillar watermark', 'Angular bleed lines', 'Microprint', 'Serial number pattern'] },
  { value: '₹200', color: '#f39c12', checks: ['Swachh Bharat logo', 'Sanchi Stupa motif', 'Security thread', 'Micro-lettering', 'UV features', 'See-through register'] },
  { value: '₹100', color: '#2ecc71', checks: ['Rani Ki Vav motif', 'Purple security thread', 'Latent image', 'Microprint', 'Intaglio numerals', 'Watermark'] },
]

const RESULTS = {
  genuine: {
    label: 'GENUINE NOTE VERIFIED',
    color: '#2ecc71',
    icon: '✅',
    verdict: 'verdict-safe',
    summary: 'All security features verified. This note passes all automated authentication checks.',
  },
  counterfeit: {
    label: 'COUNTERFEIT DETECTED',
    color: '#e74c3c',
    icon: '❌',
    verdict: 'verdict-danger',
    summary: 'Critical security features missing or inconsistent. This note is likely counterfeit. Seize and report immediately.',
  },
  suspect: {
    label: 'SUSPECT — FURTHER CHECK NEEDED',
    color: '#f39c12',
    icon: '⚠️',
    verdict: 'verdict-warning',
    summary: 'Some features are inconclusive. Submit to RBI regional office for forensic verification.',
  },
}

function SecurityCheckRow({ label, passed, delay = 0 }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
        borderRadius: 'var(--radius-md)', border: `1px solid ${passed ? 'rgba(46,204,113,0.2)' : 'rgba(231,76,60,0.2)'}`,
        background: passed ? 'rgba(46,204,113,0.04)' : 'rgba(231,76,60,0.04)',
        animation: `fadeInUp 0.4s ease ${delay}s both`,
      }}
    >
      <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{passed ? '✅' : '❌'}</span>
      <span style={{ flex: 1, fontSize: 14 }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: passed ? '#2ecc71' : '#e74c3c' }}>
        {passed ? 'PASS' : 'FAIL'}
      </span>
    </div>
  )
}

export default function CurrencyID() {
  const [selectedDenom, setSelectedDenom] = useState(DENOMINATIONS[1])
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scanResults, setScanResults] = useState(null)
  const [outcome, setOutcome] = useState(null)
  const [uploaded, setUploaded] = useState(false)
  const [tab, setTab] = useState('scanner')
  const fileRef = useRef()

  const simulateScan = () => {
    setScanning(true)
    setProgress(0)
    setScanResults(null)
    setOutcome(null)
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 12
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        const outcomes = ['genuine', 'genuine', 'genuine', 'counterfeit', 'suspect']
        const result = outcomes[Math.floor(Math.random() * outcomes.length)]
        const passMap = {
          genuine: selectedDenom.checks.map(() => true),
          counterfeit: selectedDenom.checks.map((_, i) => i > 2),
          suspect: selectedDenom.checks.map((_, i) => i % 2 === 0),
        }
        setScanResults(passMap[result])
        setOutcome(result)
        setScanning(false)
        if (result === 'counterfeit') toast.error('❌ COUNTERFEIT DETECTED! Seize and report.', { duration: 6000 })
        else if (result === 'genuine') toast.success('✅ Note verified as genuine.', { duration: 4000 })
        else toast('⚠️ Suspect note — further checks needed.', { icon: '⚠️', duration: 5000 })
      }
      setProgress(Math.min(p, 100))
    }, 150)
  }

  return (
    <div className="animate-fadeIn">
      <div className="module-tag" style={{ background: 'rgba(243,156,18,0.1)', color: '#f39c12', border: '1px solid rgba(243,156,18,0.3)' }}>
        💵 MODULE 02 — COUNTERFEIT CURRENCY ID
      </div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Counterfeit Currency Identification</h1>
          <p className="page-subtitle">Computer vision AI for mobile devices, bank counting machines & POS terminals — microprint, security thread, serial validation, UV simulation.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-amber">412 Flagged Today</span>
          <button className="btn btn-secondary btn-sm">📊 Reports</button>
        </div>
      </div>

      <div className="tabs">
        {['scanner', 'batch', 'seized'].map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ scanner: '🔍 Scanner', batch: '📦 Batch Analysis', seized: '📋 Seizure Log' }[t]}
          </button>
        ))}
      </div>

      {tab === 'scanner' && (
        <div className="grid-2">
          {/* Left: Upload + Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {/* Denomination Selector */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Select Denomination</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {DENOMINATIONS.map((d) => (
                  <div
                    key={d.value}
                    onClick={() => { setSelectedDenom(d); setScanResults(null); setOutcome(null) }}
                    style={{
                      padding: '12px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                      border: `2px solid ${selectedDenom.value === d.value ? d.color : 'var(--border)'}`,
                      background: selectedDenom.value === d.value ? `${d.color}15` : 'transparent',
                      textAlign: 'center', transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: 20, fontWeight: 800, color: d.color }}>{d.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{d.checks.length} checks</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Zone */}
            <div
              className={`upload-zone ${uploaded ? 'drag-over' : ''}`}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={() => setUploaded(true)} />
              {uploaded ? (
                <>
                  <div className="upload-icon">📷</div>
                  <h3>Image Loaded</h3>
                  <p style={{ color: 'var(--green)' }}>Ready for analysis</p>
                </>
              ) : (
                <>
                  <div className="upload-icon">📷</div>
                  <h3>Upload Currency Image</h3>
                  <p>Drag & drop or click — JPG, PNG supported<br />Both sides recommended for best accuracy</p>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={simulateScan} disabled={scanning}>
                {scanning ? (
                  <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Scanning...</>
                ) : '🔍 Run AI Scan'}
              </button>
              <button className="btn btn-secondary" onClick={() => { setScanResults(null); setOutcome(null); setProgress(0); setUploaded(false) }}>Reset</button>
            </div>

            {scanning && (
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span>Scanning {selectedDenom.value} note...</span>
                  <span className="mono" style={{ color: 'var(--blue)' }}>{Math.round(progress)}%</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${progress}%` }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                  {progress < 30 ? '🔬 Analyzing microprint...' : progress < 60 ? '🧵 Verifying security thread...' : progress < 85 ? '🔢 Validating serial number...' : '🌟 Simulating UV features...'}
                </div>
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {outcome && (
              <div className="card" style={{ borderColor: RESULTS[outcome].color + '66', background: `${RESULTS[outcome].color}08` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 36 }}>{RESULTS[outcome].icon}</span>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: RESULTS[outcome].color }}>{RESULTS[outcome].label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{RESULTS[outcome].summary}</div>
                  </div>
                </div>
                {outcome === 'counterfeit' && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="btn btn-danger btn-sm" onClick={() => toast.success('Report filed with RBI & Police')}>🚔 Report to Police</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => toast.success('Evidence package created')}>📦 Create Evidence Package</button>
                  </div>
                )}
              </div>
            )}

            <div className="card" style={{ flex: 1 }}>
              <div className="card-header">
                <div className="card-title">🔬 Security Feature Checks — {selectedDenom.value}</div>
                {scanResults && (
                  <span className="badge badge-blue">
                    {scanResults.filter(Boolean).length}/{scanResults.length} Pass
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selectedDenom.checks.map((check, i) =>
                  scanResults ? (
                    <SecurityCheckRow key={i} label={check} passed={scanResults[i]} delay={i * 0.07} />
                  ) : (
                    <div key={i} style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 24, textAlign: 'center', fontSize: 18 }}>⬜</span>
                      {check}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* UV Simulation */}
            <div className="card" style={{ borderColor: 'rgba(155,89,245,0.3)' }}>
              <div className="card-title" style={{ marginBottom: 12 }}>🔆 UV Feature Simulation</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {['Security Fibers', 'Serial UV', 'Denomination'].map((feat, i) => (
                  <div key={feat} style={{ textAlign: 'center', padding: 12, borderRadius: 'var(--radius-md)', background: outcome ? 'rgba(155,89,245,0.08)' : 'var(--bg-surface)', border: '1px solid rgba(155,89,245,0.2)' }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>🔆</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{feat}</div>
                    {outcome && <div style={{ fontSize: 11, fontWeight: 700, color: (outcome === 'genuine' || (outcome === 'suspect' && i % 2 === 0)) ? '#9b59f5' : '#e74c3c', marginTop: 4 }}>
                      {(outcome === 'genuine' || (outcome === 'suspect' && i % 2 === 0)) ? 'VISIBLE' : 'ABSENT'}
                    </div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'batch' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">📦 Batch Analysis — Bank / POS Integration</div>
            <span className="badge badge-blue">API Ready</span>
          </div>
          <div className="alert alert-info">📡 Connect counting machine via USB or API endpoint <code>POST /api/currency/batch</code> to stream notes for real-time verification.</div>
          <div className="table-wrapper" style={{ marginTop: 'var(--space-md)' }}>
            <table>
              <thead><tr><th>Note ID</th><th>Denomination</th><th>Serial No.</th><th>Branch</th><th>Result</th><th>Confidence</th></tr></thead>
              <tbody>
                {[
                  { id: 'N-00121', denom: '₹500', serial: '7DF432891', branch: 'SBI Pune', result: 'GENUINE', conf: 99 },
                  { id: 'N-00122', denom: '₹500', serial: '7DF432892', branch: 'SBI Pune', result: 'COUNTERFEIT', conf: 96 },
                  { id: 'N-00123', denom: '₹2000', serial: '2AB987134', branch: 'HDFC Mumbai', result: 'GENUINE', conf: 98 },
                  { id: 'N-00124', denom: '₹200', serial: '9CD113445', branch: 'BOI Delhi', result: 'SUSPECT', conf: 61 },
                  { id: 'N-00125', denom: '₹100', serial: '3XY567890', branch: 'PNB Chennai', result: 'GENUINE', conf: 97 },
                ].map((r, i) => (
                  <tr key={i}>
                    <td className="mono">{r.id}</td>
                    <td><span style={{ fontWeight: 700, color: DENOMINATIONS.find(d => d.value === r.denom)?.color }}>{r.denom}</span></td>
                    <td className="mono">{r.serial}</td>
                    <td>{r.branch}</td>
                    <td><span className={`badge ${r.result === 'GENUINE' ? 'badge-green' : r.result === 'COUNTERFEIT' ? 'badge-red' : 'badge-amber'}`}>{r.result}</span></td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: r.conf > 90 ? '#2ecc71' : r.conf > 70 ? '#f39c12' : '#e74c3c' }}>{r.conf}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'seized' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="stats-grid">
            {[
              { label: 'Total Seized Today', val: '412 Notes', color: '#e74c3c' },
              { label: 'Face Value', val: '₹1.84 Lakh', color: '#f39c12' },
              { label: 'Districts Reported', val: '23', color: '#388bfd' },
              { label: 'FIRs Filed', val: '18', color: '#2ecc71' },
            ].map((s) => (
              <div key={s.label} className="stat-card" style={{ '--accent': s.color }}>
                <div className="stat-value" style={{ color: s.color, fontSize: 24 }}>{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>📋 Seizure Log</div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Date</th><th>Location</th><th>Denomination</th><th>Count</th><th>Seized By</th><th>FIR</th></tr></thead>
                <tbody>
                  {[
                    { date: '23 Jun', loc: 'Dadar Market, Mumbai', denom: '₹500', count: 87, by: 'Mumbai Police', fir: 'Filed' },
                    { date: '23 Jun', loc: 'Connaught Place, Delhi', denom: '₹2000', count: 34, by: 'Delhi Police', fir: 'Filed' },
                    { date: '23 Jun', loc: 'FC Road, Pune', denom: '₹500', count: 56, by: 'SBI Branch', fir: 'Pending' },
                    { date: '22 Jun', loc: 'MG Road, Bangalore', denom: '₹200', count: 120, by: 'ED Officer', fir: 'Filed' },
                    { date: '22 Jun', loc: 'Jubilee Hills, Hyderabad', denom: '₹500', count: 45, by: 'HDFC Bank', fir: 'Filed' },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td>{r.date}</td>
                      <td>{r.loc}</td>
                      <td style={{ fontWeight: 700 }}>{r.denom}</td>
                      <td className="mono">{r.count}</td>
                      <td>{r.by}</td>
                      <td><span className={`badge ${r.fir === 'Filed' ? 'badge-green' : 'badge-amber'}`}>{r.fir}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
