import { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Alert } from "../ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { api } from "./api";
import AuthContext from "../../contexts/AuthContext";

export default function SignIn() {
  const {auth, setAuth} = useContext(AuthContext);
  const [mounted, didMount] = useState(false);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { state } = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    didMount(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setLoading(false);
    }
  }, [mounted]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/users/signin", { email, password });
      const result = response.data;

      console.log(result);
      if (result.success) {
        localStorage.setItem("accessToken", result.data.access_token);
        setAuth({
          ...result.data,
          isLoggedIn: true
        });
        navigate("/admin", { replace: true });

      } else {
        throw new Error('Unexpected error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Error signing in:', err);
      if (err.response.data.message == "Invalid email or password") {
        setError("Invalid email or password");
      } else if (err.response.data.message == "Account has not been approved yet. Please contact administrator for approval.") {
        setError("Account has not been approved yet. Please contact administrator for approval.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>

        </CardHeader>
        <CardContent>
          {state?.message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              {state.message}
            </div>
          )}
          {error && (
            <Alert variant="destructive" className="mb-3">
              { error }
            </Alert>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              {message}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  maxLength={16}
                  placeholder="Enter your password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
          {/* <Link
            to="/admin/forgot-password"
            className="text-sm text-primary hover:underline text-center"
          >
            Forgot password?
          </Link> */}
        </CardFooter>
      </Card>
    </div>
  );
}

