// store/useAppStore.ts
import { create } from 'zustand';
import { storage } from '@/lib/storage/storage';
import type { Note, Workout, Goal, DailyTarget } from "@/.expo/types";

interface AppState {
    // State
    notes: Note[];
    workouts: Workout[];
    goals: Goal[];
    dailyTargets: Record<string, DailyTarget>;
    isLoading: boolean;

    // Actions
    loadData: () => Promise<void>;

    // Notes
    addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;

    // Workouts
    addWorkout: (workout: Omit<Workout, 'id'>) => Promise<void>;
    completeWorkout: (id: string) => Promise<void>;

    // Goals
    addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
    updateGoalProgress: (id: string, value: number) => Promise<void>;
    completeGoal: (id: string) => Promise<void>;

    // Daily Targets
    updateDailyTarget: (date: string, target: Partial<DailyTarget>) => Promise<void>;
    getTodayTarget: () => DailyTarget;
}

export const useAppStore = create<AppState>((set, get) => ({
    notes: [],
    workouts: [],
    goals: [],
    dailyTargets: {},
    isLoading: false,

    loadData: async () => {
        set({ isLoading: true });
        try {
            const [notes, workouts, goals, dailyTargets] = await Promise.all([
                storage.getNotes(),
                storage.getWorkouts(),
                storage.getGoals(),
                storage.getDailyTargets(),
            ]);

            set({ notes, workouts, goals, dailyTargets, isLoading: false });
        } catch (error) {
            console.error('Error loading data:', error);
            set({ isLoading: false });
        }
    },

    addNote: async (noteData) => {
        const newNote: Note = {
            ...noteData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const updatedNotes = [...get().notes, newNote];
        await storage.saveNote(updatedNotes);
        set({ notes: updatedNotes });
    },

    updateNote: async (id, updates) => {
        const updatedNotes = get().notes.map(note =>
            note.id === id
                ? { ...note, ...updates, updatedAt: new Date() }
                : note
        );
        await storage.saveNote(updatedNotes);
        set({ notes: updatedNotes });
    },

    deleteNote: async (id) => {
        const updatedNotes = get().notes.filter(note => note.id !== id);
        await storage.saveNote(updatedNotes);
        set({ notes: updatedNotes });
    },

    addWorkout: async (workoutData) => {
        const newWorkout: Workout = {
            ...workoutData,
            id: Date.now().toString(),
        };

        const updatedWorkouts = [...get().workouts, newWorkout];
        await storage.saveWorkouts(updatedWorkouts);
        set({ workouts: updatedWorkouts });
    },

    completeWorkout: async (id) => {
        const updatedWorkouts = get().workouts.map(workout =>
            workout.id === id
                ? { ...workout, completedAt: new Date() }
                : workout
        );
        await storage.saveWorkouts(updatedWorkouts);
        set({ workouts: updatedWorkouts });
    },

    addGoal: async (goalData) => {
        const newGoal: Goal = {
            ...goalData,
            id: Date.now().toString(),
            createdAt: new Date(),
        };

        const updatedGoals = [...get().goals, newGoal];
        await storage.saveGoals(updatedGoals);
        set({ goals: updatedGoals });
    },

    updateGoalProgress: async (id, value) => {
        const updatedGoals = get().goals.map(goal =>
            goal.id === id
                ? { ...goal, currentValue: value, completed: value >= goal.targetValue }
                : goal
        );
        await storage.saveGoals(updatedGoals);
        set({ goals: updatedGoals });
    },

    completeGoal: async (id) => {
        const updatedGoals = get().goals.map(goal =>
            goal.id === id ? { ...goal, completed: true } : goal
        );
        await storage.saveGoals(updatedGoals);
        set({ goals: updatedGoals });
    },

    updateDailyTarget: async (date, updates) => {
        const current = get().dailyTargets[date] || {
            date,
            water: { current: 0, target: 2.0 }, // 2L = 8 glasses of 0.25L
            calories: { current: 0, target: 2500 },
            tasks: { completed: 0, total: 0 },
        };

        const updated = { ...current, ...updates };
        const updatedTargets = { ...get().dailyTargets, [date]: updated };
        await storage.saveDailyTargets(updatedTargets);
        set({ dailyTargets: updatedTargets });
    },

    getTodayTarget: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().dailyTargets[today] || {
            date: today,
            water: { current: 0, target: 2.0 }, // 2L = 8 glasses of 0.25L
            calories: { current: 0, target: 2500 },
            tasks: { completed: 0, total: 0 },
        };
    },
}));