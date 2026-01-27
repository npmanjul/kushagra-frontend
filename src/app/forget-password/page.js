"use client";
import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Shield,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import API_BASE_URL from "@/utils/constants";

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: "", message: "" });

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("forgetPasswordState");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.formData) setFormData((prev) => ({ ...prev, ...parsed.formData }));
        if (parsed.resetToken) setResetToken(parsed.resetToken);
      }
    } catch (e) {
      // ignore malformed storage
    }
  }, []);

  // Persist relevant parts of state
  useEffect(() => {
    const toSave = {
      currentStep,
      formData: {
        email: formData.email,
        phone: formData.phone,
      },
      resetToken,
    };
    try {
      localStorage.setItem("forgetPasswordState", JSON.stringify(toSave));
    } catch (e) {
      // ignore storage errors
    }
  }, [currentStep, formData.email, formData.phone]);

  // Clear localStorage on successful password reset
  const clearStoredState = () => {
    try {
      localStorage.removeItem("forgetPasswordState");
    } catch (e) {
      // ignore
    }
  };

  // Helper function to check all password requirements
  const checkPasswordStrength = (password) => {
    return {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
    };
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Clear API message when user starts typing
    if (apiMessage.message) {
      setApiMessage({ type: "", message: "" });
    }
  };

  // Validate Step 1: Email & Phone
  const validateStep1 = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 2: OTP
  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.otp || formData.otp.length !== 6) {
      newErrors.otp = "Please enter complete 6-digit OTP";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 3: Password
  const validateStep3 = () => {
    const newErrors = {};
    const { password, confirmPassword } = formData;
    const { hasMinLength, hasUppercase, hasNumber, hasSpecialChar } =
      checkPasswordStrength(password);

    if (!password) {
      newErrors.password = "Password is required";
    } else if (
      !hasMinLength ||
      !hasUppercase ||
      !hasNumber ||
      !hasSpecialChar
    ) {
      newErrors.password = "Password must meet all criteria listed below.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API call to send OTP
  const sendOTP = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/sendotpforpasswordreset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          phone_number: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) setResetToken(data.token);
        setApiMessage({ type: "success", message: data.message || "OTP sent successfully!" });
        return { success: true, data };
      } else {
        setApiMessage({ type: "error", message: data.message || "Failed to send OTP" });
        return { success: false, error: data.message };
      }
    } catch (error) {
      setApiMessage({ type: "error", message: "Network error. Please try again." });
      return { success: false, error: "Network error" };
    }
  };

  // API call to verify OTP
  const verifyOTP = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verifyotpforpasswordreset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          phone_number: formData.phone,
          otp: formData.otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setApiMessage({ type: "success", message: data.message || "OTP verified successfully!" });
        return { success: true, data };
      } else {
        setApiMessage({ type: "error", message: data.message || "Invalid OTP" });
        return { success: false, error: data.message };
      }
    } catch (error) {
      setApiMessage({ type: "error", message: "Network error. Please try again." });
      return { success: false, error: "Network error" };
    }
  };

  // API call to reset password
  const resetPassword = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: resetToken,
          newPassword: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        clearStoredState();
        setApiMessage({ type: "success", message: data.message || "Password reset successfully!" });
        return { success: true, data };
      } else {
        setApiMessage({ type: "error", message: data.message || "Failed to reset password" });
        return { success: false, error: data.message };
      }
    } catch (error) {
      setApiMessage({ type: "error", message: "Network error. Please try again." });
      return { success: false, error: "Network error" };
    }
  };

  // Handle next step
  const handleNext = async () => {
    setApiMessage({ type: "", message: "" });

    if (currentStep === 1) {
      if (!validateStep1()) return;

      setIsLoading(true);
      const result = await sendOTP();
      setIsLoading(false);

      if (result.success) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (!validateStep2()) return;

      setIsLoading(true);
      const result = await verifyOTP();
      setIsLoading(false);

      if (result.success) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      if (!validateStep3()) return;

      setIsLoading(true);
      const result = await resetPassword();
      setIsLoading(false);

      if (result.success) {
        setCurrentStep(4);
      }
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (isLoading) return;

    setApiMessage({ type: "", message: "" });
    setIsLoading(true);
    const result = await sendOTP();
    setIsLoading(false);

    if (result.success) {
      setApiMessage({ type: "success", message: "OTP resent successfully!" });
    }
  };

  const strength = checkPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            {/* API Message Display */}
            {apiMessage.message && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm font-medium animate-slideDown ${apiMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
                  }`}
              >
                {apiMessage.message}
              </div>
            )}

            {/* Step 1: Email & Phone */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-black">
                    Forgot Password?
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Enter your email and phone number to receive a verification
                    code
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-black mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`
                          w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 
                          transition-all duration-200 text-black placeholder-gray-400
                          ${errors.email
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-200 focus:ring-black focus:border-black"
                          }
                        `}
                        placeholder="Enter your email"
                        autoComplete="email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 animate-slideDown">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-black mb-2"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`
                          w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 
                          transition-all duration-200 text-black placeholder-gray-400
                          ${errors.phone
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-200 focus:ring-black focus:border-black"
                          }
                        `}
                        placeholder="Enter 10-digit phone number"
                        maxLength="10"
                        autoComplete="tel"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500 animate-slideDown">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold 
                           hover:bg-gray-900 transform hover:scale-[1.02] transition-all duration-200 
                           focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 
                           disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                    <KeyRound className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-black">
                    Enter Verification Code
                  </h2>
                  <p className="text-gray-600 text-sm">
                    We sent a verification code to{" "}
                    <span className="font-semibold text-black">
                      {formData.email}
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-black">
                      {formData.phone}
                    </span>
                  </p>
                </div>

                <div>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    name="otp"
                    value={formData.otp}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setFormData((prev) => ({ ...prev, otp: value }));
                      if (errors.otp)
                        setErrors((prev) => ({ ...prev, otp: "" }));
                      if (apiMessage.message)
                        setApiMessage({ type: "", message: "" });
                    }}
                    className={`
                      w-full text-center border-2 rounded-lg text-lg font-bold text-black py-3
                      focus:outline-none focus:ring-2 focus:ring-black focus:border-black
                      transition-all duration-200
                      ${errors.otp ? "border-red-500" : "border-gray-300"}
                    `}
                    maxLength="6"
                    placeholder="Enter 6-digit code"
                    autoComplete="one-time-code"
                  />
                  {errors.otp && (
                    <p className="mt-2 text-xs text-red-500 text-center animate-slideDown">
                      {errors.otp}
                    </p>
                  )}
                </div>

                <div className="text-center">
                  <button
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-black hover:text-gray-700 text-sm font-semibold disabled:opacity-50 transition-colors underline"
                  >
                    {isLoading ? "Sending..." : "Didn't receive code? Resend"}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setApiMessage({ type: "", message: "" });
                    }}
                    disabled={isLoading}
                    className="flex-1 bg-gray-100 text-black py-3 px-4 rounded-lg font-semibold 
                             hover:bg-gray-200 transform hover:scale-[1.02] transition-all duration-200 
                             focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 flex items-center justify-center disabled:opacity-50"
                  >
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="flex-1 bg-black text-white py-3 px-4 rounded-lg font-semibold 
                             hover:bg-gray-900 transform hover:scale-[1.02] transition-all duration-200 
                             focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 
                             disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Verify
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: New Password */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-black">
                    Create New Password
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Choose a strong password for your account
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-black mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`
                          w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 
                          transition-all duration-200 text-black placeholder-gray-400
                          ${errors.password
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-200 focus:ring-black focus:border-black"
                          }
                        `}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black p-1"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500 animate-slideDown">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-black mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`
                          w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 
                          transition-all duration-200 text-black placeholder-gray-400
                          ${errors.confirmPassword
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-200 focus:ring-black focus:border-black"
                          }
                        `}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black p-1"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500 animate-slideDown">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
                    <p className="text-xs font-bold text-black uppercase tracking-wide">
                      Password Requirements:
                    </p>
                    <ul className="space-y-2">
                      <li
                        className={`flex items-center text-xs transition-colors duration-200 font-medium ${strength.hasMinLength
                          ? "text-green-600"
                          : "text-gray-500"
                          }`}
                      >
                        <div
                          className={`w-4 h-4 mr-2 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${strength.hasMinLength
                            ? "border-green-600 bg-green-600"
                            : "border-gray-400"
                            }`}
                        >
                          <Check
                            className={`w-2.5 h-2.5 text-white transition-opacity duration-200 ${strength.hasMinLength
                              ? "opacity-100"
                              : "opacity-0"
                              }`}
                          />
                        </div>
                        At least 8 characters
                      </li>
                      <li
                        className={`flex items-center text-xs transition-colors duration-200 font-medium ${strength.hasUppercase
                          ? "text-green-600"
                          : "text-gray-500"
                          }`}
                      >
                        <div
                          className={`w-4 h-4 mr-2 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${strength.hasUppercase
                            ? "border-green-600 bg-green-600"
                            : "border-gray-400"
                            }`}
                        >
                          <Check
                            className={`w-2.5 h-2.5 text-white transition-opacity duration-200 ${strength.hasUppercase
                              ? "opacity-100"
                              : "opacity-0"
                              }`}
                          />
                        </div>
                        One uppercase letter (A-Z)
                      </li>
                      <li
                        className={`flex items-center text-xs transition-colors duration-200 font-medium ${strength.hasNumber
                          ? "text-green-600"
                          : "text-gray-500"
                          }`}
                      >
                        <div
                          className={`w-4 h-4 mr-2 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${strength.hasNumber
                            ? "border-green-600 bg-green-600"
                            : "border-gray-400"
                            }`}
                        >
                          <Check
                            className={`w-2.5 h-2.5 text-white transition-opacity duration-200 ${strength.hasNumber ? "opacity-100" : "opacity-0"
                              }`}
                          />
                        </div>
                        One number (0-9)
                      </li>
                      <li
                        className={`flex items-center text-xs transition-colors duration-200 font-medium ${strength.hasSpecialChar
                          ? "text-green-600"
                          : "text-gray-500"
                          }`}
                      >
                        <div
                          className={`w-4 h-4 mr-2 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${strength.hasSpecialChar
                            ? "border-green-600 bg-green-600"
                            : "border-gray-400"
                            }`}
                        >
                          <Check
                            className={`w-2.5 h-2.5 text-white transition-opacity duration-200 ${strength.hasSpecialChar
                              ? "opacity-100"
                              : "opacity-0"
                              }`}
                          />
                        </div>
                        One special character (!@#$%^&*)
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setCurrentStep(2);
                      setApiMessage({ type: "", message: "" });
                    }}
                    disabled={isLoading}
                    className="flex-1 bg-gray-100 text-black py-3 px-4 rounded-lg font-semibold 
                             hover:bg-gray-200 transform hover:scale-[1.02] transition-all duration-200 
                             focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 
                             flex items-center justify-center disabled:opacity-50"
                  >
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="flex-1 bg-black text-white py-3 px-4 rounded-lg font-semibold 
                             hover:bg-gray-900 transform hover:scale-[1.02] transition-all duration-200 
                             focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 
                             disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn text-center">
                <div>
                  <div className="mx-auto w-20 h-20 bg-black rounded-full flex items-center justify-center mb-4 animate-scaleIn">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-2">
                    Password Reset Successful!
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Your password has been reset successfully. You can now login
                    with your new password.
                  </p>
                </div>

                <Link href="/login">
                  <button
                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold 
                           hover:bg-gray-900 transform hover:scale-[1.02] transition-all duration-200 
                           focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 shadow-lg"
                  >
                    Go to Login
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Back to Login Link */}
        {currentStep < 4 && (
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-gray-600 hover:text-black text-sm font-medium transition-colors"
            >
              Remember password?{" "}
              <span className="text-black font-bold underline">Login</span>
            </Link>
          </div>
        )}
      </div>

      {/* Add custom animations */}
      <style>{`
         @keyframes fadeIn {
           from {
             opacity: 0;
             transform: translateY(10px);
           }
           to {
             opacity: 1;
             transform: translateY(0);
           }
         }
 
         @keyframes slideDown {
           from {
             opacity: 0;
             transform: translateY(-10px);
           }
           to {
             opacity: 1;
             transform: translateY(0);
           }
         }
 
         @keyframes scaleIn {
           from {
             transform: scale(0);
           }
           to {
             transform: scale(1);
           }
         }
 
         .animate-fadeIn {
           animation: fadeIn 0.5s ease-out;
         }
 
         .animate-slideDown {
           animation: slideDown 0.3s ease-out;
         }
 
         .animate-scaleIn {
           animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
         }
      `}</style>
    </div>
  );
};

export default Page;