"use client";
import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Bell,
  Home,
  Plus,
  TrendingUp,
  CreditCard,
  PieChart,
  User,
  Settings,
  LogOut,
  Clock,
  Package,
  Users,
  User2,
  BarChart3,
  FileText,
  DollarSign,
  CheckCircle,
  HouseIcon,
  Warehouse,
  LayoutDashboard,
  UserCircleIcon,
  Minus,
  RemoveFormattingIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useStore from "@/store/useStore";
import { logout } from "@/utils/api";
import PinModal from "@/components/dashboard/PinModal";
import NoticeModal from "@/components/dashboard/NoticeModal";
import Loader from "@/components/common/Loader";

const sidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    id: "deposit",
    label: "Deposit Grain",
    icon: Plus,
    href: "/admin/deposit",
  },
  {
    id: "withdraw",
    label: "Withdraw Grain",
    icon: Minus,
    href: "/admin/withdraw",
  },
  {
    id: "Requests",
    label: "Requests",
    icon: Clock,
    href: "/admin/requests",
  },
  {
    id: "warehouse",
    label: "Warehouse",
    icon: Warehouse,
    href: "/admin/warehouses",
  },

  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
    href: "/admin/inventory",
  },
  {
    id: "employeeonboarding",
    label: "Employee Onboarding",
    icon: User,
    href: "/admin/employee",
  },
  {
    id: "farmersmanagement",
    label: "Farmers",
    icon: Users,
    href: "/admin/farmers",
  },
  {
    id: "supervisormanagement",
    label: "Supervisors",
    icon: UserCircleIcon,
    href: "/admin/supervisors",
  },
  {
    id: "managermanagement",
    label: "Managers",
    icon: User2,
    href: "/admin/managers",
  },

  {
    id: "creditmanagement",
    label: "Credit",
    icon: CreditCard,
    href: "/admin/credit",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: FileText,
    href: "/admin/transactions",
  },

  {
    id: "updateprice",
    label: "Update Price",
    icon: TrendingUp,
    href: "/admin/updateprice",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    href: "/admin/notifications",
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    href: "/admin/profile",
  },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const [showAlert, setShowAlert] = useState(true);
  const [profile, setProfile] = useState([]);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const pathname = usePathname();
  const { checkToken, getprofile } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Get current tab name based on pathname
  const getCurrentTabName = () => {
    const currentItem = sidebarItems.find((item) => item.href === pathname);
    return currentItem ? currentItem.label : "Dashboard";
  };

  // Close dropdown on overlay click
  const handleOverlayClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  // Attach event listener for overlay
  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleOverlayClick);
    } else {
      document.removeEventListener("mousedown", handleOverlayClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOverlayClick);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationOpen(false);
      }
    };
    if (notificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationOpen]);

  useEffect(() => {
    setPinModalOpen(true);
    const validateToken = async () => {
      try {
        const checkTokenValidation = await checkToken();
        console.log(checkTokenValidation);

        if (!checkTokenValidation?.success) {
          router.push("/login");
          logout();
        }

        if (checkTokenValidation?.role === "farmer") {
          router.push("/dashboard");
        }

        if (checkTokenValidation?.role === "manager") {
          router.push("/manager");
        }

        if (checkTokenValidation?.role === "admin") {
          router.push("/admin");
        }
      } catch (error) {
        console.error("Token validation error:", error);
      }
    };

    const profileDetails = async () => {
      try {
        const res = await getprofile();
        setProfile(res.profile);
        setShowNotice(!res.profile.isVerified);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    validateToken();
    profileDetails();
  }, [checkToken, router]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="h-screen bg-gray-50 flex relative">
      {/* <PinModal isOpen={pinModalOpen} onClose={() => setPinModalOpen(false)} /> */}
      {/* <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Important Notice"
        message="Your session will expire in 5 minutes. Please save your work."
      /> */}
      <NoticeModal isOpen={showNotice} onClose={() => setShowNotice(false)} />
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out border-r border-gray-100 lg:flex lg:flex-col`}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden absolute top-4 right-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Logo */}
        <div className="p-6 flex items-center space-x-1">
          {/* Logo */}

          <Image
            src="/logo.png"
            alt="Samriddh Grain Bank Logo"
            className="w-18 h-18 rounded-xl object-cover bg-white border"
            width={500}
            height={500}
          />

          {/* Brand Name */}
          <div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-green-700 to-yellow-600 bg-clip-text text-transparent tracking-wide">
              Samriddh Grain Bank
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-1 overflow-auto no-scrollbar">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full"
                key={item.id}
              >
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
                    isActive
                      ? "bg-blue-50 border-r-4 border-blue-600 text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                {getCurrentTabName()}
              </h2>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <div className="relative" ref={notificationRef}>
                <button
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  onClick={() => setNotificationOpen((open) => !open)}
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-semibold shadow">
                    3
                  </span>
                </button>
                {notificationOpen && (
                  <>
                    {/* Overlay */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNotificationOpen(false)}
                    />
                    {/* Modern Notification Dropdown */}
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden animate-fade-in">
                      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-800">
                          Notifications
                        </h3>
                        <button
                          onClick={() => setNotificationOpen(false)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                        <div className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                            D
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">
                              New{" "}
                              <span className="font-medium">
                                deposit request
                              </span>{" "}
                              received.
                            </p>
                            <span className="text-xs text-gray-400">
                              2m ago
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                          <div className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full text-sm font-bold">
                            S
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">
                              Your{" "}
                              <span className="font-medium">
                                grain selling order
                              </span>{" "}
                              is approved.
                            </p>
                            <span className="text-xs text-gray-400">
                              10m ago
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                          <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full text-sm font-bold">
                            M
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">
                                System maintenance
                              </span>{" "}
                              scheduled tomorrow.
                            </p>
                            <span className="text-xs text-gray-400">
                              1h ago
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotificationOpen(false)}
                        className="w-full text-center py-3 text-sm font-medium text-blue-600 hover:bg-gray-50 transition-colors"
                      >
                        View All Notifications
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900">
                    {profile.name}
                  </p>
                  <p className="text-xs text-gray-500 font-bold">
                    {profile.role
                      ? profile.role.charAt(0).toUpperCase() +
                        profile.role.slice(1)
                      : ""}
                  </p>
                </div>
                {/* Profile Avatar with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm focus:outline-none"
                    onClick={() => setDropdownOpen((open) => !open)}
                  >
                    <img
                      src={profile.user_image}
                      alt="Profile Avatar"
                      className="w-10 h-10 rounded-full p-[2px]"
                    />
                  </button>
                  {dropdownOpen && (
                    <>
                      {/* Overlay */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setDropdownOpen(false)}
                      />
                      {/* Modern Dropdown */}
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-50 border border-gray-100 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {profile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {profile.email}
                          </p>
                          <p className="text-xs text-blue-600 font-bold">
                            {profile.employeeId}
                          </p>
                          <p className="text-xs text-red-600 font-bold">
                            {profile.role.charAt(0).toUpperCase() +
                              profile.role.slice(1)}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <button
                            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => {
                              setDropdownOpen(false);
                              router.push("/dashboard/profile");
                            }}
                          >
                            <User className="h-4 w-4 text-gray-500" /> Profile
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => {
                              setDropdownOpen(false);
                              router.push("/dashboard/settings");
                            }}
                          >
                            <Settings className="h-4 w-4 text-gray-500" />{" "}
                            Settings
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => {
                              setDropdownOpen(false);
                              router.push("/dashboard/notifications");
                            }}
                          >
                            <Bell className="h-4 w-4 text-gray-500" />{" "}
                            Notifications
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => {
                              setDropdownOpen(false);
                              logout();
                            }}
                          >
                            <LogOut className="h-4 w-4" /> Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto max-h-screen p-6 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
