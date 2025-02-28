import React, { useState, useEffect } from "react";
import { useAppContext, Symptom } from "@/app/context/appContext";

// Data for symptoms
const symptomsData = [
  "Depressed mood",
  "Loss of interest",
  "Change in appetite",
  "Sleep disturbance",
  "Fatigue",
  "Difficulty concentrating",
  "Anxiety",
  "Irritability",
  "Excessive worry",
  "Panic attacks",
  "Obsessive thoughts",
  "Compulsive behaviors",
  "Mood swings",
  "Hyperactivity",
  "Impulsivity",
  "Hallucinations",
  "Delusions",
  "Grandiosity",
  "Flight of ideas",
  "Decreased need for sleep",
];

const Symptoms: React.FC = () => {
  const { symptoms: contextSymptoms, setSymptoms: setContextSymptoms } =
    useAppContext();

  // Local states
  const [severityValues, setSeverityValues] = useState<number[]>(
    Array(5).fill(0)
  );
  const [durationValues, setDurationValues] = useState<number[]>(
    Array(5).fill(0)
  );
  const [localSymptoms, setLocalSymptoms] = useState<string[]>(
    Array(5).fill("")
  );
  const [checkedSymptoms, setCheckedSymptoms] = useState<string[]>([]);

  // Initialize local states from context's symptoms on mount
  useEffect(() => {
    const newLocalSymptoms = Array(5).fill("");
    const newSeverityValues = Array(5).fill(0);
    const newDurationValues = Array(5).fill(0);
    const newCheckedSymptoms: string[] = [];

    contextSymptoms.forEach((symptom, index) => {
      if (index < 5) {
        newLocalSymptoms[index] = symptom.name;
        newSeverityValues[index] = symptom.severity;
        newDurationValues[index] = symptom.duration;
        newCheckedSymptoms.push(symptom.name);
      }
    });

    setLocalSymptoms(newLocalSymptoms);
    setSeverityValues(newSeverityValues);
    setDurationValues(newDurationValues);
    setCheckedSymptoms(newCheckedSymptoms);
  }, []);

  useEffect(() => {
    const newContextSymptoms: Symptom[] = [];

    for (let i = 0; i < 5; i++) {
      if (localSymptoms[i].trim() !== "") {
        newContextSymptoms.push({
          name: localSymptoms[i],
          severity: severityValues[i],
          duration: durationValues[i],
        });
      }
    }

    setContextSymptoms(newContextSymptoms);
  }, [localSymptoms, severityValues, durationValues, setContextSymptoms]);

  const handleCheckboxChange = (symptomName: string) => {
    if (checkedSymptoms.length >= 5 && !checkedSymptoms.includes(symptomName)) {
      alert("You can only select up to 5 symptoms.");
      return;
    }
  
    if (checkedSymptoms.includes(symptomName)) {
      // Uncheck the symptom
      const updatedCheckedSymptoms = checkedSymptoms.filter(
        (item) => item !== symptomName
      );
      setCheckedSymptoms(updatedCheckedSymptoms);
  
      const symptomIndex = localSymptoms.findIndex((s) => s === symptomName);
      if (symptomIndex !== -1) {
        const updatedLocalSymptoms = [...localSymptoms];
        updatedLocalSymptoms[symptomIndex] = "";
        setLocalSymptoms(updatedLocalSymptoms);
  
        const updatedSeverity = [...severityValues];
        updatedSeverity[symptomIndex] = 0;
        setSeverityValues(updatedSeverity);
  
        const updatedDuration = [...durationValues];
        updatedDuration[symptomIndex] = 0;
        setDurationValues(updatedDuration);
  
        // Reset the background for sliders when unchecking
        setTimeout(() => {
          const severitySlider = document.querySelector(`#severity-slider-${symptomIndex}`) as HTMLInputElement;
          const durationSlider = document.querySelector(`#duration-slider-${symptomIndex}`) as HTMLInputElement;
  
          if (severitySlider) {
            severitySlider.style.background = `linear-gradient(to right, #709d50 0%, #F5F5F5 0%)`;
          }
          if (durationSlider) {
            durationSlider.style.background = `linear-gradient(to right, #709d50 0%, #F5F5F5 0%)`;
          }
        }, 0);
      }
    } else {
      // Check the symptom and fill an empty input field
      const emptyIndex = localSymptoms.findIndex(
        (symptomText) => symptomText === ""
      );
      if (emptyIndex !== -1) {
        const updatedLocalSymptoms = [...localSymptoms];
        updatedLocalSymptoms[emptyIndex] = symptomName;
        setLocalSymptoms(updatedLocalSymptoms);
  
        setCheckedSymptoms((prev) => [...prev, symptomName]);
  
        // Log the updated states for debugging
        console.log("Checked Symptoms:", checkedSymptoms);
        console.log("Local Symptoms:", localSymptoms);
        console.log("Severity Values:", severityValues);
        console.log("Duration Values:", durationValues);
      }
    }
  };
  


  const handleSymptomChange = (index: number, value: string) => {
    const updatedLocalSymptoms = [...localSymptoms];
    updatedLocalSymptoms[index] = value;
    setLocalSymptoms(updatedLocalSymptoms);

    // Remove the symptom from checkedSymptoms if it was manually removed
    if (!value && checkedSymptoms.includes(localSymptoms[index])) {
      setCheckedSymptoms(
        checkedSymptoms.filter((symptom) => symptom !== localSymptoms[index])
      );
    }
  };

  const handleSeverityChange = (index: number, value: string) => {
    const newSeverity = parseInt(value, 10);
    if (isNaN(newSeverity)) return;

    const updatedSeverity = [...severityValues];
    updatedSeverity[index] = newSeverity;
    setSeverityValues(updatedSeverity);
  };

  const handleDurationChange = (index: number, value: string) => {
    const newDuration = parseInt(value, 10);
    if (isNaN(newDuration)) return;

    const updatedDuration = [...durationValues];
    updatedDuration[index] = newDuration;
    setDurationValues(updatedDuration);
  };

  return (
    <main className=" space-y-5 flex flex-col items-center w-full px-4">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-4xl">
        <div className="mt-5">
          <h3 className="text-lg text-[16px] font-semibold mb-4">Select Symptoms (Max 5):</h3>
          <div className="lg:text-[16px] text-[14px] grid grid-cols-1 md:grid-cols-2 gap-2 border-t-2 border-gray-200 pt-4 mb-6 ">
            {symptomsData.map((symptom, index) => (
              <div key={index} className="flex items-center ">
                <input
                  type="checkbox"
                  id={`symptom-${index}`}
                  value={symptom}
                  className="mr-2 "
                  onChange={() => handleCheckboxChange(symptom)}
                  checked={checkedSymptoms.includes(symptom)}
                  style={{
                    accentColor: "#709d50",
                  }}
                />
                <label htmlFor={`symptom-${index}`}>{symptom}</label>
              </div>
            ))}
          </div>
        </div>
  
        {/* Symptoms Table */}
        <div className="md:overflow-x-auto" style={{ overflowX: 'auto' }}>
          <div className="hidden md:block">
            <table className="w-full mt-5 text-sm md:text-base min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-2 text-left lg:text-[16px]">Symptoms</th>
                  <th className="p-2 text-center lg:text-[16px]">Symptom Severity</th>
                  <th className="p-2 lg:text-[16px]">Duration (Months)</th>
                </tr>
              </thead>
              <tbody>
                {localSymptoms.map((symptom, index) => (
                  <React.Fragment key={index}>
                    {/* Add labels above the rows */}
                    <tr>
                      <td className="text-left sm:py-6 py-2 font-semibold lg:text-[16px] ">
                        {index === 0
                          ? "Primary"
                          : index === 1
                          ? "Secondary"
                          : index === 2
                          ? "Tertiary"
                          : "Additional"}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2">
                        <input
                          type="text"
                          value={symptom}
                          onChange={(e) => handleSymptomChange(index, e.target.value)}
                          className="rounded-md px-4 py-2 w-full border-2 text-[16px]"
                          placeholder="Enter unlisted symptom"
                        />
                      </td>
                      <td className="p-2">
                        <div className="lg:text-[16px] flex items-center">
                          <span className="w-8 text-center text-[16px]">{severityValues[index]}</span>
                          <input
                            type="range"
                            min="0"
                            max="10"  
                            id={`severity-slider-${index}`} // Added ID here
                            value={severityValues[index]}
                            onChange={(e) => {
                              const numericValue = Number(e.target.value); // Convert to number for calculations
                              handleSeverityChange(index, String(numericValue)); // Pass it back as a string
                              e.target.style.background = `linear-gradient(to right, #709d50 ${
                                numericValue * 10
                              }%, #F5F5F5 ${numericValue * 10}%)`;
                            }}
                            className="w-full mx-2 custom-slider"
                          />
                          <span className="text-[16px]">10</span>
                        </div>
                      </td>
  
                      <td className="text-[16px] p-2">
                        <div className="flex items-center">
                          <span className="w-8 text-center text-[16px]">{durationValues[index]}</span>
                          <input
                            type="range"
                            min="0"
                            max="24"
                            id={`duration-slider-${index}`} // Added ID here
                            value={durationValues[index]}
                            onChange={(e) => {
                              const numericValue = Number(e.target.value); // Convert to number for calculations
                              handleDurationChange(index, String(numericValue)); // Pass it back as a string
                              e.target.style.background = `linear-gradient(to right, #709d50 ${
                                (numericValue / 24) * 100
                              }%, #F5F5F5 ${(numericValue / 24) * 100}%)`;
                            }}
                            className="mx-2 w-full custom-slider"
                          />
                          <span className="text-[16px]">24</span>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Mobile Layout */}
          <div className="block md:hidden">
            {localSymptoms.map((symptom, index) => (
              <div key={index} className="space-y-3 mb-6">
                <div 
                className="font-semibold lg:text-lg text-[16px]">
                  {index === 0
                    ? "Primary"
                    : index === 1
                    ? "Secondary"
                    : index === 2
                    ? "Tertiary"
                    : "Additional"}
                </div>
  
                <div>
                  <input
                    type="text"
                    value={symptom}
                    onChange={(e) => handleSymptomChange(index, e.target.value)}
                    className="rounded-md px-4 py-2 w-full border-2 lg:text-lg text-[14px]"
                    placeholder="Enter unlisted symptom"
                  />
                </div>
  
                <div className="font text-[14px]">Symptom Severity</div>
                <div className="flex items-center space-x-2">
                  <span className="text-[14px]">{severityValues[index]}</span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    id={`severity-slider-${index}`} // Added ID here
                    value={severityValues[index]}
                    onChange={(e) => {
                      const numericValue = Number(e.target.value);
                      handleSeverityChange(index, String(numericValue));
                      e.target.style.background = `linear-gradient(to right, #709d50 ${
                        numericValue * 10
                      }%, #F5F5F5 ${numericValue * 10}%)`;
                    }}
                    className="w-full custom-slider text-[14px]"
                  />
                  <span className="text-[14px]">10</span>
                </div>
  
                <div className="text-[14px]">Duration (Months)</div>
                <div className="flex items-center space-x-2">
                  <span className="text-[14px]">{durationValues[index]}</span>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    id={`duration-slider-${index}`} // Added ID here
                    value={durationValues[index]}
                    onChange={(e) => {
                      const numericValue = Number(e.target.value);
                      handleDurationChange(index, String(numericValue));
                      e.target.style.background = `linear-gradient(to right, #709d50 ${
                        (numericValue / 24) * 100
                      }%, #F5F5F5 ${(numericValue / 24) * 100}%)`;
                    }}
                    className="w-full custom-slider text-[14px]"
                  />
                  <span className="text-[14px]">24</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
  
  
  

  
  
};

export default Symptoms;
