import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, Search, Code, BrainCircuit, Briefcase, BookOpen, 
  MoreHorizontal, FileText, Code2, Calculator, Trash2, 
  Save, X, Image as ImageIcon, Bold, Italic, List, 
  ChevronLeft, ChevronRight, Eye, Edit3, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/notes")({
  component: NotesPage,
});

const CATEGORIES = [
  { id: 'all', label: 'All Notes', icon: BookOpen },
  { id: 'coding', label: 'Coding & CS', icon: Code2, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { id: 'business', label: 'Business & Plans', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'subject', label: 'Subject Notes', icon: Calculator, color: 'text-green-400', bg: 'bg-green-400/10' },
];

const DUMMY_NOTES = [
  {
    id: 1,
    title: "React Server Components Architecture",
    category: "coding",
    excerpt: "Server components run exclusively on the server, resulting in zero impact on bundle size...",
    date: "2 hours ago",
    content: "Server components run exclusively on the server, resulting in zero impact on bundle size. They allow developers to fetch data directly in the component, making the code cleaner and more efficient.",
    code: "const ServerComponent = async () => {\n  const data = await db.query();\n  return <div>{data}</div>;\n};",
  },
  {
    id: 2,
    title: "Market Analysis: E-commerce Trends",
    category: "business",
    excerpt: "Consumer behavior is shifting towards hyper-personalization and AI-driven recommendations...",
    date: "Yesterday",
    content: "The e-commerce landscape is changing rapidly. Key trends include:\n1. Personalization at scale\n2. Social commerce integration\n3. Sustainable logistics\n4. AI-powered customer support.",
  }
];

function NotesPage() {
  const [notes, setNotes] = useLocalStorage("sp.notes", DUMMY_NOTES);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState(null); // Current note being viewed/edited
  const [isEditing, setIsEditing] = useState(false); // Read vs Edit mode

  const filteredNotes = notes.filter(note => {
    const matchesCategory = activeCategory === 'all' || note.category === activeCategory;
    const titleMatch = (note.title || "").toLowerCase().includes(search.toLowerCase());
    const excerptMatch = (note.excerpt || "").toLowerCase().includes(search.toLowerCase());
    const contentMatch = (note.content || "").toLowerCase().includes(search.toLowerCase());
    return matchesCategory && (titleMatch || excerptMatch || contentMatch);
  });

  const handleCreateNote = () => {
    const newNote = {
      id: Date.now(),
      title: "",
      category: activeCategory === 'all' ? 'coding' : activeCategory,
      content: "",
      date: "Just now",
      images: []
    };
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const handleSaveNote = (updatedNote) => {
    const existing = notes.find(n => n.id === updatedNote.id);
    if (existing) {
      setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
    } else {
      setNotes([updatedNote, ...notes]);
    }
    setSelectedNote(updatedNote);
    setIsEditing(false);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote?.id === id) setSelectedNote(null);
  };

  return (
    <AppShell title="Smart Workspace" subtitle="Capture and organize your knowledge seamlessly">
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-12rem)] lg:h-[calc(100vh-12rem)]">
        
        {/* Sidebar / Categories */}
        <AnimatePresence mode="wait">
          {!selectedNote && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full lg:w-64 shrink-0 flex flex-col gap-6"
            >
              <Button 
                onClick={handleCreateNote}
                className="w-full gradient-primary text-white gap-2 shadow-lg glow h-12 rounded-2xl font-bold"
              >
                <Plus className="w-5 h-5" /> New Note
              </Button>

              <div className="glass p-5 rounded-3xl flex-1 border border-white/5">
                <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-5 px-1">Knowledge Hub</h3>
                <div className="space-y-1.5">
                  {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold transition-all duration-300",
                          isActive 
                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                      >
                        <div className={cn("p-1.5 rounded-xl transition-colors", isActive ? "bg-white/20" : cat.bg || "bg-white/5")}>
                          <Icon className={cn("w-4 h-4", isActive ? "text-white" : cat.color || "text-foreground")} />
                        </div>
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 glass rounded-[2.5rem] p-4 sm:p-8 flex flex-col overflow-hidden border border-white/5 relative">
          
          <AnimatePresence mode="wait">
            {!selectedNote ? (
              <motion.div 
                key="list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col"
              >
                {/* Header & Search */}
                <div className="flex items-center justify-between mb-8">
                  <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search notes, formulas, or code snippets..." 
                      className="pl-12 bg-white/5 border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/40 h-12 text-sm"
                    />
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-muted-foreground bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <Sparkles size={14} className="text-yellow-400" />
                    {filteredNotes.length} Notes Found
                  </div>
                </div>

                {/* Notes Grid */}
                <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 content-start pb-10">
                  {filteredNotes.length === 0 ? (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <FileText className="w-8 h-8 opacity-20" />
                      </div>
                      <p className="font-medium">No knowledge found here yet.</p>
                      <Button onClick={handleCreateNote} variant="link" className="text-primary font-bold">Create your first note →</Button>
                    </div>
                  ) : (
                    filteredNotes.map(note => {
                      const catInfo = CATEGORIES.find(c => c.id === note.category) || CATEGORIES[1];
                      return (
                        <motion.div 
                          layoutId={`note-${note.id}`}
                          key={note.id} 
                          onClick={() => {
                            setSelectedNote(note);
                            setIsEditing(false);
                          }}
                          className="group flex flex-col p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 cursor-pointer relative overflow-hidden"
                        >
                          <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className={cn("px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-widest uppercase", catInfo.bg, catInfo.color)}>
                              {note.category}
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                              className="text-muted-foreground hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg hover:bg-rose-400/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <h4 className="text-lg font-bold mb-2 relative z-10 line-clamp-2 group-hover:text-primary transition-colors">{note.title || "Untitled Note"}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1 relative z-10 leading-relaxed opacity-70">
                            {note.content || "Empty note content..."}
                          </p>
                          
                          <div className="text-[11px] font-bold text-muted-foreground/50 mt-auto pt-4 border-t border-white/5 relative z-10 flex justify-between items-center">
                            <span>{note.date}</span>
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>

                          <div className={cn("absolute -bottom-16 -right-16 w-40 h-40 blur-[80px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none", catInfo.bg)} />
                        </motion.div>
                      )
                    })
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="editor"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-full flex flex-col"
              >
                <NoteEditor 
                  note={selectedNote} 
                  isEditing={isEditing} 
                  onToggleMode={() => setIsEditing(!isEditing)}
                  onBack={() => setSelectedNote(null)}
                  onSave={handleSaveNote}
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </AppShell>
  );
}

function NoteEditor({ note, isEditing, onToggleMode, onBack, onSave }) {
  const [draft, setDraft] = useState(note);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);

  // Sync draft with note when selection changes
  useEffect(() => {
    setDraft(note);
  }, [note]);

  const handleImageAdd = () => {
    if (imageUrl) {
      setDraft({
        ...draft,
        images: [...(draft.images || []), imageUrl],
        content: draft.content + `\n\n![Image](${imageUrl})`
      });
      setImageUrl("");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraft({
          ...draft,
          images: [...(draft.images || []), reader.result],
          content: draft.content + `\n\n![Image](${reader.result})`
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Ribbon Menu / Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2.5 rounded-xl hover:bg-white/5 text-muted-foreground transition">
            <ChevronLeft size={20} />
          </button>
          <div className="h-6 w-px bg-white/10 mx-1" />
          <h3 className="font-bold text-lg truncate max-w-[200px] md:max-w-md">
            {isEditing ? "Editing Knowledge" : draft.title || "Untitled Knowledge"}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={onToggleMode}
            variant="ghost" 
            className={cn("gap-2 rounded-xl font-bold h-10 px-4", isEditing ? "text-primary bg-primary/10" : "text-muted-foreground")}
          >
            {isEditing ? <><Eye size={16} /> Preview Mode</> : <><Edit3 size={16} /> Edit Mode</>}
          </Button>
          {isEditing && (
            <Button 
              onClick={() => onSave(draft)}
              className="gradient-primary text-white gap-2 rounded-xl font-bold h-10 px-6 shadow-lg shadow-primary/20"
            >
              <Save size={16} /> Save Changes
            </Button>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex flex-wrap items-center gap-1.5 mb-6 p-2 rounded-2xl bg-white/5 border border-white/5">
          <ToolbarButton icon={<Bold size={16} />} label="Bold" onClick={() => {}} />
          <ToolbarButton icon={<Italic size={16} />} label="Italic" onClick={() => {}} />
          <ToolbarButton icon={<List size={16} />} label="List" onClick={() => {}} />
          <div className="w-px h-5 bg-white/10 mx-1" />
          <ToolbarButton icon={<Code size={16} />} label="Code" onClick={() => setDraft({...draft, content: draft.content + "\n```javascript\n\n```"})} />
          <div className="w-px h-5 bg-white/10 mx-1" />
          <div className="flex items-center gap-2 ml-2">
            <Input 
              placeholder="Paste Image URL..." 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)}
              className="h-8 text-[11px] w-40 bg-white/5 border-white/10 rounded-lg"
            />
            <ToolbarButton icon={<ImageIcon size={16} />} label="Add" onClick={handleImageAdd} />
            <span className="text-xs text-muted-foreground px-2">or</span>
            <ToolbarButton icon={<Plus size={16} />} label="Upload" onClick={() => fileInputRef.current?.click()} />
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        {isEditing ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Knowledge Title</label>
              <Input 
                value={draft.title}
                onChange={(e) => setDraft({...draft, title: e.target.value})}
                placeholder="Enter a descriptive title..."
                className="text-2xl font-bold bg-transparent border-none focus-visible:ring-0 px-0 h-auto placeholder:opacity-30"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Category</label>
                <select 
                  value={draft.category}
                  onChange={(e) => setDraft({...draft, category: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-white"
                >
                  <option value="coding" className="bg-[#1a1a1a]">Coding & Technology</option>
                  <option value="business" className="bg-[#1a1a1a]">Business & Strategy</option>
                  <option value="subject" className="bg-[#1a1a1a]">Academic Subject</option>
                </select>
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Last Modified</label>
                <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-muted-foreground">
                  {draft.date}
                </div>
              </div>
            </div>

            <div className="space-y-2 flex-1 flex flex-col">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Content & Insights</label>
              <textarea 
                value={draft.content}
                onChange={(e) => setDraft({...draft, content: e.target.value})}
                placeholder="Start typing your deep work insights here..."
                className="flex-1 w-full bg-white/[0.02] border border-white/5 rounded-3xl p-6 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary/40 min-h-[400px] resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none space-y-8 pb-20">
            <div className="space-y-4">
              <div className={cn(
                "inline-block px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-widest uppercase",
                CATEGORIES.find(c => c.id === draft.category)?.bg || "bg-primary/10",
                CATEGORIES.find(c => c.id === draft.category)?.color || "text-primary"
              )}>
                {draft.category}
              </div>
              <h1 className="text-4xl font-bold tracking-tight">{draft.title || "Untitled Knowledge"}</h1>
              <div className="text-sm text-muted-foreground flex items-center gap-4">
                <span>{draft.date}</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>Deep Work Active</span>
              </div>
            </div>

            <div className="text-lg leading-relaxed text-zinc-300 whitespace-pre-wrap font-medium">
              {draft.content || "This knowledge base is currently empty."}
            </div>

            {/* Render Images if any */}
            {(draft.images || []).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {draft.images.map((img, i) => (
                  <div key={i} className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src={img} alt="Note asset" className="w-full h-auto object-cover hover:scale-105 transition duration-500" />
                  </div>
                ))}
              </div>
            )}

            {draft.code && (
              <div className="mt-8 rounded-3xl overflow-hidden border border-white/10 bg-black/40">
                <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Code Snippet</span>
                  <Code2 size={14} className="text-primary" />
                </div>
                <pre className="p-6 overflow-x-auto text-sm font-mono text-zinc-300">
                  <code>{draft.code}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({ icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-white transition flex items-center gap-2 text-xs font-semibold"
      title={label}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
