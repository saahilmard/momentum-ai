import { HeroSection } from '../components/HeroSection'
import { ProductCards } from '../components/ProductCards'
import { TrustPrivacySection } from '../components/TrustPrivacySection'
import { TestimonialsSection } from '../components/TestimonialsSection'
import Navigation from '../components/Navigation'

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <ProductCards />
      <TrustPrivacySection />
      <TestimonialsSection />

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Company */}
            <div>
              <h3 className="text-lg font-bold mb-4">Momentum AI</h3>
              <p className="text-navy-300 text-sm leading-relaxed">
                Turning academic spirals into comeback stories.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-navy-300 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-navy-300 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-navy-300 hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="text-navy-300 hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-navy-300 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-navy-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-navy-300 hover:text-white transition-colors">Teacher Guide</a></li>
                <li><a href="#" className="text-navy-300 hover:text-white transition-colors">Student Stories</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-navy-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-navy-300 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-navy-300 hover:text-white transition-colors">FERPA Compliance</a></li>
                <li><a href="#" className="text-navy-300 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-navy-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-navy-400 text-sm">
                © 2024 Momentum AI. All rights reserved.
              </p>
              <p className="text-navy-400 text-sm italic">
                "Education technology should empower students, not surveil them."
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
