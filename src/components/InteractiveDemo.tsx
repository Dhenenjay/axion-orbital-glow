
import { useState, useEffect } from "react";
import { Play, Zap, Brain, Satellite, CheckCircle, ArrowRight, Sparkles, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const demoSteps = [
  {
    id: 1,
    title: "Type",
    subtitle: "Natural-language query",
    description: "Ask in plain English what you want to analyze",
    icon: Zap,
    demo: "Give me new sentinel-2 data for Jaipur from 15th April 2023 to 30th April 2023"
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
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const fullText = demoSteps[0].demo;

  // Typing animation effect
  useEffect(() => {
    if (activeStep === 1) {
      setTypedText("");
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setCompletedSteps(prev => [...prev, 1]);
        }
      }, 50);
      return () => clearInterval(typingInterval);
    }
  }, [activeStep, fullText]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Progress animation for step 2
  useEffect(() => {
    if (isProcessing) {
      setProgress(0);
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsProcessing(false);
            setActiveStep(3);
            setCompletedSteps(prev => [...prev, 2]);
            return 100;
          }
          return prev + 2;
        });
      }, 40);
      return () => clearInterval(progressInterval);
    }
  }, [isProcessing]);

  const handleStepClick = (stepId: number) => {
    if (stepId === 2 && completedSteps.includes(1)) {
      setIsProcessing(true);
      setActiveStep(2);
    } else if (stepId === 1) {
      setActiveStep(1);
      setCompletedSteps([]);
      setProgress(0);
    } else if (stepId === 3 && completedSteps.includes(2)) {
      setActiveStep(3);
    } else {
      setActiveStep(stepId);
    }
  };

  const resetDemo = () => {
    setActiveStep(1);
    setCompletedSteps([]);
    setProgress(0);
    setIsProcessing(false);
  };

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 to-indigo-950/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-400/10 border border-blue-400/20 mb-8 animate-pulse">
            <Satellite className="h-4 w-4 text-blue-400 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
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

        {/* Progress indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {demoSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                  completedSteps.includes(step.id)
                    ? 'bg-green-500 text-white scale-110'
                    : activeStep === step.id
                    ? 'bg-blue-500 text-white scale-110'
                    : 'bg-slate-700 text-gray-400'
                }`}>
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-bold">{step.id}</span>
                  )}
                </div>
                {index < demoSteps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 transition-colors duration-300 ${
                    completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {demoSteps.map((step) => (
            <Card
              key={step.id}
              className={`cursor-pointer transition-all duration-500 transform ${
                activeStep === step.id
                  ? 'bg-gradient-to-b from-blue-900/40 to-indigo-900/40 border-blue-400/50 scale-105 shadow-2xl shadow-blue-500/20'
                  : completedSteps.includes(step.id)
                  ? 'bg-gradient-to-b from-green-900/40 to-emerald-900/40 border-green-400/50 hover:scale-105 shadow-lg shadow-green-500/10'
                  : 'bg-slate-900/30 border-slate-700/50 hover:bg-slate-900/50 hover:scale-105'
              } backdrop-blur-sm`}
              onClick={() => handleStepClick(step.id)}
            >
              <CardContent className="p-8 text-center">
                <div className={`inline-flex p-4 rounded-full mb-6 transition-all duration-300 ${
                  activeStep === step.id
                    ? 'bg-gradient-to-br from-blue-500/30 to-indigo-500/30 animate-pulse'
                    : completedSteps.includes(step.id)
                    ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30'
                    : 'bg-slate-800/50'
                }`}>
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  ) : (
                    <step.icon className={`h-8 w-8 ${
                      activeStep === step.id ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                <p className={`font-medium mb-4 ${
                  activeStep === step.id 
                    ? 'text-blue-400' 
                    : completedSteps.includes(step.id)
                    ? 'text-green-400'
                    : 'text-blue-400'
                }`}>
                  {step.subtitle}
                </p>
                <p className="text-gray-300">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Interactive Demo Area */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8">
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50 relative overflow-hidden">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-cyan-400 text-sm font-medium">Natural Language Query</span>
                      {!completedSteps.includes(1) && (
                        <div className="ml-auto">
                          <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <div className="font-mono text-lg text-white min-h-[2rem] relative">
                      {typedText}
                      {showCursor && !completedSteps.includes(1) && (
                        <span className="inline-block w-0.5 h-6 bg-cyan-400 ml-1 animate-pulse" />
                      )}
                    </div>
                    {!completedSteps.includes(1) && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100"
                          style={{ width: `${(typedText.length / fullText.length) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <Button 
                    className={`w-full transition-all duration-300 ${
                      completedSteps.includes(1)
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                    }`}
                    onClick={() => handleStepClick(2)}
                    disabled={!completedSteps.includes(1)}
                  >
                    {completedSteps.includes(1) ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Submit Query
                      </>
                    ) : (
                      'Waiting for input...'
                    )}
                  </Button>
                </div>
              )}

              {activeStep === 2 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6 animate-pulse">
                    <div className="w-4 h-4 bg-white rounded-full animate-spin mr-3"></div>
                    <span className="text-white font-medium">
                      {isProcessing ? "Processing satellite data..." : "Ready to process"}
                    </span>
                  </div>
                  
                  {isProcessing && (
                    <div className="space-y-4 max-w-md mx-auto">
                      <Progress value={progress} className="h-2" />
                      <div className="text-gray-300 text-sm">
                        Processing: {Math.round(progress)}% complete
                      </div>
                      <div className="flex justify-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Database className="h-4 w-4 mr-1 animate-pulse" />
                          Querying database
                        </div>
                        <div className="flex items-center">
                          <Satellite className="h-4 w-4 mr-1 animate-spin" style={{ animationDuration: '2s' }} />
                          Analyzing imagery
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!isProcessing && !completedSteps.includes(2) && (
                    <p className="text-gray-300">Click to start processing satellite data</p>
                  )}
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/50">
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-green-400 text-sm font-medium">Analysis Complete</span>
                      <div className="ml-auto">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg p-4 transform hover:scale-105 transition-transform duration-200">
                        <h4 className="text-white font-semibold mb-2">Satellite Images Found</h4>
                        <p className="text-2xl font-bold text-blue-400">247 scenes</p>
                        <p className="text-gray-400 text-sm">Sentinel-2 L2A</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 transform hover:scale-105 transition-transform duration-200">
                        <h4 className="text-white font-semibold mb-2">Processing Time</h4>
                        <p className="text-2xl font-bold text-green-400">&lt; 90s</p>
                        <p className="text-gray-400 text-sm">Average query to insight</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 transform hover:scale-105 transition-transform duration-200">
                        <h4 className="text-white font-semibold mb-2">Data Coverage</h4>
                        <p className="text-2xl font-bold text-purple-400">98.5%</p>
                        <p className="text-gray-400 text-sm">Cloud-free coverage</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg p-4">
                      <h5 className="text-white font-medium mb-2">Generated Insights:</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Vegetation health analysis completed</li>
                        <li>• Land use classification updated</li>
                        <li>• Change detection report generated</li>
                        <li>• Time-series visualization created</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 group"
                      onClick={() => window.open('/interface', '_blank')}
                    >
                      View Full Results
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50"
                      onClick={resetDemo}
                    >
                      Try Another Query
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
