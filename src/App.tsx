import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ParkPage from './pages/ParkPage'
import RelaxPage from './pages/RelaxPage'
import EventsPage from './pages/EventsPage'
import ApartmentsPage from './pages/ApartmentsPage'
import WaterPage from './pages/WaterPage'
import MdauDev from './pages/MdauDev'
import AboutPage from './pages/AboutPage'
import PatronPortal from './pages/PatronPortal'
import StaffPOS from './pages/StaffPOS'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2450)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {loading && <LoadingScreen />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/park" element={<ParkPage />} />
          <Route path="/relax" element={<RelaxPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/apartments" element={<ApartmentsPage />} />
          <Route path="/water" element={<WaterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/mdau/dev" element={<MdauDev />} />
          <Route path="/mdau/pos" element={<StaffPOS />} />
          <Route path="/patrons" element={<PatronPortal />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
