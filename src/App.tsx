import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ParkPage from './pages/ParkPage'
import RelaxPage from './pages/RelaxPage'
import EventsPage from './pages/EventsPage'
import ApartmentsPage from './pages/ApartmentsPage'
import WaterPage from './pages/WaterPage'
import CabHouseAdmin from './pages/CabHouseAdmin'
import AboutPage from './pages/AboutPage'
import PatronPortal from './pages/PatronPortal'
import PromotionsPage from './pages/PromotionsPage'
import StaffPOS from './pages/StaffPOS'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import LoadingScreen from './components/LoadingScreen'
import { adminAuth, staffAuth } from './lib/api'

function AdminRoute() {
  if (!adminAuth.getToken()) return <Navigate to="/login?next=/ch/admin" replace />
  return <CabHouseAdmin />
}

function PosRoute() {
  if (!staffAuth.getToken() && !adminAuth.getToken()) return <Navigate to="/login?next=/ch/pos" replace />
  return <StaffPOS />
}

export default function App() {
  const [mounted, setMounted] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let minDone = false
    let imgDone = false

    function tryReady() {
      if (minDone && imgDone) setReady(true)
    }

    // Minimum display: 2 seconds so the animation plays through
    const minTimer = setTimeout(() => { minDone = true; tryReady() }, 2000)

    // Hard cap: 5 seconds regardless of image state
    const capTimer = setTimeout(() => setReady(true), 5000)

    // Preload the first hero slide
    const img = new window.Image()
    img.onload = () => { imgDone = true; tryReady() }
    img.onerror = () => { imgDone = true; tryReady() }
    img.src = '/assets/hero-5.webp'

    return () => { clearTimeout(minTimer); clearTimeout(capTimer) }
  }, [])

  // Unmount LoadingScreen after it has faded out (550ms transition + small buffer)
  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => setMounted(false), 700)
    return () => clearTimeout(t)
  }, [ready])

  return (
    <>
      {mounted && <LoadingScreen ready={ready} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/park" element={<ParkPage />} />
          <Route path="/relax" element={<RelaxPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/apartments" element={<ApartmentsPage />} />
          <Route path="/water" element={<WaterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/ch/admin" element={<AdminRoute />} />
          <Route path="/ch/pos" element={<PosRoute />} />
          <Route path="/patrons" element={<PatronPortal />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
