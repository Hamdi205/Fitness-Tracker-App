import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { COLORS } from '@/constants/colors';

interface TopBarProps {
    title: string;
    showProfile?: boolean;
    showNotifications?: boolean;
    showSettings?: boolean;
    onProfilePress?: () => void;
    onBackPress?: () => void;
}

/**
 * Reusable TopBar component
 * Used across all screens for consistent header styling
 */
export function TopBar({
    title,
    showProfile = true,
    showNotifications = true,
    showSettings = true,
    onProfilePress,
    onBackPress,
}: TopBarProps) {
    const handleProfilePress = () => {
        if (onProfilePress) {
            onProfilePress();
        } else {
            router.push('/profile');
        }
    };

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    return (
        <View
            style={{
                height: 64,
                marginTop: 4,
                backgroundColor: COLORS.topBar,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                position: 'relative',
            }}
        >
            {/* Left side - Profile or Back button */}
            {onBackPress ? (
                <Pressable
                    onPress={handleBackPress}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    style={{ width: 64, height: 64, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </Pressable>
            ) : showProfile ? (
                <Pressable
                    onPress={handleProfilePress}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    style={{ width: 64, height: 64, justifyContent: 'center', alignItems: 'center' }}
                >
                    <View
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: COLORS.accentBlue,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons name="person" size={24} color={COLORS.text} />
                    </View>
                </Pressable>
            ) : (
                <View style={{ width: 64 }} />
            )}

            {/* Centered Page title */}
            <Text
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: '700',
                    color: COLORS.text,
                }}
            >
                {title}
            </Text>

            {/* Right side icons */}
            <View
                style={{
                    marginLeft: 'auto',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                }}
            >
                {showNotifications && (
                    <View style={{ position: 'relative' }}>
                        <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
                        <View
                            style={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: COLORS.accent,
                            }}
                        />
                    </View>
                )}

                {showSettings && (
                    <Ionicons name="settings-outline" size={24} color={COLORS.text} />
                )}
            </View>
        </View>
    );
}

