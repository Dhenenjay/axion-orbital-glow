
import { useState } from "react";
import { Globe, Mail, Eye, EyeOff, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const SignUp = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {
      [key: string]: string;
    } = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSocialSignUp = (provider: string) => {
    setSelectedProvider(provider);
    setIsLoading(true);
    toast({
      title: "Signing up...",
      description: `Redirecting to ${provider} authentication`
    });

    // Simulate sign up process
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "Account created successfully"
      });
      navigate('/interface');
    }, 1500);
  };

  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setSelectedProvider('email');
    setIsLoading(true);
    toast({
      title: "Creating account...",
      description: "Setting up your satellite data analysis workspace"
    });

    // Simulate account creation
    setTimeout(() => {
      toast({
        title: "Welcome aboard!",
        description: "Your account has been created successfully"
      });
      navigate('/interface');
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-twinkle"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-twinkle" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl animate-fade-in relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4 group">
            <Globe className="h-8 w-8 text-cyan-400 mr-2 animate-float" />
            <span className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
              Axion Orbital Space
            </span>
          </div>
          <p className="text-gray-300 text-lg font-medium">
            Democratizing Access to Satellite Intelligence for Everyone
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {!showEmailForm ? (
          <>
            {/* Social Sign Up Options */}
            <div className="space-y-4">
              <Button
                onClick={() => handleSocialSignUp('google')}
                className="w-full bg-white hover:bg-gray-50 text-black font-medium py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg group border border-gray-200"
                disabled={isLoading}
              >
                <GoogleIcon />
                <span className="ml-3">
                  {selectedProvider === 'google' ? 'Signing up...' : 'Continue with Google'}
                </span>
                {selectedProvider === 'google' && (
                  <div className="ml-3 w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )}
              </Button>

              <Button
                onClick={() => handleSocialSignUp('github')}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg group border border-gray-700"
                disabled={isLoading}
              >
                <Github className="w-4 h-4" />
                <span className="ml-3">
                  {selectedProvider === 'github' ? 'Signing up...' : 'Continue with GitHub'}
                </span>
                {selectedProvider === 'github' && (
                  <div className="ml-3 w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )}
              </Button>

              <Button
                onClick={() => setShowEmailForm(true)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
                disabled={isLoading}
              >
                <Mail className="w-4 h-4 group-hover:animate-pulse" />
                <span className="ml-3">Continue with Email</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="px-4 text-gray-400 text-sm font-medium">or explore our features</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-center text-sm text-gray-300 hover:text-cyan-300 transition-colors cursor-pointer">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
                Real-time satellite data analysis
              </div>
              <div className="flex items-center justify-center text-sm text-gray-300 hover:text-cyan-300 transition-colors cursor-pointer">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                No-code IDE interface
              </div>
              <div className="flex items-center justify-center text-sm text-gray-300 hover:text-cyan-300 transition-colors cursor-pointer">
                <div className="w-2 h-2 bg-cyan-300 rounded-full mr-3 animate-pulse" style={{ animationDelay: '1s' }}></div>
                Planetary scale insights
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Email Sign Up Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-slate-800/50 border-slate-600/50 text-white focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl py-3 transition-all duration-300"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1 animate-fade-in">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-slate-800/50 border-slate-600/50 text-white pr-12 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl py-3 transition-all duration-300"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1 animate-fade-in">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-slate-800/50 border-slate-600/50 text-white focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl py-3 transition-all duration-300"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1 animate-fade-in">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                disabled={isLoading}
              >
                {selectedProvider === 'email' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Back Button */}
            <Button
              onClick={() => setShowEmailForm(false)}
              variant="ghost"
              className="w-full mt-6 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-xl py-3 transition-all duration-300"
              disabled={isLoading}
            >
              ← Back to social login
            </Button>
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <span
              className="text-cyan-400 cursor-pointer hover:text-cyan-300 hover:underline transition-all duration-200 font-medium"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Sign in functionality will be available soon"
                });
              }}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
