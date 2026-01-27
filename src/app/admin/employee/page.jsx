"use client";
import React, { useEffect, useState } from "react";
import {
  User, Phone, Mail, MapPin, Briefcase,
  GraduationCap, Award, Heart, ChevronRight,
  ChevronLeft, Check, Upload, Calendar, Plus, X,
  Building2, UserCheck, Shield, Sparkles, Clock,
  FileText, Users, Activity, Target, Loader2,
  CreditCard, IndianRupee, Building, Hash, Wallet,
} from "lucide-react";
import API_BASE_URL from "@/utils/constants";
import toast from "react-hot-toast";

// --- S3 Upload Helper Functions ---

/**
 * Fetches presigned upload URLs from the backend
 * @param {Array<{fileName: string, fileType: string}>} fileDetails - Array of file details
 * @returns {Promise<{success: boolean, data: Array<{uploadUrl: string, publicUrl: string, key: string}>}>}
 */
const getPresignedUploadUrls = async (fileDetails) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/aws/getpresigneduploadurls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ files: fileDetails }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to get presigned URLs");
  }

  return response.json();
};

/**
 * Uploads a single file to S3 using the presigned URL
 * @param {File} file - The file to upload
 * @param {string} uploadUrl - The presigned upload URL
 * @returns {Promise<void>}
 */
const uploadFileToS3 = async (file, uploadUrl) => {
  // Note: Do NOT send custom headers - S3 presigned URLs are signed without them
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file: ${file.name}`);
  }
};

/**
 * Uploads a single file to S3 and returns the public URL
 * @param {File} file - The file to upload
 * @param {string} keyPrefix - Prefix for the file key (e.g., 'employee')
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
const uploadSingleFileToS3 = async (file, keyPrefix = 'employee') => {
  if (!file) {
    return '';
  }

  // Prepare file details for the presigned URL request
  const fileDetails = [{
    fileName: `${keyPrefix}_${Date.now()}_${file.name}`,
    fileType: file.type || "image/jpeg",
  }];

  // Get presigned URLs from the backend
  const presignedResponse = await getPresignedUploadUrls(fileDetails);

  // Handle the API response format: { success, message, data: [...] }
  const urls = presignedResponse.data || presignedResponse.urls || presignedResponse;

  if (!Array.isArray(urls) || urls.length === 0) {
    console.error("Presigned URL response:", presignedResponse);
    throw new Error("Invalid presigned URL response from server");
  }

  const urlData = urls[0];

  if (!urlData.uploadUrl) {
    throw new Error("Missing uploadUrl from server response");
  }

  // Upload the file to S3
  await uploadFileToS3(file, urlData.uploadUrl);

  return urlData.publicUrl;
};

const EmployeeOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [empId, setEmpId] = useState(null);

  // FIX 2: Added backgroundCheckStatus field
  const [formData, setFormData] = useState({
    // Step 1 - User Model fields
    role: "",
    name: "",
    phone_number: "",
    secondary_phone_number: "",
    email: "",
    gender: "",
    dob: "",

    // Step 2 - Personal Info (EmployeeProfile)
    employeeImage: "",
    maritalStatus: "",
    nationality: "Indian",
    bloodGroup: "Unknown",

    // Step 3 - Address
    permanentAddress: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
    },
    currentAddress: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
    },
    sameAsPermanent: false,

    // Step 4 - Employment & Banking
    salary: "",
    account_number: "",
    ifsc_code: "",
    account_holder: "",
    bank_name: "",
    branch_name: "",
    upiId: "",
    panNumber: "",
    aadhaarNumber: "",
    passportNumber: "",
    passportExpiry: "",
    pfNumber: "",
    esiNumber: "",
    taxStatus: "",

    // Step 5 - Education
    education: [
      {
        qualification: "",
        institution: "",
        boardOrUniversity: "",
        yearOfPassing: "",
        percentageOrCgpa: "",
        certificateUrl: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        credentialUrl: "",
      },
    ],

    // Step 6 - Experience
    experience: [
      {
        companyName: "",
        title: "",
        startDate: "",
        endDate: "",
        responsibilities: "",
        lastDrawnSalary: "",
      },
    ],
    totalExperienceYears: "",

    // Step 7 - Additional Info
    skills: [],
    medicalConditions: "",
    emergencyContacts: [
      {
        name: "",
        relationship: "",
        phone: "",
        alternatePhone: "",
        address: "",
      },
    ],
    hrNotes: "",
    backgroundCheckStatus: "Pending", // Correct default value
  });

  const [newSkill, setNewSkill] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [employeeImageFile, setEmployeeImageFile] = useState(null); // Store file for S3 upload

  // FIX 3: Add useEffect to handle empId persistence
  useEffect(() => {
    // Check if empId exists in localStorage (for page refresh scenarios)
    const storedEmpId = localStorage.getItem('currentOnboardingEmpId');
    if (storedEmpId) {
      setEmpId(storedEmpId);
    }
  }, []);

  // FIX 4: Clear stored empId when onboarding is complete
  const clearOnboardingSession = () => {
    localStorage.removeItem('currentOnboardingEmpId');
    setEmpId(null);
  };

  const steps = [
    { id: 1, title: "Account Setup", icon: Shield, color: "from-purple-500 to-pink-500" },
    { id: 2, title: "Personal Info", icon: User, color: "from-blue-500 to-cyan-500" },
    { id: 3, title: "Address", icon: MapPin, color: "from-orange-500 to-red-500" },
    { id: 4, title: "Employment", icon: Briefcase, color: "from-indigo-500 to-purple-500" },
    { id: 5, title: "Education", icon: GraduationCap, color: "from-pink-500 to-rose-500" },
    { id: 6, title: "Experience", icon: Award, color: "from-amber-500 to-yellow-500" },
    { id: 7, title: "Additional Info", icon: Heart, color: "from-teal-500 to-cyan-500" },
    { id: 8, title: "", icon: Heart, color: "from-teal-500 to-cyan-500" },
  ];

  const handleInputChange = (field, value, section = null, index = null) => {
    setFormData((prev) => {
      if (section && index !== null) {
        const updatedSection = [...prev[section]];
        updatedSection[index] = { ...updatedSection[index], [field]: value };
        return { ...prev, [section]: updatedSection };
      } else if (section) {
        return {
          ...prev,
          [section]: { ...prev[section], [field]: value },
        };
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Store the actual file for S3 upload
      setEmployeeImageFile(file);

      // Create preview for UI display
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSameAsPermanent = (checked) => {
    setFormData((prev) => ({
      ...prev,
      sameAsPermanent: checked,
      currentAddress: checked ? { ...prev.permanentAddress } : prev.currentAddress
    }));
  };

  // Helper functions for Education
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          qualification: "",
          institution: "",
          boardOrUniversity: "",
          yearOfPassing: "",
          percentageOrCgpa: "",
          certificateUrl: "",
        },
      ],
    }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          title: "",
          issuer: "",
          issueDate: "",
          expiryDate: "",
          credentialUrl: "",
        },
      ],
    }));
  };

  const removeCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  // Helper functions for Experience
  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          companyName: "",
          title: "",
          startDate: "",
          endDate: "",
          responsibilities: "",
          lastDrawnSalary: "",
        },
      ],
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Helper functions for Emergency Contacts
  const addEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        {
          name: "",
          relationship: "",
          phone: "",
          alternatePhone: "",
          address: "",
        },
      ],
    }));
  };

  const removeEmergencyContact = (index) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

  // Helper functions for Skills
  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // FIX 5: Improved token handling
  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No authentication token found");
    }
    return token;
  };

  // FIX 6: Enhanced error handling for API calls
  const handleApiError = (error, stepNumber) => {
    console.error(`Error in Step ${stepNumber}:`, error);
    if (error.message === 'Failed to fetch') {
      toast.error("Network error: Please check your internet connection.");
    } else {
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  // API Call for Step 1
  const saveStep1 = async () => {
    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/employee/onboarding/step1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          role: formData.role,
          name: formData.name,
          phone_number: formData.phone_number,
          secondary_phone_number: formData.secondary_phone_number,
          email: formData.email,
          gender: formData.gender,
          dob: formData.dob,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCompletedSteps((prev) => new Set([...prev, 1]));
        setCurrentStep(2);
        setEmpId(data.id);
        // Store empId for persistence
        localStorage.setItem('currentOnboardingEmpId', data.id);
      } else if (data.message === 'Employee already exists') {
        setCurrentStep(data.step_completed + 1);
        setEmpId(data.id);
        toast.error("Employee already exists. Resuming from last completed step.");
      }
    } catch (error) {
      handleApiError(error, 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  // API Call for Step 2
  const saveStep2 = async () => {
    if (!empId) {
      toast.error("Employee ID is missing. Please complete Step 1 first.");
      return;
    }

    setIsSubmitting(true);
    try {
      let employeeImageUrl = formData.employeeImage || "";

      // Upload employee image to S3 if a file is selected
      if (employeeImageFile) {
        toast.loading("Uploading employee image...", { id: "upload-image" });
        try {
          employeeImageUrl = await uploadSingleFileToS3(employeeImageFile, 'employee-profile');
          toast.success("Image uploaded successfully!", { id: "upload-image" });
        } catch (uploadError) {
          toast.error(`Failed to upload image: ${uploadError.message}`, { id: "upload-image" });
          throw uploadError;
        }
      }

      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/employee/onboarding/step2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          id: empId,
          employeeImage: employeeImageUrl, // Send S3 public URL instead of base64
          maritalStatus: formData.maritalStatus,
          nationality: formData.nationality,
          bloodGroup: formData.bloodGroup,
        }),
      });

      if (response.ok) {
        setCompletedSteps((prev) => new Set([...prev, 2]));
        setCurrentStep(3);
        // Clear the file after successful upload
        setEmployeeImageFile(null);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save Step 2: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      handleApiError(error, 2);
    } finally {
      setIsSubmitting(false);
    }
  };

  // API Call for Step 3
  const saveStep3 = async () => {
    if (!empId) {
      toast.error("Employee ID is missing. Please complete Step 1 first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/employee/onboarding/step3`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          id: empId,
          permanentAddress: formData.permanentAddress,
          currentAddress: formData.currentAddress,
          sameAsPermanent: formData.sameAsPermanent,
        }),
      });

      if (response.ok) {
        setCompletedSteps((prev) => new Set([...prev, 3]));
        setCurrentStep(4);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save Step 3: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      handleApiError(error, 3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveStep4 = async () => {
    if (!empId) {
      toast.error("Employee ID is missing. Please complete Step 1 first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/employee/onboarding/step4`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          id: empId,
          salary: formData.salary || null,
          account_number: formData.account_number,
          ifsc_code: formData.ifsc_code,
          account_holder: formData.account_holder,
          bank_name: formData.bank_name,
          branch_name: formData.branch_name,
          upiId: formData.upiId,
          panNumber: formData.panNumber,
          aadhaarNumber: formData.aadhaarNumber,
          passportNumber: formData.passportNumber,
          passportExpiry: formData.passportExpiry || null,
          pfNumber: formData.pfNumber,
          esiNumber: formData.esiNumber,
          taxStatus: formData.taxStatus,
        }),
      });

      if (response.ok) {
        setCompletedSteps((prev) => new Set([...prev, 4]));
        setCurrentStep(5);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save Step 4: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      handleApiError(error, 4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveStep5 = async () => {
    if (!empId) {
      toast.error("Employee ID is missing. Please complete Step 1 first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      // Filter out empty education and certification entries
      const filteredEducation = formData.education.filter(edu =>
        edu.qualification || edu.institution
      );
      const filteredCertifications = formData.certifications.filter(cert =>
        cert.title || cert.issuer
      );

      const response = await fetch(`${API_BASE_URL}/employee/onboarding/step5`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          id: empId,
          education: filteredEducation.length > 0 ? filteredEducation : [],
          certifications: filteredCertifications.length > 0 ? filteredCertifications : [],
        }),
      });

      if (response.ok) {
        setCompletedSteps((prev) => new Set([...prev, 5]));
        setCurrentStep(6);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save Step 5: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      handleApiError(error, 5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveStep6 = async () => {
    if (!empId) {
      toast.error("Employee ID is missing. Please complete Step 1 first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      // Filter out empty experience entries
      const filteredExperience = formData.experience.filter(exp =>
        exp.companyName || exp.title
      );

      const response = await fetch(`${API_BASE_URL}/employee/onboarding/step6`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          id: empId,
          experience: filteredExperience.length > 0 ? filteredExperience : [],
          totalExperienceYears: formData.totalExperienceYears || "0",
        }),
      });

      if (response.ok) {
        setCompletedSteps((prev) => new Set([...prev, 6]));
        setCurrentStep(7);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save Step 6: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      handleApiError(error, 6);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveStep7 = async () => {
    if (!empId) {
      toast.error("Employee ID is missing. Please complete Step 1 first.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      // Filter out empty emergency contacts
      const filteredContacts = formData.emergencyContacts.filter(contact =>
        contact.name || contact.phone
      );

      const response = await fetch(`${API_BASE_URL}/employee/onboarding/step7`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          id: empId,
          skills: formData.skills,
          medicalConditions: formData.medicalConditions,
          emergencyContacts: filteredContacts.length > 0 ? filteredContacts : [],
          hrNotes: formData.hrNotes,
          backgroundCheckStatus: formData.backgroundCheckStatus,
        }),
      });

      if (response.ok) {
        setCompletedSteps((prev) => new Set([...prev, 7]));
        toast.success("Employee onboarding completed successfully!");
        // show completion screen
        setCurrentStep(8);
        clearOnboardingSession();
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save Step 7: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      handleApiError(error, 7);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return (
          formData.role &&
          formData.name &&
          formData.phone_number &&
          formData.email &&
          formData.gender &&
          formData.dob
        );
      case 2:
        return true; // Make step 2 optional or add validation as needed
      case 3:
        return (
          formData.permanentAddress.line1 &&
          formData.permanentAddress.city &&
          formData.permanentAddress.state &&
          formData.permanentAddress.postalCode
        );
      case 4:
        return true; // Make step 4 optional or add validation as needed
      case 5:
        return true; // Make step 5 optional
      case 6:
        return true; // Make step 6 optional
      case 7:
        return true; // Make step 7 optional
      default:
        return true;
    }
  };

  const handleNextStep = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill in all required fields");
      return;
    }

    switch (currentStep) {
      case 1:
        await saveStep1();
        break;
      case 2:
        await saveStep2();
        break;
      case 3:
        await saveStep3();
        break;
      case 4:
        await saveStep4();
        break;
      case 5:
        await saveStep5();
        break;
      case 6:
        await saveStep6();
        break;
      case 7:
        await saveStep7();
        break;
      default:
        break;
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <AccountSetupStep formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <PersonalInfoStep formData={formData} handleInputChange={handleInputChange} imagePreview={imagePreview} handleImageUpload={handleImageUpload} />;
      case 3:
        return <AddressStep formData={formData} handleInputChange={handleInputChange} handleSameAsPermanent={handleSameAsPermanent} />;
      case 4:
        return <EmploymentStep formData={formData} handleInputChange={handleInputChange} />;
      case 5:
        return <EducationStep
          formData={formData}
          handleInputChange={handleInputChange}
          addEducation={addEducation}
          removeEducation={removeEducation}
          addCertification={addCertification}
          removeCertification={removeCertification}
        />;
      case 6:
        return <ExperienceStep
          formData={formData}
          handleInputChange={handleInputChange}
          addExperience={addExperience}
          removeExperience={removeExperience}
        />;
      case 7:
        return <AdditionalInfoStep
          formData={formData}
          handleInputChange={handleInputChange}
          addEmergencyContact={addEmergencyContact}
          removeEmergencyContact={removeEmergencyContact}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          addSkill={addSkill}
          removeSkill={removeSkill}
        />;
      case 8:
        return <CompleteOnBoarding />;
      default:
        return null;
    }
  };

  // Rest of your component remains the same...
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4">
      {/* Keep all your existing JSX as is */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg animate-pulse">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Employee Onboarding
          </h1>
          <p className="text-gray-600 text-lg">Welcome aboard! Let's get you set up</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="relative">
              {/* Progress Bar Background */}
              <div className="absolute top-8 left-0 w-full h-2 bg-gray-200 rounded-full" />

              {/* Active Progress Bar */}
              <div
                className="absolute top-8 left-0 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />

              {/* Steps */}
              <div className="relative flex justify-between items-center">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = completedSteps.has(step.id);

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div className="relative">
                        <div
                          className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                            ? `bg-gradient-to-br ${step.color} shadow-lg scale-110`
                            : isCompleted
                              ? "bg-green-500 shadow-md"
                              : "bg-gray-300"
                            }`}
                        >
                          {isCompleted && !isActive ? (
                            <Check className="w-6 h-6 text-white" />
                          ) : (
                            <Icon
                              className={`w-6 h-6 ${isActive || isCompleted ? "text-white" : "text-gray-500"
                                }`}
                            />
                          )}
                        </div>
                        {isActive && (
                          <div
                            className={`absolute -inset-1 bg-gradient-to-br ${step.color} rounded-full blur-lg opacity-50 animate-pulse`}
                          />
                        )}
                      </div>
                      <span
                        className={`mt-3 text-xs md:text-sm font-semibold transition-colors duration-300 ${isActive
                          ? "text-gray-900"
                          : isCompleted
                            ? "text-green-600"
                            : "text-gray-500"
                          }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="transition-opacity duration-500 ease-in-out">
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className={`
              group flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300
              ${currentStep === 1 || isSubmitting
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-200"
              }
            `}
          >
            <ChevronLeft
              className={`w-5 h-5 mr-2 transition-transform ${currentStep !== 1 && !isSubmitting ? "group-hover:-translate-x-1" : ""
                }`}
            />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {[...Array(steps.length)].map((_, i) => (
              <div
                key={i}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${i < currentStep
                    ? "w-8 bg-gradient-to-r from-indigo-500 to-purple-500"
                    : "w-2 bg-gray-300"
                  }
                `}
              />
            ))}
          </div>

          <button
            onClick={handleNextStep}
            disabled={isSubmitting}
            className={`
              group flex items-center px-8 py-3 rounded-2xl font-semibold transform transition-all duration-300
              ${currentStep === steps.length
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl hover:scale-105"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl hover:scale-105"
              }
              ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}
              text-white
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : currentStep === steps.length ? (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Complete Onboarding
                <Check className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                Save & Continue
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Keep all your existing step components exactly as they are
const AccountSetupStep = ({ formData, handleInputChange }) => (
  // Your existing AccountSetupStep component code
  <div className="space-y-8">
    <div className="flex items-center mb-8">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
        <Shield className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account Setup</h2>
        <p className="text-gray-500">Basic profile and account information</p>
      </div>
    </div>

    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Profile</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <UserCheck className="w-4 h-4 mr-2 text-gray-400" />
            Role <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="">Select Role</option>
            <option value="staff">Staff</option>
            <option value="supervisor">Supervisor</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            Full Name <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            Primary Phone <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone_number}
            onChange={(e) => handleInputChange('phone_number', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            Secondary Phone
          </label>
          <input
            type="tel"
            value={formData.secondary_phone_number}
            onChange={(e) => handleInputChange('secondary_phone_number', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="+91 98765 43210"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            Email Address <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="john.doe@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            Gender <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            Date of Birth <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => handleInputChange('dob', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  </div>
);

// Include all your other step components here unchanged...
const PersonalInfoStep = ({ formData, handleInputChange, imagePreview, handleImageUpload }) => (
  <div className="space-y-8">
    <div className="flex items-center mb-8">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
        <User className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-500">Employee profile details</p>
      </div>
    </div>

    {/* Profile Image Upload */}
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
      <div className="flex items-center space-x-6">
        <div className="relative">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center">
              <User className="w-16 h-16 text-white" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="profile-upload"
          />
          <label
            htmlFor="profile-upload"
            className="absolute -bottom-2 -right-2 bg-white rounded-xl p-2 shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-110"
          >
            <Upload className="w-5 h-5 text-gray-600" />
          </label>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">Upload Profile Photo</h3>
          <p className="text-sm text-gray-600 mb-3">Upload a professional photo for your profile.</p>
          <p className="text-xs text-gray-500">Accepted formats: JPG, PNG (Max 5MB)</p>
        </div>
      </div>
    </div>

    {/* Personal Details Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center">
          <Heart className="w-4 h-4 mr-2 text-gray-400" />
          Marital Status
        </label>
        <select
          value={formData.maritalStatus}
          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">Select Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
          <option value="Separated">Separated</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          Nationality
        </label>
        <input
          type="text"
          value={formData.nationality}
          onChange={(e) => handleInputChange('nationality', e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Indian"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-gray-400" />
          Blood Group
        </label>
        <select
          value={formData.bloodGroup}
          onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="Unknown">Unknown</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>
    </div>
  </div>
);

// Include all your other step components here unchanged...
const AddressStep = ({ formData, handleInputChange, handleSameAsPermanent }) => (
  <div className="space-y-8">
    <div className="flex items-center mb-8">
      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mr-4">
        <MapPin className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Address Information</h2>
        <p className="text-gray-500">Where can we find you?</p>
      </div>
    </div>

    {/* Permanent Address */}
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <Building2 className="w-5 h-5 mr-2 text-gray-400" />
        Permanent Address
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.permanentAddress.line1}
            onChange={(e) => handleInputChange('line1', e.target.value, 'permanentAddress')}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="House/Flat No, Building Name"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold text-gray-700">Address Line 2</label>
          <input
            type="text"
            value={formData.permanentAddress.line2}
            onChange={(e) => handleInputChange('line2', e.target.value, 'permanentAddress')}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="Street, Landmark"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.permanentAddress.city}
            onChange={(e) => handleInputChange('city', e.target.value, 'permanentAddress')}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="City"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.permanentAddress.state}
            onChange={(e) => handleInputChange('state', e.target.value, 'permanentAddress')}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="State"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Country</label>
          <input
            type="text"
            value={formData.permanentAddress.country}
            onChange={(e) => handleInputChange('country', e.target.value, 'permanentAddress')}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="Country"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.permanentAddress.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value, 'permanentAddress')}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            placeholder="PIN Code"
          />
        </div>
      </div>
    </div>

    {/* Current Address */}
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-gray-400" />
          Current Address
        </h3>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.sameAsPermanent}
            onChange={(e) => handleSameAsPermanent(e.target.checked)}
            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
          />
          <span className="text-sm font-medium text-gray-700">Same as permanent</span>
        </label>
      </div>

      {!formData.sameAsPermanent && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.currentAddress.line1}
              onChange={(e) => handleInputChange('line1', e.target.value, 'currentAddress')}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="House/Flat No, Building Name"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-gray-700">Address Line 2</label>
            <input
              type="text"
              value={formData.currentAddress.line2}
              onChange={(e) => handleInputChange('line2', e.target.value, 'currentAddress')}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Street, Landmark"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.currentAddress.city}
              onChange={(e) => handleInputChange('city', e.target.value, 'currentAddress')}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="City"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.currentAddress.state}
              onChange={(e) => handleInputChange('state', e.target.value, 'currentAddress')}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="State"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Country</label>
            <input
              type="text"
              value={formData.currentAddress.country}
              onChange={(e) => handleInputChange('country', e.target.value, 'currentAddress')}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="Country"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.currentAddress.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value, 'currentAddress')}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="PIN Code"
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

const EmploymentStep = ({ formData, handleInputChange }) => (
  <div className="space-y-8">
    <div className="flex items-center mb-8">
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
        <Briefcase className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Employment & Banking</h2>
        <p className="text-gray-500">Work details and payment information</p>
      </div>
    </div>

    {/* Banking Details */}
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
        Banking Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <IndianRupee className="w-4 h-4 mr-2 text-gray-400" />
            Salary
          </label>
          <input
            type="number"
            value={formData.salary}
            onChange={(e) => handleInputChange('salary', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Monthly Salary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Account Number</label>
          <input
            type="text"
            value={formData.account_number}
            onChange={(e) => handleInputChange('account_number', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Bank Account Number"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">IFSC Code</label>
          <input
            type="text"
            value={formData.ifsc_code}
            onChange={(e) => handleInputChange('ifsc_code', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="IFSC Code"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Account Holder Name</label>
          <input
            type="text"
            value={formData.account_holder}
            onChange={(e) => handleInputChange('account_holder', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="As per bank records"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Bank Name</label>
          <input
            type="text"
            value={formData.bank_name}
            onChange={(e) => handleInputChange('bank_name', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Bank Name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Branch Name</label>
          <input
            type="text"
            value={formData.branch_name}
            onChange={(e) => handleInputChange('branch_name', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Branch Name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Wallet className="w-4 h-4 mr-2 text-gray-400" />
            UPI ID
          </label>
          <input
            type="text"
            value={formData.upiId}
            onChange={(e) => handleInputChange('upiId', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="username@upi"
          />
        </div>
      </div>
    </div>

    {/* Government IDs */}
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-gray-400" />
        Government IDs
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">PAN Number</label>
          <input
            type="text"
            value={formData.panNumber}
            onChange={(e) => handleInputChange('panNumber', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="ABCDE1234F"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Aadhaar Number</label>
          <input
            type="text"
            value={formData.aadhaarNumber}
            onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="XXXX-XXXX-XXXX"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Passport Number</label>
          <input
            type="text"
            value={formData.passportNumber}
            onChange={(e) => handleInputChange('passportNumber', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Passport Number"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Passport Expiry</label>
          <input
            type="date"
            value={formData.passportExpiry}
            onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">PF Number</label>
          <input
            type="text"
            value={formData.pfNumber}
            onChange={(e) => handleInputChange('pfNumber', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="PF Account Number"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">ESI Number</label>
          <input
            type="text"
            value={formData.esiNumber}
            onChange={(e) => handleInputChange('esiNumber', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="ESI Number"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Tax Status</label>
          <input
            type="text"
            value={formData.taxStatus}
            onChange={(e) => handleInputChange('taxStatus', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Tax Status"
          />
        </div>
      </div>
    </div>
  </div>
);

const EducationStep = ({ formData, handleInputChange, addEducation, removeEducation, addCertification, removeCertification }) => (
  <div className="space-y-8">
    <div className="flex items-center mb-8">
      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mr-4">
        <GraduationCap className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Education & Certifications</h2>
        <p className="text-gray-500">Your academic background</p>
      </div>
    </div>

    {/* Education Section */}
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Education Details</h3>
        <button
          onClick={addEducation}
          className="flex items-center px-4 py-2 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-100 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </button>
      </div>

      {formData.education.map((edu, index) => (
        <div key={index} className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 relative">
          {formData.education.length > 1 && (
            <button
              onClick={() => removeEducation(index)}
              className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Qualification</label>
              <input
                type="text"
                value={edu.qualification}
                onChange={(e) => handleInputChange('qualification', e.target.value, 'education', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                placeholder="B.Tech, MBA, etc."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Institution</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleInputChange('institution', e.target.value, 'education', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                placeholder="University/College Name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Board/University</label>
              <input
                type="text"
                value={edu.boardOrUniversity}
                onChange={(e) => handleInputChange('boardOrUniversity', e.target.value, 'education', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                placeholder="Board/University"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Year of Passing</label>
              <input
                type="number"
                value={edu.yearOfPassing}
                onChange={(e) => handleInputChange('yearOfPassing', e.target.value, 'education', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                placeholder="2020"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Percentage/CGPA</label>
              <input
                type="text"
                value={edu.percentageOrCgpa}
                onChange={(e) => handleInputChange('percentageOrCgpa', e.target.value, 'education', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                placeholder="85% or 8.5 CGPA"
              />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Certifications Section */}
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Professional Certifications</h3>
        <button
          onClick={addCertification}
          className="flex items-center px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </button>
      </div>

      {formData.certifications.map((cert, index) => (
        <div key={index} className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 relative">
          {formData.certifications.length > 1 && (
            <button
              onClick={() => removeCertification(index)}
              className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Certification Title</label>
              <input
                type="text"
                value={cert.title}
                onChange={(e) => handleInputChange('title', e.target.value, 'certifications', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="AWS Certified, PMP, etc."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Issuer</label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => handleInputChange('issuer', e.target.value, 'certifications', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="Issuing Organization"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Issue Date</label>
              <input
                type="date"
                value={cert.issueDate}
                onChange={(e) => handleInputChange('issueDate', e.target.value, 'certifications', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Expiry Date</label>
              <input
                type="date"
                value={cert.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value, 'certifications', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ExperienceStep = ({ formData, handleInputChange, addExperience, removeExperience }) => (
  <div className="space-y-8">
    <div className="flex items-center mb-8">
      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mr-4">
        <Award className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Professional Experience</h2>
        <p className="text-gray-500">Your work history</p>
      </div>
    </div>

    {/* Total Experience */}
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Total Years of Experience</label>
        <input
          type="number"
          value={formData.totalExperienceYears}
          onChange={(e) => handleInputChange('totalExperienceYears', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          placeholder="5"
        />
      </div>
    </div>

    {/* Experience Entries */}
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
        <button
          onClick={addExperience}
          className="flex items-center px-4 py-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </button>
      </div>

      {formData.experience.map((exp, index) => (
        <div key={index} className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 relative">
          {formData.experience.length > 1 && (
            <button
              onClick={() => removeExperience(index)}
              className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Company Name</label>
              <input
                type="text"
                value={exp.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value, 'experience', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="Company Name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Job Title</label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) => handleInputChange('title', e.target.value, 'experience', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="Software Engineer, Manager, etc."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Start Date</label>
              <input
                type="date"
                value={exp.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value, 'experience', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">End Date</label>
              <input
                type="date"
                value={exp.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value, 'experience', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700">Responsibilities</label>
              <textarea
                value={exp.responsibilities}
                onChange={(e) => handleInputChange('responsibilities', e.target.value, 'experience', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all min-h-[100px]"
                placeholder="Key responsibilities and achievements"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Last Drawn Salary</label>
              <input
                type="number"
                value={exp.lastDrawnSalary}
                onChange={(e) => handleInputChange('lastDrawnSalary', e.target.value, 'experience', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="Annual CTC"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AdditionalInfoStep = ({ formData, handleInputChange, addEmergencyContact, removeEmergencyContact, newSkill, setNewSkill, addSkill, removeSkill }) => (
  <div className="space-y-8">
    <div className="flex items-center mb-8">
      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
        <Heart className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
        <p className="text-gray-500">Skills, emergency contacts, and other details</p>
      </div>
    </div>

    {/* Skills Section */}
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <Target className="w-5 h-5 mr-2 text-gray-400" />
        Skills
      </h3>

      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            placeholder="Add a skill"
          />
          <button
            onClick={addSkill}
            className="px-6 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-700 border border-gray-200"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="ml-2 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Emergency Contacts */}
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Users className="w-5 h-5 mr-2 text-gray-400" />
          Emergency Contacts
        </h3>
        <button
          onClick={addEmergencyContact}
          className="flex items-center px-4 py-2 bg-cyan-50 text-cyan-600 rounded-xl hover:bg-cyan-100 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </button>
      </div>

      {formData.emergencyContacts.map((contact, index) => (
        <div key={index} className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-6 relative">
          {formData.emergencyContacts.length > 1 && (
            <button
              onClick={() => removeEmergencyContact(index)}
              className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Contact Name</label>
              <input
                type="text"
                value={contact.name}
                onChange={(e) => handleInputChange('name', e.target.value, 'emergencyContacts', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Full Name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Relationship</label>
              <select
                value={contact.relationship}
                onChange={(e) => handleInputChange('relationship', e.target.value, 'emergencyContacts', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              >
                <option value="">Select Relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Child">Child</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Primary Phone</label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => handleInputChange('phone', e.target.value, 'emergencyContacts', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Alternate Phone</label>
              <input
                type="tel"
                value={contact.alternatePhone}
                onChange={(e) => handleInputChange('alternatePhone', e.target.value, 'emergencyContacts', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700">Address</label>
              <textarea
                value={contact.address}
                onChange={(e) => handleInputChange('address', e.target.value, 'emergencyContacts', index)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="Complete Address"
                rows="2"
              />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Medical Information */}
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-gray-400" />
        Medical Information
      </h3>

      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Medical Conditions / Allergies</label>
          <textarea
            value={formData.medicalConditions}
            onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            placeholder="Please list any medical conditions, allergies, or special requirements"
            rows="3"
          />
          <p className="text-xs text-gray-500">This information will be kept confidential and used only for emergency purposes</p>
        </div>
      </div>
    </div>

    {/* HR Notes */}
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-gray-400" />
        HR Notes
      </h3>

      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Additional Notes</label>
          <textarea
            value={formData.hrNotes}
            onChange={(e) => handleInputChange('hrNotes', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
            placeholder="Any additional notes or comments for HR"
            rows="4"
          />
        </div>
      </div>
    </div>

    {/* Background Check Status */}
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <Shield className="w-5 h-5 mr-2 text-gray-400" />
        Background Verification
      </h3>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Background Check Status</label>
          <select
            value={formData.backgroundCheckStatus}
            onChange={(e) => handleInputChange('backgroundCheckStatus', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="Pending">Pending</option>
            <option value="Clear">Clear</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

const CompleteOnBoarding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg animate-pulse">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Employee Onboarding
          </h1>
          <p className="text-gray-600 text-lg">Welcome aboard! Let's get you set up</p>
        </div>

        <div className="mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="relative">
              <div className="absolute top-8 left-0 w-full h-2 bg-green-500 rounded-full" />

              <div className="relative flex justify-between items-center">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Check className="w-6 h-6 text-white" />

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeOnboarding;