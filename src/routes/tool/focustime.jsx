import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Coffee, Brain, Timer as TimerIcon, Bell, Settings2, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tool/focustime")({
  component: TimersPage,
});

function TimersPage() {
  const [activeTab, setActiveTab] = useState('pomodoro'); // pomodoro, stopwatch, alarm
  
  return (
    <AppShell title="Focus & Timers" subtitle="Manage your study sessions and track your time">
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto">
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/5 pb-4">
          <TabButton active={activeTab === 'pomodoro'} onClick={() => setActiveTab('pomodoro')} icon={Brain} label="Pomodoro" />
          <TabButton active={activeTab === 'stopwatch'} onClick={() => setActiveTab('stopwatch')} icon={TimerIcon} label="Stopwatch" />
          <TabButton active={activeTab === 'alarm'} onClick={() => setActiveTab('alarm')} icon={Bell} label="Custom Timer / Alarm" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {activeTab === 'pomodoro' && <PomodoroSection />}
          {activeTab === 'stopwatch' && <StopwatchSection />}
          {activeTab === 'alarm' && <CustomTimerSection />}
        </div>

      </div>
    </AppShell>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300",
        active 
          ? "bg-white text-black shadow-lg scale-105" 
          : "text-zinc-400 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// --- POMODORO SECTION ---
function PomodoroSection() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
  
  const modes = {
    focus: { label: 'Deep Focus', time: 25 * 60, icon: Brain, color: 'text-indigo-400' },
    shortBreak: { label: 'Short Break', time: 5 * 60, icon: Coffee, color: 'text-green-400' },
    longBreak: { label: 'Long Break', time: 15 * 60, icon: Coffee, color: 'text-purple-400' }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
      audio.play().catch(e => console.log(e));
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimeLeft(modes[mode].time); };
  const switchMode = (newMode) => { setIsActive(false); setMode(newMode); setTimeLeft(modes[newMode].time); };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100;

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-300">
      <div className="flex gap-2 mb-10 p-1.5 bg-white/5 rounded-2xl border border-white/5">
        {Object.entries(modes).map(([key, m]) => {
          const Icon = m.icon;
          return (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                mode === key ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-white"
              )}
            >
              <Icon className={cn("w-4 h-4", mode === key ? m.color : "")} />
              {m.label}
            </button>
          )
        })}
      </div>

      <div className="relative mb-12">
        <svg className="w-80 h-80 transform -rotate-90">
          <circle cx="160" cy="160" r="150" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
          <circle
            cx="160" cy="160" r="150" stroke="currentColor" strokeWidth="6" fill="transparent"
            strokeDasharray={2 * Math.PI * 150}
            strokeDashoffset={2 * Math.PI * 150 * (1 - progress / 100)}
            className={cn("transition-all duration-1000 ease-linear", modes[mode].color)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-7xl font-display font-bold tracking-tighter tabular-nums drop-shadow-2xl">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Button onClick={resetTimer} variant="ghost" size="icon" className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10">
          <RotateCcw className="w-6 h-6 text-zinc-400" />
        </Button>
        <Button onClick={toggleTimer} className="w-24 h-24 rounded-full bg-white hover:bg-zinc-200 text-black shadow-xl shadow-white/10 hover:scale-105 active:scale-95 transition-all">
          {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-2" />}
        </Button>
        <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10">
          <Settings2 className="w-6 h-6 text-zinc-400" />
        </Button>
      </div>
    </div>
  );
}

// --- STOPWATCH SECTION ---
function StopwatchSection() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => setTime(t => t + 10), 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTime(0); setLaps([]); };
  const addLap = () => { setLaps([...laps, time]); };

  const formatTime = (ms) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const centisec = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${centisec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md animate-in fade-in zoom-in duration-300">
      <div className="glass-panel p-12 rounded-full mb-10 w-72 h-72 flex items-center justify-center shadow-2xl border border-white/5">
        <span className="text-6xl font-display font-bold tabular-nums tracking-tight">
          {formatTime(time)}
        </span>
      </div>

      <div className="flex items-center gap-6 mb-10">
        <Button onClick={resetTimer} variant="ghost" size="icon" className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10">
          <RotateCcw className="w-6 h-6 text-zinc-400" />
        </Button>
        <Button onClick={toggleTimer} className="w-20 h-20 rounded-full bg-white hover:bg-zinc-200 text-black shadow-xl transition-all hover:scale-105 active:scale-95">
          {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </Button>
        <Button onClick={addLap} disabled={!isActive} variant="ghost" size="icon" className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-50">
          <Flag className="w-5 h-5 text-zinc-400" />
        </Button>
      </div>

      {laps.length > 0 && (
        <div className="w-full bg-white/5 rounded-2xl p-4 max-h-48 overflow-y-auto border border-white/5">
          {laps.map((lapTime, index) => (
            <div key={index} className="flex justify-between items-center py-2 px-4 border-b border-white/5 last:border-0">
              <span className="text-zinc-400 font-medium">Lap {index + 1}</span>
              <span className="font-mono text-lg">{formatTime(lapTime)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- CUSTOM TIMER / ALARM SECTION ---
function CustomTimerSection() {
  const [inputMins, setInputMins] = useState(10);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
      audio.play().catch(e => console.log(e));
      alert("Time is up!");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    if (!isActive && timeLeft === 0) {
      setTimeLeft(inputMins * 60);
    }
    setIsActive(true);
  };

  const pauseTimer = () => setIsActive(false);
  const resetTimer = () => { setIsActive(false); setTimeLeft(0); };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md animate-in fade-in zoom-in duration-300">
      <div className="glass-panel w-full p-8 rounded-3xl mb-8 flex flex-col items-center border border-white/5">
        <Bell className="w-12 h-12 text-pink-400 mb-6" />
        
        {timeLeft === 0 && !isActive ? (
          <div className="flex items-center gap-4 text-4xl font-display font-bold mb-6">
            <Input 
              type="number" 
              value={inputMins} 
              onChange={(e) => setInputMins(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-24 h-16 text-center text-4xl font-bold bg-white/5 border-white/10 rounded-2xl"
            />
            <span>min</span>
          </div>
        ) : (
          <div className="text-7xl font-display font-bold tabular-nums tracking-tighter mb-6 text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.3)]">
            {formatTime(timeLeft)}
          </div>
        )}

        <div className="flex gap-4 w-full">
          {!isActive ? (
            <Button onClick={startTimer} className="flex-1 h-14 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-lg font-semibold shadow-lg shadow-pink-500/20 transition-all">
              Start Alarm
            </Button>
          ) : (
            <Button onClick={pauseTimer} className="flex-1 h-14 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-lg font-semibold transition-all">
              Pause
            </Button>
          )}
          <Button onClick={resetTimer} variant="outline" className="h-14 w-14 rounded-xl border-white/10 bg-transparent hover:bg-white/5">
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
