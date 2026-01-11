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
            tasks: [],
        };
    }, [dailyTargets, today]);

    const updateWater = async (value: number) => {
        const current = dailyTargets[today] || {
            date: today,
            water: { current: 0, target: 2.0 }, // 2L = 8 glasses of 0.25L
            calories: { current: 0, target: 2500 },
            tasks: [],
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
            tasks: [],
        };
        const newValue = current.water.current + 0.25; // Add 0.25L per glass
        await updateDailyTarget(today, {
            water: { ...current.water, current: newValue },
        });
    };

    const updateCalories = async (value: number) => {
        const current = dailyTargets[today] || {
            date: today,
            water: { current: 0, target: 2.0 },
            calories: { current: 0, target: 2500 },
            tasks: [],
        };
        await updateDailyTarget(today, {
            calories: { ...current.calories, current: value },
        });
    };

    return {
        todayTarget,
        updateWater,
        updateCalories,
        addWaterGlass,
    };
}