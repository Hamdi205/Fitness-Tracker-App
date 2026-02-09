import { COLORS } from '@/constants/colors';
import { getTimeBasedGreeting, getWeekNumber } from '@/utils/calculations';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

interface MinimalTopBarProps {
    userName?: string;
}

/**
 * Minimalist TopBar component – modern header with greeting and week pill
 */
export function MinimalTopBar({ userName = 'Hamdi' }: MinimalTopBarProps) {
    const greeting = useMemo(() => getTimeBasedGreeting(), []);
    const weekNumber = useMemo(() => getWeekNumber(), []);

    return (
        <View
            style={{
                paddingVertical: 16,
                paddingHorizontal: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
            }}
        >
            <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                    style={{
                        fontSize: 26,
                        fontWeight: '700',
                        color: COLORS.text,
                        marginBottom: 4,
                        letterSpacing: -0.4,
                    }}
                >
                    {greeting}, {userName}
                </Text>
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: '400',
                        color: COLORS.textDime,
                    }}
                >
                    Here's your overview
                </Text>
            </View>
            <View
                style={{
                    backgroundColor: COLORS.chip,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: COLORS.chipBorder + '99',
                }}
            >
                <Text
                    style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: COLORS.textDime,
                        letterSpacing: 0.3,
                    }}
                >
                    Uke {weekNumber}
                </Text>
            </View>
        </View>
    );
}
