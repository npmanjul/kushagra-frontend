// Invoice.tsx
const Invoice = () => {
  return (
    <div
      id="invoice"
      style={{
        padding: "40px",
        fontFamily: "Arial",
        width: "210mm", // A4 width
        background: "#fff",
      }}
    >
      <h1 style={{ textAlign: "center" }}>INVOICE</h1>

      <p>
        <strong>Invoice No:</strong> INV-1023
      </p>
      <p>
        <strong>Customer:</strong> Anjul Singh
      </p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={th}>Item</th>
            <th style={th}>Qty</th>
            <th style={th}>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={td}>Web Development</td>
            <td style={td}>1</td>
            <td style={td}>₹15000</td>
          </tr>
          <tr>
            <td style={td}>Hosting</td>
            <td style={td}>1</td>
            <td style={td}>₹2000</td>
          </tr>
        </tbody>
      </table>

      <h3 style={{ textAlign: "right", marginTop: "20px" }}>Total: ₹17000</h3>
    </div>
  );
};

const th = {
  border: "1px solid #ddd",
  padding: "10px",
  background: "#f5f5f5",
};

const td = {
  border: "1px solid #ddd",
  padding: "10px",
};

export default Invoice;
