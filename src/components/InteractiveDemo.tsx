
import { useState } from "react";
import { Play, Zap, Brain, Satellite } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const demoSteps = [
  {
    id: 1,
    title: "Type",
    subtitle: "Natural-language query",
    description: "Ask in plain English what you want to analyze",
    icon: Zap,
    demo: "Give me new sentinel-2 data for JaiSalmer from 15th April 2023 to 30th April 2023"
  },
  {
    id: 2,
    title: "Click",
    subtitle: "One-click execution",
    description: "Our AI processes your request instantly",
    icon: Play,
    demo: "Processing your query..."
  },
  {
    id: 3,
    title: "Insight",
    subtitle: "Output in minutes",
    description: "Get actionable insights and visualizations",
    icon: Brain,
    demo: "Satellite imagery analysis complete"
  }
];

export const InteractiveDemo = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStepClick = (stepId: number) => {
    if (stepId === 2) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setActiveStep(3);
      }, 2000);
    } else {
      setActiveStep(stepId);
    }
  };

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 to-indigo-950/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-400/10 border border-blue-400/20 mb-8">
            <Satellite className="h-4 w-4 text-blue-400 mr-2" />
            <span className="text-blue-400 text-sm font-medium">Interactive Demo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ask in Plain English—
            <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Get Planetary-Scale Insights in Minutes
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of satellite data analysis. No coding required, just natural language.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {demoSteps.map((step) => (
            <Card
              key={step.id}
              className={`cursor-pointer transition-all duration-300 ${
                activeStep === step.id
                  ? 'bg-gradient-to-b from-blue-900/40 to-indigo-900/40 border-blue-400/50 scale-105'
                  : 'bg-slate-900/30 border-slate-700/50 hover:bg-slate-900/50'
              } backdrop-blur-sm`}
              onClick={() => handleStepClick(step.id)}
            >
              <CardContent className="p-8 text-center">
                <div className={`inline-flex p-4 rounded-full mb-6 ${
                  activeStep === step.id
                    ? 'bg-gradient-to-br from-blue-500/30 to-indigo-500/30'
                    : 'bg-slate-800/50'
                } transition-colors`}>
                  <step.icon className={`h-8 w-8 ${
                    activeStep === step.id ? 'text-blue-400' : 'text-gray-400'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-blue-400 font-medium mb-4">{step.subtitle}</p>
                <p className="text-gray-300">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Demo Area */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-8">
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full mr-2"></div>
                      <span className="text-cyan-400 text-sm">Natural Language Query</span>
                    </div>
                    <p className="text-white font-mono text-lg">
                      {demoSteps[0].demo}
                    </p>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    onClick={() => handleStepClick(2)}
                  >
                    Submit Query
                  </Button>
                </div>
              )}

              {activeStep === 2 && (
                <div className="text-center py-12">
                  <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6 ${
                    isProcessing ? 'animate-pulse' : ''
                  }`}>
                    <div className="w-4 h-4 bg-white rounded-full animate-spin mr-3"></div>
                    <span className="text-white font-medium">
                      {isProcessing ? "Processing your query..." : "Ready to process"}
                    </span>
                  </div>
                  {!isProcessing && (
                    <p className="text-gray-300">Click to start processing satellite data</p>
                  )}
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-green-400 text-sm">Analysis Complete</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">Satellite Images Found</h4>
                        <p className="text-2xl font-bold text-blue-400">247 scenes</p>
                        <p className="text-gray-400 text-sm">Sentinel-2 L2A</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">Processing Time</h4>
                        <p className="text-2xl font-bold text-green-400">&lt; 90s</p>
                        <p className="text-gray-400 text-sm">Average query to insight</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    onClick={() => setActiveStep(1)}
                  >
                    Try Another Query
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
