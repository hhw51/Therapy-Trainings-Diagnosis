// AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the structure of a symptom object
export interface Symptom {
  name: string;
  severity: number;
  duration: number;
}

interface AppContextType {
  symptoms: Symptom[];
  setSymptoms: React.Dispatch<React.SetStateAction<Symptom[]>>;
  familyHistory: string;
  setFamilyHistory: React.Dispatch<React.SetStateAction<string>>;
  pastDiagnosis: string;
  setPastDiagnosis: React.Dispatch<React.SetStateAction<string>>;
  medicationHistory: string;
  setMedicationHistory: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [familyHistory, setFamilyHistory] = useState<string>("");
  const [pastDiagnosis, setPastDiagnosis] = useState<string>("");
  const [medicationHistory, setMedicationHistory] = useState<string>("");

  return (
    <AppContext.Provider
      value={{
        symptoms,
        setSymptoms,
        familyHistory,
        setFamilyHistory,
        pastDiagnosis,
        setPastDiagnosis,
        medicationHistory,
        setMedicationHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
