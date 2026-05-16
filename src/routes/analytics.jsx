import { createFileRoute } from "@tanstack/react-router";
import AppShell from "@/components/AppShell";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import {
  weeklyHours, productivityTrend, subjectDistribution, focusData,
} from "@/data/dummy";
import { TrendingUp, Brain, Clock, Award } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Studyflow" },
      { name: "description", content: "Track weekly study hours, focus trends and subject distribution with beautiful, real-time charts." },
    ],
  }),
  component: AnalyticsPage,
});

const tooltipStyle = {
  contentStyle: {
    background: "oklch(0.22 0.04 265 / 95%)",
    border: "1px solid oklch(1 0 0 / 10%)",
    borderRadius: 12,
    color: "white",
    fontSize: 12,
  },
  cursor: { fill: "oklch(1 0 0 / 4%)" },
};

function StatCard({ icon: Icon, label, value, delta, gradient }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} grid place-items-center text-white`}>
          <Icon size={20} />
        </div>
        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
          <TrendingUp size={12} /> {delta}
        </span>
      </div>
      <div className="text-2xl font-display font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <AppShell title="Analytics" subtitle="Insights from the past 7 weeks">
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Clock} label="Total Hours" value="38.7h" delta="+14%" gradient="from-violet-500 to-fuchsia-500" />
          <StatCard icon={Brain} label="Avg Focus" value="84%" delta="+6%" gradient="from-cyan-500 to-blue-500" />
          <StatCard icon={Award} label="Productivity" value="92" delta="+9%" gradient="from-emerald-500 to-teal-500" />
          <StatCard icon={TrendingUp} label="Best Day" value="Sat" delta="7.2h" gradient="from-amber-500 to-orange-500" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 xl:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-bold text-lg">Weekly study hours</h3>
                <p className="text-xs text-muted-foreground">Hours spent across all subjects</p>
              </div>
              <div className="flex gap-2 text-xs">
                {["Week", "Month", "Year"].map((p, i) => (
                  <button key={p}
                    className={`px-3 py-1.5 rounded-lg ${i === 0 ? "gradient-primary text-white font-semibold" : "glass text-muted-foreground"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart data={weeklyHours}>
                  <defs>
                    <linearGradient id="hoursG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                  <XAxis dataKey="day" stroke="oklch(1 0 0 / 40%)" fontSize={12} />
                  <YAxis stroke="oklch(1 0 0 / 40%)" fontSize={12} />
                  <Tooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#hoursG)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }} className="glass rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-1">Subject mix</h3>
            <p className="text-xs text-muted-foreground mb-4">Hours distribution this week</p>
            <div className="h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={subjectDistribution} dataKey="value" innerRadius={50} outerRadius={85} paddingAngle={3}>
                    {subjectDistribution.map((s, i) => (
                      <Cell key={i} fill={s.color} stroke="oklch(0.22 0.04 265)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {subjectDistribution.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-muted-foreground">{s.name}</span>
                  </div>
                  <span className="font-semibold">{s.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-1">Productivity trend</h3>
            <p className="text-xs text-muted-foreground mb-4">Weekly score over the last 7 weeks</p>
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={productivityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                  <XAxis dataKey="week" stroke="oklch(1 0 0 / 40%)" fontSize={12} />
                  <YAxis stroke="oklch(1 0 0 / 40%)" fontSize={12} domain={[40, 100]} />
                  <Tooltip {...tooltipStyle} />
                  <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3}
                    dot={{ fill: "#06b6d4", r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-1">Focus across the day</h3>
            <p className="text-xs text-muted-foreground mb-4">When your brain is sharpest</p>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={focusData}>
                  <defs>
                    <linearGradient id="focusG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3a5" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                  <XAxis dataKey="time" stroke="oklch(1 0 0 / 40%)" fontSize={12} />
                  <YAxis stroke="oklch(1 0 0 / 40%)" fontSize={12} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="focus" fill="url(#focusG)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg mb-4">Focus &amp; hours combined</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={weeklyHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
                <XAxis dataKey="day" stroke="oklch(1 0 0 / 40%)" fontSize={12} />
                <YAxis stroke="oklch(1 0 0 / 40%)" fontSize={12} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="focus" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
