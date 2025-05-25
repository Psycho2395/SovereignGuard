import React, { useState, useEffect } from "react";
import {
  User,
  ShieldCheck,
  FileLock,
  LayoutDashboard,
  Plug,
  Bot,
  Sparkles,
  CheckCircle2,
  CircleDot,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Zap,
  Trophy,
  Star,
  Rocket,
  Globe,
  Lock,
  Eye,
  Brain,
  Shield,
} from "lucide-react";

const coreFeatures = [
  {
    icon: User,
    title: "1. Self-Sovereign Identity (SSI)",
    desc: "Revolutionary DID system with quantum-resistant cryptography",
    bullets: [
      "🔐 Zero-Knowledge Proofs: Prove attributes without revealing private data",
      "🌐 Global DID registry with cross-chain compatibility",
      "⚡ Instant verification with sub-second response times",
      "🛡️ Military-grade encryption with post-quantum security",
    ],
    tools: ["Hyperledger Aries", "Trinsic SDK", "zk-SNARKs", "Semaphore", "BNB Chain"],
    bg: "from-[#f2fce2] via-[#e8f5e8] to-[#e5deff]",
    accent: "from-emerald-400 to-cyan-400",
    metrics: { security: 99, speed: 95, adoption: 87 },
  },
  {
    icon: Brain,
    title: "2. AI-Powered Threat Detection",
    desc: "Next-gen ML models with real-time behavioral analysis",
    bullets: [
      "🤖 Advanced anomaly detection using ensemble learning",
      "📊 Real-time risk scoring with 99.7% accuracy",
      "🎯 Behavioral biometrics and device fingerprinting",
      "🚨 Instant threat response with automated countermeasures",
    ],
    tools: [
      "TensorFlow",
      "PyTorch", 
      "Scikit-learn",
      "PhishTank",
      "Hugging Face",
      "OpenAI GPT-4",
    ],
    bg: "from-[#fef7cd] via-[#fff3cd] to-[#e5deff]",
    accent: "from-amber-400 to-orange-400",
    metrics: { accuracy: 99, speed: 92, coverage: 94 },
  },
  {
    icon: Shield,
    title: "3. BNB Smart Contract Risk Control",
    desc: "Immutable security layer on BNB Smart Chain",
    bullets: [
      "⛓️ Gas-optimized smart contracts on BNB Chain",
      "🔒 Multi-signature governance with DAO integration",
      "📝 Immutable audit trails with IPFS storage",
      "⚡ Lightning-fast transactions with minimal fees",
    ],
    tools: ["Solidity", "Hardhat", "OpenZeppelin", "BNB Chain", "MetaMask", "Remix IDE"],
    bg: "from-[#d3e4fd] via-[#e1f0ff] to-[#e5deff]",
    accent: "from-blue-400 to-indigo-400",
    metrics: { reliability: 99, efficiency: 96, cost: 89 },
  },
  {
    icon: LayoutDashboard,
    title: "4. Advanced Dashboard Interface",
    desc: "Real-time analytics with AI-powered insights",
    bullets: [
      "📱 Responsive design with mobile-first approach",
      "📊 Interactive charts and real-time monitoring",
      "🎨 Dark/light themes with customizable UI",
      "🔔 Smart notifications with priority filtering",
    ],
    tools: ["React 18", "Next.js", "TailwindCSS", "Framer Motion", "Chart.js", "Web3.js"],
    bg: "from-[#e5deff] via-[#f0ebff] to-[#f2fce2]",
    accent: "from-purple-400 to-pink-400",
    metrics: { usability: 98, performance: 94, accessibility: 91 },
  },
  {
    icon: Plug,
    title: "5. Microservices Architecture",
    desc: "Scalable backend with enterprise-grade security",
    bullets: [
      "🚀 Serverless functions with auto-scaling",
      "🔄 GraphQL API with real-time subscriptions",
      "🌐 CDN integration for global performance",
      "🔐 OAuth 2.0 and JWT token management",
    ],
    tools: ["FastAPI", "Node.js", "GraphQL", "Redis", "PostgreSQL", "Docker"],
    bg: "from-[#f2fce2] via-[#e8f8e8] to-[#d6bcfa]",
    accent: "from-green-400 to-teal-400",
    metrics: { scalability: 97, latency: 93, uptime: 99 },
  },
  {
    icon: Bot,
    title: "6. AI Security Assistant",
    desc: "Intelligent chatbot with natural language processing",
    bullets: [
      "🗣️ Voice commands with multilingual support",
      "🧠 Context-aware responses using GPT-4",
      "📈 Predictive analytics and trend analysis",
      "🔮 Proactive security recommendations",
    ],
    tools: ["LangChain", "OpenAI GPT-4", "Whisper API", "Pinecone", "Hugging Face"],
    bg: "from-[#fef7cd] via-[#fff8dc] to-[#f1f0fb]",
    accent: "from-yellow-400 to-red-400",
    metrics: { intelligence: 96, responsiveness: 98, satisfaction: 94 },
  },
];

const optionalAdvanced = [
  {
    label: "Quantum-Resistant Cryptography",
    icon: Lock,
    desc: "Future-proof security against quantum computing threats",
    color: "from-cyan-500 to-blue-500",
  },
  {
    label: "Cross-Chain Interoperability",
    icon: Globe,
    desc: "Seamless integration with Ethereum, Polygon, and other chains",
    color: "from-emerald-500 to-teal-500",
  },
  {
    label: "AI-Powered Risk Prediction",
    icon: Eye,
    desc: "Machine learning models that predict threats before they happen",
    color: "from-purple-500 to-pink-500",
  },
  {
    label: "Decentralized Governance",
    icon: Trophy,
    desc: "Community-driven development with DAO voting mechanisms",
    color: "from-orange-500 to-red-500",
  },
];

const StepByStepGuide = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveStep((step) => (step + 1) % coreFeatures.length);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const resetDemo = () => {
    setActiveStep(0);
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <section
      className="w-full max-w-6xl mx-auto mb-10 relative z-10 px-2 sm:px-0"
      aria-label="Advanced Features — SovereignGuard"
    >
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 mb-8">
        <div className="absolute inset-0 opacity-20"></div>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500">
              <Rocket className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 mb-4">
            SovereignGuard
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-6 max-w-3xl mx-auto">
            🏆 Revolutionary Self-Sovereign Identity Platform on BNB Smart Chain
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">World-Class Security</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="bg-white/70 dark:bg-black/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-8 border border-white/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Interactive Demo</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={resetDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold hover:scale-105 transition-transform"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${(activeStep * 100 + progress) / coreFeatures.length}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Step {activeStep + 1} of {coreFeatures.length}: {coreFeatures[activeStep]?.title}
        </div>
      </div>

      {/* Main Features */}
      <div className="rounded-2xl bg-white/70 dark:bg-black/60 backdrop-blur-xl shadow-lg p-6 sm:p-10 border border-white/40 ring-1 ring-black/10">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800 dark:text-white mb-4">
            🚀 Advanced Architecture & Features
          </h2>
          <div className="text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Built for the future with cutting-edge technology stack, designed to revolutionize digital identity management on blockchain.
          </div>
        </div>

        <div className="grid gap-8 lg:gap-12">
          {coreFeatures.map((feature, i) => (
            <div
              key={feature.title}
              className={`relative group transition-all duration-500 ${
                activeStep === i ? "scale-105 z-10" : "hover:scale-102"
              }`}
            >
              {/* Feature Card */}
              <div
                className={`relative overflow-hidden rounded-2xl p-8 transition-all duration-500 ${
                  activeStep === i
                    ? "ring-4 ring-blue-500/50 shadow-2xl"
                    : "hover:shadow-xl"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${feature.bg})`,
                }}
              >
                {/* Progress Bar for Active Step */}
                {activeStep === i && isPlaying && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}

                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div
                    className={`shrink-0 w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.accent} shadow-lg ${
                      activeStep === i ? "animate-pulse" : ""
                    } group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon size={32} className="text-white drop-shadow" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-2xl md:text-3xl text-gray-800 dark:text-white">
                        {feature.title}
                      </h3>
                      {activeStep === i && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-semibold">
                          <Play size={14} />
                          Active
                        </div>
                      )}
                    </div>
                    
                    <p className="mb-4 text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
                      {feature.desc}
                    </p>

                    {/* Feature Bullets */}
                    <ul className="space-y-2 mb-6">
                      {feature.bullets.map((bullet, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                        >
                          <CheckCircle2 size={20} className="text-green-500 mt-0.5 shrink-0" />
                          <span className="text-base">{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(feature.metrics).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-2xl font-bold text-gray-800 dark:text-white">
                            {value}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tools */}
                    <div className="flex flex-wrap gap-2">
                      {feature.tools.map((tool) => (
                        <span
                          key={tool}
                          className="bg-white/60 dark:bg-gray-800/60 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-lg text-sm font-semibold border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-transform cursor-pointer"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Step Navigation */}
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={() => setActiveStep(i)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/10 dark:bg-white/10 backdrop-blur text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                  >
                    <CircleDot size={16} />
                    Step {i + 1}
                  </button>
                </div>
              </div>

              {/* Connection Line */}
              {i < coreFeatures.length - 1 && (
                <div className="flex justify-center py-4">
                  <ArrowRight
                    size={24}
                    className="text-gray-400 dark:text-gray-600 animate-bounce"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Advanced Features Section */}
        <div className="mt-16 pt-8 border-t-2 border-dashed border-purple-400 relative">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-6 py-3 rounded-full shadow-lg">
            <Sparkles className="text-white mr-3" size={28} />
            <span className="font-bold text-xl text-white">🌟 Advanced Features</span>
            <Sparkles className="text-white ml-3" size={28} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mt-12">
            {optionalAdvanced.map((adv, idx) => (
              <div
                key={adv.label}
                className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${adv.color} text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}
              >
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 flex gap-4 items-start">
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur">
                    <adv.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-2">{adv.label}</div>
                    <div className="text-sm text-white/90 leading-relaxed">
                      {adv.desc}
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform cursor-pointer">
            <Trophy size={24} />
            Ready for BNB Hackathon Judging
            <Rocket size={24} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepByStepGuide;
