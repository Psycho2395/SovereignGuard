
import { useState } from "react";
import { Check, Lock, LockOpen, AlertTriangle } from "lucide-react";
import ZkpCredentialCard from "./ZkpCredentialCard";

const getRandomStatus = () => {
  // Return risk & status randomly for demo
  const risk = Math.floor( Math.random() * 90 + 10 );
  const code = risk < 40 ? "success" : risk < 70 ? "warning" : "error";
  return { risk, code };
};

const getDid = () => {
  // Simulated pseudo-DID for demo
  const r = () => Math.random().toString(36).substring(2, 6);
  return `did:example:123${r()}xyz${r()}${r()}`;
};

const Dashboard = () => {
  const [did, setDid] = useState<string | null>(null);
  const [identityFrozen, setFrozen] = useState(false);
  const [risk, setRisk] = useState(() => getRandomStatus());
  const [alerts, setAlerts] = useState([
    { type: "AI Anomaly", desc: "Unusual login detected", ts: "1 min ago", code: "warning" },
    { type: "Phishing Attempt", desc: "Possible phishing link accessed", ts: "3 min ago", code: "error" },
  ]);

  function onCreateIdentity() {
    setDid(getDid());
    setAlerts([
      ...alerts,
      { type: "Identity Created", desc: "Your DID is ready", ts: "now", code: "success" },
    ]);
  }

  function onToggleFreeze() {
    setFrozen((val) => !val);
    setAlerts([
      ...alerts,
      {
        type: identityFrozen ? "Identity Unfrozen" : "Identity Frozen",
        desc: identityFrozen
          ? "Your identity is now active"
          : "Identity access is temporarily frozen",
        ts: "now",
        code: identityFrozen ? "success" : "error",
      },
    ]);
  }

  return (
    <div className="font-inter px-4 py-8 w-full flex flex-col gap-6">
      {/* Heading */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">Welcome to Identity Dashboard</h2>
          <p className="text-sm text-gray-500">Secure, self-sovereign, and AI-powered.</p>
        </div>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-primary/90 active:scale-95 transition-all"
          onClick={onCreateIdentity}
          disabled={!!did}
        >
          <Check size={18} />
          {did ? "Identity Created" : "Create Identity"}
        </button>
      </div>
      {/* DID and Control */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2">
          <div className="text-xs text-gray-400 mb-2">Decentralized Identifier (DID)</div>
          <div className="font-mono font-semibold text-lg select-all break-all text-gray-900">
            {did ?? <span className="text-gray-300">Click 'Create Identity'</span>}
          </div>
          {did && (
            <div className="flex gap-2 mt-3">
              <button
                className={`flex-1 flex items-center gap-2 px-3 py-2 rounded transition ${
                  identityFrozen
                    ? "bg-muted text-gray-400 cursor-not-allowed"
                    : "bg-success text-white hover:bg-success/90"
                }`}
                onClick={() => !identityFrozen && alert("Verified Successfully! (Demo)")}
                disabled={identityFrozen}
              >
                <Check size={16} />
                Verify
              </button>
              <button
                className={`flex-1 flex items-center gap-2 px-3 py-2 rounded transition ${
                  identityFrozen
                    ? "bg-primary text-white"
                    : "bg-warning text-white"
                }`}
                onClick={onToggleFreeze}
              >
                {identityFrozen ? <LockOpen size={16} /> : <Lock size={16} />}
                {identityFrozen ? "Unfreeze" : "Freeze"}
              </button>
            </div>
          )}
        </div>
        {/* Risk Widget */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 items-start">
          <div className="text-xs text-gray-400 mb-2">Current Risk Score</div>
          <div className="flex items-center gap-2">
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center ${
                risk.code === "success"
                  ? "bg-success/10 text-success"
                  : risk.code === "warning"
                  ? "bg-warning/10 text-warning"
                  : "bg-error/10 text-error"
              }`}
            >
              {risk.code === "success" && <Check size={20} />}
              {risk.code === "warning" && <AlertTriangle size={20} />}
              {risk.code === "error" && <AlertTriangle size={20} />}
            </div>
            <span className="text-xl font-bold">{risk.risk}%</span>
            <span className="ml-2 text-gray-400 text-xs">(lower is safer)</span>
          </div>
        </div>
        {/* ZKP Credential Card */}
        <ZkpCredentialCard did={did} />
      </div>
      {/* Live Alerts */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={18} className="text-error" />
          <span className="font-semibold text-lg">Threat Alerts</span>
        </div>
        <div className="flex flex-wrap gap-4 mt-1">
          {alerts.slice(-3).map((alert, i) => (
            <div
              key={i}
              className={`rounded-lg flex items-center gap-2 px-3 py-2 min-w-[200px]
                ${
                  alert.code === "error"
                    ? "bg-error/10 text-error"
                    : alert.code === "warning"
                    ? "bg-warning/10 text-warning"
                    : "bg-success/10 text-success"
                }
                animate-fade-in
              `}
            >
              {alert.code === "error" && <AlertTriangle size={16} />}
              {alert.code === "warning" && <AlertTriangle size={16} />}
              {alert.code === "success" && <Check size={16} />}
              <div className="flex flex-col text-sm">
                <span>{alert.type}</span>
                <span className="text-xs text-gray-500">{alert.desc} · {alert.ts}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
