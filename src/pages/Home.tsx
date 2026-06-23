import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import HeroCarousel from '../components/HeroCarousel'
import IntentSection from '../components/IntentSection'
import BrandShowcase from '../components/BrandShowcase'
import ExperiencesStrip from '../components/ExperiencesStrip'
import ParkDeepDive from '../components/ParkDeepDive'
import Pricing from '../components/Pricing'
import Testimonials from '../components/Testimonials'
import Gallery from '../components/Gallery'
import MapSection from '../components/MapSection'
import BookingCTA from '../components/BookingCTA'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />
      <HeroCarousel />
      <IntentSection />
      <BrandShowcase />
      <ExperiencesStrip />
      <ParkDeepDive />
      <Pricing />
      <Testimonials />
      <Gallery />
      <MapSection />
      <BookingCTA />
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
