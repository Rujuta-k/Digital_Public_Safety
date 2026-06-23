import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Dashboard from './pages/Dashboard'
import ScamDetector from './pages/ScamDetector'
import CurrencyID from './pages/CurrencyID'
import FraudGraph from './pages/FraudGraph'
import GeospatialIntel from './pages/GeospatialIntel'
import CitizenShield from './pages/CitizenShield'
import FusionEngine from './pages/FusionEngine'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <div className="page-wrapper">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scam-detector" element={<ScamDetector />} />
              <Route path="/currency-id" element={<CurrencyID />} />
              <Route path="/fraud-graph" element={<FraudGraph />} />
              <Route path="/geospatial" element={<GeospatialIntel />} />
              <Route path="/citizen-shield" element={<CitizenShield />} />
              <Route path="/fusion-engine" element={<FusionEngine />} />
            </Routes>
          </div>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f1e35',
            color: '#e8edf5',
            border: '1px solid rgba(56,139,253,0.3)',
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
          },
        }}
      />
    </BrowserRouter>
  )
}
