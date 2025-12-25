"use client";

import { useRef } from "react";

const Html2Pdf = ({
  fileName = "document.pdf",
  buttonText = "Download PDF",
  onBeforeGenerate,
  onAfterGenerate,
  children,
}) => {
  const contentRef = useRef(null);

  const generatePDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;

    if (!contentRef.current) return;

    await html2pdf()
      .from(contentRef.current)
      .set({
        margin: 10,
        filename: fileName,
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .save();
  };

  const handleGeneratePdf = async () => {
    try {
      if (onBeforeGenerate) await onBeforeGenerate();
      await generatePDF();
      if (onAfterGenerate) await onAfterGenerate();
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  return (
    <>
      {/* Hidden content for PDF */}
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      >
        {children}
      </div>

      {/* Trigger Button */}
      <button onClick={handleGeneratePdf}>
        {buttonText}
      </button>
    </>
  );
};

export default Html2Pdf;