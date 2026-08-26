import { AlertTriangle, CheckCircle, Calendar, MapPin, Trash2 } from "lucide-react";

export default function HistoryCard({ item, onRemove }) {
  return (
    <div className="bg-[#1A1A19] border border-[#3E3D3B]/50 rounded-xl p-6
                    hover:border-[#A3B18A]/40 transition-all hover:-translate-y-1 hover:shadow-lg">

      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="flex items-center gap-2 text-[#F0EFEA] font-serif text-xl tracking-wide">
            <MapPin size={16} className="text-[#A3B18A]" />
            {item.city}
          </div>
          <div className="flex items-center gap-2 text-[#A09E99] font-medium text-xs mt-1.5">
            <Calendar size={12} />
            {item.date}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.city} prediction`}
          className="p-2 rounded-lg text-[#8A8885] hover:bg-[#D96B58]/10 hover:text-[#D96B58] transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="flex gap-3">
        <RiskBadge label="Flood" value={item.flood} probability={item.flood_probability} />
        <RiskBadge label="Landslide" value={item.landslide} probability={item.landslide_probability} />
      </div>
    </div>
  );
}

function RiskBadge({ label, value, probability }) {
  const numericProbability = Number(probability);
  const high = Number.isFinite(numericProbability)
    ? numericProbability >= 0.6
    : value === "High";
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-wide uppercase
        ${high ? "bg-[#D96B58]/10 text-[#D96B58]" : "bg-[#A3B18A]/10 text-[#A3B18A]"}`}
    >
      {high ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
      {label}: {value}
    </div>
  );
}
