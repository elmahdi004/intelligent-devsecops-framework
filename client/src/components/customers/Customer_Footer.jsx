import { Github, Linkedin, Mail, Phone, MapPin, Heart, ArrowRight, Instagram, Twitter } from 'lucide-react';

function Customer_Footer() {
  return (
    <footer className="relative mt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12">
          {/* Brand Section */}
          <div className='flex flex-col space-y-6'>
            <div>
              <span className='font-stick-no-bills text-5xl font-bold gradient-text block mb-2'>
                FLINT
                <span className='text-red-500 text-6xl'>.</span>
              </span>
              <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Premium Fashion Store</p>
            </div>
            <p className='text-sm text-gray-300 leading-relaxed max-w-sm'>
              At Flint, we specialize in offering a premium collection of apparel, including stylish clothing,
              accessories, and footwear. Elevate your wardrobe with high-quality fashion.
            </p>
            <div className="flex space-x-3 pt-2">
              <a 
                target="_blank" 
                rel="noopener noreferrer"
                href={import.meta.env.VITE_GITHUB_URL} 
                className="group w-12 h-12 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 flex items-center justify-center hover:bg-red-500 hover:border-red-500 hover:scale-110 transition-all duration-300"
              >
                <Github className='w-5 h-5 group-hover:scale-110 transition-transform'/>
              </a>
              <a 
                target="_blank" 
                rel="noopener noreferrer"
                href={import.meta.env.VITE_LINKEDIN_URL} 
                className="group w-12 h-12 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 flex items-center justify-center hover:bg-blue-500 hover:border-blue-500 hover:scale-110 transition-all duration-300"
              >
                <Linkedin className='w-5 h-5 group-hover:scale-110 transition-transform'/>
              </a>
              <a 
                target="_blank" 
                rel="noopener noreferrer"
                href="#" 
                className="group w-12 h-12 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 hover:scale-110 transition-all duration-300"
              >
                <Instagram className='w-5 h-5 group-hover:scale-110 transition-transform'/>
              </a>
              <a 
                target="_blank" 
                rel="noopener noreferrer"
                href="#" 
                className="group w-12 h-12 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 hover:scale-110 transition-all duration-300"
              >
                <Twitter className='w-5 h-5 group-hover:scale-110 transition-transform'/>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='flex flex-col space-y-5'>
            <h3 className="text-xl font-bold text-white mb-1 relative">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-red-500 to-orange-500"></span>
            </h3>
            <div className="flex flex-col space-y-3.5">
              <a href="/shop/home" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>Home</span>
              </a>
              <a href="/shop/catalog" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>Catalog</span>
              </a>
              <a href="/shop/account" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>My Account</span>
              </a>
              <a href="/shop/search" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>Search</span>
              </a>
            </div>
          </div>

          {/* Legal & Support */}
          <div className='flex flex-col space-y-5'>
            <h3 className="text-xl font-bold text-white mb-1 relative">
              Support
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-red-500 to-orange-500"></span>
            </h3>
            <div className="flex flex-col space-y-3.5">
              <a href="/privacy-policy" target="_blank" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>Privacy Policy</span>
              </a>
              <a href="/terms-conditions" target="_blank" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>Terms & Conditions</span>
              </a>
              <a href="/shop/account" className="group flex items-center text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1">
                <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>Help Center</span>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className='flex flex-col space-y-5'>
            <h3 className="text-xl font-bold text-white mb-1 relative">
              Get in Touch
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-red-500 to-orange-500"></span>
            </h3>
            <div className="flex flex-col space-y-4 text-gray-300">
              <a href="mailto:support@flint.com" className="group flex items-start gap-3 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
                  <Mail className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-gray-400">support@flint.com</p>
                </div>
              </a>
              <a href="tel:+15551234567" className="group flex items-start gap-3 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <Phone className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-xs text-gray-400">+1 (555) 123-4567</p>
                </div>
              </a>
              <div className="group flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-xs text-gray-400">123 Fashion Street<br />Style City, SC 12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2025 <span className="font-semibold text-white">Flint</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>for fashion lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Customer_Footer