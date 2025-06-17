
import { Badge } from "@/components/ui/badge";

const partners = [
  { name: "European Space Agency", logo: "🇪🇺", subtitle: "ESA" },
  { name: "NASA", logo: "🚀", subtitle: "USA" },
  { name: "ISRO", logo: "🇮🇳", subtitle: "India" },
  { name: "PierSight Space", logo: "🛰️", subtitle: "Satellite Analytics" },
  { name: "Pixxel", logo: "🌍", subtitle: "Hyperspectral Imaging" },
  { name: "Auburn University", logo: "🎓", subtitle: "Research" },
  { name: "CCSHAU", logo: "🌾", subtitle: "Agriculture" },
  { name: "ICAR", logo: "🔬", subtitle: "Agricultural Research" },
  { name: "IARI", logo: "🌱", subtitle: "Agricultural Institute" }
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
            From space agencies to agricultural research institutes, organizations worldwide 
            trust our platform for satellite data analysis and insights.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="group flex flex-col items-center p-6 bg-slate-900/30 rounded-xl border border-slate-700/50 hover:bg-slate-900/50 hover:border-cyan-400/30 transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {partner.logo}
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
            <span className="text-cyan-400 font-medium">Join 500+ organizations analyzing satellite data with Axion Orbital</span>
          </div>
        </div>
      </div>
    </section>
  );
};
