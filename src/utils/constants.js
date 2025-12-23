const API_BASE_URL =
  process.env.NEXT_PUBLIC_ENV === "development"
    ? "http://localhost:8000/api/v1"
    : "https://samriddhi-storage-backend.vercel.app/api/v1";
export default API_BASE_URL;
