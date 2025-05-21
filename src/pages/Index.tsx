// SSI Security Dashboard shell UI

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import ThreatLog from "../components/ThreatLog";
import ZkpCredentialCard from "../components/ZkpCredentialCard";
import StepByStepGuide from "../components/StepByStepGuide";

const sections = ["Dashboard", "Threat Logs", "ZKP Credentials"];

const Index = () => {
  const [selected, setSelected] = useState("Dashboard");
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] via-[#E5DEFF] to-[#D6BCFA] flex font-inter">
      <Sidebar selected={selected} onSelect={setSelected} />
      <main className="flex-1 overflow-x-auto">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Add world-class Step-by-Step guide at TOP */}
          <StepByStepGuide />
          {selected === "Dashboard" && <Dashboard />}
          {selected === "Threat Logs" && <ThreatLog />}
          {selected === "ZKP Credentials" && (
            <div className="pt-10">
              <h2 className="text-2xl font-bold mb-6">Zero-Knowledge Credentials</h2>
              <ZkpCredentialCard did={"did:example:1234xyz8901"} />
              <div className="text-xs text-gray-400 mt-3">
                When connected, your real credentials (age, citizenship, etc.) will appear here.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
