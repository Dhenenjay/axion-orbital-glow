import { useState } from "react";
import { Globe, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
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
    const {
      name,
      value
    } = e.target;
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
  return <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-cyan-400 mr-2" />
            <span className="text-2xl font-bold text-white">Axion Orbital Space</span>
          </div>
          <p className="text-gray-300 text-lg">
            Democratizing Access to Satellite for Everyone
          </p>
        </div>

        {!showEmailForm ? <>
            {/* Social Sign Up Options */}
            <div className="space-y-4">
              <Button onClick={() => handleSocialSignUp('google')} className="w-full bg-white hover:bg-gray-100 text-black font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105" disabled={selectedProvider === 'google'}>
                {selectedProvider === 'google' ? 'Signing up...' : 'Signup with Google'}
              </Button>

              <Button onClick={() => handleSocialSignUp('github')} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105" disabled={selectedProvider === 'github'}>
                {selectedProvider === 'github' ? 'Signing up...' : 'Signup with GitHub'}
              </Button>

              <Button onClick={() => setShowEmailForm(true)} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105" disabled={selectedProvider !== ''}>
                <Mail className="w-4 h-4 mr-2" />
                Signup with Email
              </Button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>
          </> : <>
            {/* Email Sign Up Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="bg-slate-800/50 border-slate-600/50 text-white" placeholder="Enter your email" />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} className="bg-slate-800/50 border-slate-600/50 text-white pr-10" placeholder="Create a password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} className="bg-slate-800/50 border-slate-600/50 text-white" placeholder="Confirm your password" />
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105" disabled={selectedProvider === 'email'}>
                {selectedProvider === 'email' ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Back Button */}
            <Button onClick={() => setShowEmailForm(false)} variant="ghost" className="w-full mt-4 text-gray-400 hover:text-white">
              ← Back to social login
            </Button>
          </>}

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <span className="text-cyan-400 cursor-pointer hover:underline" onClick={() => {
            toast({
              title: "Coming Soon",
              description: "Sign in functionality will be available soon"
            });
          }}>
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>;
};
export default SignUp;