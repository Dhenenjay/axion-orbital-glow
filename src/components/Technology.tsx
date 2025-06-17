
import { Cloud, Cpu, Database, Layers, Rocket, Zap } from "lucide-react";

const technologies = [
  { icon: Cloud, name: "Cloud Native", description: "Scalable infrastructure" },
  { icon: Cpu, name: "Edge Computing", description: "Low-latency processing" },
  { icon: Database, name: "Big Data", description: "Petabyte storage" },
  { icon: Layers, name: "Multi-Source", description: "Unified data access" },
  { icon: Rocket, name: "Real-time", description: "Live data streams" },
  { icon: Zap, name: "AI/ML", description: "Intelligent automation" }
];

export const Technology = () => {
  return (
    <section id="technology" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built on
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Cutting-Edge Technology
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our platform leverages the latest advances in cloud computing, AI, and satellite technology 
            to deliver unprecedented performance and scale.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {technologies.map((tech, index) => (
            <div 
              key={index}
              className="group flex flex-col items-center text-center p-6 bg-slate-900/30 rounded-xl border border-slate-700/50 hover:bg-slate-900/50 transition-all duration-300 hover:scale-105"
            >
              <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full mb-4 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-colors">
                <tech.icon className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{tech.name}</h3>
              <p className="text-gray-400 text-sm">{tech.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full border border-cyan-400/20">
            <Rocket className="h-5 w-5 text-cyan-400 mr-2" />
            <span className="text-white font-medium">Processing 100+ TB of satellite data daily</span>
          </div>
        </div>
      </div>
    </section>
  );
};
