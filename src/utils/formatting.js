const getStatusColor = (status) => {
  switch (status) {
    case "active":
    case "completed":
    case "valid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "low":
    case "inactive":
      return "bg-red-100 text-red-800";
    case "medium":
    case "warning":
      return "bg-orange-100 text-orange-800";
    case "normal":
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};


const formatRupee = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumSignificantDigits: 10,
  }).format(amount);
};


export { formatRupee , getStatusColor };