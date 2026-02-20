import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import LogoImg from "@/assets/Backgroundless.png";
import * as authApi from "@/api/auth.api";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, this would be an API call
      // Currently, it's still using mock data logic but through the API layer
      // We'll simulate the API call for now to keep existing demo working
      const result = await authApi.login({ email, password });

      if (result) {
        setToken(result.user);
        toast.success(`Welcome, ${result.user.name}!`);
        // Navigate based on role - assuming result.redirect is part of the API response
        // or we handle redirect logic here
        const redirectMap: Record<string, string> = {
          admin: "/admin",
          teacher: "/teacher",
          student: "/student",
        };
        navigate(redirectMap[result.user.role] || "/");
      }
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={LogoImg}
              alt="Vidyastara logo"
              className="h-20 w-15 object-cover"
              loading="lazy"
            />
            <span className="font-heading text-lg font-bold text-foreground">
              Vidyastara
            </span>
          </Link>

          <h1 className="text-2xl font-heading font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email or Register Number</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@academy.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-lg bg-muted text-xs space-y-1.5">
            <p className="font-semibold text-sm mb-2">Demo Credentials:</p>
            <p>
              <span className="text-muted-foreground">Admin:</span>{" "}
              admin@academy.com / admin123
            </p>
            <p>
              <span className="text-muted-foreground">Teacher:</span>{" "}
              rajesh@academy.com / teacher123
            </p>
            <p>
              <span className="text-muted-foreground">Student:</span>{" "}
              aarav@test.com / student123
            </p>
          </div>
        </div>
      </div>

      {/* Right - Decorative */}
      <div className="hidden lg:flex flex-1 gradient-primary items-center justify-center p-12">
        <div className="text-center text-primary-foreground max-w-md">
          <img
            src={LogoImg}
            alt="Vidyastara logo"
            className="h-16 w-16 mx-auto mb-6 animate-float"
          />
          <h2 className="text-3xl font-heading font-bold">
            Empowering Education
          </h2>
          <p className="mt-3 text-primary-foreground/70">
            Access your personalized dashboard, track progress, and achieve
            academic excellence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
