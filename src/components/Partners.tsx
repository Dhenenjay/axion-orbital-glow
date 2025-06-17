
import { Badge } from "@/components/ui/badge";

const partners = [
  { 
    name: "European Space Agency", 
    logo: "/lovable-uploads/37eaa453-89d8-4d2e-9e9a-e5550494c456.png", 
    subtitle: "ESA" 
  },
  { 
    name: "Japanese Space Agency", 
    logo: "/lovable-uploads/47dfb494-c80b-48d4-a600-73b8ffa28b45.png", 
    subtitle: "JAXA" 
  },
  { 
    name: "ISRO", 
    logo: "/lovable-uploads/7603c0d1-90b2-43fe-900a-9880b854fcdc.png", 
    subtitle: "India" 
  },
  { 
    name: "PierSight Space", 
    logo: "/lovable-uploads/5f9b800d-a625-44d1-adb3-5eb3fde1aea8.png", 
    subtitle: "Satellite Analytics" 
  },
  { 
    name: "Pixxel", 
    logo: "/lovable-uploads/768d12d6-d437-4db3-b6d7-b9f37bf2ad66.png", 
    subtitle: "Hyperspectral Imaging" 
  },
  { 
    name: "Auburn University", 
    logo: "/lovable-uploads/250cc0f1-7ff9-46e8-8f74-6bdda883cd97.png", 
    subtitle: "Research" 
  },
  { 
    name: "ETG", 
    logo: "/lovable-uploads/29205bf2-3745-4332-85b2-a57982b7e560.png", 
    subtitle: "Technology Solutions" 
  },
  { 
    name: "ICAR", 
    logo: "/lovable-uploads/8589714b-18c4-4f58-88c5-04974f9dbef9.png", 
    subtitle: "Agricultural Research" 
  }
];

export const Partners = () => {
  return (
    <section className="py-16 border-b border-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-cyan-400/30 text-cyan-400">
            Trusted by Leading Organizations
          </Badge>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Powering Space-Tech Innovation Globally
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From space agencies to agricultural research institutes, developers worldwide 
            trust our platform for satellite data analysis and insights.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="group flex flex-col items-center p-6 bg-slate-900/30 rounded-xl border border-slate-700/50 hover:bg-slate-900/50 hover:border-cyan-400/30 transition-all duration-300 hover:scale-105"
            >
              <div className="w-16 h-16 mb-3 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-white font-medium text-center text-sm mb-1 group-hover:text-cyan-400 transition-colors">
                {partner.name}
              </h3>
              <p className="text-gray-500 text-xs text-center">
                {partner.subtitle}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full border border-cyan-400/20">
            <span className="text-cyan-400 font-medium">Join 500+ developers analyzing satellite data with Axion Orbital</span>
          </div>
        </div>
      </div>
    </section>
  );
};
