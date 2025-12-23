const API_BASE_URL =
  process.env.NEXT_PUBLIC_ENV === "production"
    ? "https://samriddhi-storage-backend.onrender.com/api/v1"
    : "http://localhost:8000/api/v1";
export default API_BASE_URL;
