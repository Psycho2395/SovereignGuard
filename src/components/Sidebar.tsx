
import { User, ShieldCheck, AlertTriangle } from "lucide-react";

const nav = [
  { label: "Dashboard", icon: User, anchor: "#dashboard" },
  { label: "Threat Logs", icon: ShieldCheck, anchor: "#threatlogs" },
  { label: "ZKP Credentials", icon: AlertTriangle, anchor: "#zkp" },
];

const Sidebar = ({ selected, onSelect }: { selected: string, onSelect?: (section: string) => void }) => {
  return (
    <aside className="bg-white shadow-lg rounded-lg min-h-screen w-56 px-4 py-8 flex flex-col gap-4 font-inter">
      <div className="mb-8 text-left">
        <span className="text-2xl font-bold text-primary">IDenity</span>
        <span className="block text-xs text-gray-400 mt-1">Decentralized Security</span>
      </div>
      <nav className="flex-grow">
        <ul className="flex flex-col gap-1">
          {nav.map((n) => (
            <li key={n.label}>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                  selected === n.label
                    ? "bg-primary text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => onSelect && onSelect(n.label)}
              >
                <n.icon size={20} className={selected === n.label ? "text-white" : "text-gray-500"} />
                {n.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto text-[11px] text-gray-300 text-center">© 2025 SSI Demo</div>
    </aside>
  );
};

export default Sidebar;
