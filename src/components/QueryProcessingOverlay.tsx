import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Cpu, Zap, CheckCircle2 } from 'lucide-react';

interface QueryProcessingOverlayProps {
  isProcessing: boolean;
  onComplete: () => void;
  query: string;
}

const QueryProcessingOverlay = ({ isProcessing, onComplete, query }: QueryProcessingOverlayProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const processingSteps = [
    { 
      icon: Database, 
      title: "Acquiring datasets",
      duration: 6000
    },
    { 
      icon: Cpu, 
      title: "Running pre-processing algorithms",
      duration: 8000
    },
    { 
      icon: Zap, 
      title: "Processing",
      duration: 7000
    },
    { 
      icon: CheckCircle2, 
      title: "Finalising output",
      duration: 3000
    }
  ];

  useEffect(() => {
    if (!isProcessing) {
      setProgress(0);
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }

    let totalTime = 0;
    let currentTime = 0;

    // Calculate total processing time
    processingSteps.forEach(step => {
      totalTime += step.duration;
    });

    const processSteps = async () => {
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(i);
        
        const stepDuration = processingSteps[i].duration;
        const stepStartTime = currentTime;
        
        // Animate progress for this step
        const stepInterval = setInterval(() => {
          currentTime += 100;
          const stepProgress = Math.min((currentTime - stepStartTime) / stepDuration, 1);
          const totalProgress = ((stepStartTime + (stepProgress * stepDuration)) / totalTime) * 100;
          setProgress(totalProgress);
        }, 100);

        // Wait for step to complete
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        clearInterval(stepInterval);
        
        // Mark step as completed
        setCompletedSteps(prev => [...prev, i]);
        currentTime = stepStartTime + stepDuration;
      }

      // Complete processing
      setProgress(100);
      setTimeout(() => {
        onComplete();
      }, 500);
    };

    processSteps();
  }, [isProcessing, onComplete]);

  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center">
      <ScrollArea className="h-full w-full">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-2xl w-full">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                    <Zap className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  {/* Orbital rings */}
                  <div className="absolute -inset-4 border-2 border-cyan-500/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                  <div className="absolute -inset-8 border border-blue-500/20 rounded-full animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                Processing Query
              </h2>
              <p className="text-gray-400 text-sm max-w-md mx-auto">{query}</p>
            </div>

            {/* Ultra Enhanced Progress Bar */}
            <div className="mb-12 relative">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-gray-300 font-semibold">Progress</span>
                <span className="text-2xl text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-bold">{Math.round(progress)}%</span>
              </div>
              
              {/* Multi-layered Progress Container */}
              <div className="relative h-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-2 border-slate-700/50 overflow-hidden backdrop-blur-sm shadow-2xl">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 opacity-30 animate-pulse"></div>
                
                {/* Main Progress Fill with Triple Gradient */}
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out relative overflow-hidden shadow-lg"
                  style={{ width: `${progress}%` }}
                >
                  {/* Layer 1: Base shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                  
                  {/* Layer 2: Moving light wave */}
                  <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -skew-x-12 moving-light"></div>
                  
                  {/* Layer 3: Sparkle effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping"></div>
                  
                  {/* Layer 4: Edge glow */}
                  <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-white/50 to-transparent"></div>
                </div>
                
                {/* Outer Glow Effect - Multi-colored */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-lg opacity-70 animate-pulse"></div>
                
                {/* Pulsing Ring Animations - Multiple layers */}
                <div className="absolute -inset-3 rounded-2xl border border-cyan-500/20 animate-ping opacity-30"></div>
                <div className="absolute -inset-6 rounded-2xl border border-blue-500/15 animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -inset-9 rounded-2xl border border-purple-500/10 animate-ping opacity-10" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            {/* Simplified Processing Steps */}
            <div className="space-y-4 mb-8">
              {processingSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === index;
                const isCompleted = completedSteps.includes(index);

                return (
                  <div 
                    key={index}
                    className={`flex items-center p-4 rounded-xl border-2 transition-all duration-700 transform ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-cyan-400/70 shadow-xl shadow-cyan-500/30 scale-105' 
                        : isCompleted
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/70 shadow-lg shadow-green-500/20'
                          : 'bg-slate-800/40 border-slate-600/40 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-300 animate-pulse shadow-lg shadow-cyan-500/50' 
                        : isCompleted
                          ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 shadow-lg shadow-green-500/50'
                          : 'bg-slate-700/60 text-gray-400'
                    }`}>
                      <StepIcon className={`w-6 h-6 ${isActive ? 'animate-pulse' : isCompleted ? 'animate-bounce' : ''}`} />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className={`font-bold text-lg transition-all duration-300 ${
                        isActive ? 'text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text' 
                        : isCompleted ? 'text-green-300' 
                        : 'text-gray-400'
                      }`}>
                        {step.title}
                      </h3>
                    </div>

                    {isCompleted && (
                      <CheckCircle2 className="w-6 h-6 text-green-400 animate-bounce" />
                    )}
                    {isActive && (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Enhanced Stats Footer */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-xl p-4 border border-slate-600/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-2xl font-bold">2.4TB</div>
                <div className="text-gray-400 text-sm">Data Processed</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-xl p-4 border border-slate-600/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl font-bold">847</div>
                <div className="text-gray-400 text-sm">SAR Images</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-xl p-4 border border-slate-600/50 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-2xl font-bold">94.2%</div>
                <div className="text-gray-400 text-sm">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      
      {/* Enhanced Custom CSS Animations */}
      <style>{`
        @keyframes moving-light {
          0% { transform: translateX(-100%) skewX(-12deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(400%) skewX(-12deg); opacity: 0; }
        }
        .moving-light {
          animation: moving-light 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default QueryProcessingOverlay;
