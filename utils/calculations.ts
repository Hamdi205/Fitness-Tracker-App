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

