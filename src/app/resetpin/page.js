"use client";
import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import API_BASE_URL from "@/utils/constants";
import { useRouter } from "next/navigation";

const ResetPinPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const router = useRouter();

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validateCredentials = () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const sendOTP = async () => {
    if (!validateCredentials()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to send OTP");
      }

      // Save the token from response
      if (data?.token) {
        setResetToken(data.token);
      }

      setSuccess("OTP sent successfully to your email");
      setResendTimer(60);
      setTimeout(() => {
        setCurrentStep(2);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
      console.error("Error sending OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          type: "PIN_RESET",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to resend OTP");
      }

      setSuccess("OTP resent successfully");
      setResendTimer(60);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
  };

  const verifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verifyotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otpString,
          type: "PIN_RESET",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Invalid OTP");
      }

      setSuccess("OTP verified successfully!");
      setTimeout(() => {
        setCurrentStep(3);
        setSuccess("");
      }, 1000);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
      console.error("Error verifying OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetPin = async () => {
    if (newPin.length !== 6) {
      setError("PIN must be 6 digits");
      return;
    }

    if (newPin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resetpin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resetToken}`,
        },
        body: JSON.stringify({
          token: resetToken,
          newPin: newPin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to reset PIN");
      }

      setCurrentStep(4);
    } catch (err) {
      setError(err.message || "Failed to reset PIN. Please try again.");
      console.error("Error resetting PIN:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (value, type) => {
    if (/^\d*$/.test(value) && value.length <= 6) {
      if (type === "new") {
        setNewPin(value);
      } else {
        setConfirmPin(value);
      }
      setError("");
    }
  };

  const maskEmail = (emailStr) => {
    if (!emailStr) return "";
    const [name, domain] = emailStr.split("@");
    const maskedName = name.substring(0, 2) + "****";
    return `${maskedName}@${domain}`;
  };

  // Step 1: Enter Email & Password
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-5 bg-black rounded-2xl flex items-center justify-center shadow-xl shadow-black/20">
          <KeyRound className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-black mb-2">
          Reset Your PIN
        </h3>
        <p className="text-gray-500">
          Enter your credentials to receive a verification code
        </p>
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="Enter your email"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none transition-all bg-white text-black placeholder-gray-400"
            autoFocus
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Enter your password"
            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none transition-all bg-white text-black placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={sendOTP}
        disabled={loading || !email || !password}
        className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center group"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Verifying...
          </>
        ) : (
          <>
            Send Verification Code
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      {/* Back to Login */}
      <div className="text-center pt-2">
        <button
          onClick={() => router.push("/login")}
          className="text-sm text-gray-500 hover:text-black font-medium transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </div>
    </div>
  );

  // Step 2: Verify OTP
  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-5 bg-black rounded-2xl flex items-center justify-center shadow-xl shadow-black/20">
          <Mail className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-black mb-2">
          Verify Your Email
        </h3>
        <p className="text-gray-500">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-black">
            {maskEmail(email)}
          </span>
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onPaste={handleOtpPaste}
            className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none transition-all bg-white text-black"
            autoFocus={index === 0}
          />
        ))}
      </div>

      {/* Resend Timer */}
      <div className="text-center">
        {resendTimer > 0 ? (
          <p className="text-gray-500 text-sm">
            Resend code in{" "}
            <span className="font-semibold text-black tabular-nums">
              {resendTimer}s
            </span>
          </p>
        ) : (
          <button
            onClick={resendOTP}
            disabled={loading}
            className="text-black hover:text-gray-700 font-medium text-sm underline underline-offset-4 disabled:opacity-50 transition-colors"
          >
            Didn&apos;t receive code? Resend
          </button>
        )}
      </div>

      {/* Verify Button */}
      <button
        onClick={verifyOTP}
        disabled={loading || otp.join("").length !== 6}
        className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Verify Code
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </button>

      {/* Back Button */}
      <button
        onClick={() => {
          setCurrentStep(1);
          setOtp(["", "", "", "", "", ""]);
          setResendTimer(0);
          setError("");
        }}
        className="w-full text-gray-500 hover:text-black font-medium transition-colors flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Change Email
      </button>
    </div>
  );

  // Step 3: Set New PIN
  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-5 bg-black rounded-2xl flex items-center justify-center shadow-xl shadow-black/20">
          <Lock className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-black mb-2">
          Create New PIN
        </h3>
        <p className="text-gray-500">
          Choose a secure 6-digit PIN for your account
        </p>
      </div>

      {/* New PIN Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          New PIN
        </label>
        <div className="relative">
          <input
            type={showNewPin ? "text" : "password"}
            maxLength="6"
            value={newPin}
            onChange={(e) => handlePinChange(e.target.value, "new")}
            placeholder="••••••"
            className="w-full px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] border-2 border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none transition-all bg-white text-black placeholder-gray-300"
            autoComplete="off"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowNewPin(!showNewPin)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
          >
            {showNewPin ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {/* PIN Strength Indicator */}
        {newPin.length > 0 && (
          <div className="flex gap-1 mt-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all ${i < newPin.length ? "bg-black" : "bg-gray-200"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirm PIN Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Confirm PIN
        </label>
        <div className="relative">
          <input
            type={showConfirmPin ? "text" : "password"}
            maxLength="6"
            value={confirmPin}
            onChange={(e) => handlePinChange(e.target.value, "confirm")}
            placeholder="••••••"
            className="w-full px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] border-2 border-gray-200 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none transition-all bg-white text-black placeholder-gray-300"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPin(!showConfirmPin)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
          >
            {showConfirmPin ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* PIN Match Indicator */}
      {newPin.length === 6 && confirmPin.length > 0 && (
        <div
          className={`p-3 rounded-xl flex items-center gap-2 border ${newPin === confirmPin
            ? "bg-gray-50 text-black border-gray-200"
            : "bg-white text-gray-600 border-gray-200"
            }`}
        >
          {newPin === confirmPin ? (
            <>
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">PINs match!</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">PINs don&apos;t match</span>
            </>
          )}
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={resetPin}
        disabled={
          loading ||
          newPin.length !== 6 ||
          confirmPin.length !== 6 ||
          newPin !== confirmPin
        }
        className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Resetting PIN...
          </>
        ) : (
          <>
            Reset PIN
            <Shield className="w-5 h-5 ml-2" />
          </>
        )}
      </button>
    </div>
  );

  // Step 4: Success
  const renderStep4 = () => (
    <div className="text-center py-6">
      {/* Success Icon */}
      <div className="w-24 h-24 mx-auto mb-6 bg-black rounded-full flex items-center justify-center shadow-xl shadow-black/30">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>

      <h3 className="text-3xl font-bold text-black mb-3">
        PIN Reset Successful!
      </h3>
      <p className="text-gray-500 mb-2">
        Your PIN has been successfully updated
      </p>
      <p className="text-sm text-gray-400 mb-8">
        You can now use your new PIN for transactions
      </p>

      {/* Action Button */}
      <button
        onClick={() => router.push("/login")}
        className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 transition-all flex items-center justify-center group"
      >
        Continue to Login
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );

  // Progress Steps Indicator
  const renderProgressSteps = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2 ${currentStep > step
              ? "bg-black border-black text-white"
              : currentStep === step
                ? "bg-black border-black text-white scale-110 shadow-lg shadow-black/20"
                : "bg-white border-gray-200 text-gray-400"
              }`}
          >
            {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-12 h-0.5 rounded-full transition-all duration-500 ${currentStep > step ? "bg-black" : "bg-gray-200"
                }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 max-w-md w-full p-6 sm:p-8 border border-gray-100">
        {/* Step Content */}
        <div className="relative">
          {/* Progress Steps - Hide on success */}
          {currentStep < 4 && renderProgressSteps()}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3 text-gray-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-black" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3 text-gray-700">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-black" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          {/* Step Content */}
          <div className="transition-all duration-300 ease-in-out">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPinPage;
