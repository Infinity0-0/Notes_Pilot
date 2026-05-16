import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNav from "./MobileNav";

export default function AppShell({ children, title, subtitle }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-primary/30">
      <div className="hidden lg:block">
        <Sidebar open={open} onClose={() => setOpen(false)} />
      </div>
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pb-24 lg:pb-12">
        <Topbar onMenu={() => setOpen(true)} title={title} subtitle={subtitle} />
        <div className="mt-6">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
