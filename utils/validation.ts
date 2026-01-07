/**
 * Validation utilities for form inputs
 * Separates validation logic from UI components
 */

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validate that a string is a valid positive number
 */
export function validateNumber(value: string): ValidationResult {
    if (!value.trim()) {
        return { valid: false, error: 'Please enter a value' };
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        return { valid: false, error: 'Please enter a valid number' };
    }

    if (numValue < 0) {
        return { valid: false, error: 'Please enter a positive number' };
    }

    return { valid: true };
}

/**
 * Validate that a string is not empty
 */
export function validateRequired(value: string, fieldName: string = 'Field'): ValidationResult {
    if (!value.trim()) {
        return { valid: false, error: `${fieldName} is required` };
    }
    return { valid: true };
}

/**
 * Validate note title
 */
export function validateNoteTitle(title: string): ValidationResult {
    return validateRequired(title, 'Note title');
}

