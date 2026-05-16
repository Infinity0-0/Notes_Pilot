import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenCheck, BrainCircuit, Code, LineChart, Sparkles, Timer, Rocket } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 selection:bg-primary/30 font-sans overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center shadow-lg shadow-purple-500/20">
              <BookOpenCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Notes Pilot</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-full hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-screen">
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 to-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-purple-400 mb-8 tracking-wide uppercase"
          >
            <Sparkles className="w-4 h-4" />
            <span>The Ultimate Student Workspace</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl lg:text-7xl font-display font-bold tracking-tighter mb-6 leading-tight"
          >
            Master Your Studies. <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Achieve Your Goals.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Whether you are preparing for JEE/NEET, learning to code, or mastering business concepts, our platform provides the perfect environment for deep work and organized planning.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/dashboard"
              className="w-full sm:w-auto bg-white text-black font-semibold text-lg px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10"
            >
              Enter Workspace <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto bg-white/5 border border-white/10 text-white font-medium text-lg px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              View Features
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="py-24 relative z-10 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6 tracking-tight">Built for Top Performers</h2>
            <p className="text-zinc-400 text-lg">Everything you need to stay productive, focused, and organized in one seamless application.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BrainCircuit className="w-6 h-6 text-indigo-400" />}
              title="Smart Flashcards"
              description="Master complex topics with spaced repetition. Perfect for Biology, Physics formulas, or learning new programming languages."
            />
            <FeatureCard 
              icon={<Rocket className="w-6 h-6 text-purple-400" />}
              title="Interactive Planner"
              description="Plan your daily tasks, set weekly goals, and track your syllabus progress visually."
            />
            <FeatureCard 
              icon={<Timer className="w-6 h-6 text-pink-400" />}
              title="Deep Focus Timer"
              description="A dedicated Pomodoro environment with short and long breaks to maximize your study sessions without burning out."
            />
            <FeatureCard 
              icon={<Code className="w-6 h-6 text-emerald-400" />}
              title="Coding & CS Ready"
              description="Specialized rich-text workspaces with code formatting to safely store your logic and algorithm notes."
            />
            <FeatureCard 
              icon={<BookOpenCheck className="w-6 h-6 text-amber-400" />}
              title="JEE / NEET Optimized"
              description="Keep track of your mock test scores, revise formulas, and monitor your exam countdown effortlessly."
            />
            <FeatureCard 
              icon={<LineChart className="w-6 h-6 text-blue-400" />}
              title="Analytics & Tracking"
              description="Visualize your study patterns and see your productivity growth over time with interactive charts."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-zinc-500 border-t border-white/10 bg-[#0A0A0A]">
        <p className="font-medium">© 2026 Notes Pilot. Designed for excellence.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl hover:bg-white/[0.04] transition-colors duration-300">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
