"use client";
import WarehouseCards from "@/components/admin/WarehouseCards";
import WarehouseModal from "@/components/admin/WarehouseModal";
import API_BASE_URL from "@/utils/constants";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [managers, setManagers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);

  const fetchManager = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/warehouse/allmanager`);
      const data = await response.json();
      setManagers(data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const fetchSupervisor = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/warehouse/allsupervisor`);
      const data = await response.json();
      setSupervisors(data);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/warehouse/allstaff`);
      const data = await response.json();
      setStaffMembers(data);
    } catch (error) {
      console.error("Error fetching staff members:", error);
    }
  };

  const handleSubmit = (data) => {
    console.log("Warehouse Data:", data);
    setWarehouses((prev) => [...prev, data]);
  };
  
  useEffect(() => {
    fetchManager();
    fetchSupervisor();
    fetchStaff();
  }, []);

  return (
    <div>
      {/* Floating Add Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl flex items-center justify-center transition-transform transform hover:scale-110"
      >
        <Plus className="w-6 h-6" />
      </button>

      <WarehouseCards />

      <WarehouseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        managers={managers}
        supervisors={supervisors}
        staff={staffMembers}
      />
    </div>
  );
};

export default page;
