import { useState } from "react";
import { Check, Lock, LockOpen, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ZkpCredentialCard from "./ZkpCredentialCard";
import SecurityDashboard from "./advanced/SecurityDashboard";
import ZkpCredentialManager from "./advanced/ZkpCredentialManager";
import AIAssistant from "./advanced/AIAssistant";
import WorldClassFeatures from "./WorldClassFeatures";
import BlockchainAnalytics from "./advanced/BlockchainAnalytics";
import BiometricAuth from "./advanced/BiometricAuth";
import AuthenticationSystem from "./advanced/AuthenticationSystem";
import NetworkMonitoring from "./advanced/NetworkMonitoring";
import UserManagement from "./advanced/UserManagement";
import SettingsPanel from "./advanced/SettingsPanel";

const getRandomStatus = () => {
  const risk = Math.floor( Math.random() * 90 + 10 );
  const code = risk < 40 ? "success" : risk < 70 ? "warning" : "error";
  return { risk, code };
};

const getDid = () => {
  const r = () => Math.random().toString(36).substring(2, 6);
  return `did:bnb:sovereign:${r()}${r()}${r()}`;
};

const Dashboard = () => {
  const [did, setDid] = useState<string | null>(null);
  const [identityFrozen, setFrozen] = useState(false);
  const [risk, setRisk] = useState(() => getRandomStatus());
  const [activeTab, setActiveTab] = useState<'overview' | 'worldclass' | 'security' | 'blockchain' | 'biometric' | 'auth' | 'network' | 'users' | 'credentials' | 'ai' | 'settings'>('overview');
  const [alerts, setAlerts] = useState([
    { type: "AI Anomaly", desc: "Unusual login detected", ts: "1 min ago", code: "warning" },
    { type: "Phishing Attempt", desc: "Possible phishing link accessed", ts: "3 min ago", code: "error" },
  ]);

  const { toast } = useToast();

  function onCreateIdentity() {
    setDid(getDid());
    setAlerts([
      ...alerts,
      { type: "Identity Created", desc: "Your DID is ready on BNB Chain", ts: "now", code: "success" },
    ]);
    toast({
      title: "Identity Created Successfully!",
      description: "Your self-sovereign identity is now active on BNB Smart Chain.",
    });
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
    toast({
      title: identityFrozen ? "Identity Unfrozen" : "Identity Frozen",
      description: identityFrozen 
        ? "Your identity access has been restored." 
        : "Your identity has been temporarily secured.",
    });
  }

  const tabItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'worldclass', label: 'World-Class', icon: '🏆' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'blockchain', label: 'Blockchain', icon: '⛓️' },
    { id: 'biometric', label: 'Biometric', icon: '👁️' },
    { id: 'auth', label: 'Authentication', icon: '🔐' },
    { id: 'network', label: 'Network', icon: '🌐' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'credentials', label: 'Credentials', icon: '🏆' },
    { id: 'ai', label: 'AI Assistant', icon: '🤖' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="font-inter px-4 py-8 w-full flex flex-col gap-6">
      {/* Heading */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">SovereignGuard Dashboard</h2>
          <p className="text-sm text-gray-500">🏆 World-class self-sovereign identity platform on BNB Smart Chain</p>
        </div>
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
          onClick={onCreateIdentity}
          disabled={!!did}
        >
          <Check size={18} />
          {did ? "Identity Active" : "Create Identity"}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="flex flex-wrap gap-2">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
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
                    onClick={() => !identityFrozen && toast({
                      title: "Verification Successful!",
                      description: "Identity verified using zero-knowledge proofs.",
                    })}
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
        </>
      )}

      {activeTab === 'worldclass' && <WorldClassFeatures />}
      {activeTab === 'security' && <SecurityDashboard />}
      {activeTab === 'blockchain' && <BlockchainAnalytics />}
      {activeTab === 'biometric' && <BiometricAuth />}
      {activeTab === 'auth' && <AuthenticationSystem />}
      {activeTab === 'network' && <NetworkMonitoring />}
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'credentials' && <ZkpCredentialManager did={did} />}
      {activeTab === 'ai' && <AIAssistant />}
      {activeTab === 'settings' && <SettingsPanel />}
    </div>
  );
};

export default Dashboard;
