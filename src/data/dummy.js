export const stats = [
  { label: "Study Hours", value: "42.5h", delta: "+12%", icon: "Clock", tone: "primary" },
  { label: "Tasks Done", value: "128", delta: "+8%", icon: "CheckCircle2", tone: "success" },
  { label: "Focus Score", value: "92%", delta: "+5%", icon: "Target", tone: "accent" },
  { label: "Streak", value: "14 days", delta: "🔥", icon: "Flame", tone: "warning" },
];

export const schedule = [
  { time: "09:00", title: "Linear Algebra", subject: "Math", duration: "1h 30m", color: "primary" },
  { time: "11:00", title: "Organic Chemistry Lab", subject: "Chemistry", duration: "2h", color: "accent" },
  { time: "14:00", title: "World History Reading", subject: "History", duration: "1h", color: "success" },
  { time: "16:30", title: "Python Project Sprint", subject: "CS", duration: "2h 30m", color: "warning" },
  { time: "20:00", title: "Revision & Notes", subject: "All", duration: "45m", color: "primary" },
];

export const tasks = [
  { id: 1, title: "Finish calculus problem set", due: "Today", priority: "High", done: false, subject: "Math" },
  { id: 2, title: "Read Chapter 7 — Cellular Biology", due: "Today", priority: "Medium", done: true, subject: "Biology" },
  { id: 3, title: "Submit history essay draft", due: "Tomorrow", priority: "High", done: false, subject: "History" },
  { id: 4, title: "Practice Spanish vocabulary", due: "Wed", priority: "Low", done: false, subject: "Language" },
  { id: 5, title: "Review lecture notes — DSA", due: "Thu", priority: "Medium", done: false, subject: "CS" },
  { id: 6, title: "Lab report — titration", due: "Fri", priority: "High", done: false, subject: "Chemistry" },
];

export const goals = [
  { name: "Math Mastery", progress: 78, target: "12 chapters", color: "primary" },
  { name: "Coding Practice", progress: 64, target: "20 problems", color: "accent" },
  { name: "Reading", progress: 92, target: "5 books", color: "success" },
  { name: "Language Learning", progress: 45, target: "200 words", color: "warning" },
];

export const exams = [
  { subject: "Calculus II", date: "May 22", days: 7, color: "primary" },
  { subject: "Organic Chemistry", date: "May 28", days: 13, color: "accent" },
  { subject: "Modern History", date: "Jun 04", days: 20, color: "success" },
  { subject: "Data Structures", date: "Jun 11", days: 27, color: "warning" },
];

export const activity = [
  { user: "You", action: "completed", target: "Calculus Chapter 5", time: "12m ago" },
  { user: "You", action: "started", target: "Pomodoro session", time: "1h ago" },
  { user: "Mia", action: "shared notes for", target: "Organic Chemistry", time: "3h ago" },
  { user: "You", action: "added task", target: "History essay", time: "5h ago" },
  { user: "Leo", action: "joined study group", target: "DSA Sprint", time: "Yesterday" },
];

export const notes = [
  { title: "Eigenvalue intuition", body: "Vectors that don't change direction under transformation. λ scales them.", color: "primary" },
  { title: "SN2 vs SN1", body: "SN2 — concerted, inversion. SN1 — carbocation intermediate, racemization.", color: "accent" },
  { title: "Big-O quick ref", body: "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)", color: "success" },
];

export const weeklyHours = [
  { day: "Mon", hours: 4.2, focus: 78 },
  { day: "Tue", hours: 5.5, focus: 86 },
  { day: "Wed", hours: 3.8, focus: 70 },
  { day: "Thu", hours: 6.1, focus: 92 },
  { day: "Fri", hours: 4.9, focus: 81 },
  { day: "Sat", hours: 7.2, focus: 95 },
  { day: "Sun", hours: 5.0, focus: 84 },
];

export const productivityTrend = [
  { week: "W1", score: 62 },
  { week: "W2", score: 68 },
  { week: "W3", score: 74 },
  { week: "W4", score: 71 },
  { week: "W5", score: 82 },
  { week: "W6", score: 88 },
  { week: "W7", score: 92 },
];

export const subjectDistribution = [
  { name: "Math", value: 28, color: "#8b5cf6" },
  { name: "Chemistry", value: 22, color: "#06b6d4" },
  { name: "CS", value: 24, color: "#22d3a5" },
  { name: "History", value: 14, color: "#f5b942" },
  { name: "Language", value: 12, color: "#ec4899" },
];

export const focusData = [
  { time: "6a", focus: 40 }, { time: "8a", focus: 65 }, { time: "10a", focus: 88 },
  { time: "12p", focus: 72 }, { time: "2p", focus: 60 }, { time: "4p", focus: 84 },
  { time: "6p", focus: 78 }, { time: "8p", focus: 92 }, { time: "10p", focus: 70 },
];

export const subjects = [
  { name: "Mathematics", chapters: 18, done: 14, color: "from-violet-500 to-fuchsia-500", icon: "Sigma" },
  { name: "Chemistry", chapters: 12, done: 7, color: "from-cyan-500 to-blue-500", icon: "FlaskConical" },
  { name: "Computer Science", chapters: 22, done: 16, color: "from-emerald-500 to-teal-500", icon: "Code2" },
  { name: "History", chapters: 10, done: 5, color: "from-amber-500 to-orange-500", icon: "Landmark" },
  { name: "Biology", chapters: 14, done: 9, color: "from-pink-500 to-rose-500", icon: "Leaf" },
  { name: "Spanish", chapters: 8, done: 3, color: "from-indigo-500 to-purple-500", icon: "Languages" },
];

export const timetable = {
  hours: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  blocks: [
    { day: "Mon", hour: "08:00", title: "Algebra", color: "primary" },
    { day: "Mon", hour: "14:00", title: "Chemistry Lab", color: "accent" },
    { day: "Tue", hour: "10:00", title: "DSA", color: "success" },
    { day: "Tue", hour: "16:00", title: "History", color: "warning" },
    { day: "Wed", hour: "08:00", title: "Algebra", color: "primary" },
    { day: "Wed", hour: "12:00", title: "Spanish", color: "accent" },
    { day: "Thu", hour: "10:00", title: "DSA", color: "success" },
    { day: "Thu", hour: "18:00", title: "Reading", color: "warning" },
    { day: "Fri", hour: "08:00", title: "Calculus", color: "primary" },
    { day: "Fri", hour: "14:00", title: "Project", color: "accent" },
    { day: "Sat", hour: "10:00", title: "Group Study", color: "success" },
    { day: "Sun", hour: "16:00", title: "Review", color: "warning" },
  ],
};

export const features = [
  { icon: "Calendar", title: "Smart Planner", body: "Drag, drop and balance your week with adaptive scheduling that learns from how you actually study." },
  { icon: "Timer", title: "Pomodoro Focus", body: "Built-in deep-work timer with ambient soundscapes and gentle break reminders." },
  { icon: "BarChart3", title: "Insightful Analytics", body: "Weekly study trends, focus heatmaps and subject breakdowns to keep momentum visible." },
  { icon: "Target", title: "Goals & Streaks", body: "Set ambitious goals, track streaks and celebrate every milestone with motion-rich feedback." },
  { icon: "NotebookPen", title: "Notes Workspace", body: "Lightweight notes that live next to your tasks — no more juggling six different apps." },
  { icon: "Users", title: "Study Together", body: "Share planners, swap notes and run virtual co-working rooms with classmates." },
];

export const testimonials = [
  { name: "Amelia Chen", role: "Pre-med, Stanford", quote: "Studyflow turned my chaotic weeks into a calm rhythm. My GPA went up half a point in one quarter." },
  { name: "Marcus Reed", role: "CS undergrad, MIT", quote: "The analytics page is genuinely beautiful. I finally know which subjects need more love." },
  { name: "Priya Natarajan", role: "Bar exam candidate", quote: "Pomodoro + planner in one place. I stopped switching tabs and started actually finishing chapters." },
];
