import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sigma, FlaskConical, Code2, Landmark, Leaf, Languages,
  Plus, X, ChevronLeft, ChevronRight, Calendar as CalIcon, Pencil, Trash2,
} from "lucide-react";
import { subjects, timetable } from "@/data/dummy";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const Route = createFileRoute("/planner")({
  validateSearch: (search) => ({
    new: search.new === "true" || search.new === true,
  }),
  head: () => ({
    meta: [
      { title: "Planner — Notes Pilot" },
      { name: "description", content: "Build, edit and manage your custom study plans across the week — drag-friendly, color-coded and persistent." },
    ],
  }),
  component: PlannerPage,
});

const iconMap = { Sigma, FlaskConical, Code2, Landmark, Leaf, Languages };
const blockColor = {
  primary: "bg-gradient-to-br from-violet-500/35 to-violet-500/10 border-violet-400/40 text-violet-100",
  accent: "bg-gradient-to-br from-cyan-500/35 to-cyan-500/10 border-cyan-400/40 text-cyan-100",
  success: "bg-gradient-to-br from-emerald-500/35 to-emerald-500/10 border-emerald-400/40 text-emerald-100",
  warning: "bg-gradient-to-br from-amber-500/35 to-amber-500/10 border-amber-400/40 text-amber-100",
};

function PlannerPage() {
  const search = Route.useSearch();
  const [blocks, setBlocks] = useLocalStorage("sp.plannerBlocks",
    timetable.blocks.map((b, i) => ({ id: i + 1, ...b, subject: "Math", duration: "1h", notes: "" }))
  );
  const [subjectsState, setSubjectsState] = useLocalStorage("sp.subjects", subjects);
  const [examsState, setExamsState] = useLocalStorage("sp.exams", []);
  
  const [modal, setModal] = useState(search.new ? "new" : null);
  const [subjectEditing, setSubjectEditing] = useState(null);
  const [examEditing, setExamEditing] = useState(null);

  useEffect(() => {
    if (search.new) setModal("new");
  }, [search.new]);

  const upsert = (b) => {
    if (b.id) setBlocks(blocks.map((x) => x.id === b.id ? b : x));
    else setBlocks([{ ...b, id: Date.now() }, ...blocks]);
    setModal(null);
  };
  const remove = (id) => { setBlocks(blocks.filter((b) => b.id !== id)); setModal(null); };

  const saveSubject = (s) => {
    if (s.id) setSubjectsState(subjectsState.map(x => x.id === s.id ? s : x));
    else setSubjectsState([...subjectsState, { ...s, id: Date.now() }]);
    setSubjectEditing(null);
  };
  const removeSubject = (id) => {
    setSubjectsState(subjectsState.filter(s => s.id !== id));
    setSubjectEditing(null);
  };

  const saveExam = (e) => {
    if (e.id) setExamsState(examsState.map(x => x.id === e.id ? e : x));
    else setExamsState([...examsState, { ...e, id: Date.now() }]);
    setExamEditing(null);
  };
  const removeExam = (id) => {
    setExamsState(examsState.filter(e => e.id !== id));
    setExamEditing(null);
  };

  return (
    <AppShell title="Planner" subtitle="Design your perfect study week">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 glass rounded-xl p-1.5">
            <button className="p-1.5 rounded-lg hover:bg-white/5"><ChevronLeft size={16} /></button>
            <span className="text-sm font-semibold px-2">Week of May 12 – 18</span>
            <button className="p-1.5 rounded-lg hover:bg-white/5"><ChevronRight size={16} /></button>
          </div>
          <button onClick={() => setModal("new")}
            className="gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 glow">
            <Plus size={16} /> New plan
          </button>
        </div>

        {/* Subject cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {subjectsState.map((s) => {
            const Icon = iconMap[s.icon] || Sigma;
            const pct = s.chapters > 0 ? Math.round((s.done / s.chapters) * 100) : 0;
            const colorClass = s.color?.startsWith("from-") ? s.color : "from-violet-500 to-fuchsia-500";
            return (
              <div key={s.id || s.name} className="group relative glass rounded-2xl p-4 hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={(e) => { e.stopPropagation(); setSubjectEditing(s); }} className="p-1 rounded hover:bg-white/10"><Pencil size={12} /></button>
                  <button onClick={(e) => { e.stopPropagation(); removeSubject(s.id); }} className="p-1 rounded hover:bg-white/10 text-rose-400"><Trash2 size={12} /></button>
                </div>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorClass} grid place-items-center text-white mb-3`}>
                  <Icon size={20} />
                </div>
                <div className="font-semibold text-sm">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.done}/{s.chapters} chapters</div>
                <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${colorClass}`} style={{ width: `${pct}%`, transition: "width 800ms ease" }} />
                </div>
                <div className="text-[11px] text-muted-foreground mt-2">{pct}% complete</div>
              </div>
            );
          })}
          <button onClick={() => setSubjectEditing({ name: "", chapters: 10, done: 0, color: "from-violet-500 to-fuchsia-500", icon: "Sigma" })}
            className="glass border-dashed border-2 border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition group">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition">
              <Plus size={20} />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Add subject</span>
          </button>
        </div>

        {/* Timetable + Calendar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 glass rounded-2xl p-6 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg">Weekly timetable</h3>
              <span className="text-xs text-muted-foreground">Click any block to edit · empty slot to add</span>
            </div>
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-2">
                <div />
                {timetable.days.map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-muted-foreground pb-2">{d}</div>
                ))}
                {timetable.hours.map((h) => (
                  <Row key={h} hour={h} blocks={blocks} onPick={setModal} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <CalendarBlock exams={examsState} onAddExam={(day) => setExamEditing({ subject: "", date: `May ${day}`, daysLeft: 7, color: "primary" })} />
            <CustomPlansList blocks={blocks} onEdit={setModal} onDelete={remove} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <PlanEditor
            subjects={subjectsState}
            initial={modal === "new" ? null : modal}
            onClose={() => setModal(null)}
            onSave={upsert}
            onDelete={remove}
          />
        )}
        {subjectEditing && (
          <SubjectEditor 
            initial={subjectEditing} 
            onClose={() => setSubjectEditing(null)} 
            onSave={saveSubject} 
          />
        )}
        {examEditing && (
          <ExamEditor 
            initial={examEditing} 
            onClose={() => setExamEditing(null)} 
            onSave={saveExam}
            onDelete={removeExam}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}

function Row({ hour, blocks, onPick }) {
  return (
    <>
      <div className="text-[11px] font-mono text-muted-foreground py-3">{hour}</div>
      {timetable.days.map((d) => {
        const block = blocks.find((b) => b.day === d && b.hour === hour);
        return (
          <button key={d + hour} onClick={() => onPick(block || { day: d, hour, title: "", color: "primary" })}
            className="min-h-[64px] rounded-xl border border-white/5 bg-white/[0.015] p-1 text-left hover:bg-white/[0.04] transition">
            {block && (
              <div className={`h-full rounded-lg p-2 border ${blockColor[block.color]} text-xs font-semibold flex items-center justify-center text-center`}>
                {block.title}
              </div>
            )}
          </button>
        );
      })}
    </>
  );
}

function CalendarBlock({ exams, onAddExam }) {
  const days = Array.from({ length: 35 }, (_, i) => i - 3);
  const today = 15;
  const events = exams.map(e => parseInt(e.date.split(" ")[1])).filter(d => !isNaN(d));

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalIcon size={16} className="text-primary" />
          <h3 className="font-display font-bold">May 2026</h3>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 rounded-lg hover:bg-white/5"><ChevronLeft size={14} /></button>
          <button className="p-1.5 rounded-lg hover:bg-white/5"><ChevronRight size={14} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const valid = d > 0 && d <= 31;
          const isToday = d === today;
          const hasEvent = events.includes(d);
          return (
            <div key={i} 
              onClick={() => valid && onAddExam(d)}
              className={`aspect-square rounded-lg grid place-items-center text-xs relative transition
              ${!valid ? "text-muted-foreground/30" : "hover:bg-primary/20 cursor-pointer"}
              ${isToday ? "gradient-primary text-white font-bold glow" : ""}`}>
              {valid ? d : ""}
              {hasEvent && !isToday && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-accent animate-pulse" />}
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground mt-4 text-center italic">Click any date to add an exam or idea</p>
    </div>
  );
}

function CustomPlansList({ blocks, onEdit, onDelete }) {
  const sorted = useMemo(() => [...blocks].slice(0, 8), [blocks]);
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-display font-bold mb-4">Your custom plans</h3>
      <div className="space-y-2 max-h-[420px] overflow-y-auto scrollbar-hide pr-1">
        {sorted.map((b) => (
          <div key={b.id} className={`group p-3 rounded-xl border ${blockColor[b.color]} flex items-center gap-3`}>
            <div className="text-[11px] font-mono opacity-80 w-12">{b.hour}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{b.title}</div>
              <div className="text-[11px] opacity-70">{b.day} · {b.duration || "1h"}</div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => onEdit(b)} className="p-1.5 rounded-lg hover:bg-white/15"><Pencil size={13} /></button>
              <button onClick={() => onDelete(b.id)} className="p-1.5 rounded-lg hover:bg-white/15"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        {blocks.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">No plans yet — tap "New plan" ✨</div>
        )}
      </div>
    </div>
  );
}

function PlanEditor({ initial, subjects, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(initial || { title: "", day: "Mon", hour: "08:00", color: "primary", subject: subjects[0]?.name || "Mathematics", duration: "1h", notes: "" });
  const isEdit = Boolean(initial?.id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-2xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-xl">{isEdit ? "Edit study plan" : "New study plan"}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <Field label="Title">
            <input autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="w-full bg-white/5 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="e.g. Linear Algebra — Chapter 6" />
          </Field>
          <div className="grid grid-cols-1 gap-3">
            <Field label="Subject">
              <div className="space-y-3">
                <select 
                  value={subjects.some(s => s.name === draft.subject) ? draft.subject : "Custom"} 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "Custom") {
                      setDraft({ ...draft, subject: "" });
                    } else {
                      setDraft({ ...draft, subject: val });
                    }
                  }}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-white"
                >
                  {subjects.map((s) => (
                    <option key={s.name} value={s.name} className="bg-[#1a1a1a] text-white">
                      {s.name}
                    </option>
                  ))}
                  <option value="Custom" className="bg-[#1a1a1a] text-white">Custom...</option>
                </select>
                
                {(!subjects.some(s => s.name === draft.subject) || draft.subject === "") && (
                  <input 
                    placeholder="Enter custom subject name..."
                    value={draft.subject}
                    onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-white"
                  />
                )}
              </div>
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Field label="Color">
              <div className="flex gap-2 pt-1">
                {Object.keys(blockColor).map((c) => (
                  <button key={c} type="button" onClick={() => setDraft({ ...draft, color: c })}
                    className={`flex-1 h-9 rounded-lg border ${blockColor[c]} ${draft.color === c ? "ring-2 ring-white/50" : ""}`} />
                ))}
              </div>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Day">
              <select value={draft.day} onChange={(e) => setDraft({ ...draft, day: e.target.value })}
                className="w-full bg-white/5 rounded-xl px-3 py-2.5 text-sm outline-none">
                {timetable.days.map((d) => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Hour">
              <select value={draft.hour} onChange={(e) => setDraft({ ...draft, hour: e.target.value })}
                className="w-full bg-white/5 rounded-xl px-3 py-2.5 text-sm outline-none">
                {timetable.hours.map((h) => <option key={h}>{h}</option>)}
              </select>
            </Field>
            <Field label="Duration">
              <select value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
                className="w-full bg-white/5 rounded-xl px-3 py-2.5 text-sm outline-none">
                <option>30m</option><option>1h</option><option>1h 30m</option><option>2h</option>
              </select>
            </Field>
          </div>
          <Field label="Notes">
            <textarea rows={3} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              className="w-full bg-white/5 rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
              placeholder="Anything to remember…" />
          </Field>
        </div>
        <div className="flex justify-between gap-2 mt-6">
          <div>
            {isEdit && (
              <button onClick={() => onDelete(initial.id)}
                className="text-rose-300 hover:text-rose-200 text-sm font-medium px-3 py-2.5 rounded-xl flex items-center gap-2">
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="glass px-4 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
            <button onClick={() => draft.title.trim() && onSave(draft)}
              className="gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold glow">
              {isEdit ? "Save changes" : "Add plan"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}

function SubjectEditor({ initial, onClose, onSave }) {
  const [draft, setDraft] = useState(initial);
  const icons = ["Sigma", "FlaskConical", "Code2", "Landmark", "Leaf", "Languages", "BookOpen", "Timer"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }}
        onClick={(e) => e.stopPropagation()} className="glass-strong rounded-2xl p-6 w-full max-w-md">
        <h3 className="font-display font-bold text-xl mb-5">{initial.id ? "Edit subject" : "New subject"}</h3>
        <div className="space-y-4">
          <Field label="Subject Name">
            <input autoFocus value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="e.g. Astrophysics" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Total Chapters">
              <input type="number" value={draft.chapters} onChange={(e) => setDraft({ ...draft, chapters: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none" />
            </Field>
            <Field label="Chapters Done">
              <input type="number" value={draft.done} onChange={(e) => setDraft({ ...draft, done: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none" />
            </Field>
          </div>
          <Field label="Icon">
            <div className="flex flex-wrap gap-2 pt-1">
              {icons.map((ico) => {
                const Icon = iconMap[ico] || Sigma;
                return (
                  <button key={ico} onClick={() => setDraft({ ...draft, icon: ico })}
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center transition
                    ${draft.icon === ico ? "bg-primary text-white border-primary" : "bg-white/5 border-white/10 text-muted-foreground"}`}>
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="glass px-4 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
          <button onClick={() => draft.name.trim() && onSave(draft)}
            className="gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold">Save</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ExamEditor({ initial, onClose, onSave, onDelete }) {
  const [draft, setDraft] = useState(initial);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }}
        onClick={(e) => e.stopPropagation()} className="glass-strong rounded-2xl p-6 w-full max-w-md">
        <h3 className="font-display font-bold text-xl mb-5">{initial.id ? "Edit exam/event" : "New exam/event"}</h3>
        <div className="space-y-4">
          <Field label="Title / Subject">
            <input autoFocus value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="e.g. Final Exam" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="e.g. May 22" />
            </Field>
            <Field label="Days Left">
              <input type="number" value={draft.daysLeft} onChange={(e) => setDraft({ ...draft, daysLeft: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none" />
            </Field>
          </div>
          <Field label="Color">
            <div className="flex gap-2 pt-1">
              {Object.keys(blockColor).map((c) => (
                <button key={c} onClick={() => setDraft({ ...draft, color: c })}
                  className={`flex-1 h-9 rounded-lg border ${blockColor[c]} ${draft.color === c ? "ring-2 ring-white/50" : ""}`} />
              ))}
            </div>
          </Field>
        </div>
        <div className="flex justify-between gap-2 mt-6">
          <button onClick={() => onDelete(initial.id)} className="text-rose-400 text-sm hover:underline">Delete</button>
          <div className="flex gap-2">
            <button onClick={onClose} className="glass px-4 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
            <button onClick={() => draft.subject.trim() && onSave(draft)}
              className="gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold">Save</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
