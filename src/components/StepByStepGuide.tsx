
import { CircleCheck, ListOrdered, ArrowDown, Circle, Check } from "lucide-react";

const steps = [
  {
    icon: ListOrdered,
    title: "1. SSI Setup",
    desc: "Hyperledger Aries ya Trinsic SDK se digital identity create karo. Har user ko Decentralized Identifier (DID) milta hai.",
    color: "from-[#F2FCE2] to-[#E5DEFF]",
  },
  {
    icon: CircleCheck,
    title: "2. AI Threat Detection",
    desc: "Login times, IP, device info jaise data collect/simulate karo. Python & Scikit-learn se anomaly detection model banao.",
    color: "from-[#FEF7CD] to-[#E5DEFF]",
  },
  {
    icon: Check,
    title: "3. Smart Contract Risk Alerts",
    desc: "Solidity se contract likho: threats log, high risk par access freeze; mapping & control functions required.",
    color: "from-[#D3E4FD] to-[#E5DEFF]",
  },
  {
    icon: Circle,
    title: "4. Frontend Interface",
    desc: "React.js/TailwindCSS UI: Identity creation, real-time threat alerts, ZKP credentials display.",
    color: "from-[#E5DEFF] to-[#F2FCE2]",
  },
  {
    icon: CircleCheck,
    title: "5. Integration",
    desc: "FastAPI backend: AI model, logs, threat signals to contract. Frontend me ethers.js se blockchain connect.",
    color: "from-[#F2FCE2] to-[#D6BCFA]",
  },
  {
    icon: ArrowDown,
    title: "6. Final Touches",
    desc: "Behavioral biometrics, phishing sim, dashboard risk score, Polygon ID DID. Sab kuch polish & demo ready!",
    color: "from-[#FEF7CD] to-[#F1F0FB]",
  },
];

const StepByStepGuide = () => (
  <section
    className="w-full max-w-3xl mx-auto mb-10 relative z-10 px-2 sm:px-0"
    aria-label="Project Plan Step by Step"
  >
    <div className="rounded-2xl bg-white/70 dark:bg-black/60 backdrop-blur-xl shadow-lg p-6 sm:p-10 border border-white/40 ring-1 ring-black/10">
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient-primary drop-shadow">
          World-Class SSI Project Guide
        </h2>
        <div className="mt-2 text-base text-gray-500 dark:text-gray-300">
          Har ek stage advanced, practical aur real-world ke liye built hai. Yahin se best start hota hai.
        </div>
      </div>
      <ol className="relative border-l-4 border-primary/30 pl-8 space-y-0">
        {steps.map((step, idx) => (
          <li
            key={step.title}
            className="relative pb-10 group last:pb-0 flex items-start"
          >
            {/* Step Marker */}
            <span className={`
              absolute -left-6 top-1 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br ${step.color} shadow-md group-hover:scale-105 transition-transform
              border-[3px] ${idx === steps.length-1
                ? "border-success"
                : "border-white/80 dark:border-white/30"}
            `}>
              <step.icon size={20} className="text-primary drop-shadow" aria-hidden />
            </span>
            <div className={`
              flex flex-col
              bg-gradient-to-tr ${step.color}
              bg-opacity-40 rounded-xl px-5 py-4 ml-4 shadow
              group-hover:shadow-xl transition-all
              w-full
            `}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-lg md:text-xl text-primary drop-shadow">{step.title}</span>
              </div>
              <span className="text-gray-700 dark:text-gray-200 text-base">{step.desc}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default StepByStepGuide;
