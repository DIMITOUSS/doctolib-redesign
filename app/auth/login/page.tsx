"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { MainNav } from "@/components/main-nav";
import { Eye, EyeOff, Lock, Mail, Key } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { authApi } from "@/lib/api";
import { LoginResponse, Login2FASuccessResponse, LoginSuccessResponse } from "@/types/auth"; // Import updated types

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [tempToken, setTempToken] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);

  // Type guard to check if response is LoginSuccessResponse
  const isLoginSuccess = (data: LoginResponse): data is LoginSuccessResponse => {
    return "accessToken" in data && "refreshToken" in data && "user" in data;
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data: LoginResponse = await authApi.login({ email, password });

      if (!isLoginSuccess(data)) {
        // 2FA required
        setTempToken(data.tempToken);
        setTwoFactorRequired(true);
        setIsLoading(false);
        return;
      }

      // Full login success
      setAuth(data.accessToken, data.user.role, data.user.id);
      console.log("User role:", data.user.role);

      switch (data.user.role) {
        case "DOCTOR":
          router.push("/doctor/dashboard");
          break;
        case "PATIENT":
          router.push("/patient/dashboard");
          break;
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
        default:
          console.error("Unknown role:", data.user.role);
          setError("Unauthorized role.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }

  async function handle2FALogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data: Login2FASuccessResponse = await authApi.loginWith2FA(tempToken, twoFactorCode);
      setAuth(data.accessToken, data.user.role, data.user.id);
      console.log("User role:", data.user.role);

      switch (data.user.role) {
        case "DOCTOR":
          router.push("/doctor/dashboard");
          break;
        case "PATIENT":
          router.push("/patient/dashboard");
          break;
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
        default:
          console.error("Unknown role:", data.user.role);
          setError("Unauthorized role.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid 2FA code");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex flex-1 items-center justify-center p-4">
        <AnimatedContainer animation="fade" className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
              <CardDescription className="text-center">
                {twoFactorRequired ? "Enter your 2FA code" : "Enter your credentials to access your account"}
              </CardDescription>
            </CardHeader>
            {!twoFactorRequired ? (
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">{error}</div>}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/auth/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
                    <Label htmlFor="remember" className="text-sm font-medium leading-none">Remember me</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                  <div className="text-center text-sm">
                    Don’t have an account?{" "}
                    <Link href="/auth/register" className="text-primary underline-offset-4 hover:underline">
                      Register
                    </Link>
                  </div>
                </CardFooter>
              </form>
            ) : (
              <form onSubmit={handle2FALogin}>
                <CardContent className="space-y-4">
                  {error && <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">{error}</div>}
                  <div className="space-y-2">
                    <Label htmlFor="twoFactorCode">2FA Code</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="twoFactorCode"
                        type="text"
                        placeholder="Enter your 2FA code"
                        className="pl-10"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify 2FA"}
                  </Button>
                  <Button
                    variant="link"
                    className="text-sm"
                    onClick={() => {
                      setTwoFactorRequired(false);
                      setTwoFactorCode("");
                      setTempToken("");
                    }}
                  >
                    Back to login
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </AnimatedContainer>
      </div>
    </div>
  );
}