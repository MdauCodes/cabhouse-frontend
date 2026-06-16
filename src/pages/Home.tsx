import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import BrandPillars from '../components/BrandPillars'
import Gallery from '../components/Gallery'
import ParkDeepDive from '../components/ParkDeepDive'
import Pricing from '../components/Pricing'
import BrandEcosystem from '../components/BrandEcosystem'
import Testimonials from '../components/Testimonials'
import MapSection from '../components/MapSection'
import BookingCTA from '../components/BookingCTA'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <TrustStrip />
      <BrandPillars />
      <Gallery />
      <ParkDeepDive />
      <Pricing />
      <BrandEcosystem />
      <Testimonials />
      <MapSection />
      <BookingCTA />
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
