import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Clock, CheckCircle2, Target, Flame, TrendingUp, Play, Pause, RotateCcw,
  Plus, BookOpen, Bell, ChevronRight, Circle, CheckCircle, Trash2, X,
  Timer, StickyNote, Pencil,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  stats, schedule as initialSchedule, tasks as initialTasks, goals, exams as initialExams, activity,
  notes as initialNotes,
} from "@/data/dummy";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const iconMap = { Clock, CheckCircle2, Target, Flame };
const toneMap = {
  primary: "from-violet-500/30 to-violet-500/0 text-violet-300",
  accent: "from-cyan-500/30 to-cyan-500/0 text-cyan-300",
  success: "from-emerald-500/30 to-emerald-500/0 text-emerald-300",
  warning: "from-amber-500/30 to-amber-500/0 text-amber-300",
};

export function WelcomeBanner() {
  const [profile] = useLocalStorage("sp.profile", { name: "Aditya Kumar", nickname: "Adi" });
  const [streak] = useLocalStorage("sp.streak", { count: 0 });
  const name = profile.nickname || profile.name.split(" ")[0] || "Student";
  
  return (
    <div className="relative overflow-hidden rounded-2xl glass p-6 sm:p-8">
      <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("en", { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mt-2">
            Welcome back, <span className="gradient-text">{name}</span> 👋
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl">
            You're on a <span className="text-orange-400 font-bold">{streak.count}-day streak</span>. Keep your study rhythm going today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/planner" className="glass px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition text-center">
            View planner
          </Link>
          <Link to="/tool/focustime" className="gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold glow hover:opacity-90 transition text-center">
            Start focus session
          </Link>
        </div>
      </div>
    </div>
  );
}

export function StatsGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = iconMap[s.icon];
        return (
          <div key={s.label} className="glass rounded-2xl p-5 hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${toneMap[s.tone]} grid place-items-center`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <TrendingUp size={12} /> {s.delta}
              </span>
            </div>
            <div className="text-2xl font-display font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export function DailyProgress() {
  const items = [
    { label: "Study time", value: 75, color: "bg-gradient-to-r from-violet-500 to-fuchsia-500" },
    { label: "Tasks", value: 60, color: "bg-gradient-to-r from-cyan-500 to-blue-500" },
    { label: "Focus", value: 88, color: "bg-gradient-to-r from-emerald-500 to-teal-500" },
  ];
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-bold text-lg">Daily progress</h3>
          <p className="text-xs text-muted-foreground">You're 74% to today's plan</p>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
          Details <ChevronRight size={14} />
        </button>
      </div>
      <div className="space-y-5">
        {items.map((it) => (
          <div key={it.label}>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">{it.label}</span>
              <span className="font-semibold">{it.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div className={`h-full ${it.color}`} style={{ width: `${it.value}%`, transition: "width 800ms ease" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const colorBar = {
  primary: "bg-violet-500", accent: "bg-cyan-500",
  success: "bg-emerald-500", warning: "bg-amber-500",
};

export function TodaySchedule() {
  const [blocks] = useLocalStorage("sp.plannerBlocks", []);
  const todayDay = new Date().toLocaleDateString("en", { weekday: "short" });
  
  // Filter blocks for today or show dummy if empty
  const items = blocks.length > 0 
    ? blocks.filter(b => b.day === todayDay).sort((a, b) => a.hour.localeCompare(b.hour))
    : initialSchedule;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-bold text-lg">Today's schedule</h3>
        <a href="/planner" className="text-xs glass px-3 py-1.5 rounded-lg hover:bg-white/5">+ Add</a>
      </div>
      <div className="space-y-2">
        {items.map((s, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition">
            <div className="text-xs font-mono text-muted-foreground w-12">{s.hour || s.time}</div>
            <div className={`w-1 self-stretch rounded-full ${colorBar[s.color] || "bg-primary"}`} />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{s.title}</div>
              <div className="text-xs text-muted-foreground">{s.subject} · {s.duration || "1h"}</div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-sm text-muted-foreground">Nothing scheduled for today ☕</div>
        )}
      </div>
    </div>
  );
}

const priorityChip = {
  High: "bg-rose-500/20 text-rose-300",
  Medium: "bg-amber-500/20 text-amber-300",
  Low: "bg-emerald-500/20 text-emerald-300",
};

export function TaskManager() {
  const [items, setItems] = useLocalStorage("sp.tasks", initialTasks);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ title: "", subject: "Math", priority: "Medium" });

  const toggle = (id) => setItems(items.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id) => setItems(items.filter((t) => t.id !== id));
  const add = () => {
    if (!draft.title.trim()) return;
    setItems([{ id: Date.now(), title: draft.title, subject: draft.subject, priority: draft.priority, due: "Today", done: false }, ...items]);
    setDraft({ title: "", subject: "Math", priority: "Medium" });
    setAdding(false);
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-bold text-lg">Tasks</h3>
          <p className="text-xs text-muted-foreground">
            {items.filter((t) => !t.done).length} open · {items.filter((t) => t.done).length} done
          </p>
        </div>
        <button onClick={() => setAdding(!adding)}
          className="gradient-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
          <Plus size={14} /> Add
        </button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <input autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && add()}
                placeholder="Task title…"
                className="w-full bg-transparent text-sm outline-none" />
              <div className="flex gap-2">
                <select value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                  className="flex-1 bg-background/60 rounded-lg px-2 py-1.5 text-xs outline-none">
                  {["Math", "Chemistry", "CS", "History", "Biology", "Language"].map((s) => <option key={s}>{s}</option>)}
                </select>
                <select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
                  className="bg-background/60 rounded-lg px-2 py-1.5 text-xs outline-none">
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
                <button onClick={add} className="gradient-primary text-white text-xs font-semibold px-3 rounded-lg">Save</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-1.5 max-h-[340px] overflow-y-auto scrollbar-hide pr-1">
        {items.map((t) => (
          <div key={t.id} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition">
            <button onClick={() => toggle(t.id)} className="shrink-0">
              {t.done
                ? <CheckCircle className="text-emerald-400" size={20} />
                : <Circle className="text-muted-foreground hover:text-foreground" size={20} />}
            </button>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium truncate ${t.done ? "line-through text-muted-foreground" : ""}`}>
                {t.title}
              </div>
              <div className="text-xs text-muted-foreground">{t.subject} · {t.due}</div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${priorityChip[t.priority]}`}>{t.priority}</span>
            <button onClick={() => remove(t.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-400 transition">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">No tasks yet — add your first one ✨</div>
        )}
      </div>
    </div>
  );
}

export function PomodoroTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("Focus");
  const total = mode === "Focus" ? 25 * 60 : 5 * 60;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => { setSeconds(total); setRunning(false); }, [mode, total]);

  const pct = ((total - seconds) / total) * 100;
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  const r = 88;
  const c = 2 * Math.PI * r;

  return (
    <div id="focus" className="glass rounded-2xl p-6 flex flex-col items-center text-center">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="font-display font-bold text-lg">Pomodoro</h3>
        <div className="flex gap-1 text-xs">
          {["Focus", "Break"].map((m2) => (
            <button key={m2} onClick={() => setMode(m2)}
              className={`px-2.5 py-1 rounded-full ${mode === m2 ? "gradient-primary text-white font-semibold" : "bg-white/5 text-muted-foreground"}`}>
              {m2}
            </button>
          ))}
        </div>
      </div>
      <div className="relative my-2">
        <svg width="220" height="220" className="-rotate-90">
          <circle cx="110" cy="110" r={r} stroke="oklch(1 0 0 / 6%)" strokeWidth="10" fill="none" />
          <circle cx="110" cy="110" r={r}
            stroke="url(#pomo)" strokeWidth="10" fill="none"
            strokeDasharray={c}
            strokeDashoffset={c - (pct / 100) * c}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }} />
          <defs>
            <linearGradient id="pomo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div>
            <div className="text-4xl font-display font-bold tabular-nums">{m}:{s}</div>
            <div className="text-xs text-muted-foreground mt-1">{mode} session</div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <button onClick={() => setRunning(!running)}
          className="gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 glow">
          {running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
        </button>
        <button onClick={() => { setSeconds(total); setRunning(false); }}
          className="glass p-2.5 rounded-xl">
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}

/* Real study stopwatch — tracks total study time, persists across reloads */
export function StudyStopwatch() {
  const [elapsed, setElapsed] = useLocalStorage("sp.studyTotal", 0); // in seconds, all time
  const [today, setToday] = useLocalStorage("sp.studyToday", { date: "", seconds: 0 });
  const [running, setRunning] = useState(false);
  const startRef = useRef(null);

  const todayKey = new Date().toISOString().slice(0, 10);
  useEffect(() => {
    if (today.date !== todayKey) setToday({ date: todayKey, seconds: 0 });
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    const id = setInterval(() => {
      setElapsed((e) => e + 1);
      setToday((t) => ({ date: todayKey, seconds: (t.date === todayKey ? t.seconds : 0) + 1 }));
    }, 1000);
    return () => clearInterval(id);
  }, [running]); // eslint-disable-line

  const fmt = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer size={18} className="text-primary" />
          <h3 className="font-display font-bold text-lg">Study stopwatch</h3>
        </div>
        {running && <span className="text-[10px] font-bold flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
        </span>}
      </div>

      <div className="text-center py-3">
        <div className="text-5xl font-display font-bold tabular-nums gradient-text">{fmt(today.date === todayKey ? today.seconds : 0)}</div>
        <div className="text-xs text-muted-foreground mt-2">Today's focused study time</div>
      </div>

      <div className="flex items-center gap-2 justify-center mt-3">
        <button onClick={() => setRunning(!running)}
          className="gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 glow">
          {running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
        </button>
        <button onClick={() => { setRunning(false); setToday({ date: todayKey, seconds: 0 }); }}
          className="glass p-2.5 rounded-xl" title="Reset today">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 text-center">
        <div className="text-xs text-muted-foreground">All-time studied</div>
        <div className="text-sm font-semibold tabular-nums mt-1">{fmt(elapsed)}</div>
      </div>
    </div>
  );
}

export function WeeklyGoals() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-bold text-lg">Weekly goals</h3>
        <span className="text-xs text-muted-foreground">May 12 – 18</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {goals.map((g) => (
          <div key={g.name} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-sm">{g.name}</div>
                <div className="text-xs text-muted-foreground">{g.target}</div>
              </div>
              <CircularBar value={g.progress} color={g.color} />
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className={`h-full ${colorBar[g.color]}`} style={{ width: `${g.progress}%`, transition: "width 800ms ease" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CircularBar({ value, color }) {
  const r = 18, c = 2 * Math.PI * r;
  const stroke = { primary: "#8b5cf6", accent: "#06b6d4", success: "#22d3a5", warning: "#f5b942" }[color];
  return (
    <div className="relative w-12 h-12">
      <svg width="48" height="48" className="-rotate-90">
        <circle cx="24" cy="24" r={r} stroke="oklch(1 0 0 / 8%)" strokeWidth="4" fill="none" />
        <circle cx="24" cy="24" r={r} stroke={stroke} strokeWidth="4" fill="none"
          strokeDasharray={c} strokeDashoffset={c - (value / 100) * c} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-[10px] font-bold">{value}%</div>
    </div>
  );
}

const stickyColors = {
  yellow: "bg-amber-300/15 border-amber-300/30 text-amber-100",
  pink: "bg-pink-400/15 border-pink-400/30 text-pink-100",
  cyan: "bg-cyan-400/15 border-cyan-400/30 text-cyan-100",
  green: "bg-emerald-400/15 border-emerald-400/30 text-emerald-100",
  violet: "bg-violet-400/15 border-violet-400/30 text-violet-100",
};

/* Sticky notes — full CRUD, persistent. Use as widget OR full page (compact prop) */
export function StickyNotes({ compact = false }) {
  const seed = initialNotes.map((n, i) => ({
    id: i + 1,
    title: n.title,
    body: n.body,
    color: ["yellow", "pink", "cyan", "green", "violet"][i % 5],
    pinned: i === 0,
    date: "May 14",
  }));
  const [items, setItems] = useLocalStorage("sp.notes", seed);
  const [editing, setEditing] = useState(null); // note object or "new"
  const visible = compact ? items.slice(0, 3) : items;

  const save = (note) => {
    if (note.id) setItems(items.map((n) => n.id === note.id ? note : n));
    else setItems([{ ...note, id: Date.now(), date: new Date().toLocaleDateString("en", { month: "short", day: "numeric" }) }, ...items]);
    setEditing(null);
  };
  const remove = (id) => setItems(items.filter((n) => n.id !== id));
  const togglePin = (id) => setItems(items.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n));

  const sorted = [...visible].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <StickyNote size={18} className="text-amber-300" />
          <h3 className="font-display font-bold text-lg">Sticky notes</h3>
        </div>
        <button onClick={() => setEditing({ title: "", body: "", color: "yellow", pinned: false })}
          className="gradient-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
          <Plus size={14} /> New
        </button>
      </div>

      <div className={compact ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"}>
        {sorted.map((n) => (
          <div key={n.id} className={`group relative p-4 rounded-xl border ${stickyColors[n.color] || stickyColors.yellow}`}>
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen size={13} className="opacity-60 shrink-0" />
                <div className="text-sm font-semibold truncate">{n.title || "Untitled"}</div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => togglePin(n.id)} title="Pin"
                  className={`text-[10px] px-1.5 py-0.5 rounded ${n.pinned ? "bg-white/15" : "hover:bg-white/10"}`}>📌</button>
                <button onClick={() => setEditing(n)} className="p-1 rounded hover:bg-white/10"><Pencil size={12} /></button>
                <button onClick={() => remove(n.id)} className="p-1 rounded hover:bg-white/10"><Trash2 size={12} /></button>
              </div>
            </div>
            <p className="text-xs leading-relaxed opacity-90 whitespace-pre-wrap">{n.body}</p>
            <div className="text-[10px] opacity-60 mt-3">{n.date}</div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center text-sm text-muted-foreground py-10">No notes yet — jot down something you learned today ✏️</div>
        )}
      </div>

      <AnimatePresence>
        {editing && <NoteEditor note={editing} onSave={save} onClose={() => setEditing(null)} />}
      </AnimatePresence>
    </div>
  );
}

function NoteEditor({ note, onSave, onClose }) {
  const [draft, setDraft] = useState(note);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4">
      <motion.div initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">{note.id ? "Edit note" : "New sticky note"}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5"><X size={18} /></button>
        </div>
        <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="Title (e.g. Today I learned…)"
          className="w-full bg-white/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 mb-3" />
        <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          rows={5} placeholder="Write your note, key point or topic covered…"
          className="w-full bg-white/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
        <div className="mt-4">
          <div className="text-xs font-semibold text-muted-foreground mb-2">Color</div>
          <div className="flex gap-2">
            {Object.keys(stickyColors).map((c) => (
              <button key={c} onClick={() => setDraft({ ...draft, color: c })}
                className={`w-7 h-7 rounded-lg border ${stickyColors[c]} ${draft.color === c ? "ring-2 ring-white/50" : ""}`} />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="glass px-4 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
          <button onClick={() => onSave(draft)}
            className="gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold glow">
            {note.id ? "Save" : "Add note"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Backwards compat
export const NotesWidget = (props) => <StickyNotes compact {...props} />;

export function UpcomingExams() {
  const [exams] = useLocalStorage("sp.exams", initialExams);
  
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-bold text-lg">Upcoming exams</h3>
        <Bell size={16} className="text-muted-foreground" />
      </div>
      <div className="space-y-3">
        {exams.map((e, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className={`w-12 h-12 rounded-xl ${colorBar[e.color] || "bg-primary"}/20 grid place-items-center`}>
              <div className="text-lg font-display font-bold">{e.days || e.daysLeft}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{e.subject}</div>
              <div className="text-xs text-muted-foreground">{e.date} · {e.days || e.daysLeft} days left</div>
            </div>
            <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className={`h-full ${colorBar[e.color] || "bg-primary"}`} style={{ width: `${100 - (e.days || e.daysLeft) * 3}%` }} />
            </div>
          </div>
        ))}
        {exams.length === 0 && (
          <div className="text-center py-6 text-sm text-muted-foreground">No upcoming exams 🎓</div>
        )}
      </div>
    </div>
  );
}

export function ActivityFeed() {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-display font-bold text-lg mb-5">Activity</h3>
      <div className="relative space-y-4">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-white/10" />
        {activity.map((a, i) => (
          <div key={i} className="relative flex gap-4 pl-1">
            <div className="w-8 h-8 rounded-full gradient-primary grid place-items-center text-[10px] font-bold text-white shrink-0 z-10">
              {a.user[0]}
            </div>
            <div className="flex-1 pb-1">
              <p className="text-sm">
                <span className="font-semibold">{a.user}</span>{" "}
                <span className="text-muted-foreground">{a.action}</span>{" "}
                <span className="font-medium">{a.target}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
