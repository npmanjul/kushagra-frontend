"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
// Import all necessary icons from lucide-react
import {
  ChevronRight,
  User,
  MapPin,
  FileText,
  CreditCard,
  Users,
  Check,
  Upload,
  X,
  Camera,
  CircleCheck,
  Lock,
} from "lucide-react";
// Import constant for API base URL
import API_BASE_URL from "@/utils/constants";

// --- Configuration Constants ---

// Defines the steps of the multi-step form for rendering the indicator
const STEPS = [
  {
    id: 1,
    title: "Personal Info",
    icon: User,
    description: "Basic information",
  },
  { id: 2, title: "Address", icon: MapPin, description: "Location details" },
  {
    id: 3,
    title: "Identification",
    icon: FileText,
    description: "Documents & ID",
  },
  {
    id: 4,
    title: "Bank Details",
    icon: CreditCard,
    description: "Financial info",
  },
  { id: 5, title: "Nominee", icon: Users, description: "Emergency contact" },
  { id: 6, title: "Set PIN", icon: Lock, description: "6-digit security PIN" },
];

// Utility function to clamp a value within a min/max range
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Regex patterns for field validation
const PATTERN = {
  email: /\S+@\S+\.\S+/,
  phone10: /^\d{10}$/,
  pin6: /^\d{6}$/,
  aadhaar12: /^\d{12}$/,
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]$/i, // Indian PAN format
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/i, // Indian IFSC format
  account: /^\d{9,18}$/, // common bank account length range
};

// --- Shared Components ---

// Shared: Image preview component (memoized for performance)
const ImagePreview = React.memo(({ file, onRemove, label, error }) => (
  <div className="relative group">
    <div
      className={`relative w-full h-28 sm:h-32 rounded-xl overflow-hidden border-2 border-dashed transition-colors ${
        error
          ? "border-red-500 bg-red-50"
          : "border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 hover:border-blue-400"
      }`}
    >
      {file ? (
        // If a file preview URL exists, show the image and a remove button
        <>
          <img src={file} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={onRemove}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              aria-label={`Remove ${label}`}
            >
              <X size={16} />
            </button>
          </div>
        </>
      ) : (
        // If no file, show a camera icon and label as a placeholder
        <div className="flex flex-col items-center justify-center h-full text-gray-500 px-2">
          <Camera size={20} className="mb-1" />
          <span className="text-xs text-center">{label}</span>
        </div>
      )}
    </div>
    {error && (
      // Display validation error if present
      <p className="text-red-500 text-xs flex items-center mt-1">
        <X size={14} className="mr-1 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
));

// Shared: File upload wrapper component (memoized for performance)
const FileUpload = React.memo(
  ({ fieldName, label, onChange, preview, onRemove, error }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        {/* Hidden file input layered over the preview area */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e, fieldName)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <ImagePreview
          file={preview}
          onRemove={() => onRemove(fieldName)}
          label={`Upload ${label}`}
          error={error}
        />
      </div>
    </div>
  )
);

// Shared: Step indicator component (memoized for performance)
const StepIndicator = React.memo(({ currentStep, stepCompleted }) => (
  <div className="mb-6 sm:mb-12">
    <div className="flex items-center justify-start gap-3 sm:justify-between px-2 sm:px-0 overflow-x-auto py-2 flex-nowrap no-scrollbar">
      {STEPS.map((step) => {
        const isDone = stepCompleted >= step.id; // True if step has been successfully completed
        const isActive = currentStep === step.id; // True if this is the current step

        return (
          // ... (Styling logic for active, done, and pending steps)
          <div
            key={step.id}
            className="flex flex-col items-center relative min-w-[70px] sm:min-w-[100px] flex-shrink-0"
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                isDone
                  ? "bg-gradient-to-r from-green-400 to-green-600 border-green-500 text-white shadow-lg scale-110"
                  : isActive
                  ? "bg-gradient-to-r from-blue-400 to-blue-600 border-blue-500 text-white shadow-lg scale-110"
                  : "bg-white border-gray-300 text-gray-400 shadow-md"
              }`}
            >
              {isDone ? (
                <Check size={20} className="animate-pulse" />
              ) : (
                <step.icon size={20} />
              )}
            </div>

            <div className="text-center mt-2 sm:mt-3">
              <div
                className={`text-xs sm:text-sm md:text-base font-bold transition-colors ${
                  isDone || isActive ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step.title}
              </div>
              <div
                className={`text-[8px] sm:text-xs transition-colors hidden sm:block ${
                  isDone || isActive ? "text-blue-500" : "text-gray-400"
                }`}
              >
                {step.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
));

// --- Step Components (Steps 2-6) ---

// Component for Step 2: Address
const Step2Address = React.memo(({ formData, errors, handleInputChange }) => (
  // ... (JSX for Address fields: address, tehsil, district, state, pin_code, landmark)
  // Fields use formData, errors, and handleInputChange from props.
  <div className="space-y-4 sm:space-y-6">
    <div className="text-center mb-6 sm:mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
        Address Information
      </h2>
      <p className="text-gray-600 text-sm sm:text-base">
        Where can we reach you?
      </p>
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Full Address <span className="text-red-500">*</span>
      </label>
      <textarea
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        rows={3}
        className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all resize-none text-sm sm:text-base ${
          errors.address
            ? "border-red-500 bg-red-50"
            : "border-gray-200 bg-gray-50"
        }`}
        placeholder="Enter your complete address"
      />
      {errors.address && (
        <p className="text-red-500 text-xs sm:text-sm flex items-center">
          <X size={14} className="mr-1 flex-shrink-0" />
          {errors.address}
        </p>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Tehsil <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="tehsil"
          value={formData.tehsil}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
            errors.tehsil
              ? "border-red-500 bg-red-50"
              : "border-gray-200 bg-gray-50"
          }`}
          placeholder="Enter tehsil"
        />
        {errors.tehsil && (
          <p className="text-red-500 text-xs sm:text-sm flex items-center">
            <X size={14} className="mr-1 flex-shrink-0" />
            {errors.tehsil}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          District <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
            errors.district
              ? "border-red-500 bg-red-50"
              : "border-gray-200 bg-gray-50"
          }`}
          placeholder="Enter district"
        />
        {errors.district && (
          <p className="text-red-500 text-xs sm:text-sm flex items-center">
            <X size={14} className="mr-1 flex-shrink-0" />
            {errors.district}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          State <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
            errors.state
              ? "border-red-500 bg-red-50"
              : "border-gray-200 bg-gray-50"
          }`}
          placeholder="Enter state"
        />
        {errors.state && (
          <p className="text-red-500 text-xs sm:text-sm flex items-center">
            <X size={14} className="mr-1 flex-shrink-0" />
            {errors.state}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          PIN Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="pin_code"
          value={formData.pin_code}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
            errors.pin_code
              ? "border-red-500 bg-red-50"
              : "border-gray-200 bg-gray-50"
          }`}
          placeholder="123456"
          maxLength={6}
        />
        {errors.pin_code && (
          <p className="text-red-500 text-xs sm:text-sm flex items-center">
            <X size={14} className="mr-1 flex-shrink-0" />
            {errors.pin_code}
          </p>
        )}
      </div>
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Landmark <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="landmark"
        value={formData.landmark}
        onChange={handleInputChange}
        className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
          errors.landmark
            ? "border-red-500 bg-red-50"
            : "border-gray-200 bg-gray-50"
        }`}
        placeholder="Near any famous place"
      />
      {errors.landmark && (
        <p className="text-red-500 text-xs sm:text-sm flex items-center">
          <X size={14} className="mr-1 flex-shrink-0" />
          {errors.landmark}
        </p>
      )}
    </div>
  </div>
));

// Component for Step 3: Identification
const Step3Identification = React.memo(
  ({
    formData,
    errors,
    handleInputChange,
    handleFileChange,
    removeFile,
    previews,
    handleAddKhatauniEntry,
    handleRemoveKhatauniEntry,
    tempKhatauniImage,
    tempKhatauniPreview,
    handleTempKhatauniImage,
    removeTempKhatauniImage,
  }) => (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Farmer Identification
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Upload your identification documents
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Aadhaar Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="aadhaar_number"
            value={formData.aadhaar_number}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
              errors.aadhaar_number
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-gray-50"
            }`}
            placeholder="123456789012"
            maxLength={12}
          />
          {errors.aadhaar_number && (
            <p className="text-red-500 text-xs sm:text-sm flex items-center">
              <X size={14} className="mr-1 flex-shrink-0" />
              {errors.aadhaar_number}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            PAN Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pan_number"
            value={formData.pan_number}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
              errors.pan_number
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-gray-50"
            }`}
            placeholder="ABCDE1234F"
            maxLength={10}
          />
          {errors.pan_number && (
            <p className="text-red-500 text-xs sm:text-sm flex items-center">
              <X size={14} className="mr-1 flex-shrink-0" />
              {errors.pan_number}
            </p>
          )}
        </div>

        {/* Updated Khatauni ID Input with Image Upload */}
        <div className="space-y-2 sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700">
            Khatauni Entries (ID + Image) <span className="text-red-500">*</span>
          </label>

          {/* Input Section */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* ID Input */}
              <div>
                <input
                  type="text"
                  name="khatauni_id_input"
                  value={formData.khatauni_id_input || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base border-gray-200 bg-white"
                  placeholder="Enter Khatauni ID (e.g., KH123456)"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddKhatauniEntry();
                    }
                  }}
                />
              </div>

              {/* Image Upload */}
              <div>
                {!tempKhatauniImage ? (
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleTempKhatauniImage}
                      className="hidden"
                    />
                    <div className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-dashed border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-800">
                      <Upload size={16} />
                      <span>Upload Khatauni Image</span>
                    </div>
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={tempKhatauniPreview}
                      alt="Khatauni preview"
                      className="w-full h-12 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={removeTempKhatauniImage}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Add Button */}
            <button
              type="button"
              onClick={handleAddKhatauniEntry}
              disabled={!formData.khatauni_id_input || !tempKhatauniImage}
              className={`w-full px-4 py-2 sm:px-6 sm:py-3 font-semibold rounded-xl transition-all shadow-md text-sm sm:text-base flex items-center justify-center gap-2 ${
                !formData.khatauni_id_input || !tempKhatauniImage
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg active:scale-95"
              }`}
            >
              <span>Add Khatauni Entry</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Display added Khatauni entries */}
          {formData.khatauni_entries && formData.khatauni_entries.length > 0 && (
            <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs sm:text-sm text-gray-700 font-semibold flex items-center gap-2">
                  <FileText size={16} className="text-purple-600" />
                  Added Khatauni Entries ({formData.khatauni_entries.length})
                </p>
              </div>
              <div className="space-y-2">
                {formData.khatauni_entries.map((entry, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-3 p-3 bg-white border-2 border-purple-300 rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Preview Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={entry.preview}
                        alt={`Khatauni ${entry.id}`}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                    
                    {/* ID */}
                    <div className="flex-1">
                      <span className="font-medium text-gray-800 text-sm sm:text-base">
                        ID: {entry.id}
                      </span>
                      <p className="text-xs text-gray-500">
                        Image uploaded
                      </p>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveKhatauniEntry(index)}
                      className="p-2 hover:bg-red-100 rounded-full transition-colors group-hover:scale-110"
                      aria-label={`Remove ${entry.id}`}
                      title={`Remove ${entry.id}`}
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.khatauni_entries && (
            <p className="text-red-500 text-xs sm:text-sm flex items-center mt-2">
              <X size={14} className="mr-1 flex-shrink-0" />
              {errors.khatauni_entries}
            </p>
          )}

          {/* Helper Text */}
          {formData.khatauni_entries.length === 0 && !errors.khatauni_entries && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Add Khatauni ID with its corresponding image. You can add multiple entries.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Land Size (acres) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="land_size"
            value={formData.land_size}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
              errors.land_size
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-gray-50"
            }`}
            placeholder="0.0"
            min="0"
            step="0.1"
          />
          {errors.land_size && (
            <p className="text-red-500 text-xs sm:text-sm flex items-center">
              <X size={14} className="mr-1 flex-shrink-0" />
              {errors.land_size}
            </p>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 rounded-2xl border border-blue-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Upload className="mr-2" size={18} />
          Other Document Uploads (All Required)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <FileUpload
            fieldName="userImage"
            label="Your Photo"
            onChange={handleFileChange}
            preview={previews.userImage}
            onRemove={removeFile}
            error={errors.userImage}
          />
          <FileUpload
            fieldName="aadhaarImg"
            label="Aadhaar Image"
            onChange={handleFileChange}
            preview={previews.aadhaarImg}
            onRemove={removeFile}
            error={errors.aadhaarImg}
          />
          <FileUpload
            fieldName="panImg"
            label="PAN Image"
            onChange={handleFileChange}
            preview={previews.panImg}
            onRemove={removeFile}
            error={errors.panImg}
          />
        </div>
      </div>
    </div>
  )
);

// Component for Step 4: Bank Details
const Step4BankDetails = React.memo(
  ({
    formData,
    errors,
    handleInputChange,
    handleFileChange,
    removeFile,
    previews,
  }) => (
    // ... (JSX for account_number, ifsc_code, account_holder, bank_name, branch_name inputs and bank_passbook_img upload)
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Bank Details
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Secure banking information for transactions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Account Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="account_number"
            value={formData.account_number}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
              errors.account_number
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-gray-50"
            }`}
            placeholder="1234567890123456"
          />
          {errors.account_number && (
            <p className="text-red-500 text-xs sm:text-sm flex items-center">
              <X size={14} className="mr-1 flex-shrink-0" />
              {errors.account_number}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            IFSC Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ifsc_code"
            value={formData.ifsc_code}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
              errors.ifsc_code
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-gray-50"
            }`}
            placeholder="SBIN0001234"
          />
          {errors.ifsc_code && (
            <p className="text-red-500 text-xs sm:text-sm flex items-center">
              <X size={14} className="mr-1 flex-shrink-0" />
              {errors.ifsc_code}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Account Holder Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="account_holder"
            value={formData.account_holder}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
              errors.account_holder
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-gray-50"
            }`}
            placeholder="As per bank records"
          />
          {errors.account_holder && (
            <p className="text-red-500 text-xs sm:text-sm flex items-center">
              <X size={14} className="mr-1 flex-shrink-0" />
              {errors.account_holder}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Bank Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
              errors.bank_name
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-gray-50"
            }`}
            placeholder="State Bank of India"
          />
          {errors.bank_name && (
            <p className="text-red-500 text-xs sm:text-sm flex items-center">
              <X size={14} className="mr-1 flex-shrink-0" />
              {errors.bank_name}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Branch Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="branch_name"
          value={formData.branch_name}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
            errors.branch_name
              ? "border-red-500 bg-red-50"
              : "border-gray-200 bg-gray-50"
          }`}
          placeholder="Branch location"
        />
        {errors.branch_name && (
          <p className="text-red-500 text-xs sm:text-sm flex items-center">
            <X size={14} className="mr-1 flex-shrink-0" />
            {errors.branch_name}
          </p>
        )}
      </div>

      <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-6 rounded-2xl border border-green-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Upload className="mr-2" size={18} />
          Bank Document (Required)
        </h3>
        <div className="max-w-sm mx-auto sm:mx-0">
          <FileUpload
            fieldName="bank_passbook_img"
            label="Bank Passbook/Statement"
            onChange={handleFileChange}
            preview={previews.bank_passbook_img}
            onRemove={removeFile}
            error={errors.bank_passbook_img}
          />
        </div>
      </div>
    </div>
  )
);

// Component for Step 5: Nominee
const Step5Nominee = React.memo(
  ({
    formData,
    errors,
    handleInputChange,
    handleFileChange,
    removeFile,
    previews,
  }) => {
    const today = new Date().toISOString().split("T")[0]; // Used to set max date for DOB input

    return (
      // ... (JSX for all nominee fields and file uploads)
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Nominee Information
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Emergency contact and beneficiary details
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Nominee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nominee_name"
              value={formData.nominee_name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
                errors.nominee_name
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
              placeholder="Nominee full name"
            />
            {errors.nominee_name && (
              <p className="text-red-500 text-xs sm:text-sm flex items-center">
                <X size={14} className="mr-1 flex-shrink-0" />
                {errors.nominee_name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Nominee Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="nominee_dob"
              value={formData.nominee_dob}
              onChange={handleInputChange}
              max={today}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
                errors.nominee_dob
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            />
            {errors.nominee_dob && (
              <p className="text-red-500 text-xs sm:text-sm flex items-center">
                <X size={14} className="mr-1 flex-shrink-0" />
                {errors.nominee_dob}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Nominee Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="nominee_phone"
              value={formData.nominee_phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
                errors.nominee_phone
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
              placeholder="9876543210"
              maxLength={10}
            />
            {errors.nominee_phone && (
              <p className="text-red-500 text-xs sm:text-sm flex items-center">
                <X size={14} className="mr-1 flex-shrink-0" />
                {errors.nominee_phone}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Nominee Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="nominee_email"
              value={formData.nominee_email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
                errors.nominee_email
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
              placeholder="nominee@example.com"
            />
            {errors.nominee_email && (
              <p className="text-red-500 text-xs sm:text-sm flex items-center">
                <X size={14} className="mr-1 flex-shrink-0" />
                {errors.nominee_email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Nominee Aadhaar <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nominee_aadhaar"
              value={formData.nominee_aadhaar}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
                errors.nominee_aadhaar
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
              placeholder="123456789012"
              maxLength={12}
            />
            {errors.nominee_aadhaar && (
              <p className="text-red-500 text-xs sm:text-sm flex items-center">
                <X size={14} className="mr-1 flex-shrink-0" />
                {errors.nominee_aadhaar}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Nominee PAN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nominee_pan"
              value={formData.nominee_pan}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
                errors.nominee_pan
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
              placeholder="ABCDE1234F"
              maxLength={10}
            />
            {errors.nominee_pan && (
              <p className="text-red-500 text-xs sm:text-sm flex items-center">
                <X size={14} className="mr-1 flex-shrink-0" />
                {errors.nominee_pan}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Relation <span className="text-red-500">*</span>
            </label>
            <select
              name="nominee_relation"
              value={formData.nominee_relation}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
                errors.nominee_relation
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <option value="">Select Relation</option>
              <option value="spouse">Spouse</option>
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="son">Son</option>
              <option value="daughter">Daughter</option>
              <option value="brother">Brother</option>
              <option value="sister">Sister</option>
              <option value="other">Other</option>
            </select>
            {errors.nominee_relation && (
              <p className="text-red-500 text-xs sm:text-sm flex items-center">
                <X size={14} className="mr-1 flex-shrink-0" />
                {errors.nominee_relation}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Nominee Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="nominee_gender"
              value={formData.nominee_gender}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
                errors.nominee_gender
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.nominee_gender && (
              <p className="text-red-500 text-xs sm:text-sm flex items-center">
                <X size={14} className="mr-1 flex-shrink-0" />
                {errors.nominee_gender}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Nominee Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="nominee_address"
            value={formData.nominee_address}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all resize-none text-sm sm:text-base ${
              errors.nominee_address
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-gray-50"
            }`}
            placeholder="Nominee complete address"
          />
          {errors.nominee_address && (
            <p className="text-red-500 text-xs sm:text-sm flex items-center">
              <X size={14} className="mr-1 flex-shrink-0" />
              {errors.nominee_address}
            </p>
          )}
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-2xl border border-purple-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Upload className="mr-2" size={18} />
            Nominee Documents (All Required)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <FileUpload
              fieldName="nominee_image"
              label="Nominee Photo"
              onChange={handleFileChange}
              preview={previews.nominee_image}
              onRemove={removeFile}
              error={errors.nominee_image}
            />
            <FileUpload
              fieldName="nominee_aadhaar_image"
              label="Nominee Aadhaar"
              onChange={handleFileChange}
              preview={previews.nominee_aadhaar_image}
              onRemove={removeFile}
              error={errors.nominee_aadhaar_image}
            />
            <FileUpload
              fieldName="nominee_pan_image"
              label="Nominee PAN"
              onChange={handleFileChange}
              preview={previews.nominee_pan_image}
              onRemove={removeFile}
              error={errors.nominee_pan_image}
            />
          </div>
        </div>
      </div>
    );
  }
);

// Component for Step 6: Create PIN
const Step6CreatePin = React.memo(({ formData, errors, handleInputChange }) => (
  // ... (JSX for account_pin and confirm_account_pin inputs)
  <div className="space-y-6 sm:space-y-8">
    <div className="text-center mb-6 sm:mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
        Create Your 6-Digit PIN
      </h2>
      <p className="text-gray-600 text-sm sm:text-base">
        This PIN will be used to authorize sensitive actions. Keep it
        confidential.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Enter PIN <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          name="account_pin"
          value={formData.account_pin}
          onChange={handleInputChange}
          inputMode="numeric"
          autoComplete="new-password"
          maxLength={6}
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
            errors.account_pin
              ? "border-red-500 bg-red-50"
              : "border-gray-200 bg-gray-50"
          }`}
          placeholder="••••••"
        />
        {errors.account_pin && (
          <p className="text-red-500 text-xs sm:text-sm flex items-center">
            <X size={14} className="mr-1 flex-shrink-0" />
            {errors.account_pin}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Confirm PIN <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          name="confirm_account_pin"
          value={formData.confirm_account_pin}
          onChange={handleInputChange}
          inputMode="numeric"
          autoComplete="new-password"
          maxLength={6}
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-sm sm:text-base ${
            errors.confirm_account_pin
              ? "border-red-500 bg-red-50"
              : "border-gray-200 bg-gray-50"
          }`}
          placeholder="••••••"
        />
        {errors.confirm_account_pin && (
          <p className="text-red-500 text-xs sm:text-sm flex items-center">
            <X size={14} className="mr-1 flex-shrink-0" />
            {errors.confirm_account_pin}
          </p>
        )}
      </div>
    </div>

    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 sm:p-4 text-amber-800 text-xs sm:text-sm">
      <strong>Security Tips:</strong>
      <ul className="mt-2 space-y-1 list-disc list-inside">
        <li>
          Use a PIN that's easy for you to remember but hard for others to guess
        </li>
        <li>Avoid obvious patterns like 123456 or your birthdate</li>
        <li>Never share your PIN with anyone</li>
      </ul>
    </div>
  </div>
));

// --- Main Component ---

const MultiStepRegistration = ({ moveStep }) => {
  // Utility function to determine the initial step based on prop (e.g., from server state)
  const getInitialStep = () => {
    if (typeof moveStep === "number" && moveStep >= 1) {
      // If moveStep is 1, the user completed step 1, so they are on step 2.
      return moveStep === 1 ? 2 : clamp(moveStep, 2, STEPS.length + 1);
    }
    return 2; // Default starting step is 2, assuming Step 1 (Personal Info) is handled elsewhere/is the entry point.
  };

  // Utility function to determine the steps completed
  const getInitialCompleted = () => {
    if (typeof moveStep === "number" && moveStep >= 1) {
      // If moveStep is 2, steps 1 is completed. Completed is current step - 1.
      return clamp(moveStep - 1, 1, STEPS.length);
    }
    return 1; // Default: step 1 is completed
  };

  // State for tracking form progression
  const [currentStep, setCurrentStep] = useState(getInitialStep());
  const [stepCompleted, setStepCompleted] = useState(getInitialCompleted());

  // State for UI/API interaction
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); // Initial loading state from prop sync
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [globalError, setGlobalError] = useState(""); // For API errors

  // Form data state (includes all fields from all steps)
  const [formData, setFormData] = useState({
    // Step 1 (kept for shape, but unused in this component's JSX, assumed to be loaded/pre-filled)
    name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",

    // Step 2
    address: "",
    tehsil: "",
    district: "",
    state: "",
    landmark: "",
    pin_code: "",

    // Step 3 - Modified for multiple Khatauni entries
    aadhaar_number: "",
    pan_number: "",
    khatauni_entries: [], // Array of objects: { id: string, image: File, preview: string }
    khatauni_id_input: "", // Temporary input field for ID
    land_size: "",

    // Step 4
    account_number: "",
    ifsc_code: "",
    account_holder: "",
    bank_name: "",
    branch_name: "",

    // Step 5
    nominee_name: "",
    nominee_dob: "",
    nominee_phone: "",
    nominee_email: "",
    nominee_aadhaar: "",
    nominee_pan: "",
    nominee_relation: "",
    nominee_gender: "",
    nominee_address: "",

    // Step 6
    account_pin: "",
    confirm_account_pin: "",
  });

  // Files state (File objects)
  const [files, setFiles] = useState({
    userImage: null,
    aadhaarImg: null,
    panImg: null,
    bank_passbook_img: null,
    nominee_image: null,
    nominee_aadhaar_image: null,
    nominee_pan_image: null,
  });
  const [tempKhatauniImage, setTempKhatauniImage] = useState(null);
  const [tempKhatauniPreview, setTempKhatauniPreview] = useState(null);
  const [previews, setPreviews] = useState({});
  // Validation errors state
  const [errors, setErrors] = useState({});

  // --- Handlers ---

  // Input change handler with sanitization logic (memoized)
  const handleInputChange = useCallback(
    (e) => {
      const { name } = e.target;
      let value = e.target.value;

      // Sanitization functions
      const digitOnly = (s) => s.replace(/\D+/g, "");
      const uppercase = (s) => s.toUpperCase();

      // Fields requiring special sanitization
      const numericOnlyFields = [
        "phone_number",
        "nominee_phone",
        "pin_code",
        "aadhaar_number",
        "nominee_aadhaar",
        "account_number",
        "account_pin",
        "confirm_account_pin",
      ];
      const uppercaseFields = ["pan_number", "nominee_pan", "ifsc_code"];

      if (numericOnlyFields.includes(name)) value = digitOnly(value);
      if (uppercaseFields.includes(name)) value = uppercase(value);

      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear validation error and global error on input change
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
      if (globalError) setGlobalError("");
    },
    [errors, globalError]
  );

  // File change handler (memoized)
  const handleFileChange = useCallback(
    (e, fieldName) => {
      const file = e.target.files?.[0];
      if (file) {
        setFiles((prev) => ({ ...prev, [fieldName]: file }));

        setPreviews((prev) => {
          // Revoke old URL to prevent memory leaks
          const prevURL = prev[fieldName];
          if (prevURL) URL.revokeObjectURL(prevURL);
          // Create new preview URL
          return { ...prev, [fieldName]: URL.createObjectURL(file) };
        });
      }
      // Essential for allowing re-upload of the same file
      if (e?.target) e.target.value = "";

      // Clear related errors
      if (errors[fieldName])
        setErrors((prev) => ({ ...prev, [fieldName]: "" }));
      if (globalError) setGlobalError("");
    },
    [errors, globalError]
  );

  // File removal handler (memoized)
  const removeFile = useCallback(
    (fieldName) => {
      setFiles((prev) => ({ ...prev, [fieldName]: null }));
      setPreviews((prev) => {
        // Revoke the Object URL
        const url = prev[fieldName];
        if (url) URL.revokeObjectURL(url);
        return { ...prev, [fieldName]: null };
      });
      // Clear related errors
      if (errors[fieldName])
        setErrors((prev) => ({ ...prev, [fieldName]: "" }));
      if (globalError) setGlobalError("");
    },
    [errors, globalError]
  );

  // Effect to clean up all generated Object URLs on unmount
  useEffect(() => {
    return () => {
      // Clean up all preview URLs
      Object.values(previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      
      // Clean up Khatauni entry previews
      formData.khatauni_entries.forEach((entry) => {
        if (entry.preview) URL.revokeObjectURL(entry.preview);
      });
      
      // Clean up temporary Khatauni preview
      if (tempKhatauniPreview) URL.revokeObjectURL(tempKhatauniPreview);
    };
  }, [previews, formData.khatauni_entries, tempKhatauniPreview]); // Depends on `previews` state

  // --- Validation and Submission Logic ---

  // Client-side validation function (memoized)
  const validateStep = useCallback(
    (step) => {
      const newErrors = {};

      switch (step) {
        case 2: {
          // Validation for Step 2: Address
          if (!formData.address?.trim())
            newErrors.address = "Address is required.";
          if (!formData.tehsil?.trim())
            newErrors.tehsil = "Tehsil is required.";
          if (!formData.district?.trim())
            newErrors.district = "District is required.";
          if (!formData.state?.trim()) newErrors.state = "State is required.";
          if (!formData.pin_code?.trim())
            newErrors.pin_code = "PIN code is required.";
          else if (!PATTERN.pin6.test(formData.pin_code))
            newErrors.pin_code = "PIN code must be 6 digits.";
          if (!formData.landmark?.trim())
            newErrors.landmark = "Landmark is required.";
          break;
        }

        case 3: {
          // Validation for Step 3: Identification
          if (!formData.aadhaar_number?.trim())
            newErrors.aadhaar_number = "Aadhaar number is required.";
          else if (!PATTERN.aadhaar12.test(formData.aadhaar_number))
            newErrors.aadhaar_number = "Aadhaar must be 12 digits.";

          if (!formData.pan_number?.trim())
            newErrors.pan_number = "PAN number is required.";
          else if (!PATTERN.pan.test(formData.pan_number))
            newErrors.pan_number = "Invalid PAN format (e.g., ABCDE1234F).";

          // Updated Khatauni validation for array of entries
          if (!formData.khatauni_entries || formData.khatauni_entries.length === 0)
            newErrors.khatauni_entries = "At least one Khatauni entry (ID + Image) is required.";

          const land = parseFloat(formData.land_size);
          if (
            !formData.land_size?.toString().trim() ||
            !isFinite(land) ||
            land <= 0
          ) {
            newErrors.land_size = "Land size must be greater than 0.";
          }

          // File validations - removed khatauniImg check
          if (!files.userImage) newErrors.userImage = "Your photo is required.";
          if (!files.aadhaarImg)
            newErrors.aadhaarImg = "Aadhaar image is required.";
          if (!files.panImg) newErrors.panImg = "PAN image is required.";
          break;
        }

        case 4: {
          // Validation for Step 4: Bank Details
          if (!formData.account_number?.trim())
            newErrors.account_number = "Account number is required.";
          else if (!PATTERN.account.test(formData.account_number))
            newErrors.account_number = "Account number must be 9 to 18 digits.";

          if (!formData.ifsc_code?.trim())
            newErrors.ifsc_code = "IFSC code is required.";
          else if (!PATTERN.ifsc.test(formData.ifsc_code))
            newErrors.ifsc_code = "Invalid IFSC format (e.g., SBIN0001234).";

          if (!formData.account_holder?.trim())
            newErrors.account_holder = "Account holder name is required.";
          if (!formData.bank_name?.trim())
            newErrors.bank_name = "Bank name is required.";
          if (!formData.branch_name?.trim())
            newErrors.branch_name = "Branch name is required.";
          if (!files.bank_passbook_img)
            newErrors.bank_passbook_img = "Bank passbook image is required.";
          break;
        }

        case 5: {
          // Validation for Step 5: Nominee
          if (!formData.nominee_name?.trim())
            newErrors.nominee_name = "Nominee name is required.";
          if (!formData.nominee_dob)
            newErrors.nominee_dob = "Nominee date of birth is required.";
          else {
            const todayStr = new Date().toISOString().split("T")[0];
            if (formData.nominee_dob > todayStr) {
              newErrors.nominee_dob = "Nominee DOB cannot be in the future.";
            }
          }

          if (!formData.nominee_phone?.trim())
            newErrors.nominee_phone = "Nominee phone is required.";
          else if (!PATTERN.phone10.test(formData.nominee_phone))
            newErrors.nominee_phone = "Nominee phone must be 10 digits.";

          if (!formData.nominee_email?.trim())
            newErrors.nominee_email = "Nominee email is required.";
          else if (!PATTERN.email.test(formData.nominee_email))
            newErrors.nominee_email = "Invalid nominee email format.";

          if (!formData.nominee_aadhaar?.trim())
            newErrors.nominee_aadhaar = "Nominee Aadhaar is required.";
          else if (!PATTERN.aadhaar12.test(formData.nominee_aadhaar))
            newErrors.nominee_aadhaar = "Nominee Aadhaar must be 12 digits.";

          if (!formData.nominee_pan?.trim())
            newErrors.nominee_pan = "Nominee PAN is required.";
          else if (!PATTERN.pan.test(formData.nominee_pan))
            newErrors.nominee_pan = "Invalid nominee PAN format.";

          if (!formData.nominee_relation?.trim())
            newErrors.nominee_relation = "Relation is required.";
          if (!formData.nominee_gender?.trim())
            newErrors.nominee_gender = "Nominee gender is required.";
          if (!formData.nominee_address?.trim())
            newErrors.nominee_address = "Nominee address is required.";

          // Nominee file validations
          if (!files.nominee_image)
            newErrors.nominee_image = "Nominee photo is required.";
          if (!files.nominee_aadhaar_image)
            newErrors.nominee_aadhaar_image =
              "Nominee Aadhaar image is required.";
          if (!files.nominee_pan_image)
            newErrors.nominee_pan_image = "Nominee PAN image is required.";
          break;
        }

        case 6: {
          // Validation for Step 6: Set PIN
          if (!formData.account_pin?.trim())
            newErrors.account_pin = "PIN is required.";
          else if (!PATTERN.pin6.test(formData.account_pin))
            newErrors.account_pin = "PIN must be exactly 6 digits.";

          if (!formData.confirm_account_pin?.trim())
            newErrors.confirm_account_pin = "Please confirm your PIN.";
          else if (formData.confirm_account_pin !== formData.account_pin)
            newErrors.confirm_account_pin = "PINs do not match.";
          break;
        }

        default:
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData, files]
  );

  // API submission logic for a single step (memoized)
  const submitStep = useCallback(
    async (step) => {
      // 1. Client-side validation check
      if (!validateStep(step)) return false;

      setIsLoading(true);
      setGlobalError("");
      try {
        let endpoint = "";
        let data;
        let options = {};
        const isFileUploadStep = [3, 4, 5].includes(step);

        // Logic to prepare payload for each step
        switch (step) {
          case 2: {
            endpoint = `${API_BASE_URL}/register/step2`;
            const payload = {
              address: formData.address,
              tehsil: formData.tehsil,
              district: formData.district,
              state: formData.state,
              landmark: formData.landmark,
              pin_code: formData.pin_code,
            };
            options = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Authentication token
              },
              body: JSON.stringify(payload),
            };
            break;
          }

          case 3: {
            endpoint = `${API_BASE_URL}/register/step3`;
            const formDataToSend = new FormData();

            // Append form fields
            formDataToSend.append("aadhaar_number", formData.aadhaar_number);
            formDataToSend.append("pan_number", formData.pan_number);
            formDataToSend.append("land_size", formData.land_size);

            // Append khatauni entries (IDs and images as parallel arrays)
            if (Array.isArray(formData.khatauni_entries) && formData.khatauni_entries.length) {
              formData.khatauni_entries.forEach((entry, index) => {
                // Append ID
                formDataToSend.append(`khatauni_ids[]`, entry.id);
                // Append corresponding image with index to maintain order
                formDataToSend.append(`khatauni_images[]`, entry.image, `khatauni_${entry.id}_${index}.jpg`);
              });
              
              // Also send count for backend validation
              formDataToSend.append("khatauni_count", formData.khatauni_entries.length.toString());
            }

            // Append other files
            if (files.userImage)
              formDataToSend.append("userImage", files.userImage);
            if (files.aadhaarImg)
              formDataToSend.append("aadhaarImg", files.aadhaarImg);
            if (files.panImg) 
              formDataToSend.append("panImg", files.panImg);

            options = {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                // NOTE: do NOT set Content-Type here — browser will set multipart/form-data boundary.
              },
              body: formDataToSend,
            };
            break;
          }

          case 4: {
            endpoint = `${API_BASE_URL}/register/step4`;
            const formDataToSend = new FormData();
            // Append form fields
            formDataToSend.append("account_number", formData.account_number);
            formDataToSend.append("ifsc_code", formData.ifsc_code);
            formDataToSend.append("account_holder", formData.account_holder);
            formDataToSend.append("bank_name", formData.bank_name);
            formDataToSend.append("branch_name", formData.branch_name);
            // Append file
            if (files.bank_passbook_img)
              formDataToSend.append(
                "bank_passbook_img",
                files.bank_passbook_img
              );

            options = {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: formDataToSend,
            };
            break;
          }

          case 5: {
            endpoint = `${API_BASE_URL}/register/step5`;
            const formDataToSend = new FormData();
            // Append nominee form fields
            Object.keys(formData).forEach((key) => {
              if (key.startsWith("nominee_"))
                formDataToSend.append(key, formData[key]);
            });
            // Append nominee files
            if (files.nominee_image)
              formDataToSend.append("nominee_image", files.nominee_image);
            if (files.nominee_aadhaar_image)
              formDataToSend.append(
                "nominee_aadhaar_image",
                files.nominee_aadhaar_image
              );
            if (files.nominee_pan_image)
              formDataToSend.append(
                "nominee_pan_image",
                files.nominee_pan_image
              );

            options = {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: formDataToSend,
            };
            break;
          }

          case 6: {
            endpoint = `${API_BASE_URL}/register/step6`;
            options = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ account_pin: formData.account_pin }),
            };
            break;
          }

          default:
            return false;
        }

        // 2. Perform API call
        const res = await fetch(endpoint, options);
        data = await res.json().catch(() => null); // Safely parse JSON

        // 3. Handle API response
        if (!res.ok) {
          throw new Error(data?.message || `Step ${step} failed.`);
        }

        // Update stepCompleted state based on server response (or default to current step)
        const completed = clamp(
          Number(data?.step_completed ?? step), // Use server's completed step, default to current step on success
          0,
          STEPS.length
        );
        setStepCompleted(completed);

        // Logic for final step completion
        if (step === 5) {
          // Special handling for step 5, which moves to 6 if not fully completed, or to success screen if done.
          if (completed >= STEPS.length) {
            setCurrentStep(STEPS.length + 1);
            setShowSuccessMessage(true);
          } else {
            setCurrentStep(6);
          }
        } else if (step === 6 && completed >= STEPS.length) {
          // Final completion logic for step 6
          setShowSuccessMessage(true);
          setCurrentStep(STEPS.length + 1);
        } else if (step !== STEPS.length) {
          // For steps 2-4, only update completed state, let handleNext move the currentStep
        }

        // Persist completion status locally for app-wide state management
        if (completed > 0) {
          localStorage.setItem("registrationStepCompleted", completed);
        }

        return true; // Success
      } catch (error) {
        console.error(`Step ${step} Error:`, error);
        setGlobalError(
          error.message || "Something went wrong. Please try again."
        );
        return false; // Failure
      } finally {
        setIsLoading(false);
      }
    },
    [formData, files, validateStep] // Dependencies for useCallback
  );

  const handleAddKhatauniEntry = useCallback(() => {
    const currentInput = formData.khatauni_id_input?.trim();

    if (!currentInput) {
      setErrors((prev) => ({
        ...prev,
        khatauni_entries: "Please enter a Khatauni ID before adding.",
      }));
      return;
    }

    if (!tempKhatauniImage) {
      setErrors((prev) => ({
        ...prev,
        khatauni_entries: "Please upload Khatauni image before adding.",
      }));
      return;
    }

    // Normalize: uppercase
    const normalizedId = currentInput.toUpperCase();

    // Check for duplicates
    const isDuplicate = formData.khatauni_entries.some(
      entry => entry.id === normalizedId
    );
    
    if (isDuplicate) {
      setErrors((prev) => ({
        ...prev,
        khatauni_entries: "This Khatauni ID is already added.",
      }));
      return;
    }

    // Create new entry with ID and image
    const newEntry = {
      id: normalizedId,
      image: tempKhatauniImage,
      preview: tempKhatauniPreview
    };

    // Add the new entry to the array
    setFormData((prev) => ({
      ...prev,
      khatauni_entries: [...prev.khatauni_entries, newEntry],
      khatauni_id_input: "", // Clear the input field
    }));

    // Clear temporary image and preview
    setTempKhatauniImage(null);
    setTempKhatauniPreview(null);

    // Clear errors
    setErrors((prev) => ({ ...prev, khatauni_entries: "" }));
    if (globalError) setGlobalError("");
  }, [formData.khatauni_entries, formData.khatauni_id_input, tempKhatauniImage, tempKhatauniPreview, globalError]);

  const handleRemoveKhatauniEntry = useCallback(
    (index) => {
      setFormData((prev) => {
        const entryToRemove = prev.khatauni_entries[index];
        // Revoke the preview URL to prevent memory leaks
        if (entryToRemove?.preview) {
          URL.revokeObjectURL(entryToRemove.preview);
        }
        
        const updatedEntries = prev.khatauni_entries.filter((_, i) => i !== index);
        return { ...prev, khatauni_entries: updatedEntries };
      });

      // Clear errors
      setErrors((prev) => ({ ...prev, khatauni_entries: "" }));
      if (globalError) setGlobalError("");
    },
    [globalError]
  );

  const handleTempKhatauniImage = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        if (tempKhatauniPreview) URL.revokeObjectURL(tempKhatauniPreview);
        setTempKhatauniImage(file);
        setTempKhatauniPreview(URL.createObjectURL(file));
        if (errors.khatauni_entries) {
          setErrors((prev) => ({ ...prev, khatauni_entries: "" }));
        }
      }
      if (e?.target) e.target.value = "";
    },
    [tempKhatauniPreview, errors.khatauni_entries]
  );

  const removeTempKhatauniImage = useCallback(() => {
    if (tempKhatauniPreview) URL.revokeObjectURL(tempKhatauniPreview);
    setTempKhatauniImage(null);
    setTempKhatauniPreview(null);
  }, [tempKhatauniPreview]);

  const handleNext = useCallback(async () => {
    if (isLoading) return;
    const success = await submitStep(currentStep);
    if (success && currentStep < 5) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  }, [currentStep, submitStep, isLoading]);

  const handleFinish = useCallback(async () => {
    if (isLoading) return;
    await submitStep(6);
  }, [submitStep, isLoading]);

  // Effect to synchronize component state with the `moveStep` prop on mount/update
  useEffect(() => {
    if (typeof moveStep === "number" && moveStep >= 1) {
      if (moveStep > STEPS.length) {
        // All steps completed (e.g., moveStep = 7)
        setStepCompleted(STEPS.length);
        setCurrentStep(STEPS.length + 1); // Point to success screen
        setShowSuccessMessage(true);
      } else if (moveStep === 1) {
        // Step 1 done, start at Step 2
        setStepCompleted(1);
        setCurrentStep(2);
        setShowSuccessMessage(false);
      } else {
        // Steps 2-6: start at moveStep, previous step is completed
        setStepCompleted(moveStep - 1);
        setCurrentStep(moveStep);
        setShowSuccessMessage(false);
      }
    }

    setIsLoading(false);
    setIsInitializing(false); // Done initializing after checking prop
  }, [moveStep]);

  // Renders the current step component
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
      case 2:
        return (
          <Step2Address
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <Step3Identification
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            previews={previews}
            handleAddKhatauniEntry={handleAddKhatauniEntry}
            handleRemoveKhatauniEntry={handleRemoveKhatauniEntry}
            tempKhatauniImage={tempKhatauniImage}
            tempKhatauniPreview={tempKhatauniPreview}
            handleTempKhatauniImage={handleTempKhatauniImage}
            removeTempKhatauniImage={removeTempKhatauniImage}
          />
        );
      case 4:
        return (
          <Step4BankDetails
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            previews={previews}
          />
        );
      case 5:
        return (
          <Step5Nominee
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            previews={previews}
          />
        );
      case 6:
        return (
          <Step6CreatePin
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />
        );
      default:
        return null; // Should not happen if logic is correct (or render a final summary/completion component)
    }
  };

  // Memoized progress calculation
  const progress = useMemo(
    () => Math.round((stepCompleted / STEPS.length) * 100),
    [stepCompleted]
  );

  // Memoized remaining steps calculation for display text
  const remainingSteps = useMemo(
    () => Math.max(0, STEPS.length - Math.min(stepCompleted, STEPS.length)),
    [stepCompleted]
  );

  // Initializing spinner view
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
            Loading Registration...
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Please wait while we check your progress
          </p>
        </div>
      </div>
    );
  }

  const showSteps = currentStep <= STEPS.length;

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 px-4 sm:py-8 font-sans antialiased">
      {!showSuccessMessage ? (
        // Registration Form View
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-4">
                Farmer Registration
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                Complete your registration in {remainingSteps} remaining step
                {remainingSteps === 1 ? "" : "s"}
              </p>
              {showSteps && (
                <div className="mt-2 sm:mt-4 text-xs sm:text-sm text-gray-500">
                  Step {currentStep} of {STEPS.length} • All fields marked with
                  * are required
                </div>
              )}
            </div>

            {/* Step Indicator */}
            {showSteps && (
              <StepIndicator
                currentStep={currentStep}
                stepCompleted={stepCompleted}
                steps={STEPS}
              />
            )}

            {/* Global Error Message */}
            {globalError && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start justify-between">
                <div className="flex items-start">
                  <X size={18} className="mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{globalError}</span>
                </div>
                <button
                  onClick={() => setGlobalError("")}
                  className="text-red-600 hover:text-red-800 text-sm ml-4"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Step Content Area */}
            <div className="mb-6 sm:mb-8 md:mb-12">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-4 sm:p-6 md:p-8">
                {showSteps ? (
                  renderCurrentStep()
                ) : (
                  // Fallback/Summary if somehow past max step but not showing success screen
                  <div className="text-center">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                      Registration Complete
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500">
                      Thank you for completing your registration!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons and Progress Bar */}
            {showSteps && (
              <>
                <div className="flex flex-col sm:flex-row justify-end items-center pt-4 sm:pt-6 md:pt-8 border-t border-gray-200/50 gap-4">
                  <div className="w-full sm:w-auto order-1 sm:order-2">
                    {currentStep < STEPS.length ? (
                      // Save & Continue Button
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={isLoading}
                        className={`flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 rounded-2xl font-semibold transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto ${
                          isLoading
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                            <span className="text-sm sm:text-base">
                              Saving...
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm sm:text-base">
                              Save & Continue
                            </span>
                            <ChevronRight size={18} className="ml-2" />
                          </>
                        )}
                      </button>
                    ) : (
                      // Complete Registration Button (Final Step)
                      <button
                        type="button"
                        onClick={handleFinish}
                        disabled={isLoading}
                        className={`px-4 py-2 sm:px-8 sm:py-3 rounded-2xl font-semibold transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto ${
                          isLoading
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 inline-block"></div>
                            <span className="text-sm sm:text-base">
                              Completing Registration...
                            </span>
                          </>
                        ) : (
                          <span className="text-sm sm:text-base">
                            Complete Registration 🎉
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 sm:mt-6 md:mt-8 text-center">
                  <div className="text-xs sm:text-sm text-gray-500 mb-2">
                    Progress: {progress}% Complete
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 text-center text-xs text-gray-400">
            Your progress is securely synced with the server.
          </div>
        </div>
      ) : (
        // Success Message View
        <div className="flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-3xl rounded-3xl p-8 sm:p-12 max-w-md w-full text-center shadow-2xl border border-white/30 animate-[scale-in_0.5s_ease]">
            <div className="flex flex-col items-center mb-6">
              <span className="text-5xl sm:text-6xl mb-2 animate-bounce">
                🎉
              </span>
              <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center shadow-lg mb-4">
                <CircleCheck
                  size={56}
                  className="text-green-600 animate-pulse"
                />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Registration Complete!
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              You have successfully completed the registration process.
              <br />
              Your data has been securely saved.
            </p>
            <a
              href="/dashboard"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-all text-lg"
            >
              Go to Dashboard
            </a>
          </div>
          {/* Tailwind CSS keyframe simulation via inline style block */}
          <style>{`
            @keyframes scale-in {
              0% { transform: scale(0.8); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default MultiStepRegistration;
