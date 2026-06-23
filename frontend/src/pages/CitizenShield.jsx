import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'

const LANGUAGES = [
  { code: 'en', name: 'English',    greeting: 'Hello! I am SHIELD AI Citizen Assistant. How can I help you today?' },
  { code: 'hi', name: 'हिन्दी',      greeting: 'नमस्ते! मैं SHIELD AI नागरिक सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?' },
  { code: 'mr', name: 'मराठी',       greeting: 'नमस्कार! मी SHIELD AI नागरिक सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?' },
  { code: 'ta', name: 'தமிழ்',      greeting: 'வணக்கம்! நான் SHIELD AI குடிமக்கள் உதவியாளர். இன்று உங்களுக்கு எவ்வாறு உதவலாம்?' },
  { code: 'te', name: 'తెలుగు',     greeting: 'నమస్కారం! నేను SHIELD AI పౌర సహాయకుడిని. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?' },
  { code: 'kn', name: 'ಕನ್ನಡ',      greeting: 'ನಮಸ್ಕಾರ! ನಾನು SHIELD AI ನಾಗರಿಕ ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' },
  { code: 'gu', name: 'ગુજરાતી',    greeting: 'નમસ્તે! હું SHIELD AI નાગરિક સહાયક છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?' },
  { code: 'bn', name: 'বাংলা',      greeting: 'নমস্কার! আমি SHIELD AI নাগরিক সহকারী। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ',     greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ SHIELD AI ਨਾਗਰਿਕ ਸਹਾਇਕ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?' },
  { code: 'or', name: 'ଓଡ଼ିଆ',      greeting: 'ନମସ୍କାର! ମୁଁ SHIELD AI ନାଗରିକ ସହାୟକ। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?' },
  { code: 'ml', name: 'മലയാളം',    greeting: 'നമസ്കാരം! ഞാൻ SHIELD AI പൗര സഹായി ആണ്. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കണം?' },
  { code: 'ur', name: 'اردو',       greeting: 'السلام علیکم! میں SHIELD AI شہری معاون ہوں۔ آج میں آپ کی کیسے مدد کر سکتا ہوں؟' },
]

const QUICK_SCENARIOS = [
  { id: 1, label: 'Suspicious Call', icon: '📞', scenario: 'Someone called claiming to be from CBI and saying my Aadhaar is linked to crime. They want me to stay on video call and transfer money.' },
  { id: 2, label: 'UPI Scam',        icon: '💳', scenario: 'Received a UPI payment request saying I won a prize. They asked for my UPI PIN to "receive" the prize money.' },
  { id: 3, label: 'Fake Message',    icon: '📱', scenario: 'Got a WhatsApp message saying my SIM will be blocked. They sent a link to update KYC and asked for Aadhaar and bank details.' },
  { id: 4, label: 'Job Fraud',       icon: '💼', scenario: 'Applied for job online. They asked for registration fee of ₹2,000 through UPI to process my application.' },
]

const RESPONSES = {
  'suspicious call': {
    risk: 97,
    verdict: 'SCAM',
    analysis: [
      'CBI never conducts arrests via video/phone call.',
      'Government agencies never demand money transfers for bail.',
      'This is a classic "Digital Arrest Scam" pattern.',
      'Caller is likely spoofing an official number.',
    ],
    action: [
      'Immediately disconnect the call.',
      'Do NOT transfer any money.',
      'Report on NCRB Cybercrime Portal: cybercrime.gov.in',
      'Call Cyber Helpline: 1930',
    ],
  },
  'upi': {
    risk: 89,
    verdict: 'SCAM',
    analysis: [
      'Legitimate prizes never require your UPI PIN.',
      'UPI PIN is only used to send money, not receive it.',
      'This is a "collect request" scam pattern.',
      'Entering PIN would send money FROM your account.',
    ],
    action: [
      'Do NOT enter your UPI PIN.',
      'Decline the payment request immediately.',
      'Report to your bank and on cybercrime.gov.in',
      'Call 1930 for immediate help.',
    ],
  },
  'whatsapp': {
    risk: 85,
    verdict: 'SCAM',
    analysis: [
      'Telecom providers never ask for KYC via WhatsApp.',
      'The link appears to be a phishing website.',
      'Sharing Aadhaar + bank details enables identity theft.',
      'SIM blocking threats are common social engineering tactics.',
    ],
    action: [
      'Do NOT click the link.',
      'Do NOT share Aadhaar or bank details.',
      'Contact your telecom provider directly.',
      'Report the number on cybercrime.gov.in',
    ],
  },
  'job': {
    risk: 72,
    verdict: 'LIKELY SCAM',
    analysis: [
      'Legitimate employers never charge registration fees.',
      'Requests for UPI payment as "advance" are scam indicators.',
      'Job portals do not process fees via personal UPI.',
      'Verify company registration on MCA portal.',
    ],
    action: [
      'Do NOT pay any registration fee.',
      'Verify the company on mca.gov.in',
      'Report fake job offers on cybercrime.gov.in',
      'Contact the job portal directly to flag the listing.',
    ],
  },
}

function getResponse(text) {
  const low = text.toLowerCase()
  if (low.includes('cbi') || low.includes('arrest') || low.includes('video call') || low.includes('call')) return RESPONSES['suspicious call']
  if (low.includes('upi') || low.includes('pin') || low.includes('prize')) return RESPONSES['upi']
  if (low.includes('whatsapp') || low.includes('sim') || low.includes('kyc')) return RESPONSES['whatsapp']
  if (low.includes('job') || low.includes('registration') || low.includes('fee')) return RESPONSES['job']
  return { risk: 45, verdict: 'MODERATE RISK', analysis: ['Scenario analysed by AI.', 'Some suspicious elements detected.', 'Proceed with caution.'], action: ['Verify the identity of the caller.', 'Never share OTPs, PINs, or passwords.', 'Report any suspicions on cybercrime.gov.in'] }
}

export default function CitizenShield() {
  const [lang, setLang] = useState(LANGUAGES[0])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [assessment, setAssessment] = useState(null)
  const [tab, setTab] = useState('chat')
  const bottomRef = useRef()

  useEffect(() => {
    setMessages([{ role: 'bot', text: lang.greeting, time: new Date() }])
    setAssessment(null)
  }, [lang])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = { role: 'user', text, time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const resp = getResponse(text)
      setAssessment(resp)
      const reply = lang.code === 'en'
        ? `I've analysed your situation. Risk Score: **${resp.risk}/100** — **${resp.verdict}**\n\n${resp.analysis[0]} ${resp.analysis[1]}\n\nI've prepared a full risk assessment and recommended actions for you.`
        : `आपकी स्थिति का विश्लेषण किया गया। जोखिम स्कोर: **${resp.risk}/100** — **${resp.verdict}**\n\n${resp.analysis[0]}`
      setMessages(prev => [...prev, { role: 'bot', text: reply, time: new Date() }])
      setTyping(false)
    }, 1800)
  }

  const riskColor = assessment?.risk > 80 ? '#e74c3c' : assessment?.risk > 60 ? '#f39c12' : '#2ecc71'

  return (
    <div className="animate-fadeIn">
      <div className="module-tag" style={{ background: 'rgba(57,208,216,0.1)', color: '#39d0d8', border: '1px solid rgba(57,208,216,0.3)' }}>
        💬 MODULE 05 — CITIZEN FRAUD SHIELD
      </div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Citizen Fraud Shield</h1>
          <p className="page-subtitle">Conversational AI accessible via WhatsApp, IVR, and mobile app — real-time fraud risk assessment in 12 regional languages with guided NCRB reporting.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-cyan">12 Languages</span>
          <span className="badge badge-green">● Online</span>
        </div>
      </div>

      <div className="tabs">
        {['chat', 'channels', 'stats'].map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ chat: '💬 AI Chat', channels: '📡 Channels', stats: '📊 Statistics' }[t]}
          </button>
        ))}
      </div>

      {tab === 'chat' && (
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          {/* Chat Panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {/* Language Selector */}
            <div className="card" style={{ padding: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>SELECT LANGUAGE</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l)}
                    className={`btn btn-sm ${lang.code === l.code ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '4px 10px', fontSize: 12 }}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="card" style={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column' }}>
              {/* Chat Header */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#39d0d8,#388bfd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🛡️</div>
                <div>
                  <div style={{ fontWeight: 700 }}>SHIELD AI Assistant</div>
                  <div style={{ fontSize: 11, color: '#2ecc71' }}>● Online · {lang.name}</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  <span className="badge badge-cyan">AI</span>
                  <span className="badge badge-green">Secure</span>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 320, maxHeight: 420 }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
                    {msg.role === 'bot' && (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#39d0d8,#388bfd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🛡️</div>
                    )}
                    <div style={{
                      maxWidth: '75%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: msg.role === 'user' ? 'linear-gradient(135deg,#388bfd,#1f5fd4)' : 'var(--bg-card)',
                      border: msg.role === 'bot' ? '1px solid var(--border)' : 'none',
                      fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-line',
                    }}>
                      {msg.text}
                      <div style={{ fontSize: 10, color: msg.role === 'user' ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>
                        {msg.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#39d0d8,#388bfd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🛡️</div>
                    <div style={{ padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px 14px 14px 4px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[0, 1, 2].map((d) => (
                          <div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: '#39d0d8', animation: `blink 1.2s ease ${d * 0.2}s infinite` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick Scenarios */}
              <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>QUICK SCENARIOS:</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {QUICK_SCENARIOS.map((s) => (
                    <button key={s.id} className="btn btn-secondary btn-sm" style={{ fontSize: 11 }} onClick={() => sendMessage(s.scenario)}>
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div style={{ padding: 'var(--space-md)', display: 'flex', gap: 8 }}>
                <input
                  className="form-control"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
                  placeholder="Describe the suspicious activity..."
                  disabled={typing}
                />
                <button className="btn btn-primary" onClick={() => sendMessage(input)} disabled={typing || !input.trim()}>Send</button>
              </div>
            </div>
          </div>

          {/* Assessment Panel */}
          <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {assessment ? (
              <>
                {/* Risk Score */}
                <div className="card" style={{ textAlign: 'center', borderColor: riskColor + '66' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>FRAUD RISK SCORE</div>
                  <div style={{ fontSize: 52, fontWeight: 900, color: riskColor, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{assessment.risk}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>/ 100</div>
                  <div className={`verdict ${assessment.risk > 80 ? 'verdict-danger' : assessment.risk > 60 ? 'verdict-warning' : 'verdict-safe'}`} style={{ display: 'flex', justifyContent: 'center' }}>
                    {assessment.risk > 80 ? '🚨' : assessment.risk > 60 ? '⚠️' : '✅'} {assessment.verdict}
                  </div>
                </div>

                {/* Analysis */}
                <div className="card">
                  <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>🔍 AI Analysis</div>
                  {assessment.analysis.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: i < assessment.analysis.length - 1 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                      <span>⚠️</span><span>{a}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="card">
                  <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>✅ Recommended Actions</div>
                  {assessment.action.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: i < assessment.action.length - 1 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                      <span style={{ color: '#2ecc71', fontWeight: 700 }}>{i + 1}.</span><span>{a}</span>
                    </div>
                  ))}
                </div>

                {/* Report */}
                <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => { toast.success('Complaint filed on NCRB portal!'); }}>
                  🏛️ Report to NCRB Portal
                </button>
                <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => toast.success('Helpline 1930 dialled!')}>
                  📞 Call Helpline 1930
                </button>
              </>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-lg)' }}>
                <div style={{ fontSize: 48, marginBottom: 'var(--space-md)' }}>🛡️</div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Risk Assessment</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Describe your suspicious situation above and our AI will provide an instant risk verdict.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'channels' && (
        <div className="grid-3">
          {[
            { icon: '📱', name: 'WhatsApp', number: '+91-9999-SHIELD', status: 'Active', color: '#25D366', desc: 'Send "START" to begin fraud assessment in your preferred language.', users: '45K' },
            { icon: '📞', name: 'IVR Helpline', number: '1930', status: 'Active', color: '#388bfd', desc: 'Call 1930 to report cybercrime. AI IVR available in 12 languages 24/7.', users: '12K/day' },
            { icon: '📲', name: 'Mobile App', number: 'Cybercrime.gov.in', status: 'Active', color: '#9b59f5', desc: 'Download the official MHA Cybercrime app for Android and iOS.', users: '2.3M' },
            { icon: '💻', name: 'Web Portal', number: 'cybercrime.gov.in', status: 'Active', color: '#39d0d8', desc: 'File detailed complaints online with case tracking and status updates.', users: '8K/day' },
            { icon: '📧', name: 'Email', number: 'cybercell@gov.in', status: 'Active', color: '#e74c3c', desc: 'For non-urgent reports. Response within 24 hours by dedicated officers.', users: '2K/day' },
            { icon: '🏢', name: 'Cyber Thana', number: 'Nearest Station', status: 'Active', color: '#f39c12', desc: 'Visit your nearest Cyber Crime Police Station for in-person assistance.', users: '500/day' },
          ].map((c) => (
            <div key={c.name} className="card" style={{ borderTop: `3px solid ${c.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>{c.icon}</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: c.color, fontFamily: 'var(--font-mono)' }}>{c.number}</div>
                </div>
                <span className="badge badge-green" style={{ marginLeft: 'auto' }}>{c.status}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{c.desc}</p>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>👥 {c.users} active users</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'stats' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>📊 Reports Received Today</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { type: 'Digital Arrest Scam', count: 312, pct: 100 },
                { type: 'UPI Fraud', count: 289, pct: 93 },
                { type: 'KYC Scam', count: 201, pct: 64 },
                { type: 'Job Fraud', count: 178, pct: 57 },
                { type: 'Investment Scam', count: 134, pct: 43 },
                { type: 'Counterfeit Currency', count: 89, pct: 29 },
              ].map((r) => (
                <div key={r.type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span>{r.type}</span>
                    <span className="mono" style={{ color: 'var(--blue)', fontWeight: 700 }}>{r.count}</span>
                  </div>
                  <div className="progress"><div className="progress-bar" style={{ width: `${r.pct}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>🌐 Language Usage</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { lang: 'Hindi', pct: 38, color: '#388bfd' },
                { lang: 'English', pct: 22, color: '#2ecc71' },
                { lang: 'Marathi', pct: 12, color: '#f39c12' },
                { lang: 'Tamil', pct: 8, color: '#9b59f5' },
                { lang: 'Telugu', pct: 7, color: '#39d0d8' },
                { lang: 'Others', pct: 13, color: '#8899b4' },
              ].map((l) => (
                <div key={l.lang} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 70, fontSize: 13 }}>{l.lang}</span>
                  <div style={{ flex: 1, height: 8, background: 'var(--bg-surface)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${l.pct}%`, height: '100%', background: l.color, borderRadius: 99, transition: 'width 1s ease' }} />
                  </div>
                  <span style={{ width: 36, fontSize: 12, fontWeight: 700, textAlign: 'right', fontFamily: 'var(--font-mono)', color: l.color }}>{l.pct}%</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {[
                { label: 'Total Reports Today', val: '3,129', color: '#388bfd' },
                { label: 'Avg Response Time', val: '1.2s', color: '#2ecc71' },
                { label: 'NCRB Filed', val: '2,841', color: '#9b59f5' },
                { label: 'Satisfaction', val: '94%', color: '#39d0d8' },
              ].map((s) => (
                <div key={s.label} style={{ padding: 10, background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
