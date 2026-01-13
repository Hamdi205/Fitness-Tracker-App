import { COLORS } from '@/constants/colors';
import { getTimeBasedGreeting, getWeekNumber } from '@/utils/calculations';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

interface MinimalTopBarProps {
    userName?: string;
}

/**
 * Minimalist TopBar component
 * Inspired by Yazio's clean design
 * Shows time-based greeting and week number
 */
export function MinimalTopBar({ userName = 'Hamdi' }: MinimalTopBarProps) {
    const greeting = useMemo(() => getTimeBasedGreeting(), []);
    const weekNumber = useMemo(() => getWeekNumber(), []);

    return (
        <View
            style={{
                paddingVertical: 20,
                paddingHorizontal: 0,
            }}
        >
            {/* Greeting */}
            <Text
                style={{
                    fontSize: 28,
                    fontWeight: '700',
                    color: COLORS.text,
                    marginBottom: 4,
                }}
            >
                {greeting} {userName}
            </Text>

            {/* Week number */}
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: '400',
                    color: COLORS.text,
                    opacity: 0.8,
                }}
            >
                Uke {weekNumber}
            </Text>
        </View>
    );
}
