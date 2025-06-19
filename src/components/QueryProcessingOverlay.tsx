
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Satellite, Database, BarChart3, Zap, CheckCircle2, Globe } from 'lucide-react';

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
      title: "Connecting to Satellites",
      duration: 3000
    },
    { 
      icon: Satellite, 
      title: "Acquiring SAR Data",
      duration: 8000
    },
    { 
      icon: Globe, 
      title: "Processing Data",
      duration: 6000
    },
    { 
      icon: BarChart3, 
      title: "Running Analysis",
      duration: 7000
    },
    { 
      icon: Zap, 
      title: "Validating Results",
      duration: 4000
    },
    { 
      icon: CheckCircle2, 
      title: "Generating Map",
      duration: 2000
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
      <div className="max-w-2xl w-full mx-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <Satellite className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Processing Satellite Query</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">{query}</p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8 relative">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">Overall Progress</span>
            <span className="text-sm text-cyan-400 font-semibold">{Math.round(progress)}%</span>
          </div>
          
          {/* Custom Progress Bar Container */}
          <div className="relative h-6 bg-slate-800/80 rounded-full border border-slate-700/50 overflow-hidden backdrop-blur-sm">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse opacity-30"></div>
            
            {/* Progress Fill with Gradient and Glow */}
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Animated Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              
              {/* Moving Light Effect */}
              <div 
                className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 animate-pulse slide-right"
              ></div>
            </div>
            
            {/* Outer Glow Effect */}
            <div 
              className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-sm opacity-60"
              style={{ width: `${Math.max(progress, 10)}%` }}
            ></div>
          </div>
          
          {/* Pulsing Ring Animation */}
          <div className="absolute -inset-4 rounded-full border border-cyan-500/20 animate-ping opacity-20"></div>
        </div>

        {/* Processing Steps */}
        <div className="space-y-3">
          {processingSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === index;
            const isCompleted = completedSteps.includes(index);

            return (
              <div 
                key={index}
                className={`flex items-center p-3 rounded-lg border transition-all duration-500 ${
                  isActive 
                    ? 'bg-cyan-500/10 border-cyan-400/50 shadow-lg shadow-cyan-500/20' 
                    : isCompleted
                      ? 'bg-green-500/10 border-green-400/50'
                      : 'bg-slate-800/30 border-slate-700/50'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : isCompleted
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-700/50 text-gray-500'
                }`}>
                  <StepIcon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                </div>
                
                <div className="ml-3 flex-1">
                  <h3 className={`font-semibold text-sm ${
                    isActive ? 'text-cyan-300' : isCompleted ? 'text-green-300' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h3>
                </div>

                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-green-400 animate-fade-in" />
                )}
                {isActive && (
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats Footer */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
            <div className="text-cyan-400 text-lg font-bold">2.4TB</div>
            <div className="text-gray-400 text-xs">Data Processed</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
            <div className="text-blue-400 text-lg font-bold">847</div>
            <div className="text-gray-400 text-xs">SAR Images</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-700/50">
            <div className="text-purple-400 text-lg font-bold">94.2%</div>
            <div className="text-gray-400 text-xs">Accuracy</div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for the slide animation */}
      <style>{`
        @keyframes slide-right {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(300%) skewX(-12deg); }
        }
        .slide-right {
          animation: slide-right 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default QueryProcessingOverlay;
