import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, ChevronLeft, ChevronRight, Brain, Zap, Library } from "lucide-react";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { title: "Flashcards — Notes Pilot" },
      { name: "description", content: "Master subjects with AI-powered spaced repetition. Organize by deck and level up your memory." },
    ],
  }),
  component: FlashcardsPage,
});

const DECKS = [
  { id: 1, title: "Biology: Human Anatomy", count: 42, color: "from-pink-500/20 to-rose-500/10", icon: Brain },
  { id: 2, title: "Data Structures & Algorithms", count: 120, color: "from-blue-500/20 to-cyan-500/10", icon: Zap },
  { id: 3, title: "Business Economics", count: 35, color: "from-emerald-500/20 to-teal-500/10", icon: Library },
];

const SAMPLE_CARDS = [
  { id: 1, front: "What is the time complexity of QuickSort in the worst case?", back: "O(n^2) - This occurs when the pivot chosen is always the greatest or smallest element." },
  { id: 2, front: "Define the Law of Demand in Economics.", back: "As the price of a good increases, the quantity demanded decreases, assuming all other factors remain constant (ceteris paribus)." },
  { id: 3, front: "What is the powerhouse of the cell?", back: "The Mitochondria. It generates most of the chemical energy needed to power the cell's biochemical reactions." },
];

function FlashcardsPage() {
  const [activeDeck, setActiveDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const startDeck = (deckId) => {
    setActiveDeck(deckId);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    if (currentCardIndex < SAMPLE_CARDS.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(c => c + 1), 150);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(c => c - 1), 150);
    }
  };

  return (
    <AppShell title="Flashcards Memory" subtitle="Active recall and spaced repetition">
      <div className="h-[calc(100vh-12rem)] flex flex-col">
        {!activeDeck ? (
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold">Your Decks</h2>
              <Button className="gradient-primary gap-2 glow text-white">
                <Plus className="w-4 h-4" /> Create Deck
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DECKS.map(deck => {
                const Icon = deck.icon;
                return (
                  <div 
                    key={deck.id}
                    onClick={() => startDeck(deck.id)}
                    className="glass-panel p-6 rounded-3xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${deck.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{deck.title}</h3>
                      <p className="text-muted-foreground mt-auto">{deck.count} cards</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full relative">
            <Button 
              variant="ghost" 
              className="absolute top-0 left-0 gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => setActiveDeck(null)}
            >
              <ChevronLeft className="w-4 h-4" /> Back to Decks
            </Button>
            
            <div className="text-sm font-medium text-muted-foreground mb-8">
              Card {currentCardIndex + 1} of {SAMPLE_CARDS.length}
            </div>

            <div 
              className="w-full h-80 perspective-1000 cursor-pointer mb-12"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <AnimatePresence mode="wait">
                {!isFlipped ? (
                  <motion.div
                    key="front"
                    initial={{ rotateX: 90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 glass-panel rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl border border-white/10"
                  >
                    <span className="absolute top-6 left-6 text-xs font-semibold uppercase tracking-wider text-primary">Front • Question</span>
                    <p className="text-2xl md:text-3xl font-display font-medium leading-tight">
                      {SAMPLE_CARDS[currentCardIndex].front}
                    </p>
                    <p className="absolute bottom-6 text-sm text-muted-foreground">Click to flip</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ rotateX: 90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 glass-panel bg-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl border border-white/20"
                  >
                    <span className="absolute top-6 left-6 text-xs font-semibold uppercase tracking-wider text-green-400">Back • Answer</span>
                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-green-50">
                      {SAMPLE_CARDS[currentCardIndex].back}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-6">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={(e) => { e.stopPropagation(); prevCard(); }}
                disabled={currentCardIndex === 0}
                className="w-14 h-14 rounded-full border-white/10 bg-background/50 hover:bg-white/10"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                className="w-14 h-14 rounded-full border-white/10 bg-background/50 hover:bg-white/10"
              >
                <RotateCcw className="w-5 h-5 text-muted-foreground" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={(e) => { e.stopPropagation(); nextCard(); }}
                disabled={currentCardIndex === SAMPLE_CARDS.length - 1}
                className="w-14 h-14 rounded-full border-white/10 bg-background/50 hover:bg-white/10"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

          </div>
        )}
      </div>
    </AppShell>
  );
}
