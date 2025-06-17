
import { Brain, Layers, Zap, Globe, BarChart3, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms automatically detect patterns, changes, and anomalies in satellite imagery."
  },
  {
    icon: Layers,
    title: "Multi-Spectral Processing",
    description: "Process data across visible, infrared, and radar spectrums with intuitive visual tools."
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Stream and analyze satellite data as it's captured, enabling immediate insights and alerts."
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Access imagery from multiple satellite constellations covering every corner of the Earth."
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "Create stunning visualizations and interactive dashboards without any coding knowledge."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with SOC 2 compliance and end-to-end encryption."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful Features for
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Satellite Intelligence
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to transform raw satellite data into actionable insights, 
            all through an intuitive no-code interface.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/70 transition-all duration-300 group hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-colors">
                    <feature.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
