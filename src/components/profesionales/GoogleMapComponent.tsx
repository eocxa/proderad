import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || "";
const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY";

export default function GoogleMapComponent() {
  if (!hasValidKey) {
    return (
      <div className="w-full h-[400px] bg-surface-container rounded-3xl flex items-center justify-center border border-outline-variant/30 p-8 text-center">
        <div className="max-w-md">
          <h3 className="text-xl font-bold text-primary mb-4">Se requiere una API Key de Google Maps</h3>
          <p className="text-sm text-outline mb-6">
            Para ver el mapa interactivo, por favor agrega tu API Key en la sección de <strong>Secrets</strong> de AI Studio con el nombre <code>GOOGLE_MAPS_PLATFORM_KEY</code>.
          </p>
          <div className="text-xs text-secondary font-mono bg-white p-4 rounded-xl border border-secondary/20">
            Paseo de la Reforma 483, Cuauhtémoc, CDMX
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/20">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={{ lat: 19.4231, lng: -99.1751 }}
          defaultZoom={15}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          style={{ width: "100%", height: "100%" }}
          gestureHandling="greedy"
          disableDefaultUI={true}
        >
          <AdvancedMarker position={{ lat: 19.4231, lng: -99.1751 }}>
            <Pin background="#003049" glyphColor="#fff" borderColor="#50d9fe" />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}
