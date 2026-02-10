import React, { useState, useMemo } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    addMonths,
    subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Trophy, CheckCircle, Flame, Calendar as CalendarIcon } from 'lucide-react';

interface DailyStat {
    percentage: number;
    count: number;
    total: number;
}

interface ConsistencyCalendarProps {
    data?: { [date: string]: DailyStat }; // Date string (YYYY-MM-DD) -> Stat
}

const ConsistencyCalendar: React.FC<ConsistencyCalendarProps> = ({ data = {} }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    // Calculate Monthly Stats
    const stats = useMemo(() => {
        let totalHabitsDone = 0;
        let perfectDays = 0;
        let activeDays = 0;
        let totalPercentageSum = 0;
        let daysCounted = 0;

        // Iterate through days of the current month
        daysInMonth.forEach(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayStat = data[dateKey];

            if (dayStat) {
                totalHabitsDone += dayStat.count;
                if (dayStat.percentage === 100 && dayStat.total > 0) perfectDays++;
                if (dayStat.count > 0) activeDays++;

                // Only count up to today for average consistency to be fair
                if (day <= new Date()) {
                    totalPercentageSum += dayStat.percentage;
                    daysCounted++;
                }
            }
        });

        const averageConsistency = daysCounted > 0 ? Math.round(totalPercentageSum / daysCounted) : 0;

        // Simple Streak Logic (End of month backwards or from today backwards)
        // For this view, let's calculate the streak ending *today* or the last active day
        let currentStreak = 0;
        let maxStreak = 0;
        // Iterate all days to find max streak in this month
        let tempStreak = 0;
        daysInMonth.forEach(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayStat = data[dateKey];
            if (dayStat && dayStat.count > 0) {
                tempStreak++;
            } else {
                // Check if day is in future (don't break streak for future days)
                if (day < new Date()) {
                    tempStreak = 0;
                }
            }
            if (tempStreak > maxStreak) maxStreak = tempStreak;
        });

        return {
            averageConsistency,
            totalHabitsDone,
            perfectDays,
            activeDays,
            maxStreak
        };
    }, [data, daysInMonth]);


    const renderHeader = () => (
        <div className="flex justify-between items-center mb-6 px-2">
            <button
                onClick={prevMonth}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Previous month"
            >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Next month"
            >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
        </div>
    );

    const renderDays = () => (
        <div className="grid grid-cols-7 mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div
                    key={index}
                    className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide"
                >
                    {day}
                </div>
            ))}
        </div>
    );

    const renderCells = () => {
        const startDay = monthStart.getDay();
        const blanks = Array.from({ length: startDay }, (_, i) => (
            <div key={`blank-${i}`} className="w-10 h-10" />
        ));

        return (
            <div className="grid grid-cols-7 gap-y-2 place-items-center">
                {blanks}
                {daysInMonth.map((day) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayStat = data[dateKey];
                    const progress = dayStat ? dayStat.percentage : 0;

                    const size = 40;
                    const center = size / 2;
                    const radiusBase = 18;
                    const radiusRing = 14;
                    const strokeWidth = 3;
                    const circumference = 2 * Math.PI * radiusRing;
                    const strokeDashoffset = circumference - (progress / 100) * circumference;

                    return (
                        <div key={day.toString()} className="flex flex-col items-center justify-center relative w-10 h-10 group">
                            <svg
                                width={size}
                                height={size}
                                viewBox={`0 0 ${size} ${size}`}
                                className="transform -rotate-90"
                            >
                                {/* Layer 1: The Base */}
                                <circle
                                    cx={center}
                                    cy={center}
                                    r={radiusBase}
                                    className="fill-indigo-50 dark:fill-zinc-800 transition-colors"
                                />

                                {/* Layer 2a: The Track */}
                                <circle
                                    cx={center}
                                    cy={center}
                                    r={radiusRing}
                                    fill="transparent"
                                    className="stroke-gray-200 dark:stroke-zinc-700 opacity-30"
                                    strokeWidth={strokeWidth}
                                />

                                {/* Layer 2b: The Progress Ring */}
                                {progress > 0 && (
                                    <circle
                                        cx={center}
                                        cy={center}
                                        r={radiusRing}
                                        fill="transparent"
                                        strokeWidth={strokeWidth}
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        className="stroke-indigo-500 transition-all duration-500 ease-out"
                                    />
                                )}
                            </svg>

                            {/* Layer 3: The Number */}
                            <span className={`absolute inset-0 flex items-center justify-center text-sm font-medium pointer-events-none transition-colors ${progress === 100 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-700 dark:text-gray-200'}`}>
                                {format(day, 'd')}
                            </span>

                            {/* Tooltip for exact count */}
                            {dayStat && (
                                <div className="absolute bottom-full mb-1 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    {dayStat.count} / {dayStat.total} done
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT PANEL: MONTHLY REPORT */}
            <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">Month Summary</h4>

                    <div className="mb-8">
                        <div className="text-5xl font-bold text-slate-800 dark:text-white mb-1">
                            {stats.averageConsistency}%
                        </div>
                        <div className="text-slate-400 text-sm font-medium">Overall Consistency</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Perfect Days */}
                        <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 mb-1">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                <span className="text-[10px] uppercase font-bold text-slate-400">Perfect</span>
                            </div>
                            <div className="text-xl font-bold text-slate-700 dark:text-slate-200">{stats.perfectDays}</div>
                        </div>

                        {/* Total Habits */}
                        <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
                            </div>
                            <div className="text-xl font-bold text-slate-700 dark:text-slate-200">{stats.totalHabitsDone}</div>
                        </div>

                        {/* Longest Streak */}
                        <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 mb-1">
                                <Flame className="w-4 h-4 text-orange-500" />
                                <span className="text-[10px] uppercase font-bold text-slate-400">Streak</span>
                            </div>
                            <div className="text-xl font-bold text-slate-700 dark:text-slate-200">{stats.maxStreak}</div>
                        </div>

                        {/* Active Days */}
                        <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 mb-1">
                                <CalendarIcon className="w-4 h-4 text-indigo-500" />
                                <span className="text-[10px] uppercase font-bold text-slate-400">Active</span>
                            </div>
                            <div className="text-xl font-bold text-slate-700 dark:text-slate-200">{stats.activeDays}</div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-zinc-700">
                    <div className="text-xs text-slate-400 text-center">
                        Keep up the momentum!
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: CALENDAR */}
            <div className="lg:col-span-2">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>
        </div>
    );
};

export default ConsistencyCalendar;
