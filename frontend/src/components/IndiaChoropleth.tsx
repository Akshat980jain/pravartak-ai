import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

type StateData = { id: string; name: string; funds: number };

const INDIA_TOPO = "https://cdn.jsdelivr.net/npm/india-topojson@1.0.0/india.json";

const defaultData: StateData[] = [
  { id: "UP", name: "Uttar Pradesh", funds: 820 },
  { id: "MH", name: "Maharashtra", funds: 770 },
  { id: "BR", name: "Bihar", funds: 390 },
  { id: "TG", name: "Telangana", funds: 310 },
  { id: "AP", name: "Andhra Pradesh", funds: 420 },
  { id: "OD", name: "Odisha", funds: 260 },
  { id: "GJ", name: "Gujarat", funds: 480 },
  { id: "RJ", name: "Rajasthan", funds: 520 },
  { id: "WB", name: "West Bengal", funds: 450 },
  { id: "MP", name: "Madhya Pradesh", funds: 540 },
];

export default function IndiaChoropleth({ data = defaultData }: { data?: StateData[] }) {
  const [hover, setHover] = useState<StateData | null>(null);

  const range = useMemo(() => {
    const vals = data.map((d) => d.funds);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    return { min, max };
  }, [data]);

  function getColor(value: number) {
    const { min, max } = range;
    const t = (value - min) / (max - min || 1);
    // interpolate from light to dark green
    const g = Math.round(150 + t * 100);
    return `rgb(34, ${g}, 94)`;
  }

  function nameToFunds(geoName: string): StateData | undefined {
    const normalized = geoName.toLowerCase().replace(/\s+/g, "");
    return data.find((d) => d.name.toLowerCase().replace(/\s+/g, "") === normalized);
  }

  return (
    <div className="relative">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 900, center: [78.9629, 22.5] }}>
        <Geographies geography={INDIA_TOPO}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const nm = (geo.properties as any)?.name as string;
              const entry = nameToFunds(nm);
              const fill = entry ? getColor(entry.funds) : "#e2e8f0";
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => entry && setHover(entry)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    default: { fill, outline: "none", stroke: "#fff", strokeWidth: 0.5 },
                    hover: { fill, outline: "none", stroke: "#0ea5e9", strokeWidth: 1 },
                    pressed: { fill, outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {hover && (
        <div className="absolute left-2 bottom-2 rounded-md border bg-white/95 px-3 py-2 text-xs shadow">
          <div className="font-semibold">{hover.name}</div>
          <div>Funds: ₹ {hover.funds.toLocaleString()} Cr</div>
        </div>
      )}
    </div>
  );
}


