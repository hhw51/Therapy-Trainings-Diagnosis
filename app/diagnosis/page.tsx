"use client";

import React from "react";
import Header from "@/components/header";
import { AppProvider } from "../context/appContext";
import Symptoms from "@/components/symptoms";
import History from "@/components/history";
import Diagnose from "@/components/diagnose";

const Diagnosis = () => {
  return (
    <AppProvider>
      <DiagnosisContent />
    </AppProvider>
  );
};

const DiagnosisContent = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen space-y-10 mb-12">
        <Header />
        <main className="flex-grow lg:px-10  space-y-10  bg-[#f5f5f5] font-roboto">
          <Symptoms />
          <History />
          <Diagnose />
        </main>
      </div>
    </>
  );
};

export default Diagnosis;
