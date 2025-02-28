import React, { useState } from "react";
import { useAppContext, Symptom } from "@/app/context/appContext";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";


interface Diagnosis {
  name: string;
  confidenceLevel: string; // e.g., "85%"
  explanation: string;
}

const Diagnose: React.FC = () => {
  const { symptoms, familyHistory, pastDiagnosis, medicationHistory } =
    useAppContext();

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateSymptoms = () => {
    if (symptoms.length === 0) {
      toast.error("Please select at least one symptom.");
      return false;
    }

    for (let symptom of symptoms) {
      if (!symptom.severity || !symptom.duration) {
        toast.error(
          `Please provide severity and duration for the symptom: ${symptom.name}.`
        );
        return false;
      }

      if (symptom.severity <= 0 || symptom.duration <= 0) {
        toast.error(
          `Severity and duration must be greater than zero for the symptom: ${symptom.name}.`
        );
        return false;
      }
    }

    return true;
  };

  const handleDiagnose = async () => {
    setDiagnoses([]);
    setError(null);

    // Validate symptoms before proceeding
    if (!validateSymptoms()) return;

    setIsLoading(true); // Set loading state to true

    try {
      const payload = {
        symptoms: symptoms.map((symptom: Symptom) => ({
          name: symptom.name,
          severity: symptom.severity,
          duration: symptom.duration,
        })),
        familyHistory: familyHistory || "",
        pastDiagnosis: pastDiagnosis || "",
        medicationHistory: medicationHistory || "",
      };

      const response = await fetch("/api/getDiagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from /api/getDiagnosis:", errorData.message);
        setError(
          errorData.message ||
            "An error occurred while processing the diagnosis."
        );
        toast.error(
          errorData.message ||
            "An error occurred while processing the diagnosis."
        ); // Add toast for API error
        setIsLoading(false); // Reset loading state
        return;
      }

      const data = await response.json();
      setDiagnoses(data.diagnoses);
    } catch (err: any) {
      console.error("Network or unexpected error:", err);
      setError(
        err.message || "A network error occurred. Please try again later."
      );
      toast.error(
        err.message || "A network error occurred. Please try again later."
      ); // Add toast for network or unexpected error
    } finally {
      setIsLoading(false); // Reset loading state after the API call
    }
  };

  const downloadAsPDF = () => {
    if (diagnoses.length === 0) {
      toast.error("No diagnoses to download.");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
    });

    // Add logo
    const logoUrl = "/images/logo.png"; // Replace with your actual logo URL or base64 image string
    const logoWidth = 60; // Adjust logo width
    const logoHeight = 20; // Adjust logo height
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoX = (pageWidth - logoWidth) / 2; // Center logo
    doc.addImage(logoUrl, "PNG", logoX, 10, logoWidth, logoHeight);

    // Add heading
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const heading = "Diagnoses Report";
    const headingX = (pageWidth - doc.getTextWidth(heading)) / 2;
    doc.text(heading, headingX, logoHeight + 30); // Position heading below logo

    // Calculate total table width to center it on the page
    const tableWidth = 200; // You can adjust this as per your table column width sum
    const tableX = (pageWidth - tableWidth) / 2; // Center table by adjusting its x position

    // Create the table using autoTable
    doc.autoTable({
      startY: logoHeight + 40, // Position the table below the heading
      margin: { left: tableX }, // Center the table
      head: [
        ["No", "Diagnosis", "Confidence Level", "Explanation"], // Table headers
      ],
      body: diagnoses.map((diag, index) => [
        index + 1, // Ensuring the No column stays within a single line
        diag.name,
        diag.confidenceLevel,
        diag.explanation,
      ]), // Data for each row
      theme: "grid", // Use a grid theme for the table
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: "center", // Center-align the content within the cells
      },
      headStyles: {
        fillColor: [0, 176, 80], // Set header background color to green
        textColor: [255, 255, 255], // Set header text color to white
        fontSize: 12, // Increase font size for the header
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Alternate row color (light gray)
      },
      columnStyles: {
        0: { cellWidth: 20, halign: "center" }, // "No" column with proper width and alignment
        1: { cellWidth: 50 }, // "Diagnosis" column
        2: { cellWidth: 40, halign: "center" }, // "Confidence Level" column centered
        3: { cellWidth: 100 }, // "Explanation" column
      },
    });

    // Save the PDF
    doc.save("diagnoses_report.pdf");
    toast.success("PDF downloaded successfully!");
  };
  return (
    <main className="lg:text-lg text-sm space-y-5 flex flex-col items-center w-full px-2 md:px-4">
      {/* React Hot Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />
  
      <div className="space-y-10 w-full max-w-4xl">
        {/* Right-aligned Diagnose button */}
        <div className="flex justify-center">
          <button
            className="px-4 py-2 w-full max-w-xs rounded-md text-white bg-[#709d50] hover:bg-[#50822d] disabled:bg-gray-400 lg:text-[16px]"
            onClick={handleDiagnose}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Diagnosing..." : "Diagnose"}
          </button>
        </div>
  
        {/* Loader while processing diagnosis */}
        {isLoading && (
          <div className="flex justify-center items-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#709d50] border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
  
        {/* Display diagnoses or message */}
        {!isLoading && (
          <div className="bg-white p-4 md:p-6 rounded-md shadow-lg w-full max-w-4xl">
            {diagnoses?.length > 0 ? (
              <div className="overflow-x-auto">
                <table id="diagnosis-table" className="w-full">
                  <thead>
                    <tr>
                      <th className="p-2 text-left lg:text-[16px] ">No</th>
                      <th className="p-2 text-left lg:text-[16px]">Diagnosis</th>
                      <th className="p-2 text-left lg:text-[16px]">Confidence Level</th>
                      <th className="p-2 text-left lg:text-[16px]">Explanation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diagnoses?.map((diag, index) => (
                      <tr
                        key={index}
                        className={`border-t ${
                          parseInt(diag.confidenceLevel) < 50
                            ? "text-gray-400"
                            : ""
                        }`}
                      >
                        <td className="p-2 lg:text-[16px]">{index + 1}</td>
                        <td className="p-2 lg:text-[16px]">{diag.name}</td>
                        <td className="p-2 lg:text-[16px]">{diag.confidenceLevel}</td>
                        <td className="p-2 lg:text-[16px]">{diag.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center lg:text-[16px] text-gray-500">
                {error
                  ? `Error: ${error}`
                  : "No diagnoses available. Click 'Diagnose' to get started."}
              </div>
            )}
  
            {/* Action buttons at the bottom */}
            {diagnoses?.length > 0 && (
              <div className="flex justify-end space-x-4 mt-4 flex-wrap">
                {/* <button
                  className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d] disabled:bg-gray-400"
                  onClick={downloadAsPDF}
                >
                  Download as PDF
                </button> */}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
  
};

export default Diagnose;
