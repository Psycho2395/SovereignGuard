
const demoLogins = [
  {
    time: "2025-05-20 09:12",
    ip: "192.168.1.25",
    device: "Chrome on Windows",
    risk: "Low",
    comment: "",
  },
  {
    time: "2025-05-21 14:41",
    ip: "45.223.91.51",
    device: "Safari on iPhone",
    risk: "Medium",
    comment: "Unusual geo-location",
  },
  {
    time: "2025-05-21 19:27",
    ip: "178.55.33.19",
    device: "Firefox on Ubuntu",
    risk: "High",
    comment: "Phishing detected",
  },
];

const riskBg = {
  Low: "bg-success/10 text-success",
  Medium: "bg-warning/10 text-warning",
  High: "bg-error/10 text-error",
};

const ThreatLog = () => (
  <div className="p-6 font-inter">
    <h2 className="text-2xl font-bold mb-4">Threat Logs</h2>
    <div className="overflow-x-auto">
      <table className="min-w-[480px] w-full border-collapse shadow rounded-xl bg-white">
        <thead>
          <tr className="bg-muted text-muted-foreground text-sm">
            <th className="py-3 pl-3 pr-2 text-left font-semibold">Time</th>
            <th className="py-3 px-2 text-left font-semibold">IP</th>
            <th className="py-3 px-2 text-left font-semibold">Device</th>
            <th className="py-3 px-2 text-left font-semibold">Risk</th>
            <th className="py-3 px-2 text-left font-semibold">Comment</th>
          </tr>
        </thead>
        <tbody>
          {demoLogins.map((log, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition">
              <td className="py-2 pl-3 pr-2 font-mono text-xs">{log.time}</td>
              <td className="py-2 px-2 font-mono text-xs">{log.ip}</td>
              <td className="py-2 px-2 text-sm">{log.device}</td>
              <td className={`py-2 px-2 text-sm font-semibold ${riskBg[log.risk as keyof typeof riskBg]} rounded`}>
                {log.risk}
              </td>
              <td className="py-2 px-2 text-xs">{log.comment || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="text-xs text-gray-400 mt-3">
      Logs are simulated/demo – AI risk analysis & smart contract link coming soon
    </div>
  </div>
);

export default ThreatLog;
