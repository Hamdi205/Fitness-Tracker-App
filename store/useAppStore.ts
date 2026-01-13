// store/useAppStore.ts
import type { DailyTarget, Goal, Note, Task, Workout } from "@/.expo/types";
import { storage } from '@/lib/storage/storage';
import { create } from 'zustand';
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
    startWorkoutSession: (name?: string) => Promise<string>; // Returns workout ID
    addExerciseToWorkout: (workoutId: string, exercise: { name: string; sets?: number; weight?: number; reps?: number }) => Promise<void>;
    updateWorkout: (id: string, updates: Partial<Workout>) => Promise<void>;
    
    // Goals
    addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
    updateGoalProgress: (id: string, value: number) => Promise<void>;
    completeGoal: (id: string) => Promise<void>;

    // Daily Targets
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
    toggleTask: (taskId: string) => Promise<void>;
    deleteTask: (taskId: string) => Promise<void>;
    updateDailyTarget: (date: string, target: Partial<DailyTarget>) => Promise<void>;
    getTodayTarget: () => DailyTarget; 

    
}


export const useAppStore = create<AppState>()((set, get) => ({
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
    
    startWorkoutSession: async (name) => {
        const workoutName = name || `Workout ${new Date().toLocaleDateString()}`;
        const workoutId = Date.now().toString();
        const newWorkout: Workout = {
            id: workoutId,
            name: workoutName,
            exercises: [],
            duration: 0,
            completedAt: undefined as any,
        };
        
        const updatedWorkouts = [...get().workouts, newWorkout];
        await storage.saveWorkouts(updatedWorkouts);
        set({ workouts: updatedWorkouts });
        return workoutId;
    },
    
    addExerciseToWorkout: async (workoutId, exercise) => {
        const updatedWorkouts = get().workouts.map(workout =>
            workout.id === workoutId
                ? {
                    ...workout,
                    exercises: [...(workout.exercises || []), {
                        id: Date.now().toString(),
                        name: exercise.name,
                        category: 'Other',
                        sets: exercise.sets || 0,
                        reps: exercise.reps || 0,
                        weight: exercise.weight || 0,
                    }]
                }
                : workout
        );
        await storage.saveWorkouts(updatedWorkouts);
        set({ workouts: updatedWorkouts });
    },
    
    updateWorkout: async (id, updates) => {
        const updatedWorkouts = get().workouts.map(workout =>
            workout.id === id
                ? { ...workout, ...updates }
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

    addTask: async (taskData) => {
        const today = new Date().toISOString().split('T')[0];
        const current = get().dailyTargets[today] || {
            date: today, 
            water: { current: 0, target: 2.0 },
            calories: { current: 0, target: 2500 },
            tasks: [],
        };

        const newTask: Task = {
            ...taskData,
            id: Date.now().toString(),
            createdAt: new Date(),
        };

        const updated = {
            ...current,
            tasks: [...current.tasks, newTask],
        };

        const updatedTargets = { ...get().dailyTargets, [today]: updated };
        await storage.saveDailyTargets(updatedTargets);
        set({ dailyTargets: updatedTargets });
    },
    toggleTask: async (taskId) => {
        const today = new Date().toISOString().split('T')[0];
        const current = get().dailyTargets[today];
        if (!current) return;

        const updated = {
            ...current,
            tasks: current.tasks.map(task =>
                task.id === taskId
                ? { ...task, completed: !task.completed }
                : task
            ),
        };

        const updatedTargets = { ...get().dailyTargets, [today]: updated };
        await storage.saveDailyTargets(updatedTargets);
        set({ dailyTargets: updatedTargets });
    },

    deleteTask: async (taskId) => {
        const today = new Date().toISOString().split('T')[0];
        const current = get().dailyTargets[today];
        if (!current) return;

        const updated = {
            ...current,
            tasks: current.tasks.filter(task => task.id !== taskId),
        };

        const updatedTargets = { ...get().dailyTargets, [today]: updated };
        await storage.saveDailyTargets(updatedTargets);
        set({ dailyTargets: updatedTargets });
    },

    updateDailyTarget: async (date, updates) => {
        const current = get().dailyTargets[date] || {
            date,
            water: { current: 0, target: 2.0 },
            calories: { current: 0, target: 2500 },
            tasks: [],
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
            water: { current: 0, target: 2.0 },
            calories: { current: 0, target: 2500 },
            tasks: [],
        };
    },
    }));
