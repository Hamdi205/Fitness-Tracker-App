/**
 * Utility functions for calculations and data transformations
 * Separates business logic from UI components
 */

/**
 * Calculate percentage with bounds checking
 */
export function calculatePercentage(current: number, target: number): number {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
}

/**
 * Format calories with locale-specific number formatting
 */
export function formatCalories(value: number): string {
    return value.toLocaleString('en-US');
}

/**
 * Format any number with locale-specific formatting
 */
export function formatNumber(value: number): string {
    return value.toLocaleString('en-US');
}

/**
 * Get day name from date
 */
export function getDayName(date: Date = new Date()): string {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Calculate start of week (Sunday)
 */
export function getStartOfWeek(date: Date = new Date()): Date {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
}

/**
 * Check if date is within current week
 */
export function isDateInCurrentWeek(date: Date): boolean {
    const startOfWeek = getStartOfWeek();
    return date >= startOfWeek;
}

/**
 * Format minutes to hours and minutes
 */
export function formatDuration(minutes: number): { hours: number; minutes: number } {
    return {
        hours: Math.floor(minutes / 60),
        minutes: minutes % 60,
    };
}

/**
 * Get ISO week number (1-53)
 */
export function getWeekNumber(date: Date = new Date()): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Get time-based greeting in Norwegian
 */
export function getTimeBasedGreeting(date: Date = new Date()): string {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) {
        return 'Godmorgen';
    } else if (hour >= 12 && hour < 18) {
        return 'God ettermiddag';
    } else {
        return 'God kveld';
    }
}

