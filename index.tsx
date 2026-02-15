import React, { useState, useEffect, useRef, useMemo } from 'react';

import { ThemeToggle } from './ThemeToggle';
import { createRoot } from 'react-dom/client';
import { LoginOverlay } from './LoginOverlay';
import { LandingPage } from './LandingPage';
import ConsistencyCalendar from './ConsistencyCalendar';
import { auth } from './firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { loadHabitProgress, loadHabitConfigs, saveHabitProgress, saveHabitConfigs } from './firestore-service';
import { logOut } from './auth-service';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivacyPolicy from './src/pages/legal/PrivacyPolicy';
import TermsOfService from './src/pages/legal/TermsOfService';
import RefundPolicy from './src/pages/legal/RefundPolicy';
import ContactUs from './src/pages/legal/ContactUs';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
  registerables
} from 'chart.js';

Chart.register(...registerables);

interface Habit {
  id: string;
  name: string;
  goal: number;
  unit: string;
  checks: boolean[]; // 31 days
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const INITIAL_HABIT_CONFIGS = [
  { name: 'Morning Meditation', goal: 10, unit: 'mins' },
  { name: 'Deep Work', goal: 4, unit: 'hours' },
  { name: 'Reading', goal: 20, unit: 'pages' },
  { name: 'Hydration', goal: 8, unit: 'glasses' },
  { name: 'Exercise', goal: 30, unit: 'mins' },
  { name: 'Journaling', goal: 1, unit: 'page' },
  { name: 'Networking', goal: 1, unit: 'person' },
  { name: 'Learning French', goal: 15, unit: 'mins' },
  { name: 'Healthy Meal', goal: 3, unit: 'meals' },
  { name: 'No Sugar', goal: 1, unit: 'day' }
];

const createDefaultHabits = (): Habit[] =>
  INITIAL_HABIT_CONFIGS.map((config, i) => ({
    id: (i + 1).toString(),
    name: config.name,
    goal: config.goal,
    unit: config.unit,
    checks: new Array(31).fill(false)
  }));

const PASTEL_WEEKS = [
  'bg-rose-50 text-rose-600',   // Week 1
  'bg-indigo-50 text-indigo-600', // Week 2
  'bg-emerald-50 text-emerald-600', // Week 3
  'bg-amber-50 text-amber-600',  // Week 4
  'bg-violet-50 text-violet-600', // Week 5
];

const HabitTracker = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [animatingHabitId, setAnimatingHabitId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // Theme state
  const [showLogin, setShowLogin] = useState(false);

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkTheme(); // Initial check

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);


  const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  /* ------------------------------------------------------------------
   * STREAK LOGIC
   * ------------------------------------------------------------------ */
  const calculateStreak = (habitName: string, allData: Record<string, Habit[]>) => {
    let streak = 0;
    const today = new Date(); // Use real today for alignment
    // We start checking from Yesterday to seeing if the chain is alive.
    // If Today is checked, we add 1 to whatever the past streak is.

    // Check Today
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const todayDay = today.getDate();
    const todayHabits = allData[todayKey];
    const todayHabit = todayHabits?.find(h => h.name === habitName);
    const isTodayDone = todayHabit?.checks[todayDay - 1] || false;

    // Traverse backwards from Yesterday
    let dateIter = new Date(today);
    dateIter.setDate(dateIter.getDate() - 1); // Start with Yesterday

    while (true) {
      const y = dateIter.getFullYear();
      const m = dateIter.getMonth() + 1;
      const d = dateIter.getDate();
      const mKey = `${y}-${String(m).padStart(2, '0')}`;

      const habitsInMonth = allData[mKey];
      if (!habitsInMonth) break; // No data for this month, stop.

      const habit = habitsInMonth.find(h => h.name === habitName);
      if (!habit || !habit.checks[d - 1]) {
        break; // Streak broken
      }

      streak++;
      dateIter.setDate(dateIter.getDate() - 1); // Go back one day
    }

    return isTodayDone ? streak + 1 : streak;
  };


  const [allData, setAllData] = useState<Record<string, Habit[]>>({});

  const habits = useMemo(() => {
    if (allData[monthKey]) {
      const monthHabits = allData[monthKey];
      // Safety: Remove duplicates based on ID
      const uniqueHabits = monthHabits.filter((habit, index, self) =>
        index === self.findIndex((t) => t.id === habit.id)
      );
      return uniqueHabits;
    }
    const keys = Object.keys(allData).sort().reverse();
    if (keys.length > 0) {
      // Inherit names and units from most recent entry, but reset checks
      return allData[keys[0]].map(h => ({
        ...h,
        checks: new Array(31).fill(false)
      }));
    }
    return [];
  }, [allData, monthKey]);

  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const weeklyBarRef = useRef<HTMLCanvasElement>(null);
  const dailyDoughnutRef = useRef<HTMLCanvasElement>(null);

  const lineChartInstance = useRef<any>(null);
  const weeklyBarInstance = useRef<any>(null);
  const dailyDoughnutInstance = useRef<any>(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const getTodayStats = () => {
    const today = new Date();
    const isThisMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const dayIdx = today.getDate() - 1;

    if (!isThisMonth) return { completed: 0, left: 0, percentage: 0 };

    let completed = 0;
    habits.forEach(h => {
      if (h.checks[dayIdx]) completed++;
    });

    const total = habits.length;
    const left = Math.max(0, total - completed);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, left, percentage };
  };

  const todayStats = getTodayStats();



  const getWeeklyCompletion = () => {
    const weeks = [0, 0, 0, 0, 0];
    const weekCounts = [0, 0, 0, 0, 0];
    habits.forEach(h => {
      h.checks.slice(0, daysInMonth).forEach((checked, i) => {
        const weekIdx = Math.floor(i / 7);
        if (weekIdx < 5) {
          weekCounts[weekIdx]++;
          if (checked) weeks[weekIdx]++;
        }
      });
    });
    return weeks.map((val, i) => weekCounts[i] ? (val / weekCounts[i]) * 100 : 0);
  };

  const renderCharts = () => {
    const commonAnim = { duration: 1000, easing: 'easeOutQuart' as any };
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDarkMode ? '#94a3b8' : '#64748b'; // slate-400 vs slate-500

    if (lineChartRef.current) {
      if (lineChartInstance.current) lineChartInstance.current.destroy();
      const dailyCompletion = Array.from({ length: daysInMonth }, (_, i) => {
        const count = habits.filter(h => h.checks[i]).length;
        return (count / habits.length) * 100;
      });
      lineChartInstance.current = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
          datasets: [{
            data: dailyCompletion,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.05)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 3
          }]
        },
        options: {
          animation: commonAnim,
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: textColor } },
            y: { beginAtZero: true, max: 100, ticks: { display: false }, grid: { color: gridColor, tickBorderDash: [5, 5] } }
          }
        }
      });
    }

    if (weeklyBarRef.current) {
      if (weeklyBarInstance.current) weeklyBarInstance.current.destroy();
      weeklyBarInstance.current = new Chart(weeklyBarRef.current, {
        type: 'bar',
        data: {
          labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
          datasets: [{
            data: getWeeklyCompletion(),
            backgroundColor: [
              'rgba(253, 164, 175, 0.7)',
              'rgba(165, 180, 252, 0.7)',
              'rgba(134, 239, 172, 0.7)',
              'rgba(252, 211, 77, 0.7)',
              'rgba(196, 181, 253, 0.7)'
            ],
            borderRadius: 12,
            barThickness: 'flex',
            maxBarThickness: 60
          }]
        },
        options: {
          animation: commonAnim,
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { cornerRadius: 10 }
          },
          scales: {
            y: { beginAtZero: true, max: 100, display: false },
            x: { grid: { display: false }, ticks: { color: textColor, font: { weight: 'bold', family: 'Plus Jakarta Sans' } } }
          }
        }
      });
    }

    if (dailyDoughnutRef.current) {
      if (dailyDoughnutInstance.current) dailyDoughnutInstance.current.destroy();
      dailyDoughnutInstance.current = new Chart(dailyDoughnutRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Left'],
          datasets: [{
            data: [todayStats.completed, todayStats.left],
            backgroundColor: ['#fda4af', isDarkMode ? '#1e293b' : '#cbd5e1'], // Darker slate for unused part in dark mode
            hoverOffset: 4,
            borderWidth: 0,
            borderRadius: 8
          }]
        },
        options: {
          animation: commonAnim,
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
          }
        }
      });
    }
  };


  /* ------------------------------------------------------------------
   * FIREBASE INTEGRATION START
   * ------------------------------------------------------------------ */
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load user data on auth change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load data from Firestore
        const [progressData, configData] = await Promise.all([
          loadHabitProgress(currentUser.uid),
          loadHabitConfigs(currentUser.uid)
        ]);

        if (progressData || configData) {
          // Transform Firestore data back to `allData` structure
          // This is a simplified merge strategy: local vs remote.
          // For now, we overwrite local state with remote if remote exists to ensure sync.

          /*
             Transformation Logic:
             We need to reconstruct `allData` (Record<monthKey, Habit[]>) from `progressData` (Habit -> Date -> Bool).
                    Since `progressData` is just checks, we need `configData` for metadata (Goal, Unit).
                    */

          // 0. If New User (no configData), save defaults immediately
          if (!configData || Object.keys(configData).length === 0) {
            const defaultHabits = INITIAL_HABIT_CONFIGS.map((h, i) => ({ ...h, id: (i + 1).toString() }));
            saveHabitConfigs(currentUser.uid, defaultHabits);
          }

          const newAllData: Record<string, Habit[]> = {};

          // Helper to get month key from date string YYYY-MM-DD
          const getMonthKey = (dateStr: string) => dateStr.substring(0, 7); // "2026-02"

          // 1. Collect all unique month keys involved in checks
          const monthKeys = new Set<string>();
          if (progressData) {
            Object.values(progressData).forEach(dates => {
              Object.keys(dates).forEach(d => monthKeys.add(getMonthKey(d)));
            });
          }
          // Ensure current month is included
          monthKeys.add(monthKey);

          // 2. Iterate months and build Habit objects
          monthKeys.forEach(mKey => {
            const [y, m] = mKey.split('-').map(Number);
            const daysInM = new Date(y, m, 0).getDate();

            // Get habit keys from configs (now IDs or Names)
            const configKeys = Object.keys(configData);

            // If completely new user or empty, fallback to default names BUT we need to give them IDs if we want to move to ID-based system.
            // For now, if configData is empty, we use defaults.
            let habitItems: any[] = [];

            if (configKeys.length > 0) {
              // Build from saved configs
              const rawItems = configKeys.map(key => ({
                ...configData[key],
                id: configData[key].id || key, // Fallback to key if ID missing
                name: configData[key].name || key // Fallback to key if name missing
              }));

              // DE-DUPLICATION LOGIC:
              // 1. Prefer items with numeric IDs (1-10) over string IDs (Legacy Names)
              // 2. Remove items with duplicate Names (keep the one with numeric ID)
              const seenNames = new Set();
              // Sort so numeric IDs come first (simplified check: if id is number-like)
              rawItems.sort((a, b) => {
                const aIsNum = !isNaN(Number(a.id));
                const bIsNum = !isNaN(Number(b.id));
                if (aIsNum && !bIsNum) return -1;
                if (!aIsNum && bIsNum) return 1;
                return 0;
              });

              habitItems = rawItems.filter(item => {
                if (seenNames.has(item.name)) return false;
                seenNames.add(item.name);
                return true;
              });
            } else {
              // Defaults
              habitItems = INITIAL_HABIT_CONFIGS.map((h, i) => ({ ...h, id: (i + 1).toString() }));
            }

            const monthHabits: Habit[] = habitItems.map((item) => {
              const checks = new Array(31).fill(false);

              // Fill checks from progressData
              // Progressive migration: Check if progress is under ID or Name
              // We prefer ID if available in item.
              const lookupKey = item.name; // Currently saveHabitProgress uses NAME. We need to support ID eventually, but for now let's keep NAME to not break history, BUT we must ensure uniqueness.
              // Actually, the bug is that "New Routine" duplicates share the same lookupKey.
              // to fix this without breaking old data:
              // We should start saving progress under ID.

              // Let's look for progress under Name first (legacy) then ID? 
              // Or just Name. If we have duplicate names, they will share progress.
              // The robust fix is to switch `saveHabitProgress` to use ID.

              // For now, let's load what we can.
              if (progressData) {
                // Check by Name (Legacy)
                if (progressData[item.name]) {
                  Object.entries(progressData[item.name]).forEach(([dateStr, checked]) => {
                    if (dateStr.startsWith(mKey) && checked) {
                      const day = parseInt(dateStr.split('-')[2]);
                      if (day > 0 && day <= daysInM) checks[day - 1] = true;
                    }
                  });
                }
                // Check by ID (Future/Fix)
                if (progressData[item.id]) {
                  Object.entries(progressData[item.id]).forEach(([dateStr, checked]) => {
                    if (dateStr.startsWith(mKey) && checked) {
                      const day = parseInt(dateStr.split('-')[2]);
                      if (day > 0 && day <= daysInM) checks[day - 1] = true;
                    }
                  });
                }
              }

              return {
                id: item.id,
                name: item.name,
                goal: item.goal,
                unit: item.unit,
                checks
              };
            });
            newAllData[mKey] = monthHabits;
          });

          setAllData(newAllData);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [monthKey]);

  // Modified toggleCheck to save to Firestore
  const toggleCheck = async (habitId: string, dayIdx: number) => {
    setAnimatingHabitId(`${habitId}-${dayIdx}`);
    const newHabits = habits.map(h => {
      if (h.id === habitId) {
        const nc = [...h.checks];
        nc[dayIdx] = !nc[dayIdx];

        // Fire and forget Firestore update
        if (user) {
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayIdx + 1).padStart(2, '0')}`;
          // Use ID for robustness, fallback to default behavior if needed? No, ID is always present now.
          saveHabitProgress(user.uid, h.id, dateStr, nc[dayIdx]);
        }

        return { ...h, checks: nc };
      }
      return h;
    });
    setAllData(prev => ({ ...prev, [monthKey]: newHabits }));
    setTimeout(() => setAnimatingHabitId(null), 400);
  };

  const updateGoal = (id: string, newGoal: number) => {
    const newHabits = habits.map(h => h.id === id ? { ...h, goal: newGoal } : h);
    setAllData(prev => ({ ...prev, [monthKey]: newHabits }));
    if (user) {
      saveHabitConfigs(user.uid, newHabits);
    }
  };

  const updateUnit = (id: string, newUnit: string) => {
    const newHabits = habits.map(h => h.id === id ? { ...h, unit: newUnit } : h);
    setAllData(prev => ({ ...prev, [monthKey]: newHabits }));
    if (user) {
      saveHabitConfigs(user.uid, newHabits);
    }
  };

  const updateHabitName = (id: string, newName: string) => {
    const newHabits = habits.map(h => h.id === id ? { ...h, name: newName } : h);
    setAllData(prev => ({ ...prev, [monthKey]: newHabits }));
    if (user) {
      saveHabitConfigs(user.uid, newHabits);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    logOut();
    setAllData({}); // Clear local data on logout
  };

  /* ------------------------------------------------------------------
   * FIREBASE INTEGRATION END
   * ------------------------------------------------------------------ */

  useEffect(() => {
    const timer = setTimeout(() => {
      renderCharts();
    }, 100);

    return () => clearTimeout(timer);
  }, [habits, currentMonth, currentYear, isDarkMode]); // Re-render charts when data or date or theme changes

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not authenticated, show Landing Page
  if (!user) {
    return (
      <>
        <LandingPage onLoginClick={() => setShowLogin(true)} />
        {showLogin && <LoginOverlay onClose={() => setShowLogin(false)} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 p-4 md:p-6 lg:p-8 space-y-8 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300">

      {/* HEADER ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-6 md:p-8 lg:p-10 shadow-sm flex flex-col justify-between border border-gray-100 dark:border-slate-800 ring-1 dark:ring-white/5 hover:scale-[1.01] hover:shadow-xl transition-all duration-300">
          <div>
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-indigo-600 rounded-[24px] flex items-center justify-center mb-6 shadow-xl shadow-indigo-100 dark:shadow-none">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                {user && (
                  <button onClick={handleLogout} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
                    Logout
                  </button>
                )}
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {user?.displayName || 'FocusBoard'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-base md:text-lg leading-tight">Master your routine engineering.</p>
          </div>

          <div className="mt-10 flex gap-4">
            <select
              value={currentMonth}
              onChange={e => setCurrentMonth(parseInt(e.target.value))}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 px-4 md:py-4 md:px-5 text-sm font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
            >
              {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <input
              type="number"
              value={currentYear}
              onChange={e => setCurrentYear(parseInt(e.target.value) || 2026)}
              className="w-28 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 px-4 md:py-4 md:px-5 text-sm font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 text-center"
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[40px] p-6 md:p-8 lg:p-10 shadow-sm border border-gray-100 dark:border-slate-800 hover:scale-[1.01] hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">Growth Trajectory</h2>
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Monthly Pulse</span>
          </div>
          <div className="relative h-48 w-full" style={{ height: '192px' }}>
            <canvas ref={lineChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[40px] p-6 md:p-8 lg:p-10 shadow-sm border border-gray-100 dark:border-slate-800 hover:scale-[1.01] hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Weekly Momentum</h3>
              <p className="text-slate-400 font-medium">Aggregate completion intensity</p>
            </div>
          </div>
          <div className="relative h-56 w-full" style={{ height: '224px' }}>
            <canvas ref={weeklyBarRef}></canvas>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-6 md:p-8 lg:p-10 shadow-sm border border-gray-100 dark:border-slate-800 ring-1 dark:ring-white/5 flex flex-col items-center hover:scale-[1.01] hover:shadow-xl transition-all duration-300">
          <div className="w-full text-center mb-6">
            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">Daily Status</h3>
            <p className="text-slate-400 font-medium text-sm">Today's Performance</p>
          </div>
          <div className="relative w-40 h-40" style={{ height: '160px', width: '160px' }}>
            <canvas ref={dailyDoughnutRef}></canvas>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800 dark:text-white">{todayStats.percentage}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Done</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-8 w-full">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest mb-1">Done</p>
              <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">{todayStats.completed}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest mb-1">Left</p>
              <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">{todayStats.left}</p>
            </div>
          </div>
        </div>
      </section>

      {/* MONTHLY CONSISTENCY */}
      <section className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-6 md:p-8 lg:p-10 shadow-sm border border-gray-100 dark:border-slate-800 hover:scale-[1.01] hover:shadow-xl transition-all duration-300 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Consistency Calendar</h3>
            <p className="text-slate-400 font-medium">Daily completion visualization</p>
          </div>
          <ConsistencyCalendar data={(() => {
            const data: { [key: string]: { percentage: number; count: number; total: number } } = {};

            // Merge allData with current habits and type it explicitly
            const combinedData: Record<string, Habit[]> = { ...allData, [monthKey]: habits };

            Object.entries(combinedData).forEach(([mKey, monthHabits]) => {
              const [y, m] = mKey.split('-').map(Number);
              const daysInM = new Date(y, m, 0).getDate();
              for (let d = 1; d <= daysInM; d++) {
                const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const completedCount = monthHabits.filter(h => h.checks[d - 1] === true).length;
                const total = monthHabits.length;
                if (total > 0) {
                  data[dateKey] = {
                    percentage: Math.round((completedCount / total) * 100),
                    count: completedCount,
                    total: total
                  };
                }
              }
            });
            return data;
          })()} />
        </div>
      </section>

      {/* MAIN HABIT GRID */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800 ring-1 dark:ring-white/5 overflow-hidden animate-fade-in-up hover:shadow-xl transition-all duration-300" style={{ animationDelay: '200ms' }}>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/40 dark:bg-slate-800/50">
                <th className="p-4 md:p-8 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em] sticky left-0 bg-white dark:bg-slate-900 z-20 w-52 min-w-[200px] md:w-80 md:min-w-[320px] border-b border-gray-100 dark:border-slate-800 border-r dark:border-r-slate-800">Daily Routines</th>
                <th className="p-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">Daily Target</th>
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const weekIdx = Math.floor(i / 7);
                  const isVisible = day <= daysInMonth;
                  return (
                    <th key={i} className={`p-3 text-center border-b border-gray-100 dark:border-slate-800 w-12 min-w-[48px] ${isVisible ? PASTEL_WEEKS[Math.min(weekIdx, 4)] : 'opacity-0'}`}>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-800">{day}</span>
                    </th>
                  );
                })}
                <th className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 border-l border-slate-100 dark:border-l-slate-800">Days Done</th>
                <th className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800">% Done</th>
                <th className="p-4 md:p-8 text-right text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-gray-100 dark:border-slate-800 min-w-[160px]">Consistency</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => {
                const doneCount = habit.checks.slice(0, daysInMonth).filter(Boolean).length;
                const progress = Math.round((doneCount / daysInMonth) * 100);

                return (
                  <tr key={habit.id} className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-gray-50 dark:border-slate-800 last:border-0 ${calculateStreak(habit.name, allData) >= 10 ? 'shadow-[0_0_15px_rgba(234,179,8,0.3)] border-l-4 border-l-yellow-500 bg-yellow-50/30 dark:bg-yellow-900/10' : ''}`}>
                    <td className="p-4 md:p-8 sticky left-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50/50 dark:group-hover:bg-slate-800/50 z-20 border-r border-gray-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <input
                          className="bg-transparent border-none focus:ring-0 font-bold text-slate-800 dark:text-white w-full outline-none placeholder-slate-300 text-sm md:text-lg transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                          value={habit.name}
                          onChange={e => updateHabitName(habit.id, e.target.value)}
                        />
                        {calculateStreak(habit.name, allData) >= 3 && (
                          <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full animate-bounce-slow">
                            <span className="text-sm">🔥</span>
                            <span className="text-xs font-black text-orange-600 dark:text-orange-400">{calculateStreak(habit.name, allData)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full flex items-center justify-center gap-1 w-fit mx-auto transition-all hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 group-hover:border-indigo-200 dark:group-hover:border-indigo-900">
                        <input
                          type="number"
                          value={habit.goal}
                          onChange={e => updateGoal(habit.id, parseInt(e.target.value) || 0)}
                          className="w-8 bg-transparent border-none text-right font-black text-slate-800 dark:text-white focus:ring-0 outline-none p-0 text-sm appearance-none"
                        />
                        <input
                          type="text"
                          value={habit.unit}
                          placeholder="unit"
                          onChange={e => updateUnit(habit.id, e.target.value)}
                          className="w-14 bg-transparent border-none text-left font-bold text-slate-500 focus:ring-0 outline-none p-0 text-[10px] uppercase tracking-tighter"
                        />
                      </div>
                    </td>
                    {habit.checks.map((checked, dayIdx) => {
                      const day = dayIdx + 1;
                      const isVisible = day <= daysInMonth;
                      const isAnimating = animatingHabitId === `${habit.id}-${dayIdx}`;
                      return (
                        <td key={dayIdx} className={`p-1.5 text-center ${!isVisible && 'bg-slate-50/30 dark:bg-slate-800/30 opacity-20'}`}>
                          {isVisible && (
                            <div
                              onClick={() => toggleCheck(habit.id, dayIdx)}
                              className={`w-8 h-8 mx-auto rounded-xl cursor-pointer transition-all flex items-center justify-center border-2 ${checked
                                ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-none'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                                } ${isAnimating ? 'checkbox-anim' : ''} active:scale-90`}
                            >
                              {checked && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-4 text-center border-l border-slate-50 dark:border-slate-800 font-black text-slate-700 dark:text-slate-200">{doneCount}</td>
                    <td className="p-4 text-center font-black text-indigo-600 dark:text-indigo-400">{progress}%</td>
                    <td className="p-4 md:p-8">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden border border-gray-100 dark:border-slate-700 shadow-inner">
                          <div
                            className={`h-full transition-all duration-700 ease-out rounded-full ${progress === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : progress > 50 ? 'bg-indigo-500' : 'bg-slate-400'
                              }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-t-2 border-slate-200 dark:border-slate-800">
                <td className="p-4 md:p-8 sticky left-0 bg-slate-50 dark:bg-slate-900 z-20 font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs border-r border-gray-200 dark:border-slate-800">
                  Monthly Average
                </td>
                <td colSpan={32}></td>
                <td className="p-4 text-center font-black text-slate-800 dark:text-white text-sm border-l border-slate-200 dark:border-slate-800">
                  {Math.round(habits.reduce((acc, h) => acc + h.checks.slice(0, daysInMonth).filter(Boolean).length, 0) / (habits.length || 1))}
                </td>
                <td className="p-4 text-center font-black text-indigo-600 dark:text-indigo-400 text-sm">
                  {Math.round(habits.reduce((acc, h) => acc + (h.checks.slice(0, daysInMonth).filter(Boolean).length / daysInMonth) * 100, 0) / (habits.length || 1))}%
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 py-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <button
          onClick={() => {
            const newHabit = { id: Date.now().toString(), name: 'New Routine', goal: 10, unit: 'mins', checks: new Array(31).fill(false) };
            const newHabits = [...habits, newHabit];
            setAllData(prev => ({ ...prev, [monthKey]: newHabits }));
            if (user) {
              saveHabitConfigs(user.uid, newHabits);
            }
          }}
          className="group flex items-center gap-3 bg-indigo-600 text-white px-6 py-4 md:px-10 md:py-5 rounded-[24px] font-black text-base md:text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 hover:-translate-y-1 active:scale-95"
        >
          <span className="text-2xl leading-none font-light transition-transform group-hover:rotate-90 inline-block">+</span>
          <span>Add New Daily Habit</span>
        </button>
        <div className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em]">
          FocusBoard Pro • Precision Productivity Engine v8.3
        </div>
      </div>


    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HabitTracker />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/refund" element={<RefundPolicy />} />
      <Route path="/contact" element={<ContactUs />} />
    </Routes>
  </BrowserRouter>
);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
