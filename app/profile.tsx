import { Divider } from '@/components/common/Divider';
import { TopBar } from '@/components/common/TopBar';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * ProfileScreen
 * ---
 * This is the profile screen of the app
 *
 * Its like view in MVC
 */

export default function ProfileScreen() {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.bg}}>
            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            >

            {/* === Top Bar === */}
            <TopBar 
                title="Profile" 
                showProfile={false}
                showNotifications={false}
                onBackPress={() => router.back()}
            />

            {/* Subtle divider */}
            <Divider />

            {/* === Profile Header === */}
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <View style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: COLORS.accentBlue,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16,
                }}>
                    <Ionicons name="person" size={48} color={COLORS.text} />
                </View>
                <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: '700', marginBottom: 4 }}>
                    User Name
                </Text>
                <Text style={{ color: COLORS.textDime, fontSize: 14 }}>
                    user@example.com
                </Text>
            </View>

            {/* === Profile Options === */}
            <View style={{ marginBottom: 24 }}>
                {[
                    { icon: 'person-outline', title: 'Edit Profile', subtitle: 'Update your personal information' },
                    { icon: 'notifications-outline', title: 'Notifications', subtitle: 'Manage notification settings' },
                    { icon: 'lock-closed-outline', title: 'Privacy & Security', subtitle: 'Password and privacy settings' },
                    { icon: 'stats-chart-outline', title: 'Statistics', subtitle: 'View your activity stats' },
                    { icon: 'help-circle-outline', title: 'Help & Support', subtitle: 'Get help and contact support' },
                    { icon: 'information-circle-outline', title: 'About', subtitle: 'App version and information' },
                ].map((item, index) => (
                    <Pressable
                        key={index}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 16,
                            backgroundColor: COLORS.card,
                            borderRadius: 12,
                            marginBottom: 12,
                        }}
                    >
                        <View style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: COLORS.chip,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12,
                        }}>
                            <Ionicons name={item.icon as any} size={20} color={COLORS.text} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600', marginBottom: 2 }}>
                                {item.title}
                            </Text>
                            <Text style={{ color: COLORS.textDime, fontSize: 12 }}>
                                {item.subtitle}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" size={20} color={COLORS.textDime} />
                    </Pressable>
                ))}
            </View>

            {/* === Account Actions === */}
            <View style={{ marginBottom: 24 }}>
                <Pressable
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 16,
                        backgroundColor: COLORS.card,
                        borderRadius: 12,
                        marginBottom: 12,
                    }}
                >
                    <Ionicons name="log-out-outline" size={20} color={COLORS.accent} style={{ marginRight: 8 }} />
                    <Text style={{ color: COLORS.accent, fontSize: 16, fontWeight: '600' }}>
                        Sign Out
                    </Text>
                </Pressable>
            </View>

            </ScrollView>
        </SafeAreaView>
    );
}

