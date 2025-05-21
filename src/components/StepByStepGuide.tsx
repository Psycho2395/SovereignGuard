
import {
  User,
  ShieldCheck,
  FileLock,
  LayoutDashboard,
  Plug,
  Robot,
  Sparkles,
  CheckCircle2,
  CircleDot,
} from "lucide-react";

const coreFeatures = [
  {
    icon: User,
    title: "1. Self-Sovereign Identity (SSI)",
    desc: "Every user is issued a Decentralized Identifier (DID) they fully control.",
    bullets: [
      "Zero-Knowledge Proofs: Prove attributes (e.g., age over 18, citizenship) without revealing private data.",
      "DIDs are globally unique & user-owned; easily exportable or shareable.",
    ],
    tools: ["Hyperledger Aries", "Trinsic SDK", "zk-SNARKs", "Semaphore"],
    bg: "from-[#f2fce2] to-[#e5deff]",
  },
  {
    icon: ShieldCheck,
    title: "2. AI-Powered Threat Detection",
    desc: "Detect suspicious behavior & possible phishing using AI models.",
    bullets: [
      "Monitors login time, IP, device info for anomalies.",
      "Anomaly detection (Isolation Forest/Logistic Regression).",
      "Integrates phishing detection models from global datasets.",
    ],
    tools: [
      "Python",
      "Scikit-learn",
      "TensorFlow (optional)",
      "PhishTank",
      "Hugging Face",
      "Kaggle",
    ],
    bg: "from-[#fef7cd] to-[#e5deff]",
  },
  {
    icon: FileLock,
    title: "3. Blockchain Smart Contract for Risk Control",
    desc: "Risky identities can be frozen or logged on-chain.",
    bullets: [
      "Log every detected threat via Solidity contract.",
      "Can freeze/unfreeze access on high-risk activity.",
      "Current risk status is stored immutably for every user.",
    ],
    tools: ["Solidity", "Remix IDE", "MetaMask"],
    bg: "from-[#d3e4fd] to-[#e5deff]",
  },
  {
    icon: LayoutDashboard,
    title: "4. Real-Time Frontend Dashboard",
    desc: "All identity & threat activity accessible in secure, beautiful UI.",
    bullets: [
      "Easy DID creation & verification from dashboard.",
      "Live, color-coded threat alerts; one-click Freeze/Unfreeze.",
      "Display of Zero-Knowledge Proof credentials.",
    ],
    tools: ["React.js", "TailwindCSS", "HTML/CSS"],
    bg: "from-[#e5deff] to-[#f2fce2]",
  },
  {
    icon: Plug,
    title: "5. Backend Integration",
    desc: "AI-powered backend for security, seamlessly connected to smart contracts.",
    bullets: [
      "Python FastAPI backend receives logs, signals, & AI risk scores.",
      "Feeds threat data directly to blockchain contract.",
      "Frontend interacts with blockchain (Web3.js/Ethers.js).",
    ],
    tools: ["FastAPI", "Ethers.js", "Web3.js"],
    bg: "from-[#f2fce2] to-[#d6bcfa]",
  },
  {
    icon: Robot,
    title: "6. Optional AI Assistant",
    desc: "Get personalized, secure answers about your identity status.",
    bullets: [
      "Handles queries like: Was my identity used recently?",
      "Real-time, chat-based AI support anytime.",
    ],
    tools: ["LangChain", "ChatGPT API"],
    bg: "from-[#fef7cd] to-[#f1f0fb]",
  },
];

const optionalAdvanced = [
  {
    label: "Behavioral biometrics",
    icon: CheckCircle2,
    desc: "Track typing speed, mouse movement patterns for even deeper security."
  },
  {
    label: "Real-time phishing simulation",
    icon: CheckCircle2,
    desc: "Demo as user—see how phishing attacks are detected and blocked."
  },
  {
    label: "Visual risk dashboard",
    icon: CheckCircle2,
    desc: "Charts and visual logs showing identity activity, usage, and dynamic risk score."
  },
  {
    label: "Integration with Polygon ID",
    icon: CheckCircle2,
    desc: "Seamless advanced decentralized identity system compatibility."
  },
];

const StepByStepGuide = () => (
  <section
    className="w-full max-w-3xl mx-auto mb-10 relative z-10 px-2 sm:px-0"
    aria-label="Core Features — SovereignGuard"
  >
    <div className="rounded-2xl bg-white/70 dark:bg-black/60 backdrop-blur-xl shadow-lg p-6 sm:p-10 border border-white/40 ring-1 ring-black/10">
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient-primary drop-shadow">
          Core Features of <span className="text-primary">SovereignGuard</span>
        </h2>
        <div className="mt-2 text-base text-gray-600 dark:text-gray-300">
          The most advanced, secure, and practical SSI system—built with industry-best tools and real-world use in mind.
        </div>
      </div>
      <ol className="space-y-10">
        {coreFeatures.map((f, i) => (
          <li key={f.title} className="relative group">
            {/* Step icon & title */}
            <div className="flex items-start gap-5">
              <span
                className={`
                  shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                  bg-gradient-to-br ${f.bg} shadow
                  border-2 border-primary/20 group-hover:scale-110 transition-transform
                `}
              >
                <f.icon size={28} className="text-primary drop-shadow" />
              </span>
              <div>
                <h3 className="font-semibold text-xl md:text-2xl flex items-center gap-3 text-primary mb-1">
                  {f.title}
                </h3>
                <p className="mb-2 text-gray-700 dark:text-gray-200 text-base">{f.desc}</p>
                <ul className="list-disc text-[15px] pl-5 mb-2 text-gray-700 dark:text-gray-300 space-y-1">
                  {f.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-2">
                  {f.tools.map((tool) => (
                    <span key={tool} className="bg-primary/10 text-primary px-2.5 py-0.5 rounded text-xs font-semibold">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Progress line/edge connector */}
            {i < coreFeatures.length - 1 && (
              <div
                className="absolute left-6 top-16 h-[calc(100%-56px)] w-1 bg-gradient-to-b from-primary/20 to-transparent"
                aria-hidden
              />
            )}
          </li>
        ))}
      </ol>
      {/* Optional Advanced */}
      <div className="mt-14 pt-8 border-t border-dashed border-primary/20 relative">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center bg-gradient-to-br from-[#e0e7ff] via-[#fef7cd] to-[#f3e8ff] px-5 py-2 rounded-full shadow-md ring-2 ring-primary/10">
          <Sparkles className="text-yellow-500 mr-2" size={24} />
          <span className="font-semibold text-md text-gradient-primary">✨ Optional (Advanced) Features</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 mt-6">
          {optionalAdvanced.map((adv) => (
            <div
              key={adv.label}
              className="rounded-xl p-4 bg-gradient-to-tr from-[#fff9e3] to-[#e6e7fc] dark:from-[#22214d]/80 dark:to-[#37262f]/70
                border border-primary/10 shadow hover:shadow-xl transition hover:scale-[1.03] flex gap-3 items-start animate-fade-in"
            >
              <adv.icon className="text-success mt-1" size={22} />
              <div>
                <div className="font-medium text-md text-primary">{adv.label}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{adv.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default StepByStepGuide;

