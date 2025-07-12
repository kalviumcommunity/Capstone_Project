import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import {
  Heart,
  Brain,
  Shield,
  Users,
  CheckCircle,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login, signup, isLoading } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin && !formData.name) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    let success = false;

    try {
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await signup(
          formData.name,
          formData.email,
          formData.password,
        );
      }

      if (!success) {
        setErrors({
          submit: isLogin
            ? "Invalid email or password. Please try again."
            : "Failed to create account. Email might already exist.",
        });
      }
    } catch (error) {
      console.error("Auth form error:", error);
      setErrors({
        submit: "Network error. Please check your connection and try again.",
      });
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Support",
      description:
        "Advanced mental health chatbot trained on evidence-based therapy",
    },
    {
      icon: Shield,
      title: "100% Confidential",
      description:
        "Your conversations are private and secure with end-to-end encryption",
    },
    {
      icon: Heart,
      title: "24/7 Available",
      description: "Get support whenever you need it, day or night",
    },
    {
      icon: Users,
      title: "Professional Guidance",
      description:
        "Created with licensed therapists and mental health professionals",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-50 via-background to-healing-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-calm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-calm-500 to-serenity-500 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-calm-700 to-serenity-700 bg-clip-text text-transparent">
                MindSpace
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-foreground/70">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>AI Mental Health Support</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-calm-700 via-serenity-700 to-healing-700 bg-clip-text text-transparent">
              Your Mental Health Journey Starts Here
            </h2>
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              Connect with an AI companion that understands, listens, and
              provides personalized mental health support whenever you need it.
            </p>

            <div className="space-y-6">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-calm-500 to-serenity-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-foreground/70">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-healing-50 rounded-lg border border-healing-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-healing-600" />
                <span className="font-medium text-healing-800">
                  Trusted by thousands
                </span>
              </div>
              <p className="text-sm text-healing-700">
                Join our community of users who have found support and guidance
                for their mental health journey.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 p-6 lg:p-12 flex items-center justify-center">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <p className="text-foreground/70 mt-2">
                {isLogin
                  ? "Sign in to continue your mental health journey"
                  : "Start your journey to better mental health"}
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-destructive text-sm">{errors.name}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-destructive text-sm">
                      {errors.password}
                    </p>
                  )}
                </div>

                {errors.submit && (
                  <p className="text-destructive text-sm text-center">
                    {errors.submit}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-calm-500 to-serenity-500 hover:from-calm-600 hover:to-serenity-600 text-white font-medium py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>
                        {isLogin ? "Signing In..." : "Creating Account..."}
                      </span>
                    </div>
                  ) : (
                    <span>{isLogin ? "Sign In" : "Create Account"}</span>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-foreground/70">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                      setFormData({ name: "", email: "", password: "" });
                    }}
                    className="ml-2 font-medium text-calm-600 hover:text-calm-700 transition-colors"
                    disabled={isLoading}
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="mt-6 p-3 bg-calm-50 rounded-lg">
                <p className="text-xs text-calm-700 text-center">
                  Use your personal mail id to access the app
                  <br />
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Features */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-calm-200 p-4">
          <div className="flex justify-center space-x-6 text-xs text-foreground/70">
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI Support</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>24/7 Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
