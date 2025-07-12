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
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);
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

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-calm-50 via-background to-healing-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-calm-500 to-serenity-500 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
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
                  <p className="text-destructive text-sm">{errors.password}</p>
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

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowLogin(false)}
                className="text-sm text-foreground/50 hover:text-foreground/70 transition-colors"
                disabled={isLoading}
              >
                ← Back to home
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-50 via-background to-healing-50">
      {/* Clean Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-calm-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-calm-500 to-serenity-500 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-calm-700 to-serenity-700 bg-clip-text text-transparent">
                MindSpace
              </h1>
            </div>
            <div className="text-sm text-foreground/60">
              Professional Mental Health Support
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-calm-500 to-serenity-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Brain className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-calm-700 via-serenity-700 to-healing-700 bg-clip-text text-transparent leading-tight">
              MindSpace
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-foreground/70 mb-4 font-light">
            Your AI-Powered Mental Health Companion
          </p>
          <p className="text-lg text-foreground/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Professional mental health support available 24/7. Get personalized
            guidance, coping strategies, and a safe space to express yourself.
          </p>

          {/* Login Button */}
          <div className="mb-12">
            <Button
              onClick={() => setShowLogin(true)}
              size="lg"
              className="bg-gradient-to-r from-calm-500 to-serenity-500 hover:from-calm-600 hover:to-serenity-600 text-white font-medium py-6 px-12 text-lg rounded-xl shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <span>Access MindSpace</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "End-to-end encrypted",
              },
              {
                icon: Brain,
                title: "AI-Powered",
                desc: "Evidence-based therapy",
              },
              {
                icon: Heart,
                title: "24/7 Available",
                desc: "Always here for you",
              },
              {
                icon: Users,
                title: "Professional",
                desc: "Therapist-approved",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-calm-100 hover:bg-white/70 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-calm-500 to-serenity-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-foreground/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
