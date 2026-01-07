import { useAppStore } from '@/store/useAppStore';
import { useMemo } from 'react';

export function useDailyTargets() {
    const dailyTargets = useAppStore((state) => state.dailyTargets);
    const updateDailyTarget = useAppStore((state) => state.updateDailyTarget);
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);

    const todayTarget = useMemo(() => {
        return dailyTargets[today] || {
            date: today,
            water: { current: 0, target: 2.0 }, // 2L = 8 glasses of 0.25L
            calories: { current: 0, target: 2500 },
            tasks: { completed: 0, total: 0 },
        };
    }, [dailyTargets, today]);

    const updateWater = async (value: number) => {
        const current = dailyTargets[today] || {
            date: today,
            water: { current: 0, target: 2.0 }, // 2L = 8 glasses of 0.25L
            calories: { current: 0, target: 2500 },
            tasks: { completed: 0, total: 0 },
        };
        await updateDailyTarget(today, {
            water: { ...current.water, current: value },
        });
    };
    
    const addWaterGlass = async () => {
        const current = dailyTargets[today] || {
            date: today,
            water: { current: 0, target: 2.0 },
            calories: { current: 0, target: 2500 },
            tasks: { completed: 0, total: 0 },
        };
        const newValue = current.water.current + 0.25; // Add 0.25L per glass
        await updateDailyTarget(today, {
            water: { ...current.water, current: newValue },
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
        addWaterGlass,
    };
}