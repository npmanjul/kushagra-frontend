"use client";
import MultiStepRegistration from "@/components/dashboard/MultiStepRegistration";
import useStore from "@/store/useStore";
import API_BASE_URL from "@/utils/constants";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    gender: "",
    password: "",
    confirmPassword: "",
    dob: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openMultiStepForm, setOpenMultiStepForm] = useState(false);
  const { getCurrentStep, setCurrStep, currStep } = useStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ""))) {
      newErrors.phone_number = "Please enter a valid 10-digit phone number";
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const password = formData.password;
      const validationErrors = [];

      if (password.length < 8) validationErrors.push("at least 8 characters");
      if (!/(?=.*[a-z])/.test(password))
        validationErrors.push("one lowercase letter");
      if (!/(?=.*[A-Z])/.test(password))
        validationErrors.push("one uppercase letter");
      if (!/(?=.*\d)/.test(password)) validationErrors.push("one number");
      if (!/(?=.*[@$!%*?&])/.test(password))
        validationErrors.push("one special character");

      if (validationErrors.length > 0) {
        newErrors.password = `Password must contain ${validationErrors.join(
          ", ",
        )}`;
      }
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Date of Birth validation
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 13) {
        newErrors.dob = "You must be at least 13 years old";
      } else if (age > 120) {
        newErrors.dob = "Please enter a valid date of birth";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await fetch(`${API_BASE_URL}/register/step1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.token);
          setCurrStep(data.step_completed);
          setOpenMultiStepForm(true);
        } else {
          toast.error(data.message || "Something went wrong");
          setErrors({ apiError: data.message || "Something went wrong" });
        }
      } catch (error) {
        console.error("Error creating account:", error);
        setErrors({ apiError: "Network error. Please try again." });
      }
    }
  };

  useEffect(() => {
    const fetchStep = async () => {
      try {
        const data = await getCurrentStep();

        if (data?.currentStep !== undefined) {
          setCurrStep(data.currentStep);

          if (data.currentStep < 6) {
            setOpenMultiStepForm(true);
          }
        }
      } catch (error) {
        console.error("Error fetching step:", error);
      }
    };

    fetchStep();
  }, []);

  return (
    <div>
      {openMultiStepForm ? (
        <MultiStepRegistration moveStep={currStep + 1} />
      ) : (
        <>
          <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              {/* Header */}
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-900 mb-1">
                  Create Account
                </h1>
                <p className="text-slate-500 text-sm">Join us today</p>
              </div>

              {/* Form Container */}
              <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 shadow-xl shadow-slate-900/5">
                <div className="space-y-6">
                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className={`w-full px-0 py-3 border-0 border-b-2 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 transition-all duration-300 ${
                          errors.name
                            ? "border-rose-400 focus:border-rose-500"
                            : "border-slate-200 focus:border-slate-900"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-rose-500 mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className={`w-full px-0 py-3 border-0 border-b-2 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 transition-all duration-300 ${
                          errors.email
                            ? "border-rose-400 focus:border-rose-500"
                            : "border-slate-200 focus:border-slate-900"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-rose-500 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Phone & Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Phone Number <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        className={`w-full px-0 py-3 border-0 border-b-2 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 transition-all duration-300 ${
                          errors.phone_number
                            ? "border-rose-400 focus:border-rose-500"
                            : "border-slate-200 focus:border-slate-900"
                        }`}
                      />
                      {errors.phone_number && (
                        <p className="text-xs text-rose-500 mt-1">
                          {errors.phone_number}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Gender <span className="text-rose-400">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`w-full px-0 py-3 border-0 border-b-2 bg-transparent text-slate-900 focus:outline-none focus:ring-0 transition-all duration-300 appearance-none cursor-pointer ${
                          errors.gender
                            ? "border-rose-400 focus:border-rose-500"
                            : "border-slate-200 focus:border-slate-900"
                        } ${
                          !formData.gender ? "text-slate-400" : "text-slate-900"
                        }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male" className="text-slate-900">
                          Male
                        </option>
                        <option value="female" className="text-slate-900">
                          Female
                        </option>
                        <option value="other" className="text-slate-900">
                          Other
                        </option>
                        <option
                          value="prefer-not-to-say"
                          className="text-slate-900"
                        >
                          Prefer not to say
                        </option>
                      </select>
                      {errors.gender && (
                        <p className="text-xs text-rose-500 mt-1">
                          {errors.gender}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Password & Confirm Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Password <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Create a strong password"
                          className={`w-full px-0 py-3 pr-10 border-0 border-b-2 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 transition-all duration-300 ${
                            errors.password
                              ? "border-rose-400 focus:border-rose-500"
                              : "border-slate-200 focus:border-slate-900"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 top-3 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                        >
                          {showPassword ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-rose-500 mt-1">
                          {errors.password}
                        </p>
                      )}
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2 space-y-1">
                          <div className="flex space-x-1">
                            <div
                              className={`h-1 w-1/4 rounded ${
                                formData.password.length >= 8
                                  ? "bg-green-400"
                                  : "bg-gray-200"
                              }`}
                            ></div>
                            <div
                              className={`h-1 w-1/4 rounded ${
                                /(?=.*[a-z])/.test(formData.password)
                                  ? "bg-green-400"
                                  : "bg-gray-200"
                              }`}
                            ></div>
                            <div
                              className={`h-1 w-1/4 rounded ${
                                /(?=.*[A-Z])/.test(formData.password)
                                  ? "bg-green-400"
                                  : "bg-gray-200"
                              }`}
                            ></div>
                            <div
                              className={`h-1 w-1/4 rounded ${
                                /(?=.*\d)/.test(formData.password) &&
                                /(?=.*[@$!%*?&])/.test(formData.password)
                                  ? "bg-green-400"
                                  : "bg-gray-200"
                              }`}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-500">
                            Password must contain: 8+ chars, uppercase,
                            lowercase, number, special char
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Confirm Password{" "}
                        <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          className={`w-full px-0 py-3 pr-10 border-0 border-b-2 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 transition-all duration-300 ${
                            errors.confirmPassword
                              ? "border-rose-400 focus:border-rose-500"
                              : "border-slate-200 focus:border-slate-900"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-0 top-3 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                        >
                          {showConfirmPassword ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-xs text-rose-500 mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                      {/* Password Match Indicator */}
                      {formData.confirmPassword && (
                        <div className="flex items-center mt-2">
                          {formData.password === formData.confirmPassword ? (
                            <div className="flex items-center text-green-600">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-xs">Passwords match</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-rose-500">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-xs">
                                Passwords don't match
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Date of Birth <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className={`w-full px-0 py-3 border-0 border-b-2 bg-transparent text-slate-900 focus:outline-none focus:ring-0 transition-all duration-300 cursor-pointer ${
                        errors.dob
                          ? "border-rose-400 focus:border-rose-500"
                          : "border-slate-200 focus:border-slate-900"
                      }`}
                    />
                    {errors.dob && (
                      <p className="text-xs text-rose-500 mt-1">{errors.dob}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="w-full bg-slate-900 text-white py-4 rounded-xl font-medium hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Create Account
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center pt-2">
                    <p className="text-slate-500 text-sm">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="text-slate-900 font-medium hover:underline transition-all duration-200"
                      >
                        Login
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
