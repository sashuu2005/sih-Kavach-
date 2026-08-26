import { useState } from "react";
import { Search, Trash2, History as HistoryIcon, X } from "lucide-react";
import { getHistory, clearHistory } from "../utils/historyStorage";
import HistoryCard from "../components/HistoryCard";

export default function History() {
  const [records, setRecords] = useState(() => getHistory());
  const [query, setQuery] = useState("");

  const clearAll = () => {
    clearHistory();
    setRecords([]);
  };

  const removeRecord = (recordToRemove) => {
    const nextRecords = records.filter((record) => record !== recordToRemove);
    localStorage.setItem("prediction_history", JSON.stringify(nextRecords));
    setRecords(nextRecords);
  };

  const filteredRecords = records.filter((item) =>
    item.city.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="w-full bg-[#2D2C2A] rounded-[2rem] shadow-xl
                    border border-[#3E3D3B]/50 p-6 sm:p-10 text-[#F0EFEA]">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-2 sm:gap-3 mb-3">
          <HistoryIcon className="text-[#A3B18A]" size={22} sm:size={26} />
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-[#F0EFEA]">
            Prediction History
          </h2>
        </div>
        <p className="text-[#A09E99] text-xs font-medium uppercase tracking-widest">
          Previously generated risk assessments
        </p>
      </div>

      {/* Clear Button */}
      {records.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8885]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by city"
              aria-label="Search prediction history by city"
              className="dark-input pl-9 pr-9 py-2.5 text-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear history search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8885] hover:text-[#F0EFEA]"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 text-xs font-medium
                       bg-[#D96B58]/10 border border-[#D96B58]/30
                       text-[#D96B58] px-4 py-2 rounded-lg hover:bg-[#D96B58]/20 transition-colors"
          >
            <Trash2 size={14} />
            Clear History
          </button>
        </div>
      )}

      {/* Content */}
      {records.length === 0 ? (
        <div className="text-center text-[#A09E99] text-sm py-20 font-medium tracking-wide">
          No prediction history available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((item, index) => (
            <HistoryCard key={`${item.city}-${item.date}-${index}`} item={item} onRemove={() => removeRecord(item)} />
          ))}
        </div>
      )}

      {records.length > 0 && filteredRecords.length === 0 && (
        <div className="text-center text-[#A09E99] text-sm py-12 font-medium">
          No assessments match &quot;{query}&quot;.
        </div>
      )}
    </div>
  );
}
