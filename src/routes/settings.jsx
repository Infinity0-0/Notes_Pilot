import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { motion } from "framer-motion";
import { 
  User, Camera, Shield, Bell, Smartphone, 
  Trash2, RefreshCcw, Save, CheckCircle 
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const DEFAULT_PROFILE = {
  name: "Aditya Kumar",
  nickname: "Adi",
  avatar: null,
  email: "aditya@example.com",
  theme: "Dark"
};

function SettingsPage() {
  const [profile, setProfile] = useLocalStorage("sp.profile", DEFAULT_PROFILE);
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setProfile(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setDraft(DEFAULT_PROFILE);
    setProfile(DEFAULT_PROFILE);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraft({ ...draft, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppShell title="Settings" subtitle="Customize your workspace and profile">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] gradient-primary grid place-items-center text-4xl font-bold text-white shadow-2xl shadow-primary/20 overflow-hidden">
                {draft.avatar ? (
                  <img src={draft.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  draft.name.split(" ").map(n => n[0]).join("")
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-white text-black hover:bg-zinc-200 cursor-pointer shadow-xl transition-transform active:scale-90">
                <Camera size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    value={draft.name}
                    onChange={(e) => setDraft({...draft, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Nickname</label>
                  <input 
                    value={draft.nickname}
                    onChange={(e) => setDraft({...draft, nickname: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email"
                  value={draft.email}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-zinc-500 outline-none cursor-not-allowed"
                />
                <p className="text-[10px] text-muted-foreground ml-1 flex items-center gap-1">
                  <Shield size={10} /> Email is managed by your account provider
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-8 space-y-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/20 text-primary">
                <Bell size={18} />
              </div>
              <h3 className="font-bold">Notifications</h3>
            </div>
            <div className="space-y-4">
              <Toggle label="Email Reminders" defaultChecked />
              <Toggle label="Study Session Alerts" defaultChecked />
              <Toggle label="Streak Reminders" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-8 space-y-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                <Shield size={18} />
              </div>
              <h3 className="font-bold">Privacy & Security</h3>
            </div>
            <div className="space-y-4">
              <Toggle label="Public Profile" />
              <Toggle label="Share Analytics" defaultChecked />
              <Toggle label="Two-Factor Auth" />
            </div>
          </motion.div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass rounded-3xl p-6">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-rose-400 hover:bg-rose-400/10 transition"
          >
            <RefreshCcw size={18} /> Reset to Defaults
          </button>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={handleSave}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold transition-all shadow-xl
                ${saved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'gradient-primary text-white shadow-primary/30 hover:scale-105 active:scale-95'}`}
            >
              {saved ? (
                <>
                  <CheckCircle size={18} /> Saved!
                </>
              ) : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Toggle({ label, defaultChecked = false }) {
  const [enabled, setEnabled] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between group cursor-pointer" onClick={() => setEnabled(!enabled)}>
      <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{label}</span>
      <div className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 flex ${enabled ? 'bg-primary' : 'bg-white/10'}`}>
        <motion.div 
          animate={{ x: enabled ? 20 : 0 }}
          className="w-4 h-4 bg-white rounded-full shadow-sm" 
        />
      </div>
    </div>
  );
}
