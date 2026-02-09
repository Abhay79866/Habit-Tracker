import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

interface Habit {
  id: string;
  name: string;
  goal: number;
  checks: boolean[]; // 31 days
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const INITIAL_HABIT_NAMES = [
  'Morning Meditation', 'Deep Work', 'Reading', 'Hydration', 'Exercise',
  'Journaling', 'Networking', 'Learning French', 'Healthy Meal', 'No Sugar'
];

const createDefaultHabits = (): Habit[] => 
  INITIAL_HABIT_NAMES.map((name, i) => ({
    id: (i + 1).toString(),
    name,
    goal: 20,
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
  
  const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  const [allData, setAllData] = useState<Record<string, Habit[]>>(() => {
    const saved = localStorage.getItem('habit-v7-data');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(key => {
          parsed[key] = parsed[key].map((h: any) => ({ ...h, goal: h.goal ?? 20 }));
        });
        return parsed;
      } catch (e) { return {}; }
    }
    return {};
  });

  const habits = useMemo(() => {
    if (allData[monthKey]) return allData[monthKey];
    const keys = Object.keys(allData).sort().reverse();
    if (keys.length > 0) {
      return allData[keys[0]].map(h => ({ ...h, checks: new Array(31).fill(false) }));
    }
    return createDefaultHabits();
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

  useEffect(() => {
    localStorage.setItem('habit-v7-data', JSON.stringify(allData));
    renderCharts();
  }, [allData, monthKey, habits, currentMonth, currentYear, todayStats.completed]);

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

    // 1. Line Chart
    if (lineChartRef.current) {
      if (lineChartInstance.current) lineChartInstance.current.destroy();
      const dailyCompletion = Array.from({ length: daysInMonth }, (_, i) => {
        const count = habits.filter(h => h.checks[i]).length;
        return (count / habits.length) * 100;
      });

      lineChartInstance.current = new (window as any).Chart(lineChartRef.current, {
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
            x: { grid: { display: false } },
            y: { beginAtZero: true, max: 100, ticks: { display: false }, grid: { borderDash: [5, 5] } }
          }
        }
      });
    }

    // 2. Weekly Momentum
    if (weeklyBarRef.current) {
      if (weeklyBarInstance.current) weeklyBarInstance.current.destroy();
      weeklyBarInstance.current = new (window as any).Chart(weeklyBarRef.current, {
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
            x: { grid: { display: false }, ticks: { font: { weight: 'bold', family: 'Plus Jakarta Sans' } } }
          }
        }
      });
    }

    // 3. Daily Doughnut
    if (dailyDoughnutRef.current) {
      if (dailyDoughnutInstance.current) dailyDoughnutInstance.current.destroy();
      dailyDoughnutInstance.current = new (window as any).Chart(dailyDoughnutRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Left'],
          datasets: [{
            data: [todayStats.completed, todayStats.left],
            backgroundColor: ['#fda4af', '#cbd5e1'], 
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

  const toggleCheck = (habitId: string, dayIdx: number) => {
    setAnimatingHabitId(`${habitId}-${dayIdx}`);
    const newHabits = habits.map(h => {
      if (h.id === habitId) {
        const nc = [...h.checks];
        nc[dayIdx] = !nc[dayIdx];
        return { ...h, checks: nc };
      }
      return h;
    });
    setAllData(prev => ({ ...prev, [monthKey]: newHabits }));
    // Clear animation state after duration
    setTimeout(() => setAnimatingHabitId(null), 400);
  };

  const updateGoal = (habitId: string, goal: number) => {
    const newHabits = habits.map(h => h.id === habitId ? { ...h, goal } : h);
    setAllData(prev => ({ ...prev, [monthKey]: newHabits }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* HEADER ROW - STAGGER 0s */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
        <div className="bg-white rounded-[40px] p-10 shadow-sm flex flex-col justify-between border border-gray-100 hover:scale-[1.01] hover:shadow-xl transition-all duration-300">
          <div>
            <div className="w-14 h-14 bg-indigo-600 rounded-[24px] flex items-center justify-center mb-6 shadow-xl shadow-indigo-100">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">FocusBoard</h1>
            <p className="text-slate-500 mt-2 font-medium text-lg leading-tight">Elevated routine engineering.</p>
          </div>
          
          <div className="mt-10 flex gap-4">
            <select 
              value={currentMonth} 
              onChange={e => setCurrentMonth(parseInt(e.target.value))}
              className="flex-1 bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
            >
              {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <input 
              type="number" 
              value={currentYear} 
              onChange={e => setCurrentYear(parseInt(e.target.value) || 2026)}
              className="w-28 bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 text-center"
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 hover:scale-[1.01] hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-800">Growth Trajectory</h2>
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Monthly Pulse</span>
          </div>
          <div className="h-48">
            <canvas ref={lineChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* STATS GRID - STAGGER 0.1s */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 hover:scale-[1.01] hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Weekly Momentum</h3>
              <p className="text-slate-400 font-medium">Monthly consistency heatmap</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <canvas ref={weeklyBarRef}></canvas>
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 flex flex-col items-center hover:scale-[1.01] hover:shadow-xl transition-all duration-300">
          <div className="w-full text-center mb-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Daily Status</h3>
            <p className="text-slate-400 font-medium text-sm">Today's Performance</p>
          </div>
          <div className="relative w-40 h-40">
            <canvas ref={dailyDoughnutRef}></canvas>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800">{todayStats.percentage}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Done</span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-8 w-full">
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Done</p>
                <p className="text-2xl font-black text-slate-800">{todayStats.completed}</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Left</p>
                <p className="text-2xl font-black text-slate-800">{todayStats.left}</p>
             </div>
          </div>
        </div>
      </section>

      {/* MAIN HABIT GRID - STAGGER 0.2s */}
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up hover:shadow-xl transition-all duration-300" style={{ animationDelay: '200ms' }}>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/40">
                <th className="p-8 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em] sticky left-0 bg-white z-20 w-80 min-w-[320px] border-b border-gray-100">Daily Routines</th>
                <th className="p-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-b border-gray-100">Goal</th>
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const weekIdx = Math.floor(i / 7);
                  const isVisible = day <= daysInMonth;
                  return (
                    <th key={i} className={`p-3 text-center border-b border-gray-100 w-12 min-w-[48px] ${isVisible ? PASTEL_WEEKS[Math.min(weekIdx, 4)] : 'opacity-0'}`}>
                      <span className="text-xs font-black">{day}</span>
                    </th>
                  );
                })}
                <th className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 border-l border-slate-100">Done</th>
                <th className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100">Left</th>
                <th className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100">%</th>
                <th className="p-8 text-right text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-gray-100 min-w-[160px]">Progress</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => {
                const doneCount = habit.checks.slice(0, daysInMonth).filter(Boolean).length;
                const leftCount = Math.max(0, daysInMonth - doneCount);
                const progress = Math.round((doneCount / daysInMonth) * 100);
                
                return (
                  <tr key={habit.id} className="group hover:bg-slate-50/50 transition-colors border-b border-gray-50 last:border-0">
                    <td className="p-8 sticky left-0 bg-white group-hover:bg-slate-50/50 z-20 border-r border-gray-100">
                      <input 
                        className="bg-transparent border-none focus:ring-0 font-bold text-slate-800 w-full outline-none placeholder-slate-300 text-lg transition-colors group-hover:text-indigo-600"
                        value={habit.name}
                        onChange={e => {
                          const newHabits = habits.map(h => h.id === habit.id ? { ...h, name: e.target.value } : h);
                          setAllData(prev => ({ ...prev, [monthKey]: newHabits }));
                        }}
                      />
                    </td>
                    <td className="p-4 text-center">
                      <input 
                        type="number"
                        value={habit.goal}
                        onChange={e => updateGoal(habit.id, parseInt(e.target.value) || 0)}
                        className="w-16 bg-transparent border-none text-center font-bold text-slate-700 focus:ring-0 transition-all focus:scale-110"
                      />
                    </td>
                    {habit.checks.map((checked, dayIdx) => {
                      const day = dayIdx + 1;
                      const isVisible = day <= daysInMonth;
                      const isAnimating = animatingHabitId === `${habit.id}-${dayIdx}`;
                      return (
                        <td key={dayIdx} className={`p-1.5 text-center ${!isVisible && 'bg-slate-50/30 opacity-20'}`}>
                          {isVisible && (
                            <div 
                              onClick={() => toggleCheck(habit.id, dayIdx)}
                              className={`w-8 h-8 mx-auto rounded-xl cursor-pointer transition-all flex items-center justify-center border-2 ${
                                checked 
                                ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100' 
                                : 'bg-white border-slate-200 hover:border-indigo-300'
                              } ${isAnimating ? 'checkbox-anim' : ''} active:scale-90`}
                            >
                              {checked && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-4 text-center border-l border-slate-50 font-black text-slate-700">{doneCount}</td>
                    <td className="p-4 text-center font-bold text-slate-400">{leftCount}</td>
                    <td className="p-4 text-center font-black text-indigo-600">{progress}%</td>
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden border border-gray-100 shadow-inner">
                          <div 
                            className={`h-full transition-all duration-700 ease-out rounded-full ${
                              progress === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : progress > 50 ? 'bg-indigo-500' : 'bg-slate-400'
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
          </table>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 py-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <button 
          onClick={() => {
            const newHabits = [...habits, { id: Date.now().toString(), name: 'New Routine', goal: 20, checks: new Array(31).fill(false) }];
            setAllData(prev => ({ ...prev, [monthKey]: newHabits }));
          }}
          className="group flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 hover:-translate-y-1 active:scale-95"
        >
          <span className="text-2xl leading-none font-light transition-transform group-hover:rotate-90 inline-block">+</span>
          <span>Add New Daily Habit</span>
        </button>
        <div className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em]">
          FocusBoard Pro • Dynamic Routine Engine v8.2
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<HabitTracker />);
