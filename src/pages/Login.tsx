import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import LogoFinal from "@/assets/LogoFinal.png";
import HeroImage from "@/assets/HEROIMAGE.png";
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
      const result = await authApi.login({ email, password });

      if (result) {
        setToken(result.user);
        toast.success(`Welcome, ${result.user.name}!`);
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #bee9efff 0%, #fdf3c0 50%, #fce570 100%)",
        padding: "24px",
      }}
    >
      {/* Card container */}
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "960px",
          minHeight: "600px",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
          background: "#fff",
        }}
      >
        {/* Left – Form Panel */}
        <div
          style={{
            flex: "0 0 420px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 44px",
            background: "linear-gradient(160deg, #fffef5 0%, #fef9d7 100%)",
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: "inline-block", marginBottom: "28px" }}>
            <img
              src={LogoFinal}
              alt="Vidyastara logo"
              style={{ height: "72px", objectFit: "contain" }}
              loading="lazy"
            />
          </Link>

          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#1a1a2e",
              margin: "0 0 4px 0",
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 28px 0" }}>
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Label style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}>
                Email or Register Number
              </Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@academy.com"
                required
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "10px",
                  height: "44px",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Label style={{ fontSize: "13px", color: "#374151", fontWeight: 500 }}>
                Password
              </Label>
              <div style={{ position: "relative" }}>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    background: "#ffffff",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "10px",
                    height: "44px",
                    fontSize: "14px",
                    paddingRight: "44px",
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff style={{ height: "16px", width: "16px" }} /> : <Eye style={{ height: "16px", width: "16px" }} />}
                </button>
              </div>
              <div style={{ textAlign: "right" }}>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: "12px", color: "#f59e0b", fontWeight: 500, textDecoration: "none" }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "46px",
                borderRadius: "10px",
                border: "none",
                background: loading
                  ? "#fcd34d"
                  : "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
                color: "#1a1a2e",
                fontWeight: 700,
                fontSize: "15px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(245,158,11,0.35)",
                transition: "all 0.2s ease",
                marginTop: "4px",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo credentials */}
          <div
            style={{
              marginTop: "24px",
              padding: "14px 16px",
              borderRadius: "12px",
              background: "rgba(251,191,36,0.12)",
              border: "1px solid rgba(251,191,36,0.3)",
              fontSize: "12px",
              lineHeight: "1.7",
            }}
          >
            <p style={{ fontWeight: 600, fontSize: "13px", marginBottom: "4px", color: "#374151" }}>
              Demo Credentials:
            </p>
            <p style={{ color: "#4b5563" }}>
              <span style={{ color: "#9ca3af" }}>Admin:</span> admin@academy.com / admin123
            </p>
            <p style={{ color: "#4b5563" }}>
              <span style={{ color: "#9ca3af" }}>Teacher:</span> rajesh@academy.com / teacher123
            </p>
            <p style={{ color: "#4b5563" }}>
              <span style={{ color: "#9ca3af" }}>Student:</span> aarav@test.com / student123
            </p>
          </div>
        </div>

        {/* Right – Image Panel */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            display: "flex",
          }}
        >
          <img
            src={HeroImage}
            alt="Students learning"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          {/* Overlay gradient for depth */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.25) 100%)",
            }}
          />
          {/* Floating text overlay */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "32px",
              right: "32px",
              color: "#fff",
            }}
          >
            <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 6px 0", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
              Empowering Education
            </h2>
            <p style={{ fontSize: "14px", opacity: 0.88, margin: 0, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
              Access your personalized dashboard, track progress, and achieve academic excellence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
