
import { Badge } from "@/components/ui/badge";

const partners = [
  { 
    name: "European Space Agency", 
    logo: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=200&h=200&fit=crop&crop=center", 
    subtitle: "ESA" 
  },
  { 
    name: "Japanese Space Agency", 
    logo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center", 
    subtitle: "JAXA" 
  },
  { 
    name: "ISRO", 
    logo: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=200&h=200&fit=crop&crop=center", 
    subtitle: "India" 
  },
  { 
    name: "PierSight Space", 
    logo: "https://images.unsplash.com/photo-1517976547714-720226b864c1?w=200&h=200&fit=crop&crop=center", 
    subtitle: "Satellite Analytics" 
  },
  { 
    name: "Pixxel", 
    logo: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=200&h=200&fit=crop&crop=center", 
    subtitle: "Hyperspectral Imaging" 
  },
  { 
    name: "Auburn University", 
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop&crop=center", 
    subtitle: "Research" 
  },
  { 
    name: "ETG", 
    logo: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=200&h=200&fit=crop&crop=center", 
    subtitle: "Technology Solutions" 
  },
  { 
    name: "ICAR", 
    logo: "https://images.unsplash.com/photo-1574263867128-b2c5a94e4e5d?w=200&h=200&fit=crop&crop=center", 
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
