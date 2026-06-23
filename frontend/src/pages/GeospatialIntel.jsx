import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Circle, Popup, Marker } from 'react-leaflet'
import L from 'leaflet'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png', iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png' })

const HOTSPOTS = [
  { id: 1, city: 'Mumbai',    lat: 19.076, lng: 72.877, intensity: 342, type: 'fraud',       color: '#e74c3c', risk: 'CRITICAL' },
  { id: 2, city: 'Delhi',     lat: 28.704, lng: 77.102, intensity: 289, type: 'scam',        color: '#e74c3c', risk: 'CRITICAL' },
  { id: 3, city: 'Bangalore', lat: 12.972, lng: 77.594, intensity: 218, type: 'cyber',       color: '#f39c12', risk: 'HIGH' },
  { id: 4, city: 'Hyderabad', lat: 17.387, lng: 78.491, intensity: 175, type: 'counterfeit', color: '#f39c12', risk: 'HIGH' },
  { id: 5, city: 'Pune',      lat: 18.520, lng: 73.856, intensity: 143, type: 'fraud',       color: '#388bfd', risk: 'MEDIUM' },
  { id: 6, city: 'Chennai',   lat: 13.083, lng: 80.270, intensity: 121, type: 'scam',        color: '#388bfd', risk: 'MEDIUM' },
  { id: 7, city: 'Kolkata',   lat: 22.572, lng: 88.363, intensity: 98,  type: 'cyber',       color: '#2ecc71', risk: 'LOW' },
  { id: 8, city: 'Ahmedabad', lat: 23.023, lng: 72.571, intensity: 87,  type: 'counterfeit', color: '#2ecc71', risk: 'LOW' },
  { id: 9, city: 'Jaipur',    lat: 26.912, lng: 75.787, intensity: 76,  type: 'fraud',       color: '#2ecc71', risk: 'LOW' },
  { id: 10, city: 'Lucknow',  lat: 26.847, lng: 80.947, intensity: 65,  type: 'scam',        color: '#2ecc71', risk: 'LOW' },
]

const PATROLS = [
  { city: 'Mumbai',    units: 12, deployed: 9,  coverage: 75 },
  { city: 'Delhi',     units: 15, deployed: 13, coverage: 87 },
  { city: 'Bangalore', units: 8,  deployed: 6,  coverage: 75 },
  { city: 'Hyderabad', units: 6,  deployed: 5,  coverage: 83 },
  { city: 'Pune',      units: 5,  deployed: 3,  coverage: 60 },
]

const riskColor = { CRITICAL: '#e74c3c', HIGH: '#f39c12', MEDIUM: '#388bfd', LOW: '#2ecc71' }

export default function GeospatialIntel() {
  const [selectedHotspot, setSelectedHotspot] = useState(null)
  const [filter, setFilter] = useState('all')
  const [tab, setTab] = useState('map')

  const filteredHotspots = filter === 'all' ? HOTSPOTS : HOTSPOTS.filter(h => h.type === filter)

  return (
    <div className="animate-fadeIn">
      <div className="module-tag" style={{ background: 'rgba(46,204,113,0.1)', color: '#2ecc71', border: '1px solid rgba(46,204,113,0.3)' }}>
        🗺️ MODULE 04 — GEOSPATIAL INTEL
      </div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Geospatial Crime Pattern Intelligence</h1>
          <p className="page-subtitle">GeoAI layer mapping fraud complaints, counterfeit seizures, and cybercrime hotspots for patrol prioritisation, resource deployment, and inter-district intelligence sharing.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-green">● Live Map</span>
          <button className="btn btn-secondary btn-sm" onClick={() => toast.success('Intelligence report shared with all districts!')}>📡 Share Intel</button>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Hotspot Zones', val: '234', color: '#e74c3c' },
          { label: 'Critical Districts', val: '12', color: '#f39c12' },
          { label: 'Patrol Units Active', val: '47', color: '#2ecc71' },
          { label: 'Alerts Today', val: '89', color: '#388bfd' },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ '--accent': s.color }}>
            <div className="stat-value" style={{ color: s.color, fontSize: 28 }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        {['map', 'patrol', 'trends'].map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ map: '🗺️ Live Map', patrol: '🚔 Patrol Deploy', trends: '📈 Trends' }[t]}
          </button>
        ))}
      </div>

      {tab === 'map' && (
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          {/* Map */}
          <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
            {/* Filter Bar */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Filter:</span>
              {['all', 'fraud', 'scam', 'cyber', 'counterfeit'].map((f) => (
                <button
                  key={f}
                  className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 12px', fontSize: 11 }}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
              <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-secondary)' }}>{filteredHotspots.length} zones shown</span>
            </div>

            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: 480, background: '#0b1526' }}
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; CartoDB'
              />
              {filteredHotspots.map((h) => (
                <Circle
                  key={h.id}
                  center={[h.lat, h.lng]}
                  radius={h.intensity * 400}
                  pathOptions={{ color: h.color, fillColor: h.color, fillOpacity: 0.25, weight: 2 }}
                  eventHandlers={{ click: () => setSelectedHotspot(h) }}
                >
                  <Popup>
                    <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 160 }}>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>{h.city}</div>
                      <div style={{ fontSize: 12, marginBottom: 4 }}>Type: <strong>{h.type}</strong></div>
                      <div style={{ fontSize: 12, marginBottom: 4 }}>Complaints: <strong>{h.intensity}</strong></div>
                      <div style={{ fontSize: 12 }}>Risk: <span style={{ color: riskColor[h.risk], fontWeight: 700 }}>{h.risk}</span></div>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </MapContainer>

            {/* Legend */}
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {Object.entries(riskColor).map(([risk, color]) => (
                <div key={risk} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, opacity: 0.8 }} />
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{risk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hotspot List */}
          <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div className="card" style={{ padding: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>🔥 Top Hotspots</div>
              {filteredHotspots.slice(0, 8).map((h) => (
                <div
                  key={h.id}
                  onClick={() => setSelectedHotspot(h)}
                  style={{
                    padding: '8px 10px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    border: `1px solid ${selectedHotspot?.id === h.id ? h.color + '80' : 'transparent'}`,
                    background: selectedHotspot?.id === h.id ? `${h.color}10` : 'transparent',
                    transition: 'all 0.2s', marginBottom: 4,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{h.city}</span>
                    <span className={`badge ${h.risk === 'CRITICAL' ? 'badge-red' : h.risk === 'HIGH' ? 'badge-amber' : h.risk === 'MEDIUM' ? 'badge-blue' : 'badge-green'}`} style={{ fontSize: 9 }}>{h.risk}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.type}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: h.color }}>{h.intensity} alerts</span>
                  </div>
                  <div className="progress" style={{ height: 3, marginTop: 6 }}>
                    <div className="progress-bar" style={{ width: `${(h.intensity / 342) * 100}%`, background: h.color }} />
                  </div>
                </div>
              ))}
            </div>

            {selectedHotspot && (
              <div className="card" style={{ borderColor: selectedHotspot.color + '66' }}>
                <div style={{ fontWeight: 700, marginBottom: 10, color: selectedHotspot.color }}>📍 {selectedHotspot.city}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <div>Risk Level: <span style={{ color: selectedHotspot.color, fontWeight: 700 }}>{selectedHotspot.risk}</span></div>
                  <div>Crime Type: <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{selectedHotspot.type}</span></div>
                  <div>Complaints: <span style={{ color: selectedHotspot.color, fontWeight: 700 }}>{selectedHotspot.intensity}</span></div>
                  <div>Coordinates: <span className="mono" style={{ fontSize: 11 }}>{selectedHotspot.lat.toFixed(3)}, {selectedHotspot.lng.toFixed(3)}</span></div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                  <button className="btn btn-sm btn-danger" style={{ flex: 1 }} onClick={() => toast.success('Patrol dispatched!')}>🚔 Deploy Patrol</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => toast.success('Alert shared!')}>📡 Alert</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'patrol' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="alert alert-info">🚔 Patrol units are deployed based on real-time threat intensity scores from the GeoAI layer.</div>
          {PATROLS.map((p) => (
            <div key={p.city} className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>📍 {p.city}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-green">{p.deployed}/{p.units} Deployed</span>
                  <button className="btn btn-sm btn-primary" onClick={() => toast.success(`Additional unit deployed to ${p.city}`)}>+ Deploy Unit</button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span>Area Coverage</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: p.coverage > 80 ? '#2ecc71' : p.coverage > 60 ? '#f39c12' : '#e74c3c', fontWeight: 700 }}>{p.coverage}%</span>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div className="progress-bar" style={{ width: `${p.coverage}%`, background: p.coverage > 80 ? 'linear-gradient(90deg,#2ecc71,#27ae60)' : p.coverage > 60 ? 'linear-gradient(90deg,#f39c12,#e67e22)' : 'linear-gradient(90deg,#e74c3c,#c0392b)' }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: p.coverage > 80 ? '#2ecc71' : p.coverage > 60 ? '#f39c12' : '#e74c3c' }}>{p.units - p.deployed}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>units idle</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'trends' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>📈 Complaints by Type (Last 7 Days)</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={[
                { day: 'Mon', fraud: 89, scam: 67, cyber: 45, counterfeit: 23 },
                { day: 'Tue', fraud: 102, scam: 78, cyber: 52, counterfeit: 31 },
                { day: 'Wed', fraud: 95, scam: 82, cyber: 61, counterfeit: 28 },
                { day: 'Thu', fraud: 121, scam: 91, cyber: 58, counterfeit: 35 },
                { day: 'Fri', fraud: 143, scam: 109, cyber: 72, counterfeit: 42 },
                { day: 'Sat', fraud: 167, scam: 125, cyber: 88, counterfeit: 51 },
                { day: 'Sun', fraud: 139, scam: 98, cyber: 65, counterfeit: 38 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,139,253,0.08)" />
                <XAxis dataKey="day" tick={{ fill: '#8899b4', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8899b4', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f1e35', border: '1px solid rgba(56,139,253,0.3)', borderRadius: 8, color: '#e8edf5', fontSize: 12 }} />
                <Bar dataKey="fraud"      name="Fraud"      fill="#e74c3c" radius={[4,4,0,0]} />
                <Bar dataKey="scam"       name="Scam"       fill="#f39c12" radius={[4,4,0,0]} />
                <Bar dataKey="cyber"      name="Cyber"      fill="#9b59f5" radius={[4,4,0,0]} />
                <Bar dataKey="counterfeit" name="Counterfeit" fill="#388bfd" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>🏆 District Performance</div>
            <div className="table-wrapper">
              <table>
                <thead><tr><th>District</th><th>Complaints</th><th>Resolved</th><th>Rate</th></tr></thead>
                <tbody>
                  {[
                    { dist: 'South Mumbai', comp: 342, res: 298, rate: 87 },
                    { dist: 'Delhi South', comp: 289, res: 241, rate: 83 },
                    { dist: 'Bangalore East', comp: 218, res: 167, rate: 77 },
                    { dist: 'Hyderabad West', comp: 175, res: 145, rate: 83 },
                    { dist: 'Pune City', comp: 143, res: 98, rate: 69 },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td>{r.dist}</td>
                      <td className="mono">{r.comp}</td>
                      <td className="mono" style={{ color: '#2ecc71' }}>{r.res}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress" style={{ flex: 1, height: 6 }}>
                            <div className="progress-bar" style={{ width: `${r.rate}%`, background: r.rate > 85 ? 'linear-gradient(90deg,#2ecc71,#27ae60)' : r.rate > 70 ? 'linear-gradient(90deg,#f39c12,#e67e22)' : 'linear-gradient(90deg,#e74c3c,#c0392b)' }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: r.rate > 85 ? '#2ecc71' : r.rate > 70 ? '#f39c12' : '#e74c3c' }}>{r.rate}%</span>
                        </div>
                      </td>
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
