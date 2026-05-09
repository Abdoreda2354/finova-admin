import { useState, useEffect } from "react";
import apiClient from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { kpiData } from "@/data/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,

} from "recharts";
import { Users } from "lucide-react";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const kpis = [{ label: "Total Users", icon: Users }];

// ── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "hsl(220 20% 10%)",
        border: "1px solid hsl(192 47% 47% / 0.35)",
        borderRadius: 10,
        padding: "8px 14px",
        boxShadow: "0 8px 24px hsl(192 47% 30% / 0.25)",
      }}
    >
      <p style={{ color: "hsl(192 47% 70%)", fontSize: 11, marginBottom: 2, letterSpacing: "0.06em" }}>
        {label}
      </p>
      <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>
        {payload[0].value.toLocaleString()}
        <span style={{ fontSize: 11, fontWeight: 400, color: "hsl(192 47% 65%)", marginLeft: 4 }}>users</span>
      </p>
    </div>
  );
};

// ── Custom Active Dot ────────────────────────────────────────────────────────
const CustomActiveDot = (props: any) => {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill="hsl(192 47% 47% / 0.2)" />
      <circle cx={cx} cy={cy} r={5}  fill="hsl(192 47% 60%)" stroke="#fff" strokeWidth={2} />
    </g>
  );
};

export default function Dashboard() {
  const [totalUsers, setTotalUsers]       = useState(0);
  const [userGrowthData, setUserGrowthData] = useState<{ month: number; count: number }[]>([]);
  const [selectedYear, setSelectedYear]   = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const totalResponse = await apiClient.get("/api/admin/stats/total-users");
        setTotalUsers(totalResponse.data);

        const chartResponse = await apiClient.get("/api/admin/stats/monthly-registrations", {
          params: { year: selectedYear },
        });
        setUserGrowthData(chartResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, [selectedYear]);

  // Map month numbers → { month: "Apr", users: 1 }
  const chartData = userGrowthData.map((d) => ({
    month: MONTH_NAMES[(d.month - 1 + 12) % 12],
    users: d.count,
  }));

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="space-y-6 flex flex-col items-center w-full">
      <h1 className="text-4xl font-bold text-primary">Dashboard</h1>

      {/* KPI Card */}
      <div className="w-11/12 max-w-6xl">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <k.icon className="h-4 w-4 text-accent" />
                <span className="text-xs text-muted-foreground">{k.label}</span>
              </div>
              <p className="text-5xl font-bold text-primary">{totalUsers.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Growth Chart */}
      <div className="w-11/12 max-w-6xl">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Users Growth</CardTitle>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-sm border rounded px-2 py-1"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </CardHeader>

          <CardContent>
            {chartData.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                No data for {selectedYear}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  {/* Gradient fill */}
                  <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="hsl(192,47%,47%)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(192,47%,47%)" stopOpacity={0}   />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="hsl(220 15% 88%)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(220 10% 55%)" }}
                    dy={6}
                  />
                  <YAxis
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(220 10% 55%)" }}
                    allowDecimals={false}
                    // If all values are small, give a sensible domain
                    domain={[0, (max: number) => Math.max(max + 1, 5)]}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: "hsl(192 47% 47% / 0.3)", strokeWidth: 1, strokeDasharray: "4 4" }}
                  />

                  {/* Gradient area */}
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="none"
                    fill="url(#userGradient)"
                    isAnimationActive={true}
                    animationDuration={800}
                  />

                  {/* Main line */}
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(192,47%,47%)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "hsl(192,47%,47%)", stroke: "#fff", strokeWidth: 2 }}
                    activeDot={<CustomActiveDot />}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}