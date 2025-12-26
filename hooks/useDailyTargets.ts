import { useAppStore } from '@/store/useAppStore';
import { useMemo } from 'react';

export function useDailyTargets() {
    const { getTodayTarget, updateDailyTarget } = useAppStore();
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);

    const todayTarget = getTodayTarget();

    const updateWater = async (value: number) => {
        await updateDailyTarget(today, {
            water: { ...todayTarget.water, current: value },
        });
    };

    const updateCalories = async (value: number) => {
        await updateDailyTarget(today, {
            calories: { ...todayTarget.calories, current: value },
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