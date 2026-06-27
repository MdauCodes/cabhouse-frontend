import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import HeroCarousel from '../components/HeroCarousel'
import IntentSection from '../components/IntentSection'
import BrandShowcase from '../components/BrandShowcase'
import ExperiencesStrip from '../components/ExperiencesStrip'
import ParkDeepDive from '../components/ParkDeepDive'
import Pricing from '../components/Pricing'
import OffersStrip from '../components/OffersStrip'
import Testimonials from '../components/Testimonials'
import Gallery from '../components/Gallery'
import MapSection from '../components/MapSection'
import BookingCTA from '../components/BookingCTA'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import CookieBanner from '../components/CookieBanner'

export default function Home() {
  return (
    <div style={{ overflowX: 'clip', background: 'var(--canvas)' }}>
      <AnnouncementBar />
      <Navbar />
      <HeroCarousel />
      <IntentSection />
      <BrandShowcase />
      <ExperiencesStrip />
      <ParkDeepDive />
      <Pricing />
      <OffersStrip />
      <Testimonials />
      <Gallery />
      <MapSection />
      <BookingCTA />
      <Footer />
      <FloatingWhatsApp />
      <CookieBanner />
    </div>
  )
}
