import { useAppStore } from '@/store/useAppStore';
import { useMemo } from 'react';

export function useDailyTargets() {
    const dailyTargets = useAppStore((state) => state.dailyTargets);
    const updateDailyTarget = useAppStore((state) => state.updateDailyTarget);
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);

    const todayTarget = useMemo(() => {
        return dailyTargets[today] || {
            date: today,
            water: { current: 0, target: 8 },
            calories: { current: 0, target: 2500 },
            tasks: { completed: 0, total: 0 },
        };
    }, [dailyTargets, today]);

    const updateWater = async (value: number) => {
        const current = dailyTargets[today] || {
            date: today,
            water: { current: 0, target: 8 },
            calories: { current: 0, target: 2500 },
            tasks: { completed: 0, total: 0 },
        };
        await updateDailyTarget(today, {
            water: { ...current.water, current: value },
        });
    };

    const updateCalories = async (value: number) => {
        const current = dailyTargets[today] || {
            date: today,
            water: { current: 0, target: 8 },
            calories: { current: 0, target: 2500 },
            tasks: { completed: 0, total: 0 },
        };
        await updateDailyTarget(today, {
            calories: { ...current.calories, current: value },
        });
    };

    const updateTasks = async (completed: number, total: number) => {
        await updateDailyTarget(today, {
            tasks: { completed, total },
        });
    };

    return {
        todayTarget,
        updateWater,
        updateCalories,
        updateTasks,
    };
}