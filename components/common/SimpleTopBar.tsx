import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface SimpleTopBarProps {
    title: string;
    subtitle?: string;
    showProfile?: boolean;
    showBack?: boolean;
    onBackPress?: () => void;
}

/**
 * Simplified top bar: optional back, title + optional subtitle, optional profile icon.
 * No background box, no notifications/settings.
 */
export function SimpleTopBar({
    title,
    subtitle,
    showProfile = true,
    showBack = false,
    onBackPress,
}: SimpleTopBarProps) {
    const handleBack = () => {
        if (onBackPress) onBackPress();
        else router.back();
    };

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 16,
                paddingHorizontal: 0,
                gap: 12,
            }}
        >
            <View style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {showBack && (
                    <Pressable
                        onPress={handleBack}
                        hitSlop={16}
                        style={({ pressed }) => ({
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: pressed ? COLORS.chipBorder + '99' : COLORS.chip,
                            alignItems: 'center',
                            justifyContent: 'center',
                        })}
                    >
                        <Ionicons name="arrow-back" size={22} color={COLORS.text} />
                    </Pressable>
                )}
                <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                    style={{
                        fontSize: 26,
                        fontWeight: '700',
                        color: COLORS.text,
                        letterSpacing: -0.4,
                    }}
                >
                    {title}
                </Text>
                {subtitle != null && (
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '400',
                            color: COLORS.textDime,
                            marginTop: 4,
                        }}
                    >
                        {subtitle}
                    </Text>
                )}
                </View>
            </View>
            {showProfile && (
                <Pressable
                    onPress={() => router.push('/profile')}
                    hitSlop={16}
                    style={({ pressed }) => ({
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: pressed ? COLORS.chipBorder + '99' : COLORS.chip,
                        alignItems: 'center',
                        justifyContent: 'center',
                    })}
                >
                    <Ionicons name="person-outline" size={22} color={COLORS.text} />
                </Pressable>
            )}
        </View>
    );
}
