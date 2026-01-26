const API_BASE_URL = 
  process.env.NEXT_PUBLIC_ENV === "production"
  ? "http://backend:8000/api/v1"
  : "http://localhost:8000/api/v1";
export default API_BASE_URL;
