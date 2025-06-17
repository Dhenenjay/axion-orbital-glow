import { Satellite, Mail, MapPin } from "lucide-react";
export const Footer = () => {
  return <footer className="py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Satellite className="h-6 w-6 text-cyan-400" />
              <span className="text-xl font-bold text-white">Axion Orbital</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Democratizing satellite data analysis with our revolutionary no-code platform. 
              Empowering organizations to make informed decisions at planetary scale.
            </p>
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>dhenenjay@axionorbital.space</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 Axion Orbital. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};