import AsyncStorage from '@react-native-async-storage/async-storage'
import {Note, Workout, DailyTarget, Goal} from "@/.expo/types";

const STORAGE_KEYS = {
    NOTES: 'notes',
    WORKOUTS: 'workouts',
    GOALS: 'goals',
    DAILY_TARGETS: 'daily_targets',
    WORKOUT_HISTORY: 'workout_history',
} as const;

export const storage = {
    // get/set
    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await AsyncStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting ${key}:', error);
            return null;
        }
    },

    async set<T>(key: string, value: T): Promise<void> {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting ${key}:`, error);
        }
    },

    async remove<T>(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error(`Error deleting ${key}:`, error);
        }
    },

    // Helper methods
    async getNotes(): Promise<Note[]> {
        return (await this.get<Note[]>(STORAGE_KEYS.NOTES)) || [];
    },

    async saveNote(notes: Note[]): Promise<void> {
        await this.set(STORAGE_KEYS.NOTES, notes);
    },

    async getWorkouts(): Promise<Workout[]> {
        return (await this.get<Workout[]>(STORAGE_KEYS.WORKOUTS)) || [];
    },

    async saveWorkouts(workouts: Workout[]): Promise<void> {
        await this.set(STORAGE_KEYS.WORKOUTS, workouts);
    },

    async getGoals(): Promise<Goal[]> {
        return (await this.get<Goal[]>(STORAGE_KEYS.GOALS)) || [];
    },

    async saveGoals(goals: Goal[]): Promise<void> {
        await this.set(STORAGE_KEYS.GOALS, goals);
    },

    async getDailyTargets(): Promise<Record<string, DailyTarget>> {
        return (await this.get<Record<string, DailyTarget>>(STORAGE_KEYS.DAILY_TARGETS)) || {};
    },

    async saveDailyTargets(targets: Record<string, DailyTarget>): Promise<void> {
        await this.set(STORAGE_KEYS.DAILY_TARGETS, targets);
    }
};   