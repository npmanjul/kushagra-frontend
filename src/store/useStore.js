import API_BASE_URL from "@/utils/constants";
import { create } from "zustand";

const useStore = create((set, get) => ({
  // Example state
  currStep: 2,

  // Example actions
  setCurrStep: (value) => set({ currStep: value }),

  // ✅ Fetch current step
  getCurrentStep: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/register/currentstep`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching current step:", error);
      return null;
    }
  },

  checkToken: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/checktoken`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error("Error occurred while checking token:", error);
      return null;
    }
  },
  getprofile: async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/getprofile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
},
}));



export default useStore;
