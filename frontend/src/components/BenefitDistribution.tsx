import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SectorCount = { sector: string; count: number };

const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || "http://localhost:4000/api";

const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-indigo-500",
];

export default function BenefitDistribution() {
  const [data, setData] = useState<SectorCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/reports/benefit-distribution`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return (await r.json()) as SectorCount[];
      })
      .then((rows) => {
        if (!cancelled) {
          setData(rows);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message || "Failed to load");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const max = data.reduce((m, r) => Math.max(m, r.count), 0) || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Benefit Distribution</CardTitle>
        <CardDescription>Applications by sector (from current schemes)</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="space-y-5">
            {data.length === 0 && (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
            {data.map((row, idx) => {
              const width = `${Math.round((row.count / max) * 100)}%`;
              const color = colors[idx % colors.length];
              return (
                <div key={row.sector}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{row.sector}</span>
                    <span className="text-sm font-semibold">{row.count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className={`${color} h-2 rounded-full`} style={{ width }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


