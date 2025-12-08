"use client";
import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Users,
  Camera,
  Edit3,
  Eye,
  EyeOff,
  Shield,
  FileText,
  Building,
  Heart,
  Award,
} from "lucide-react";

const UserProfile = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Sample user data - replace with actual data
  const userData = {
    user_id: "usr_123456789",
    role: "FARMER",
    name: "Rajesh Kumar",
    phone_number: "+91-9876543210",
    email: "rajesh.kumar@email.com",
    password: "********",
    account_pin: "****",
    gender: "MALE",
    dob: "1985-03-15",

    // Address Info
    address: "Village Rampur, Near Primary School",
    tehsil: "Karchhana",
    district: "Allahabad",
    state: "Uttar Pradesh",
    landmark: "Near Bus Stand",
    pin_code: "212107",

    // Farmer Identity
    user_image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    aadhaar_number: "1234-5678-9012",
    pan_number: "ABCDE1234F",
    khatauni_id: "KH001234",
    land_size: "5.50",

    // Bank Details
    account_number: "1234567890123456",
    ifsc_code: "SBIN0001234",
    account_holder: "Rajesh Kumar",
    bank_name: "State Bank of India",
    branch_name: "Karchhana Branch",

    // Nominee Details
    nominee_name: "Sunita Kumar",
    nominee_dob: "1988-07-20",
    nominee_phone: "+91-9876543211",
    nominee_email: "sunita.kumar@email.com",
    nominee_aadhaar: "9876-5432-1098",
    nominee_pan: "ZYXWV5678G",
    nominee_relation: "WIFE",
    nominee_gender: "FEMALE",
    nominee_address: "Same as above",

    registration_date: "2023-01-15",
    step_completed: 10,
    created_at: "2023-01-15",
    updated_at: "2024-08-30",
  };

  const InfoCard = ({ label, value, icon: Icon, colSpan = "1" }) => (
    <div
      className={`bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow ${
        colSpan === "2" ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-center space-x-2 mb-2">
        {Icon && <Icon className="w-4 h-4 text-blue-600" />}
        <label className="text-sm font-medium text-gray-500">{label}</label>
      </div>
      <p className="text-gray-900 font-medium">{value || "Not provided"}</p>
    </div>
  );

  const SectionHeader = ({ title, icon: Icon, description }) => (
    <div className="flex items-center space-x-3 mb-6">
      <div className="bg-blue-100 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
      </div>
    </div>
  );

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <img
                  src={userData.user_image}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-blue-100"
                />
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 sm:p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <div className="space-y-2 text-center sm:text-left flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {userData.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium">
                    {userData.role}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium">
                    Active
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                  <span>ID: {userData.user_id}</span>
                  <span className="hidden sm:inline">•</span>
                  {/* <span>
                    Joined:{" "}
                    {new Date(userData.registration_date).toLocaleDateString()}
                  </span> */}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 sm:justify-end">
              <button className="bg-blue-600 text-white px-4 py-2 sm:px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base">
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 sm:px-6 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-6">
          <SectionHeader
            title="Personal Information"
            icon={User}
            description="Basic personal details and contact information"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <InfoCard label="Full Name" value={userData.name} icon={User} />
            <InfoCard
              label="Phone Number"
              value={userData.phone_number}
              icon={Phone}
            />
            <InfoCard
              label="Email Address"
              value={userData.email}
              icon={Mail}
            />
            <InfoCard label="Gender" value={userData.gender} />
            <InfoCard
              label="Date of Birth"
              value={new Date(userData.dob).toLocaleDateString()}
              icon={Calendar}
            />
            <InfoCard
              label="Land Size"
              value={`${userData.land_size} acres`}
              icon={Award}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-medium text-gray-500">
                    Account PIN
                  </label>
                </div>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-gray-900 font-mono font-medium">
                {showPassword ? userData.account_pin : "******"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-medium text-gray-500">
                  Last Updated
                </label>
              </div>
              <p className="text-gray-900 font-medium">
                {new Date(userData.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-6">
          <SectionHeader
            title="Address Information"
            icon={MapPin}
            description="Complete residential address details"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <InfoCard
              label="Full Address"
              value={userData.address}
              colSpan="2"
            />
            <InfoCard label="Landmark" value={userData.landmark} />
            <InfoCard label="Tehsil" value={userData.tehsil} />
            <InfoCard label="District" value={userData.district} />
            <InfoCard label="State" value={userData.state} />
            <InfoCard label="PIN Code" value={userData.pin_code} />
          </div>
        </div>

        {/* Identity Documents Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-6">
          <SectionHeader
            title="Identity Documents"
            icon={FileText}
            description="Government identity and land ownership documents"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-medium text-gray-500">
                  Aadhaar Number
                </label>
              </div>
              <p className="text-gray-900 font-mono font-medium mb-3 text-sm sm:text-base">
                {userData.aadhaar_number}
              </p>
              <button className="text-blue-600 text-xs sm:text-sm hover:underline bg-blue-50 px-2 py-1 sm:px-3 rounded">
                View Document
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-medium text-gray-500">
                  PAN Number
                </label>
              </div>
              <p className="text-gray-900 font-mono font-medium mb-3 text-sm sm:text-base">
                {userData.pan_number}
              </p>
              <button className="text-blue-600 text-xs sm:text-sm hover:underline bg-blue-50 px-2 py-1 sm:px-3 rounded">
                View Document
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-medium text-gray-500">
                  Khatauni ID
                </label>
              </div>
              <p className="text-gray-900 font-mono font-medium mb-3 text-sm sm:text-base">
                {userData.khatauni_id}
              </p>
              <button className="text-blue-600 text-xs sm:text-sm hover:underline bg-blue-50 px-2 py-1 sm:px-3 rounded">
                View Document
              </button>
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-6">
          <SectionHeader
            title="Bank Details"
            icon={Building}
            description="Banking information for payments and transactions"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <InfoCard
              label="Account Holder"
              value={userData.account_holder}
              icon={User}
            />
            <InfoCard
              label="Account Number"
              value={userData.account_number}
              icon={CreditCard}
            />
            <InfoCard label="IFSC Code" value={userData.ifsc_code} />
            <InfoCard
              label="Bank Name"
              value={userData.bank_name}
              icon={Building}
            />
            <InfoCard
              label="Branch Name"
              value={userData.branch_name}
              colSpan="2"
            />
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900 text-sm sm:text-base">
                Bank Account Verification
              </h3>
            </div>
            <p className="text-blue-800 text-xs sm:text-sm">
              Bank details are verified and secure. All transactions are
              encrypted and monitored.
            </p>
          </div>
        </div>

        {/* Nominee Details Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 mb-6">
          <SectionHeader
            title="Nominee Information"
            icon={Heart}
            description="Designated nominee for account and benefits"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <InfoCard
              label="Nominee Name"
              value={userData.nominee_name}
              icon={Users}
            />
            <InfoCard
              label="Relationship"
              value={userData.nominee_relation}
              icon={Heart}
            />
            <InfoCard label="Gender" value={userData.nominee_gender} />
            <InfoCard
              label="Date of Birth"
              value={new Date(userData.nominee_dob).toLocaleDateString()}
              icon={Calendar}
            />
            <InfoCard
              label="Phone Number"
              value={userData.nominee_phone}
              icon={Phone}
            />
            <InfoCard
              label="Email Address"
              value={userData.nominee_email}
              icon={Mail}
            />
            <InfoCard label="Aadhaar Number" value={userData.nominee_aadhaar} />
            <InfoCard label="PAN Number" value={userData.nominee_pan} />
            <InfoCard
              label="Address"
              value={userData.nominee_address}
              colSpan="2"
            />
          </div>

          <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-green-900 text-sm sm:text-base">
                Nominee Status
              </h3>
            </div>
            <p className="text-green-800 text-xs sm:text-sm">
              Nominee information is complete and verified. They will be
              contacted in case of emergencies.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-600">
                <p>
                  Profile created:{" "}
                  {new Date(userData.created_at).toLocaleDateString()}
                </p>
                <p>
                  Last updated:{" "}
                  {new Date(userData.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                User ID: {userData.user_id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
