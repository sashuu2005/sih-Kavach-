import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function MapView({ lat, lon, floodRisk, landslideRisk }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  if (!isLoaded) {
    return (
      <div className="h-[250px] sm:h-[360px] flex items-center justify-center text-[#A09E99]">
        Loading map…
      </div>
    );
  }

  return (
    <div className="h-[250px] sm:h-[360px] rounded-xl overflow-hidden border border-[#3E3D3B]/50 shadow-md">
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={{ lat, lng: lon }}
        zoom={11}
      >
        <Marker position={{ lat, lng: lon }} label={`Flood: ${floodRisk}`} />
        <Marker
          position={{ lat: lat + 0.01, lng: lon + 0.01 }}
          label={`Landslide: ${landslideRisk}`}
        />
      </GoogleMap>
    </div>
  );
}
