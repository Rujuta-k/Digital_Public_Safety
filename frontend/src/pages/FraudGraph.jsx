import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import * as d3 from 'd3'

const NODES = [
  { id: 'scammer1', label: 'S-001\nScammer', type: 'scammer', x: 400, y: 200 },
  { id: 'scammer2', label: 'S-002\nScammer', type: 'scammer', x: 600, y: 150 },
  { id: 'mule1',    label: 'M-001\nMule', type: 'mule', x: 300, y: 350 },
  { id: 'mule2',    label: 'M-002\nMule', type: 'mule', x: 500, y: 380 },
  { id: 'mule3',    label: 'M-003\nMule', type: 'mule', x: 700, y: 300 },
  { id: 'acc1',     label: 'ACC-1', type: 'account', x: 200, y: 250 },
  { id: 'acc2',     label: 'ACC-2', type: 'account', x: 350, y: 480 },
  { id: 'acc3',     label: 'ACC-3', type: 'account', x: 600, y: 480 },
  { id: 'acc4',     label: 'ACC-4', type: 'account', x: 750, y: 180 },
  { id: 'acc5',     label: 'ACC-5', type: 'account', x: 150, y: 400 },
  { id: 'victim1',  label: 'V-001\nVictim', type: 'victim', x: 100, y: 150 },
  { id: 'victim2',  label: 'V-002\nVictim', type: 'victim', x: 250, y: 100 },
  { id: 'victim3',  label: 'V-003\nVictim', type: 'victim', x: 700, y: 450 },
  { id: 'shell1',   label: 'Shell Co\nDelhi', type: 'shell', x: 500, y: 250 },
  { id: 'crypto1',  label: 'Crypto\nWallet', type: 'crypto', x: 650, y: 380 },
]

const LINKS = [
  { source: 'victim1', target: 'scammer1', value: 2 },
  { source: 'victim2', target: 'scammer1', value: 3 },
  { source: 'victim3', target: 'scammer2', value: 1 },
  { source: 'scammer1', target: 'mule1', value: 4 },
  { source: 'scammer1', target: 'mule2', value: 3 },
  { source: 'scammer2', target: 'mule3', value: 2 },
  { source: 'mule1', target: 'acc1', value: 2 },
  { source: 'mule1', target: 'acc2', value: 2 },
  { source: 'mule2', target: 'acc3', value: 3 },
  { source: 'mule3', target: 'acc4', value: 1 },
  { source: 'mule3', target: 'crypto1', value: 2 },
  { source: 'acc1', target: 'shell1', value: 2 },
  { source: 'acc3', target: 'shell1', value: 2 },
  { source: 'shell1', target: 'crypto1', value: 3 },
  { source: 'acc5', target: 'mule1', value: 1 },
]

const typeConfig = {
  scammer: { color: '#e74c3c', icon: '💀', radius: 22 },
  mule:    { color: '#f39c12', icon: '🤝', radius: 18 },
  account: { color: '#388bfd', icon: '🏦', radius: 14 },
  victim:  { color: '#8899b4', icon: '👤', radius: 16 },
  shell:   { color: '#9b59f5', icon: '🏢', radius: 20 },
  crypto:  { color: '#39d0d8', icon: '₿',  radius: 18 },
}

const CASES = [
  { id: 'FC-2024-001', name: 'Operation Cyber Shakti', scammers: 4, mules: 12, victims: 89, amount: '₹2.3 Cr', status: 'Court Admissible', jurisdiction: 'Multi-state' },
  { id: 'FC-2024-002', name: 'UPI Ring — Hyderabad',   scammers: 2, mules: 7,  victims: 34, amount: '₹67 Lakh', status: 'Investigation', jurisdiction: 'Telangana' },
  { id: 'FC-2024-003', name: 'Fake Job Scam Network',  scammers: 6, mules: 23, victims: 215, amount: '₹4.8 Cr', status: 'Chargesheeted', jurisdiction: 'Pan India' },
]

export default function FraudGraph() {
  const svgRef = useRef()
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('graph')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (tab !== 'graph') return
    const W = 900, H = 520
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', '100%').attr('height', H).attr('viewBox', `0 0 ${W} ${H}`)

    // Background
    svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#0b1526').attr('rx', 12)

    // Grid dots
    for (let x = 0; x < W; x += 40)
      for (let y = 0; y < H; y += 40)
        svg.append('circle').attr('cx', x).attr('cy', y).attr('r', 1).attr('fill', 'rgba(56,139,253,0.1)')

    // Links
    LINKS.forEach(link => {
      const src = NODES.find(n => n.id === link.source)
      const tgt = NODES.find(n => n.id === link.target)
      svg.append('line')
        .attr('x1', src.x).attr('y1', src.y).attr('x2', tgt.x).attr('y2', tgt.y)
        .attr('stroke', 'rgba(56,139,253,0.25)').attr('stroke-width', link.value)
        .attr('stroke-dasharray', '4,4')
    })

    // Nodes
    NODES.forEach(node => {
      const cfg = typeConfig[node.type]
      const g = svg.append('g')
        .attr('transform', `translate(${node.x},${node.y})`)
        .style('cursor', 'pointer')
        .on('click', () => setSelected(node))

      // Glow
      g.append('circle').attr('r', cfg.radius + 8).attr('fill', cfg.color).attr('opacity', 0.12)

      // Main circle
      g.append('circle').attr('r', cfg.radius).attr('fill', cfg.color).attr('opacity', 0.9)
        .attr('stroke', '#fff').attr('stroke-width', 1.5)

      // Icon text
      g.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('font-size', cfg.radius * 0.8).text(cfg.icon)

      // Label
      const parts = node.label.split('\n')
      parts.forEach((part, i) =>
        g.append('text').attr('text-anchor', 'middle').attr('y', cfg.radius + 14 + i * 13)
          .attr('font-family', 'Inter').attr('font-size', 10).attr('fill', '#8899b4').text(part)
      )
    })
  }, [tab])

  const generateEvidencePackage = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      toast.success('📦 Court-admissible evidence package generated and encrypted!', { duration: 5000 })
    }, 2500)
  }

  return (
    <div className="animate-fadeIn">
      <div className="module-tag" style={{ background: 'rgba(155,89,245,0.1)', color: '#9b59f5', border: '1px solid rgba(155,89,245,0.3)' }}>
        🕸️ MODULE 03 — FRAUD GRAPH AI
      </div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fraud Network Graph Intelligence</h1>
          <p className="page-subtitle">Graph AI agent mapping transaction metadata, call records, device fingerprints, and account linkages — clustering fraud campaigns into court-admissible evidence packages.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-purple">89 Networks Mapped</span>
          <button className="btn btn-sm" style={{ background: 'linear-gradient(135deg,#9b59f5,#7d3cf8)', color: '#fff', boxShadow: '0 4px 15px rgba(155,89,245,0.35)' }} onClick={generateEvidencePackage} disabled={generating}>
            {generating ? '⏳ Generating...' : '📦 Generate Evidence Package'}
          </button>
        </div>
      </div>

      <div className="tabs">
        {['graph', 'cases', 'intelligence'].map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ graph: '🕸️ Network Graph', cases: '📋 Active Cases', intelligence: '🧠 Intelligence' }[t]}
          </button>
        ))}
      </div>

      {tab === 'graph' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {/* Legend */}
          <div className="card" style={{ padding: '12px 20px' }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>LEGEND:</span>
              {Object.entries(typeConfig).map(([type, cfg]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: cfg.color }} />
                  <span style={{ fontSize: 12, textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{type}</span>
                </div>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <span className="badge badge-purple">15 Nodes</span>
                <span className="badge badge-blue">15 Connections</span>
              </div>
            </div>
          </div>

          {/* Graph + Detail */}
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <div className="card" style={{ flex: 1 }}>
              <svg ref={svgRef} style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
            </div>

            {selected && (
              <div className="card" style={{ width: 240, flexShrink: 0, borderColor: `${typeConfig[selected.type].color}66` }}>
                <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>🔍 Node Detail</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ textAlign: 'center', padding: 12 }}>
                    <div style={{ fontSize: 40 }}>{typeConfig[selected.type].icon}</div>
                    <div style={{ fontWeight: 700, marginTop: 6 }}>{selected.label.replace('\n', ' ')}</div>
                    <span className="badge" style={{ background: `${typeConfig[selected.type].color}20`, color: typeConfig[selected.type].color, border: `1px solid ${typeConfig[selected.type].color}40`, marginTop: 8 }}>
                      {selected.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="divider" />
                  {selected.type === 'scammer' && <>
                    <div style={{ fontSize: 13 }}><span style={{ color: 'var(--text-secondary)' }}>Linked Victims:</span> <span style={{ color: '#e74c3c', fontWeight: 700 }}>3</span></div>
                    <div style={{ fontSize: 13 }}><span style={{ color: 'var(--text-secondary)' }}>Total Siphoned:</span> <span style={{ color: '#e74c3c', fontWeight: 700 }}>₹1.2 Cr</span></div>
                  </>}
                  {selected.type === 'mule' && <>
                    <div style={{ fontSize: 13 }}><span style={{ color: 'var(--text-secondary)' }}>Accounts Used:</span> <span style={{ color: '#f39c12', fontWeight: 700 }}>4</span></div>
                    <div style={{ fontSize: 13 }}><span style={{ color: 'var(--text-secondary)' }}>Txn Volume:</span> <span style={{ color: '#f39c12', fontWeight: 700 }}>₹34 Lakh</span></div>
                  </>}
                  <button className="btn btn-secondary btn-sm" onClick={() => toast.success('Node flagged for investigation')}>🚩 Flag Node</button>
                  <button className="btn btn-sm" style={{ background: 'linear-gradient(135deg,#9b59f5,#7d3cf8)', color: '#fff' }} onClick={() => toast.success('Added to evidence package')}>📦 Add to Evidence</button>
                </div>
              </div>
            )}
          </div>

          <div className="stats-grid">
            {[
              { label: 'Active Fraud Rings', val: '23', color: '#e74c3c' },
              { label: 'Mule Accounts', val: '187', color: '#f39c12' },
              { label: 'Total Victims Linked', val: '1,429', color: '#388bfd' },
              { label: 'Amount at Risk', val: '₹12.4 Cr', color: '#9b59f5' },
            ].map((s) => (
              <div key={s.label} className="stat-card" style={{ '--accent': s.color }}>
                <div className="stat-value" style={{ color: s.color, fontSize: 24 }}>{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'cases' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {CASES.map((c) => (
            <div key={c.id} className="card" style={{ borderLeft: '3px solid #9b59f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{c.id}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className={`badge ${c.status === 'Court Admissible' ? 'badge-green' : c.status === 'Chargesheeted' ? 'badge-purple' : 'badge-amber'}`}>{c.status}</span>
                  <span className="badge badge-blue">{c.jurisdiction}</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { label: 'Scammers', val: c.scammers, color: '#e74c3c' },
                  { label: 'Money Mules', val: c.mules, color: '#f39c12' },
                  { label: 'Victims', val: c.victims, color: '#388bfd' },
                  { label: 'Amount', val: c.amount, color: '#9b59f5' },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: 'center', padding: 10, background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: stat.color }}>{stat.val}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn btn-secondary btn-sm">🔍 View Graph</button>
                <button className="btn btn-secondary btn-sm">📦 Evidence Package</button>
                <button className="btn btn-sm" style={{ background: 'linear-gradient(135deg,#9b59f5,#7d3cf8)', color: '#fff' }} onClick={() => toast.success('Submitted to court portal')}>⚖️ Submit to Court</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'intelligence' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>📡 Data Sources Analysed</div>
            {[
              { src: 'Transaction Metadata', records: '2.4M', status: 'Live' },
              { src: 'Call Records (CDR)', records: '1.8M', status: 'Live' },
              { src: 'Device Fingerprints', records: '890K', status: 'Live' },
              { src: 'Account Linkages', records: '456K', status: 'Live' },
              { src: 'NCRB Complaint DB', records: '125K', status: 'Batch' },
            ].map((s) => (
              <div key={s.src} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 14 }}>{s.src}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: 13, color: 'var(--blue)' }}>{s.records}</span>
                  <span className={`badge ${s.status === 'Live' ? 'badge-green' : 'badge-amber'}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>🔗 Cross-Jurisdiction Links</div>
            {[
              { state1: 'Maharashtra', state2: 'Jharkhand', links: 23, amount: '₹1.2 Cr' },
              { state1: 'Delhi', state2: 'Rajasthan', links: 17, amount: '₹89 Lakh' },
              { state1: 'Gujarat', state2: 'UP', links: 12, amount: '₹56 Lakh' },
              { state1: 'Karnataka', state2: 'Tamil Nadu', links: 8, amount: '₹34 Lakh' },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span className="badge badge-blue">{l.state1}</span>
                <span style={{ color: 'var(--text-muted)' }}>⇄</span>
                <span className="badge badge-purple">{l.state2}</span>
                <div style={{ marginLeft: 'auto', textAlign: 'right', fontSize: 13 }}>
                  <div style={{ fontWeight: 700, color: '#9b59f5' }}>{l.links} links</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{l.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
