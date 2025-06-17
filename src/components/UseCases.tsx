
import { Leaf, Building, Waves, Mountain, Car, Shield } from "lucide-react";

const useCases = [
  {
    icon: Leaf,
    title: "Environmental Monitoring",
    description: "Track deforestation, monitor crop health, and assess environmental changes with precision.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Building,
    title: "Urban Planning",
    description: "Analyze urban growth, infrastructure development, and city expansion patterns.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Waves,
    title: "Maritime Intelligence",
    description: "Monitor vessel traffic, detect illegal fishing, and track maritime activities globally.",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    icon: Mountain,
    title: "Disaster Response",
    description: "Rapid assessment of natural disasters, damage evaluation, and emergency response planning.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Car,
    title: "Infrastructure Monitoring",
    description: "Track transportation networks, monitor construction progress, and assess infrastructure health.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "Security & Defense",
    description: "Border monitoring, threat detection, and strategic intelligence gathering.",
    gradient: "from-slate-500 to-gray-500"
  }
];

export const UseCases = () => {
  return (
    <section id="use-cases" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 to-purple-950/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Endless Possibilities
            <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Across Industries
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From environmental conservation to urban planning, our platform empowers organizations 
            to make data-driven decisions at planetary scale.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-xl bg-slate-900/30 border border-slate-700/50 p-6 hover:scale-105 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${useCase.gradient} bg-opacity-20 mb-4`}>
                  <useCase.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{useCase.title}</h3>
                <p className="text-gray-300 leading-relaxed">{useCase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
