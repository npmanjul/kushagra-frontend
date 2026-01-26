"use client";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Phone, Lock } from "lucide-react";
import Link from "next/link";
import API_BASE_URL from "@/utils/constants"; // ✅ Make sure you have this file
import { useRouter } from "next/navigation";
import useStore from "@/store/useStore";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setCurrStep, checkToken } = useStore();

  // ✅ Detect email or phone input
  const detectInputType = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;

    if (emailPattern.test(value)) return "email";
    if (phonePattern.test(value.replace(/[\s\-\(\)]/g, ""))) return "phone";
    return "text";
  };

  const inputType = detectInputType(emailOrPhone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password) return;

    setIsLoading(true);
    try {
      // ✅ Send email if email, phone_number if phone
      console.log("API_BASE_URL used in browser:", API_BASE_URL);
      const bodyData =
        inputType === "email"
          ? { email: emailOrPhone.trim(), password }
          : { phone_number: emailOrPhone.trim(), password };

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      console.log("Login response:", data);
      if (response.ok) {
        localStorage.setItem("token", data.token);
        if (data.currentStep < 6 && data.role === "farmer") {
          setCurrStep(data.currentStep + 1);
          router.push("/register");
        } else {
          if(data.role === "farmer"){
            router.push("/dashboard");
          }else if(data.role === "manager"){
            router.push("/manager");
          }else if(data.role === "admin"){
            router.push("/admin");
          }else if(data.role === "supervisor"){
            router.push("/supervisor");
          }
        }
        toast.success("Login successful");
        setIsLoading(false);
      } else {
        toast.error(`Login failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      try {
        const checkTokenValidation = await checkToken();
        console.log(checkTokenValidation);

        if (checkTokenValidation?.success) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Token validation error:", error);
      }
    };

    validateToken();
  }, [checkToken, router]);

  // if(isLoading) {
  //   return <Loader/>
  // }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-xl mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Welcome back
            </h1>
            <p className="text-gray-600 text-sm">
              Please sign in to your account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-2" onSubmit={handleSubmit}>
            {/* Email/Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {inputType === "email" ? (
                    <Mail className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Phone className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  placeholder="Enter email or phone number"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <Link
                href="/forget-password"
                className="text-sm text-gray-600 hover:underline hover:text-gray-900 transition-all duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-8 text-sm">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-gray-900 font-medium hover:underline transition-all duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
