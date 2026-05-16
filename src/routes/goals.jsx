import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Target, Calendar, Clock, Flame, Plus, Trash2, 
  ChevronRight, AlertCircle, CheckCircle2, Sparkles 
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const Route = createFileRoute("/goals")({
  component: GoalsPage,
});

function GoalsPage() {
  const [goals, setGoals] = useLocalStorage("sp.goals", []);
  const [exams, setExams] = useLocalStorage("sp.exams", []);
  const [streak, setStreak] = useLocalStorage("sp.streak", { count: 0, lastUpdate: null });
  const [newGoalModal, setNewGoalModal] = useState(false);

  // Sync exams with goals for calendar view if needed, 
  // but let's keep them separate for now or merge them carefully.
  // Actually, the user wants them linked. So if it's an exam, we save to exams too.

  const formatCalendarDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en", { month: "short", day: "numeric" });
  };

  const addGoal = (goal) => {
    const id = Date.now();
    const goalWithId = { ...goal, id };
    setGoals([...goals, goalWithId]);
    
    if (goal.type === "exam") {
      const newExam = {
        id: id,
        subject: goal.title,
        date: formatCalendarDate(goal.date),
        daysLeft: calculateDaysLeft(goal.date),
        color: goal.color || "primary"
      };
      setExams([...exams, newExam]);
    }
    setNewGoalModal(false);
  };

  const removeGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
    setExams(exams.filter(e => e.id !== id));
  };

  useEffect(() => {
    const today = new Date();
    const lastDate = streak.lastUpdate ? new Date(streak.lastUpdate) : null;
    
    if (lastDate) {
      const diffTime = Math.abs(today - lastDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        // Reset streak if more than 1 day passed
        setStreak({ count: 0, lastUpdate: null });
      }
    }
  }, []);

  const updateStreak = () => {
    const today = new Date().toDateString();
    if (streak.lastUpdate !== today) {
      setStreak({
        count: streak.count + 1,
        lastUpdate: today
      });
    }
  };

  return (
    <AppShell title="Goal & Aim" subtitle="Define your future and track your progress">
      <div className="space-y-8 max-w-6xl mx-auto pb-10">
        
        {/* Hero Section / Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Flame size={80} className="text-orange-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                  <Flame size={20} />
                </div>
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Current Streak</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-display font-bold text-white">{streak.count}</span>
                <span className="text-muted-foreground font-medium">Days</span>
              </div>
              <button 
                onClick={updateStreak}
                className="mt-4 text-xs font-semibold px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
              >
                Log Today's Effort
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-3xl relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target size={80} className="text-primary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary/20 text-primary">
                  <Target size={20} />
                </div>
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Active Goals</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-display font-bold text-white">{goals.length}</span>
                <span className="text-muted-foreground font-medium">In Progress</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-3xl relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle2 size={80} className="text-emerald-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Trophy size={20} />
                </div>
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Achievements</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-display font-bold text-white">0</span>
                <span className="text-muted-foreground font-medium">Completed</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold flex items-center gap-3">
              Your Milestones
              <Sparkles className="text-yellow-400" size={20} />
            </h2>
            <button 
              onClick={() => setNewGoalModal(true)}
              className="gradient-primary text-white px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:scale-105 transition glow"
            >
              <Plus size={18} /> Set New Goal
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onDelete={() => removeGoal(goal.id)} />
              ))}
            </AnimatePresence>
            
            {goals.length === 0 && (
              <div className="col-span-full py-20 glass border-dashed border-2 border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Target className="text-muted-foreground" size={32} />
                </div>
                <h3 className="text-lg font-bold">No goals set yet</h3>
                <p className="text-muted-foreground text-sm max-w-xs mt-1">
                  Start by setting your first exam date or a personal study milestone.
                </p>
                <button 
                  onClick={() => setNewGoalModal(true)}
                  className="mt-6 text-primary font-bold hover:underline"
                >
                  Create your first goal →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {newGoalModal && (
          <GoalModal onClose={() => setNewGoalModal(false)} onSave={addGoal} />
        )}
      </AnimatePresence>
    </AppShell>
  );
}

function GoalCard({ goal, onDelete }) {
  const daysLeft = calculateDaysLeft(goal.date);
  const isPast = daysLeft < 0;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass p-6 rounded-3xl relative overflow-hidden group border border-white/5 hover:border-primary/20 transition-all"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center 
            ${goal.type === 'exam' ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
            {goal.type === 'exam' ? <Calendar size={28} /> : <Target size={28} />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">{goal.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Clock size={14} />
              <span>Due: {goal.date}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onDelete}
          className="p-2.5 rounded-xl hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass bg-white/5 p-4 rounded-2xl">
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Time Remaining</div>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-display font-bold ${isPast ? 'text-rose-400' : 'text-white'}`}>
              {isPast ? 0 : daysLeft}
            </span>
            <span className="text-xs text-muted-foreground font-medium">Days left</span>
          </div>
        </div>
        <div className="glass bg-white/5 p-4 rounded-2xl flex flex-col justify-center">
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Priority</div>
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${goal.priority === 'High' ? 'bg-rose-500' : goal.priority === 'Medium' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
            <span className="text-sm font-semibold">{goal.priority}</span>
          </div>
        </div>
      </div>

      {!isPast && daysLeft <= 7 && (
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-yellow-500 bg-yellow-500/10 p-2.5 rounded-xl">
          <AlertCircle size={14} />
          Deadline approaching! Push harder.
        </div>
      )}
      
      {isPast && (
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 p-2.5 rounded-xl">
          <CheckCircle2 size={14} />
          Goal date reached. Did you achieve it?
        </div>
      )}
    </motion.div>
  );
}

function GoalModal({ onClose, onSave }) {
  const [draft, setDraft] = useState({
    title: "",
    date: "",
    type: "exam",
    priority: "Medium",
    color: "primary"
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }} 
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-[2.5rem] p-8 w-full max-w-lg border border-white/10"
      >
        <h2 className="text-3xl font-display font-bold mb-6">Set Your Goal</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground ml-1">What is your goal?</label>
            <input 
              autoFocus
              placeholder="e.g. JEE Main 2026, Learn React..."
              value={draft.title}
              onChange={(e) => setDraft({...draft, title: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground ml-1">Target Date</label>
              <input 
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({...draft, date: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-primary/50 transition [color-scheme:dark]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground ml-1">Category</label>
              <select 
                value={draft.type}
                onChange={(e) => setDraft({...draft, type: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-primary/50 transition"
              >
                <option value="exam">Exam Date</option>
                <option value="milestone">Personal Milestone</option>
                <option value="other">Other Goal</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground ml-1">Priority Level</label>
            <div className="flex gap-3">
              {['Low', 'Medium', 'High'].map((p) => (
                <button
                  key={p}
                  onClick={() => setDraft({...draft, priority: p})}
                  className={`flex-1 py-3 rounded-2xl text-sm font-bold border transition-all ${
                    draft.priority === p 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' 
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-10">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-bold bg-white/5 hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <button 
            onClick={() => draft.title && draft.date && onSave(draft)}
            className="flex-[2] py-4 rounded-2xl font-bold gradient-primary text-white shadow-xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition"
          >
            Confirm Goal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function calculateDaysLeft(dateStr) {
  if (!dateStr) return 0;
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
