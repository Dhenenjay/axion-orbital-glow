
import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const navigate = useNavigate();

  const handleSignUp = (provider: string) => {
    setSelectedProvider(provider);
    // Simulate sign up process
    setTimeout(() => {
      navigate('/interface');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-cyan-400 mr-2" />
            <span className="text-2xl font-bold text-white">Axiom Orbital Space</span>
          </div>
          <p className="text-gray-300 text-lg">
            Democratizing Access to Satellite for Everyone
          </p>
        </div>

        {/* Sign Up Options */}
        <div className="space-y-4">
          <Button
            onClick={() => handleSignUp('google')}
            className="w-full bg-white hover:bg-gray-100 text-black font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            disabled={selectedProvider === 'google'}
          >
            {selectedProvider === 'google' ? 'Signing up...' : 'Signup with Google'}
          </Button>

          <Button
            onClick={() => handleSignUp('github')}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            disabled={selectedProvider === 'github'}
          >
            {selectedProvider === 'github' ? 'Signing up...' : 'Signup with GitHub'}
          </Button>

          <Button
            onClick={() => handleSignUp('email')}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            disabled={selectedProvider === 'email'}
          >
            {selectedProvider === 'email' ? 'Signing up...' : 'Signup with Email'}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <span className="text-cyan-400 cursor-pointer hover:underline">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
