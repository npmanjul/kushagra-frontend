console.log("NEXT_PUBLIC_API_URL =", process.env.NEXT_PUBLIC_API_URL);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "___MISSING_ENV___";

export default API_BASE_URL;