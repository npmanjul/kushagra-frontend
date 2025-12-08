"use client";
import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User,
  Loader2,
  Eye,
  EyeOff,
  Send,
  RefreshCw,
} from "lucide-react";
import API_BASE_URL from "@/utils/constants";
import { useRouter } from "next/navigation";

const ResetPinPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userDetails, setUserDetails] = useState(null);
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  

  const router = useRouter();

  // Automatically fetch user details on mount
  useEffect(() => {
    checkUserLogin();
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const checkUserLogin = async () => {
    try {
        const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/auth/checktoken`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });


      const data = await response.json();
      if (data.success) {
        setUserDetails(data.profile);
        setError("");
      } else {
        router.push("/login");
      } 
    } catch (err) {
      setError(
        err.message || "Failed to fetch user details. Please try again."
      );
      console.error("Error fetching user details:", err);
    }
  };

  const fetchUserDetails = async () => {
    setLoadingUser(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/auth/getprofile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to fetch user details");
      }

      const data = await response.json();
      if (data.profile) {
        setUserDetails(data.profile);
        setError("");
      } else {
        throw new Error("User profile not found");
      }
    } catch (err) {
      setError(
        err.message || "Failed to fetch user details. Please try again."
      );
      console.error("Error fetching user details:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  const sendOTP = async () => {
    if (!userDetails || !userDetails.email) {
      setError("User details not available. Please refresh the page.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userDetails.email,
          type: "PIN_RESET",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to send OTP");
      }

      setOtpSent(true);
      setResendTimer(60); // 60 seconds timer
      setCurrentStep(2);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
      console.error("Error sending OTP:", err);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setOtp(""); // Clear previous OTP
    await sendOTP();
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          otp: otp,
          type: "PIN_RESET",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Invalid OTP");
      }

      setCurrentStep(3);
      setError("");
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
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/auth/reset-pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pin: newPin,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to reset PIN");
      }

      setCurrentStep(4);
    } catch (err) {
      setError(err.message || "Failed to reset PIN. Please try again.");
      console.error("Error resetting PIN:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value) => {
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setError("");
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

  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    const maskedName = name.substring(0, 2) + "****";
    return `${maskedName}@${domain}`;
  };

  const renderStep1 = () => (
    <div className="text-center">
      <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 backdrop-blur-sm">
        <div className="w-20 h-20 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
          <User className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-black mb-3">
          Verification Required
        </h3>
        <p className="text-gray-600 mb-6">
          We need to verify your identity before resetting your PIN
        </p>

        {loadingUser ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-black mb-3" />
            <span className="text-gray-600">Loading your details...</span>
          </div>
        ) : userDetails ? (
          <>
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="text-lg font-semibold text-black">
                  {userDetails.name || userDetails.fullName || "User"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  OTP will be sent to
                </p>
                <p className="text-lg font-semibold text-black">
                  {maskEmail(userDetails.email)}
                </p>
              </div>
            </div>

            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-900 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP to Email
                  <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </>
        ) : (
          <div className="py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 mb-4">Failed to load user details</p>
            <button
              onClick={fetchUserDetails}
              className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-900 transition-all flex items-center justify-center mx-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="w-20 h-20 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
          <Mail className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-black mb-2">Enter OTP</h3>
        <p className="text-gray-600">
          We sent a 6-digit code to{" "}
          {userDetails && maskEmail(userDetails.email)}
        </p>
      </div>

      <div className="relative">
        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => handleOtpChange(e.target.value)}
          placeholder="000000"
          className="w-full px-4 py-4 text-center text-xl sm:text-2xl font-bold tracking-[0.5em] border-2 border-gray-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none transition-all bg-white text-black placeholder-gray-300"
          autoComplete="off"
          autoFocus
        />
      </div>

      <div className="text-center">
        {resendTimer > 0 ? (
          <p className="text-gray-500">
            Resend OTP in{" "}
            <span className="font-semibold text-black">{resendTimer}s</span>
          </p>
        ) : (
          <button
            onClick={resendOTP}
            disabled={loading}
            className="text-black hover:text-gray-700 font-medium underline underline-offset-4 disabled:opacity-50 transition-colors"
          >
            Resend OTP
          </button>
        )}
      </div>

      <button
        onClick={verifyOTP}
        disabled={loading || otp.length !== 6}
        className="w-full mt-6 bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-900 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Verify OTP
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </button>

      <button
        onClick={() => {
          setCurrentStep(1);
          setOtp("");
          setOtpSent(false);
          setResendTimer(0);
        }}
        className="w-full mt-3 text-gray-600 hover:text-black font-medium transition-colors"
      >
        &larr; Back to previous step
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="w-20 h-20 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
          <Lock className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-black mb-2">Set New PIN</h3>
        <p className="text-gray-600">Create a secure 6-digit PIN</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New PIN
        </label>
        <div className="relative group">
          <input
            type={showNewPin ? "text" : "password"}
            maxLength="6"
            value={newPin}
            onChange={(e) => handlePinChange(e.target.value, "new")}
            placeholder="••••••"
            className="w-full px-4 py-4 text-center text-xl sm:text-2xl font-bold tracking-[0.5em] border-2 border-gray-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none transition-all bg-white text-black placeholder-gray-400 group-hover:border-gray-400"
            autoComplete="off"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowNewPin(!showNewPin)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
          >
            {showNewPin ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm PIN
        </label>
        <div className="relative group">
          <input
            type={showConfirmPin ? "text" : "password"}
            maxLength="6"
            value={confirmPin}
            onChange={(e) => handlePinChange(e.target.value, "confirm")}
            placeholder="••••••"
            className="w-full px-4 py-4 text-center text-xl sm:text-2xl font-bold tracking-[0.5em] border-2 border-gray-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black/5 focus:outline-none transition-all bg-white text-black placeholder-gray-400 group-hover:border-gray-400"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPin(!showConfirmPin)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
          >
            {showConfirmPin ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {newPin.length === 6 &&
        confirmPin.length === 6 &&
        newPin !== confirmPin && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center text-yellow-700">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">PINs do not match</span>
          </div>
        )}

      <button
        onClick={resetPin}
        disabled={
          loading ||
          newPin.length !== 6 ||
          confirmPin.length !== 6 ||
          newPin !== confirmPin
        }
        className="w-full mt-6 bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-900 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
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

  const renderStep4 = () => (
    <div className="text-center">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 sm:p-10 border border-green-200">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-green-600" />
        </div>
        <h3 className="text-3xl font-bold text-black mb-3">Success!</h3>
        <p className="text-gray-600 mb-2">
          Your PIN has been successfully reset
        </p>
        <p className="text-sm text-gray-500 mb-8">
          You can now use your new PIN for transactions
        </p>

        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-gray-900 transform hover:-translate-y-0.5 transition-all inline-flex items-center"
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 sm:p-8 border border-gray-100 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full -translate-y-1/2 translate-x-1/2 z-0" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-gray-50 to-gray-100 rounded-full translate-y-1/2 -translate-x-1/2 z-0" />

        {/* Content wrapper with relative positioning */}
        <div className="relative z-10">
          {/* Dynamic header based on current step */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {currentStep === 1 && "Reset Your PIN"}
              {currentStep === 2 && "Verify OTP"}
              {currentStep === 3 && "Create New PIN"}
              {currentStep === 4 && "Success!"}
            </h2>
            <div className="mt-2 w-16 h-1 bg-black mx-auto rounded-full" />
          </div>

          {/* Error message */}
          {error && currentStep !== 1 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-700 animate-shake">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Step content with smooth transitions */}
          <div className="transition-all duration-300 ease-in-out transform">
            {currentStep === 1 && (
              <div className="animate-fadeIn">{renderStep1()}</div>
            )}
            {currentStep === 2 && (
              <div className="animate-fadeIn">{renderStep2()}</div>
            )}
            {currentStep === 3 && (
              <div className="animate-fadeIn">{renderStep3()}</div>
            )}
            {currentStep === 4 && (
              <div className="animate-fadeIn">{renderStep4()}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPinPage;
