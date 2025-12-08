import toast from "react-hot-toast";

const logout = () => {
  try {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    window.location.href = "/login";
  } catch (error) {
    console.error("Error logging out:", error);
    toast.error("Error logging out");
  }
};

export { logout };