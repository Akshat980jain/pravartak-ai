import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface StateData {
  name: string;
  applicants: number;
  budgetAllocated: number;
  budgetDisbursed: number;
  coordinates: [number, number];
}

const stateData: StateData[] = [
  { name: "Uttar Pradesh", applicants: 125430, budgetAllocated: 2500, budgetDisbursed: 2100, coordinates: [26.8467, 80.9462] },
  { name: "Maharashtra", applicants: 98750, budgetAllocated: 2000, budgetDisbursed: 1750, coordinates: [19.7515, 75.7139] },
  { name: "Bihar", applicants: 85620, budgetAllocated: 1800, budgetDisbursed: 1450, coordinates: [25.0961, 85.3131] },
  { name: "West Bengal", applicants: 72340, budgetAllocated: 1500, budgetDisbursed: 1200, coordinates: [22.9868, 87.8550] },
  { name: "Madhya Pradesh", applicants: 65430, budgetAllocated: 1400, budgetDisbursed: 1100, coordinates: [22.9734, 78.6569] },
  { name: "Rajasthan", applicants: 58920, budgetAllocated: 1300, budgetDisbursed: 1050, coordinates: [27.0238, 74.2179] },
  { name: "Gujarat", applicants: 52340, budgetAllocated: 1200, budgetDisbursed: 950, coordinates: [23.0225, 72.5714] },
  { name: "Tamil Nadu", applicants: 48750, budgetAllocated: 1100, budgetDisbursed: 900, coordinates: [11.1271, 78.6569] },
  { name: "Karnataka", applicants: 45680, budgetAllocated: 1000, budgetDisbursed: 850, coordinates: [15.3173, 75.7139] },
  { name: "Andhra Pradesh", applicants: 42340, budgetAllocated: 950, budgetDisbursed: 800, coordinates: [15.9129, 79.7400] },
  { name: "Telangana", applicants: 38920, budgetAllocated: 900, budgetDisbursed: 750, coordinates: [18.1124, 79.0193] },
  { name: "Odisha", applicants: 35420, budgetAllocated: 850, budgetDisbursed: 700, coordinates: [20.9517, 85.0985] },
  { name: "Kerala", applicants: 32150, budgetAllocated: 800, budgetDisbursed: 650, coordinates: [10.8505, 76.2711] },
  { name: "Jharkhand", applicants: 28940, budgetAllocated: 750, budgetDisbursed: 600, coordinates: [23.6102, 85.2799] },
  { name: "Assam", applicants: 25680, budgetAllocated: 700, budgetDisbursed: 550, coordinates: [26.2006, 92.9376] },
  { name: "Punjab", applicants: 22340, budgetAllocated: 650, budgetDisbursed: 500, coordinates: [31.1471, 75.3412] },
  { name: "Haryana", applicants: 19850, budgetAllocated: 600, budgetDisbursed: 450, coordinates: [29.0588, 76.0856] },
  { name: "Chhattisgarh", applicants: 17560, budgetAllocated: 550, budgetDisbursed: 400, coordinates: [21.2787, 81.8661] },
  { name: "Himachal Pradesh", applicants: 12340, budgetAllocated: 400, budgetDisbursed: 300, coordinates: [31.1048, 77.1734] },
  { name: "Uttarakhand", applicants: 9870, budgetAllocated: 350, budgetDisbursed: 250, coordinates: [30.0668, 79.0193] },
  { name: "Tripura", applicants: 6540, budgetAllocated: 200, budgetDisbursed: 150, coordinates: [23.9408, 91.9882] },
  { name: "Meghalaya", applicants: 5430, budgetAllocated: 180, budgetDisbursed: 120, coordinates: [25.4670, 91.3662] },
  { name: "Manipur", applicants: 4320, budgetAllocated: 150, budgetDisbursed: 100, coordinates: [24.6637, 93.9063] },
  { name: "Nagaland", applicants: 3210, budgetAllocated: 120, budgetDisbursed: 80, coordinates: [26.1584, 94.5624] },
  { name: "Mizoram", applicants: 2890, budgetAllocated: 100, budgetDisbursed: 70, coordinates: [23.1645, 92.9376] },
  { name: "Arunachal Pradesh", applicants: 2150, budgetAllocated: 80, budgetDisbursed: 50, coordinates: [28.2180, 94.7278] },
  { name: "Sikkim", applicants: 1230, budgetAllocated: 50, budgetDisbursed: 30, coordinates: [27.5330, 88.5122] },
  { name: "Goa", applicants: 890, budgetAllocated: 40, budgetDisbursed: 25, coordinates: [15.2993, 74.1240] },
];

const IndiaMapLeaflet = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629], // Center of India
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Add state markers
    stateData.forEach((state) => {
      const marker = L.marker(state.coordinates, {
        icon: L.divIcon({
          className: "custom-marker",
          html: `<div class="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        }),
      });

      // Create popup content
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <h3 class="font-bold text-sm mb-2">${state.name}</h3>
          <div class="space-y-1 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-600">Applicants:</span>
              <span class="font-semibold">${state.applicants.toLocaleString()}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Budget Allocated:</span>
              <span class="font-semibold">₹ ${state.budgetAllocated} Cr</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Budget Disbursed:</span>
              <span class="font-semibold">₹ ${state.budgetDisbursed} Cr</span>
            </div>
            <div class="flex justify-between pt-1 border-t">
              <span class="text-gray-600">Utilization:</span>
              <span class="font-semibold text-green-600">${Math.round((state.budgetDisbursed / state.budgetAllocated) * 100)}%</span>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(map);
      markersRef.current.push(marker);

      // Add hover events
      marker.on("mouseover", () => {
        setHoveredState(state);
        marker.setIcon(
          L.divIcon({
            className: "custom-marker",
            html: `<div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })
        );
      });

      marker.on("mouseout", () => {
        setHoveredState(null);
        marker.setIcon(
          L.divIcon({
            className: "custom-marker",
            html: `<div class="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
          })
        );
      });
    });

    mapInstanceRef.current = map;

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Hover tooltip */}
      {hoveredState && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border p-4 z-[1000] min-w-[250px]">
          <h3 className="font-bold text-lg mb-3 text-gray-800">{hoveredState.name}</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Number of Applicants:</span>
              <span className="font-semibold text-blue-600">{hoveredState.applicants.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Budget Allocated:</span>
              <span className="font-semibold text-green-600">₹ {hoveredState.budgetAllocated} Cr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Budget Disbursed:</span>
              <span className="font-semibold text-orange-600">₹ {hoveredState.budgetDisbursed} Cr</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Utilization Rate:</span>
                <span className="font-semibold text-purple-600">
                  {Math.round((hoveredState.budgetDisbursed / hoveredState.budgetAllocated) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.round((hoveredState.budgetDisbursed / hoveredState.budgetAllocated) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndiaMapLeaflet;
