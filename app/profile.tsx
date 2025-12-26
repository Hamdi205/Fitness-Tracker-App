import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
    bg: '#0E0E10',
    topBar: '#151517', // slithly different shade the the bg
    divider: '#212124', // hairline separator 
    chip: '#2E2E33',
    chipBorder: '#3A3A40',
    text: '#FFFFFF',
    textDime: '#AAAAAA',
    card: '#1A1A1E',
    cardSecondary: '#2A2A2A',
    textSecondary: '#777777'
}

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
                    
                }}>
                {/* Back button */}
                <Pressable 
                    onPress={() => router.back()}
                    style={{ width: 56, justifyContent: 'center' }}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </Pressable>

                {/* Centered Page title */}
                    <Text style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: '700',
                        color: COLORS.text
                    }}>
                        Profile
                    </Text>

                {/* Right side icons */}
                <View style={{
                    marginLeft: 'auto',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12
                }}>
                    {/* Settings icon */}
                    <Ionicons name="settings-outline" size={24} color={COLORS.text} />
                </View>
            </View>

            {/* Subtle divider */}
            <View style={{
                height: 1,
                backgroundColor: COLORS.divider,
                marginTop: 8,
                marginBottom: 24
            }} />

            {/* === Profile Header === */}
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <View style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: '#4A90E2',
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
                    <Ionicons name="log-out-outline" size={20} color="#E85C5C" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#E85C5C', fontSize: 16, fontWeight: '600' }}>
                        Sign Out
                    </Text>
                </Pressable>
            </View>

            </ScrollView>
        </SafeAreaView>
    );
}

