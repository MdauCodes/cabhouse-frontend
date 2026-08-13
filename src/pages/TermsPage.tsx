import Layout from '../components/Layout'

const EFFECTIVE = '1 August 2026'
const COMPANY = 'CabHouse Agencies Ltd'
const EMAIL = 'customercare@cabhouseagencies.com'

export default function TermsPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-5 py-16 font-body">
        <p className="text-xs uppercase tracking-[0.2em] font-bold mb-3" style={{ color: 'var(--color-gold)' }}>Legal</p>
        <h1 className="font-display font-black text-3xl mb-2" style={{ letterSpacing: '-0.02em' }}>Terms of Use</h1>
        <p className="text-slate-500 text-sm mb-10">Effective date: {EFFECTIVE}</p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-700">

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-3">1. Agreement</h2>
            <p>
              By accessing cabhouse.site or making a reservation through our booking system, you agree to
              be bound by these Terms of Use. If you do not agree, please do not use our services.
              These terms are governed by the laws of Kenya.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-3">2. Our services</h2>
            <p>
              {COMPANY} provides recreational, hospitality, and accommodation services under the CabHouse
              Park, CabHouse Apartments, and CabHouse Water brands. The website and booking system are
              provided to facilitate reservations and information about those services.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-3">3. Reservations and bookings</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>A reservation is not confirmed until you have paid the required deposit and received a written confirmation from us.</li>
              <li>Reference codes (e.g. CBH-XXXXXXXX) are issued upon submission and serve as your provisional booking identifier.</li>
              <li>We reserve the right to cancel a reservation if the deposit is not received within 24 hours of submission, or if we cannot verify the payment.</li>
              <li>All prices are quoted in Kenya Shillings (KES) and are inclusive of applicable taxes unless stated otherwise.</li>
              <li>We reserve the right to refuse a booking at our discretion.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-3">4. Deposits and payments</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Deposits paid via M-Pesa are non-refundable unless the cancellation is initiated by CabHouse.</li>
              <li>The deposit amount is applied toward the total cost of your booking. Any balance is payable on arrival.</li>
              <li>You are responsible for ensuring that the M-Pesa transaction code and account name you submit are correct. Incorrect details may delay confirmation.</li>
              <li>CabHouse is not responsible for delays or losses caused by failed M-Pesa transactions on the part of Safaricom or your mobile network provider.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-3">5. Cancellations and refunds</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Cancellations made more than 72 hours before the booking date may be eligible for a credit toward a future booking at CabHouse's discretion.</li>
              <li>Cancellations within 72 hours of the booking date forfeit the deposit.</li>
              <li>No-shows forfeit the full deposit.</li>
              <li>CabHouse may cancel a booking due to force majeure, safety concerns, or circumstances beyond our control. In such cases, we will offer a full refund or rescheduling.</li>
              <li>To request a cancellation, contact us at <a href={`mailto:${EMAIL}`} className="underline text-slate-900">{EMAIL}</a> with your reference code.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-3">6. Guest conduct and safety</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>All guests must comply with the rules and safety instructions posted on-site and communicated by staff.</li>
              <li>CabHouse reserves the right to remove any guest who poses a risk to the safety or enjoyment of others, without refund.</li>
              <li>Children under 12 must be accompanied by a responsible adult at all times.</li>
              <li>Guests participate in physical activities (zip lines, go-karts, swimming, etc.) at their own risk. CabHouse provides safety equipment and trained staff but cannot eliminate all risks inherent in recreational activities.</li>
              <li>Alcohol consumption is restricted to designated areas. Intoxicated guests may be refused entry or removed.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-3">7. Liability</h2>
            <p>
              To the maximum extent permitted by Kenyan law, {COMPANY} shall not be liable for:
            </p>
            <ul className="mt-3 space-y-1.5 list-disc pl-5">
              <li>Loss or damage to personal property brought onto our premises.</li>
              <li>Personal injury arising from a guest's failure to follow safety instructions.</li>
              <li>Any indirect, consequential, or incidental loss arising from use of our website or services.</li>
            </ul>
            <p className="mt-3">
              Nothing in these terms excludes liability for death or personal injury caused by our negligence,
              or for fraud or fraudulent misrepresentation.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-3">8. Intellectual property</h2>
            <p>
              All content on this website — including text, images, videos, logos, and branding — is owned
              by or licensed to {COMPANY}. You may not reproduce, distribute, or commercially exploit any
              content without our written permission.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-3">9. Loyalty programme (coupons)</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Loyalty coupons are discounts applied to future purchases at CabHouse. They have no cash value and cannot be transferred, sold, or exchanged for money.</li>
              <li>Coupons do not expire, but the programme may be modified or discontinued with 30 days' notice.</li>
              <li>CabHouse reserves the right to void coupons obtained through fraudulent means.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-3">10. Acceptable use of the website</h2>
            <p>You agree not to:</p>
            <ul className="mt-3 space-y-1.5 list-disc pl-5">
              <li>Submit false information when making a reservation.</li>
              <li>Attempt to gain unauthorised access to any part of our systems.</li>
              <li>Use automated tools to scrape or overload our website.</li>
              <li>Impersonate CabHouse staff or misrepresent your identity.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-3">11. Privacy</h2>
            <p>
              Your use of our services is also governed by our{' '}
              <a href="/privacy" className="underline text-slate-900">Privacy Policy</a>, which is incorporated
              into these Terms of Use by reference.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-3">12. Governing law and disputes</h2>
            <p>
              These Terms are governed by the laws of Kenya. Any dispute arising from or relating to these
              Terms shall first be referred to mediation. If mediation fails, disputes shall be subject to
              the exclusive jurisdiction of the courts of Kenya.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-3">13. Changes to these terms</h2>
            <p>
              We may update these Terms from time to time. The updated version will be posted on this page
              with a new effective date. Continued use of our services after that date constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-lg text-slate-900 mb-3">14. Contact</h2>
            <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-1">
              <p><strong>{COMPANY}</strong></p>
              <p><a href={`mailto:${EMAIL}`} className="underline text-slate-900">{EMAIL}</a></p>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  )
}
