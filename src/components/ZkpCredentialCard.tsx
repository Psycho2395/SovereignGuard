
const ZkpCredentialCard = ({ did }: { did: string | null }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 min-h-[112px] items-start w-full">
    <div className="text-xs text-gray-400 mb-2">ZKP Credential</div>
    {!did ? (
      <span className="italic text-gray-300">Create your identity first</span>
    ) : (
      <div className="flex flex-col gap-1">
        <span className="text-md font-bold">Proof: Over 18</span>
        <span className="text-xs text-gray-500">
          Zero-Knowledge Proof verified. <span className="font-mono text-success">Credential: {did.slice(-8)}</span>
        </span>
        <span className="text-xs text-gray-400">No personal details revealed</span>
      </div>
    )}
  </div>
);

export default ZkpCredentialCard;
