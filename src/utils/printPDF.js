const API_BASE_PDF_URL =
  process.env.NEXT_PUBLIC_PDF_API_URL || "http://localhost:4000";

const handlePrint = ({ data, service }) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${API_BASE_PDF_URL}/generatepdf/${service}`;
  form.target = "_self"; // 👈 download starts automatically

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "data";
  input.value = JSON.stringify(data); // 👈 your data

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

export default handlePrint;
