import {
  AlertTriangle,
  CheckCircle,
  CloudRain,
  Droplets,
  MapPin,
  Waves,
  Mountain,
  Leaf,
  History,
  Info
} from "lucide-react";
import MapView from "./MapView";

const getRiskConfig = (risk, prob) => {
  const probability = Number(prob);
  const isLowRisk = Number.isFinite(probability) ? probability < 0.6 : risk !== "High";

  if (!isLowRisk) {
    return {
      color: "text-[#D96B58]",
      bg: "bg-[#D96B58]/10",
      border: "border-[#D96B58]/30",
      barColor: "bg-[#D96B58]"
    };
  }

  return {
    color: "text-[#A3B18A]",
    bg: "bg-[#A3B18A]/10",
    border: "border-[#A3B18A]/30",
    barColor: "bg-[#A3B18A]"
  };
};

export default function ResultCard({ result }) {
  // 🔍 DEBUG (you can remove later)
  console.log("Map coords:", result.lat, result.lon);

  return (
    <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Section Title */}
      <div className="flex items-center gap-4 mb-8 opacity-60">
        <div className="h-px flex-1 bg-[#3E3D3B]" />
        <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#A09E99]">
          Computation Output
        </h3>
        <div className="h-px flex-1 bg-[#3E3D3B]" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={<MapPin className="text-[#A3B18A]" />}
          label="Target"
          value={result.city}
        />
        <StatCard
          icon={<CloudRain className="text-[#7A9E9F]" />}
          label="Rainfall"
          value={`${result.rainfall_mm} mm`}
        />
        <StatCard
          icon={<Droplets className="text-[#4F759B]" />}
          label="Humidity"
          value={`${result.humidity_percent}%`}
        />
        <StatCard
          icon={<Waves className="text-[#4F759B]" />}
          label="River Level"
          value={`${result.river_level} m`}
        />
        <StatCard
          icon={<Mountain className="text-[#D9AC6B]" />}
          label="Slope Angle"
          value={`${result.slope}°`}
        />
        <StatCard
          icon={<Leaf className="text-[#82A87A]" />}
          label="Vegetation"
          value={result.vegetation}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <StatCard
          icon={<History className="text-[#B292A5]" />}
          label="Past Events"
          value={result.past_events}
        />
        
        {/* Analysis Overview */}
        <div className="bg-[#1A1A19] p-5 rounded-xl border border-[#3E3D3B]/50 flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-[#2D2C2A] rounded-xl sm:mt-1">
            <Info className="text-[#F0EFEA]" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-medium text-[#A09E99] uppercase tracking-wider mb-1">
              Data Analysis
            </p>
            <p className="text-xs text-[#F0EFEA]/90 leading-relaxed font-normal">
              Geographical features were manually provided for <strong>{result.city || "this location"}</strong>. 
              {result.river_level > 8 ? " High river levels" : " Moderate river levels"} coupled with 
              {result.slope > 25 ? " steep slopes" : " mild terrain"} heavily influence the risk computations below.
            </p>
          </div>
        </div>
      </div>

      {/* Risk Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <RiskMeter title="Flood Probability" risk={result.flood_risk} prob={result.flood_probability} />
        <RiskMeter title="Landslide Probability" risk={result.landslide_risk} prob={result.landslide_probability} />
      </div>

      {/* 🗺️ GOOGLE MAP (THIS WAS MISSING BEFORE) */}
      {result.lat && result.lon && result.lat !== "N/A" && result.lon !== "N/A" && (
        <MapView
          lat={Number(result.lat)}
          lon={Number(result.lon)}
          floodRisk={result.flood_risk}
          landslideRisk={result.landslide_risk}
        />
      )}
    </div>
  );
}

/* ---------- Sub Components ---------- */

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-[#1A1A19] p-5 rounded-xl border border-[#3E3D3B]/50 flex items-center gap-4 transition-all hover:border-[#504F4C]">
      <div className="p-3 bg-[#2D2C2A] rounded-xl">{icon}</div>
      <div>
        <p className="text-[10px] font-medium text-[#A09E99] uppercase tracking-wider">
          {label}
        </p>
        <p className="text-lg font-medium text-[#F0EFEA]">{value}</p>
      </div>
    </div>
  );
}

function RiskMeter({ title, risk, prob }) {
  const cfg = getRiskConfig(risk, prob);
  const percent = prob != null ? (prob * 100).toFixed(1) + "%" : "";
  const defaultWidth = risk === "High" ? "100%" : risk === "Medium" ? "66%" : "33%";

  return (
    <div className={`p-6 sm:p-8 rounded-2xl border ${cfg.border} ${cfg.bg}`}>
      <div className="flex justify-between items-end mb-4">
        <div>
          <h4 className="text-[#A09E99] text-[10px] font-medium uppercase tracking-wider mb-1">
            {title}
          </h4>
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
             <p className={`text-3xl sm:text-4xl font-serif italic ${cfg.color}`}>{percent || risk}</p>
             {percent && <p className={`text-sm font-medium tracking-wide uppercase opacity-80 ${cfg.color}`}>{risk} RISK</p>}
          </div>
        </div>

        {risk === "High" ? (
          <AlertTriangle className={cfg.color} size={32} />
        ) : (
          <CheckCircle className={cfg.color} size={32} />
        )}
      </div>

      <div className="h-2 w-full bg-[#1A1A19] rounded-full overflow-hidden border border-[#3E3D3B]/30">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${cfg.barColor} shadow-sm`}
          style={{ width: percent || defaultWidth }}
        />
      </div>
    </div>
  );
}
