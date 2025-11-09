import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Alert } from "react-bootstrap";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { api, PASSWORD_REGEX, EMAIL_REGEX } from "./api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (email !== "") {
      validateEmail(email);
    } else {
      setEmailValid(false);
    }
  }, [email]);

  useEffect(() => {
    if (emailValid && passwordValid && firstName !== "" && lastName !== "") {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [firstName, lastName, emailValid, passwordValid]);

  const validateEmail = (e) => {
    if (EMAIL_REGEX.test(e)) {
      setEmailValid(true);
      setErrorMessage("");
    } else {
      setEmailValid(false);
      setErrorMessage("Invalid email address");
    }
  }

  useEffect(() => {
    if (password !== "" || confirmPassword !== "") {
      validatePassword(password, confirmPassword);
    } else {
      // Clear error message if both fields are empty
      setErrorMessage("");
      setPasswordValid(false);
    }
  }, [password, confirmPassword]);

  const validatePassword = (p1, p2) => {
    // Clear error message first
    setErrorMessage("");
    
    // If both fields are empty, don't validate
    if (!p1 && !p2) {
      setPasswordValid(false);
      return;
    }

    // Check password format first
    if (p1 && !PASSWORD_REGEX.test(p1)) {
      setPasswordValid(false);
      setErrorMessage("Password must be 6-16 characters long, contain at least one number and one special character (!@#$%^&*)");
      return;
    }

    // Check if passwords match (only if both are filled)
    if (p1 && p2 && p1 !== p2) {
      setPasswordValid(false);
      setErrorMessage("Passwords do not match");
      return;
    }

    // If we get here, password is valid and matches
    if (p1 && p2 && PASSWORD_REGEX.test(p1) && p1 === p2) {
      setPasswordValid(true);
      setErrorMessage(""); // Clear any error message
      console.log("Password is valid and matches confirm password");
    } else {
      setPasswordValid(false);
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formValid) {
      setErrorMessage("Please check your inputs and complete all required fields with valid values.");
      return;
    }
    // setIsLoading(true);
    setErrorMessage("");
    setMessage("");

    try {
      const response = await api.post("api/users/register", {
        email: email.toLowerCase(),
        password,
        firstName,
        lastName,
      });
      const data = response.data;

      // Store token in localStorage
      if (data.data?.token) {
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      setMessage("Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/signin", 
          { 
            replace: true, 
            state: { message: "Registration successful! Please sign in to continue." } 
          });
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle> Registration </CardTitle>

        </CardHeader>
        <CardContent>
          {errorMessage && <Alert variant="danger">
            { errorMessage }
          </Alert>}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Enter your last name"
              />
            </div>
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
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                maxLength={16}
                placeholder="Enter your password"
              />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="cursor-pointer"
                />
                <span className="text-sm text-gray-600">Show Password</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Must be 6-16 characters with at least one number and one special character (!@#$%^&*)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                maxLength={16}
                placeholder="Confirm your password"
              />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showConfirmPassword}
                  onChange={(e) => setShowConfirmPassword(e.target.checked)}
                  className="cursor-pointer"
                />
                <span className="text-sm text-gray-600">Show Password</span>
              </label>
            </div>
            <Button 
              type="submit" 
              className="w-full">
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/admin" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

