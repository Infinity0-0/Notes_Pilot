import { Bell, Search, Menu, Plus, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function Topbar({ onMenu, title = "Dashboard", subtitle }) {
  const [profile] = useLocalStorage("sp.profile", {
    name: "Aditya Kumar",
    nickname: "Adi",
    avatar: null
  });

  const initials = profile.name.split(" ").map(n => n[0]).join("");

  return (
    <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-background/95 border-b border-white/5">
      <div className="flex items-center gap-4">
        <div className="block lg:hidden mr-auto">
          <h1 className="text-lg font-display font-bold">{title}</h1>
        </div>

        <div className="hidden sm:block">
          <h1 className="text-xl font-display font-bold">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex-1 max-w-md ml-auto">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search tasks, subjects, notes…"
              className="w-full glass rounded-xl py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>
        </div>

        <Link to="/planner" search={{ new: true }} className="hidden sm:flex items-center gap-2 gradient-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition glow">
          <Plus size={16} /> New plan
        </Link>

        <button className="glass p-2.5 rounded-xl relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
        </button>

        <Link to="/settings" className="w-10 h-10 rounded-xl gradient-primary overflow-hidden grid place-items-center text-white font-bold text-sm shrink-0 hover:scale-105 transition shadow-lg shadow-primary/20">
          {profile.avatar ? (
            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </Link>
      </div>
    </div>
  );
}
