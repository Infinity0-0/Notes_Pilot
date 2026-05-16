import { Link, useRouterState } from "@tanstack/react-router";
import { 
  LayoutDashboard, CalendarDays, GraduationCap, 
  StickyNote, MoreHorizontal, BookOpenCheck, 
  Timer, Settings, X 
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const mainItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/planner", icon: CalendarDays, label: "Plan" },
  { to: "/goals", icon: GraduationCap, label: "Goals" },
  { to: "/notes", icon: StickyNote, label: "Notes" },
];

const toolItems = [
  { to: "/flashcards", icon: BookOpenCheck, label: "Flashcards" },
  { to: "/tool/focustime", icon: Timer, label: "Timers" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function MobileNav() {
  const [showTools, setShowTools] = useState(false);
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <>
      {/* Tools Drawer */}
      <AnimatePresence>
        {showTools && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTools(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[70] glass-strong rounded-t-[2.5rem] p-8 pb-12 lg:hidden border-t border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Tools & Settings</h3>
                <button 
                  onClick={() => setShowTools(false)}
                  className="p-2 rounded-full bg-white/5 text-muted-foreground"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                {toolItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setShowTools(false)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-4 rounded-2xl transition",
                      path === item.to ? "bg-primary/20 text-primary" : "text-muted-foreground bg-white/5"
                    )}
                  >
                    <item.icon size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-6 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
        <div className="glass-strong rounded-2xl h-16 flex items-center justify-around px-2 border border-white/5 pointer-events-auto shadow-2xl">
          {mainItems.map((item) => {
            const active = path === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl transition-all duration-300",
                  active ? "text-primary scale-110" : "text-muted-foreground"
                )}
              >
                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[8px] font-bold uppercase tracking-tight">{item.label}</span>
              </Link>
            );
          })}
          
          <button
            onClick={() => setShowTools(true)}
            className="flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl text-muted-foreground hover:text-primary transition-all duration-300"
          >
            <MoreHorizontal size={20} />
            <span className="text-[8px] font-bold uppercase tracking-tight">More</span>
          </button>
        </div>
      </div>
    </>
  );
}
