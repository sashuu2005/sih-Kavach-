import { useState } from "react";
import axios from "axios";
import {
  MapPin,
  Search,
  Loader2,
  X
} from "lucide-react";
import ResultCard from "./ResultCard";
import { saveHistory } from "../utils/historyStorage";


export default function PredictionForm() {
  // Initial state helper
  const initialState = {
    city: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const suggestedCities = ["Mumbai", "Pune", "Bengaluru", "Chennai"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const chooseCity = (city) => {
    setFormData({ city });
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSubmit = async () => {
    if (!formData.city) {
      setError("Please enter a target city to fetch live weather and geographical data.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const configuredApiUrl = import.meta.env.VITE_API_URL || "/api";
      const API_URL = configuredApiUrl === "https://kavach-api.onrender.com"
        ? "https://kavach-api-4tdx.onrender.com"
        : configuredApiUrl;
      const res = await axios.post(
        `${API_URL}/predict`,
        formData
      );

      setResult(res.data);
      saveHistory({
        city: res.data.city,
        flood: res.data.flood_risk,
        landslide: res.data.landslide_risk,
        flood_probability: res.data.flood_probability,
        landslide_probability: res.data.landslide_probability,
        date: new Date().toLocaleString()
      });


      // Reset form after successful prediction
      setFormData(initialState);

    } catch {
      setError("Failed to fetch analysis. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#142238]/95 rounded-[2rem] shadow-2xl shadow-black/35 border border-[#52647D]/60 p-6 sm:p-10 transition-all">

      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="mx-auto mb-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#66C7C2]">
          <span className="h-px w-8 bg-[#66C7C2]/50" />
          Live monitoring
          <span className="h-px w-8 bg-[#66C7C2]/50" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#F8FAFC] tracking-tight">
          Risk Assessment
        </h2>
        <p className="text-[#B8C4D6] mt-3 text-sm leading-relaxed max-w-md mx-auto">
          Turn local weather and terrain signals into a clear landslide and flood outlook.
        </p>
      </div>

      {/* Inputs */}
      <div className="mb-10 w-full flex flex-col gap-6">
        <Field
          label="Target City"
          desc="Fetches real-time weather & geographical data"
          icon={<MapPin size={16} className="text-[#A3B18A]" />}
        >
          <div className="relative">
            <input
              name="city"
              value={formData.city}
              placeholder="e.g. Mumbai"
              className="dark-input w-full"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoComplete="address-level2"
            />
            {formData.city && (
              <button
                type="button"
                onClick={() => chooseCity("")}
                aria-label="Clear city"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#A09E99] hover:text-[#F0EFEA]"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-2 -mt-5 mb-8">
        <span className="text-[10px] uppercase tracking-wider text-[#8A8885]">Try a city</span>
        {suggestedCities.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => chooseCity(city)}
            className={`rounded-full border px-3 py-1.5 text-[11px] transition-colors ${
              formData.city === city
                ? "border-[#D96B58]/60 bg-[#D96B58]/15 text-[#F0EFEA]"
                : "border-[#3E3D3B] text-[#A09E99] hover:border-[#A3B18A]/60 hover:text-[#F0EFEA]"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full flex justify-center items-center gap-3
                   bg-[#F2A65A] hover:bg-[#FFC078] text-[#111827] 
                   py-4 rounded-xl font-medium text-base shadow-lg
                   shadow-[#F2A65A]/25 transition-all
                   hover:-translate-y-0.5 active:translate-y-0
                   disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
        {loading ? "Analyzing Data..." : "Run Risk Analysis"}
      </button>

      {/* Error */}
      {error && (
        <p className="text-[#D96B58] text-sm mt-4 text-center font-medium">
          {error}
        </p>
      )}

      {/* Result */}
      {result && <ResultCard result={result} />}
    </div>
  );
}

/* ---------- Field Component ---------- */

function Field({ icon, label, desc, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center px-1 mb-1">
        <label className="text-xs font-medium text-[#F0EFEA] flex items-center gap-2">
          {icon} {label}
        </label>
        <span className="text-[10px] text-[#A09E99]">
          {desc}
        </span>
      </div>
      {children}
    </div>
  );
}
