// History.tsx
import React from "react";
import { useAppContext } from "@/app/context/appContext"; // Adjust the import path as needed

const History: React.FC = () => {
  // Destructure the necessary context values and their setters
  const {
    familyHistory,
    setFamilyHistory,
    pastDiagnosis,
    setPastDiagnosis,
    medicationHistory,
    setMedicationHistory,
  } = useAppContext();

  // Handlers to update context on input change
  const handleFamilyHistoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFamilyHistory(e.target.value);
  };

  const handlePastDiagnosisChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPastDiagnosis(e.target.value);
  };

  const handleMedicationHistoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMedicationHistory(e.target.value);
  };

  return (
    <main className="space-y-5 flex flex-col items-center w-full px-4">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-4xl">
        <h3 className="text-[16px] font-semibold mb-4">Patient History (Include for a more accurate suggestion)</h3>

        <div className="space-y-4">
          {/* Family History */}
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <label
              htmlFor="family-history"
              className="w-full md:w-1/4 font-semibold mb-2 md:mb-0 lg:text-[16px] text-[14px]"
            >
              Family History
            </label>
            <input
              type="text"
              id="family-history"
              className="lg:text-[16px] rounded-md px-4 py-2 w-full border-2 lg:text-lg text-[14px]"
              placeholder="Enter family history"
              value={familyHistory}
              onChange={handleFamilyHistoryChange}
            />
          </div>

          {/* Past Diagnosis */}
          <div className="lg:text-[16px] flex flex-col md:flex-row items-start md:items-center">
            <label
              htmlFor="past-diagnosis"
              className="w-full md:w-1/4 font-semibold mb-2 md:mb-0 lg:text-[16px] text-[14px]"
            >
              Past Diagnosis
            </label>
            <input
              type="text"
              id="past-diagnosis"
              className="rounded-md px-4 py-2 w-full border-2 lg:text-[16px] text-[14px]"
              placeholder="Enter past diagnosis"
              value={pastDiagnosis}
              onChange={handlePastDiagnosisChange}
            />
          </div>

          {/* Medication History */}
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <label
              htmlFor="medication-history"
              className="w-full md:w-1/4 font-semibold mb-2 md:mb-0 lg:text-[16px] text-[14px]"
            >
              Medication History
            </label>
            <input
              type="text"
              id="medication-history"
              className="rounded-md px-4 py-2 w-full border-2 lg:text-[16px] text-[14px]"
              placeholder="Enter medication history"
              value={medicationHistory}
              onChange={handleMedicationHistoryChange}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default History;
