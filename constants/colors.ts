/**
 * Centralized color constants for the app
 * All screens should import from here instead of defining COLORS locally
 */

export const COLORS = {
    bg: '#0E0E10',
    topBar: '#151517', // slightly different shade than the bg
    divider: '#212124', // hairline separator
    chip: '#2E2E33',
    chipBorder: '#3A3A40',
    text: '#FFFFFF',
    textDime: '#AAAAAA',
    card: '#1A1A1E',
    cardSecondary: '#2A2A2A',
    textSecondary: '#777777',
    button: '#4A90E2',
    buttonText: '#FFFFFF',
    accent: '#E85C5C',
    accentBlue: '#4A90E2',
} as const;

