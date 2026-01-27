"use client";
import { useState, useEffect, useRef } from "react";
import { Lock, CheckCircle2, Loader2, LogOut, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import API_BASE_URL from "@/utils/constants";
import { useRouter } from "next/navigation";

export default function PinModal({ isOpen, onClose }) {
  const [pin, setPin] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const inactivityTimer = useRef(null);
  const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

  // 🕒 Detect inactivity and reopen modal
  useEffect(() => {
    if (!isOpen) return;

    const resetTimer = () => {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        setPin("");
        setIsSuccess(false);
        setIsError(false);
        onClose?.();
      }, INACTIVITY_LIMIT);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    window.addEventListener("focus", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      window.removeEventListener("focus", resetTimer);
    };
  }, [isOpen, onClose]);

  // 🚫 Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSubmitPin = async () => {
    if (isSuccess || isLoading) return;

    if (pin.length !== 6) {
      toast.error("Please enter a 6-digit PIN");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/pinverification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
        toast.success("PIN verified successfully");
        setTimeout(() => {
          setIsSuccess(false);
          onClose?.();
        }, 500);
      } else {
        setIsError(true);
        toast.error("Incorrect PIN");
        setTimeout(() => {
          setPin("");
          setIsError(false);
        }, 800);
      }
    } catch (error) {
      console.error("Error verifying PIN:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/50 backdrop-blur-md">
      <div className="relative w-full max-w-lg px-6">
        <div className="bg-white backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/40">
          <div className="flex flex-col items-center">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-all duration-300 ${isSuccess
                ? "bg-green-50 ring-4 ring-green-100"
                : isError
                  ? "bg-red-50 ring-4 ring-red-100 animate-pulse"
                  : "bg-gray-50 ring-4 ring-gray-100"
                }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="text-green-600" size={48} />
              ) : isLoading ? (
                <Loader2 className="text-gray-700 animate-spin" size={48} />
              ) : (
                <Lock
                  className={`${isError ? "text-red-600" : "text-gray-700"
                    } transition-colors`}
                  size={48}
                />
              )}
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {isSuccess ? "Success!" : "Enter PIN"}
            </h2>
            <p className="text-gray-600 text-center mb-10 text-lg">
              {isSuccess
                ? "PIN verified successfully"
                : "Please enter your 6-digit PIN to continue"}
            </p>

            <div className="w-full">
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                disabled={isSuccess || isLoading}
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                autoFocus
                className={`w-full h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none tracking-widest ${isSuccess
                  ? "border-green-400 bg-green-50 text-green-700 shadow-sm"
                  : isError
                    ? "border-red-400 bg-red-50 text-red-700 animate-shake"
                    : pin
                      ? "border-gray-800 bg-gray-50 text-gray-900 shadow-md"
                      : "border-gray-300 bg-white text-gray-900 focus:border-gray-800 focus:shadow-md hover:border-gray-400"
                  }`}
              />
            </div>

            <button
              onClick={handleSubmitPin}
              disabled={isSuccess || isLoading}
              className="w-full py-3 mt-6 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify PIN"}
            </button>

            {isError && (
              <div className="mt-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">
                  Incorrect PIN. Please try again.
                </p>
              </div>
            )}

            <div className="flex w-full gap-3 mt-4">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  router.push("/login");
                }}
                className="flex-1 py-3 rounded-xl border-2 border-red-100 text-red-600 font-medium hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
              <button
                onClick={() => router.push("/resetpin")}
                className="flex-1 py-3 rounded-xl border-2 border-gray-100 text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Forgot PIN?
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
