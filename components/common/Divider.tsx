import { View } from 'react-native';
import { COLORS } from '@/constants/colors';

/**
 * Reusable Divider component
 * Consistent separator used across screens
 */
export function Divider() {
    return (
        <View
            style={{
                height: 1,
                backgroundColor: COLORS.divider,
                marginTop: 8,
                marginBottom: 24,
            }}
        />
    );
}

