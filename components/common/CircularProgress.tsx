import { Text, View } from 'react-native';
import { COLORS } from '@/constants/colors';

interface CircularProgressProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label: string;
    value: string;
    subtitle?: string;
}

/**
 * Reusable CircularProgress component
 * Displays progress as a circular indicator with percentage/value
 */
export function CircularProgress({
    percentage,
    size = 80,
    strokeWidth = 8,
    color = COLORS.accentBlue,
    label,
    value,
    subtitle,
}: CircularProgressProps) {
    return (
        <View style={{ alignItems: 'center', marginHorizontal: 8 }}>
            <View style={{ position: 'relative', width: size, height: size }}>
                {/* Background circle */}
                <View
                    style={{
                        position: 'absolute',
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: '#2A2A2E',
                    }}
                />
                {/* Progress circle - simplified version using border segments */}
                <View
                    style={{
                        position: 'absolute',
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderTopColor: percentage > 0 ? color : 'transparent',
                        borderRightColor: percentage > 25 ? color : 'transparent',
                        borderBottomColor: percentage > 50 ? color : 'transparent',
                        borderLeftColor: percentage > 75 ? color : 'transparent',
                        transform: [{ rotate: '-90deg' }],
                    }}
                />
                {/* Center content */}
                <View
                    style={{
                        position: 'absolute',
                        width: size,
                        height: size,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '600' }}>
                        {value}
                    </Text>
                    {subtitle && (
                        <Text style={{ color: COLORS.textDime, fontSize: 10, marginTop: 2 }}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
            <Text style={{ color: COLORS.text, fontSize: 12, fontWeight: '500', marginTop: 8 }}>
                {label}
            </Text>
        </View>
    );
}

