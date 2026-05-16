import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, BarChart3, CalendarDays, GraduationCap,
  StickyNote, Settings, LogOut, BookOpenCheck, Timer,
} from "lucide-react";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/planner", label: "Planner", icon: CalendarDays },
  { to: "/goals", label: "Goal & Aim", icon: GraduationCap },
  { to: "/notes", label: "Workspace", icon: StickyNote },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

const more = [
  { to: "/flashcards", label: "Flashcards", icon: BookOpenCheck },
  { to: "/tool/focustime", label: "Focus Timers", icon: Timer },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 z-30 bg-background/70 lg:hidden" />}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 shrink-0 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="glass-strong m-3 lg:m-4 h-[calc(100vh-1.5rem)] lg:h-[calc(100vh-2rem)] rounded-2xl p-5 flex flex-col">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary grid place-items-center glow">
              <BookOpenCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-none">Notes Pilot</div>
              <div className="text-xs text-muted-foreground mt-1">Premium plan</div>
            </div>
          </Link>

          <nav className="flex-1 space-y-1">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground px-3 mb-2">Main</div>
            {items.map((it) => {
              const active = path === it.to;
              const Icon = it.icon;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={onClose}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                    active
                      ? "gradient-primary text-white glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{it.label}</span>
                </Link>
              );
            })}

            <div className="text-[11px] uppercase tracking-widest text-muted-foreground px-3 mt-6 mb-2">Tools</div>
            {more.map((it) => {
              const Icon = it.icon;
              const Cmp = it.to ? Link : "button";
              return (
                <Cmp
                  key={it.label}
                  to={it.to}
                  onClick={it.to ? onClose : undefined}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                    path === it.to
                      ? "gradient-primary text-white glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{it.label}</span>
                </Cmp>
              );
            })}
          </nav>



          <button className="mt-3 flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition">
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
