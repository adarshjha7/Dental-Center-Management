import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Activity, Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, session } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (session?.isAuthenticated) {
      const redirectPath =
        session.user.role === "admin" ? "/admin" : "/patient";
      navigate(redirectPath, { replace: true });
    }
  }, [session, navigate]);

  if (session?.isAuthenticated) {
    const redirectPath = session.user.role === "admin" ? "/admin" : "/patient";
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        // Navigation will be handled by useEffect
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 medical-gradient rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">DentalCare</h1>
          <p className="mt-2 text-gray-600">
            Welcome to your dental management system
          </p>
        </div>

        {/* Login Form */}
        <Card className="glass-morphism shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full medical-gradient text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Demo Login Credentials:
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div>
                  <strong>👨‍⚕️ Admin:</strong> admin@dentalcenter.com / admin123
                </div>
                <div className="mt-3">
                  <strong>🦷 Patients (All use password: patient123):</strong>
                </div>
                <div className="ml-4 space-y-1">
                  <div>• patient@example.com (John Smith)</div>
                  <div>• adarsh@example.com (Adarsh Jha)</div>
                  <div>• abhay@example.com (Abhay Kumar)</div>
                  <div>• robert@example.com (Robert Davis)</div>
                  <div>• priya@example.com (Priya Sharma)</div>
                  <div>• rahul@example.com (Rahul Verma)</div>
                  <div>• neha@example.com (Neha Gupta)</div>
                </div>
              </div>
              <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                <strong>✅ All 7 patients can login!</strong> Session persists
                on refresh.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
