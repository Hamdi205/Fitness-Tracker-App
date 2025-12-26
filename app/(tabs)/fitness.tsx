import { Ionicons } from '@expo/vector-icons';
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
 * FitnessScreen
 * ---
 * This is the fitness/workout screen of the app
 *
 * Its like view in MVC
 */

export default function FitnessScreen() {
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
                    height: 48,
                    marginTop: 4,
                    backgroundColor: COLORS.topBar,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 14,
                    position: 'relative',
                    
                }}>
                {/* space for profil pic */}
                <View style={{ width: 48, justifyContent: 'center' }}>
                    <View style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: '#4A90E2',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Ionicons name="person" size={16} color={COLORS.text} />
                    </View>
                </View>

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
                        Fitness
                    </Text>

                {/* Right side icons */}
                <View style={{
                    marginLeft: 'auto',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12
                }}>
                    {/* Notification icon with badge */}
                    <View style={{ position: 'relative' }}>
                        <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
                        <View style={{
                            position: 'absolute',
                            top: -2,
                            right: -2,
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#E85C5C',
                        }} />
                    </View>
                    
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

            {/* === Start Workout Section === */}
            <View style={{ marginBottom: 24 }}>
                <Pressable
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                        backgroundColor: COLORS.card,
                        borderRadius: 16,
                        marginBottom: 16,
                    }}
                >
                    <Ionicons name="play-circle" size={32} color="#E85C5C" style={{ marginRight: 12 }} />
                    <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: '700' }}>
                        Start Workout
                    </Text>
                </Pressable>
            </View>

            {/* === Active Workout Plan === */}
            <View style={{ marginBottom: 24 }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: COLORS.text,
                    marginBottom: 12
                }}>
                    Active Plan
                </Text>

                <View style={{
                    padding: 16,
                    backgroundColor: COLORS.card,
                    borderRadius: 12,
                    marginBottom: 12,
                    opacity: 0.6,
                }}>
                    <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600', fontStyle: 'italic', marginBottom: 8 }}>
                        No active plan
                    </Text>
                    <Text style={{ color: COLORS.textDime, fontSize: 14 }}>
                        Create or select a workout plan to get started
                    </Text>
                </View>

                <Pressable style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 14,
                    backgroundColor: COLORS.cardSecondary,
                    borderRadius: 12,
                }}>
                    <Ionicons name="add-circle-outline" size={20} color={COLORS.textDime} style={{ marginRight: 8 }} />
                    <Text style={{ color: COLORS.textDime, fontSize: 16 }}>
                        + Create new plan
                    </Text>
                </Pressable>
            </View>

            {/* === Workout History === */}
            <View style={{ marginBottom: 24 }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: COLORS.text,
                    marginBottom: 12
                }}>
                    Recent Workouts
                </Text>

                <View style={{
                    padding: 16,
                    backgroundColor: COLORS.card,
                    borderRadius: 12,
                    opacity: 0.6,
                }}>
                    <Text style={{ color: COLORS.textDime, fontSize: 14, fontStyle: 'italic', textAlign: 'center' }}>
                        No workouts completed yet
                    </Text>
                </View>
            </View>

            {/* === Exercise Library === */}
            <View style={{ marginBottom: 24 }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: COLORS.text,
                    marginBottom: 12
                }}>
                    Exercise Library
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    {['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Cardio'].map((category, index) => (
                        <Pressable
                            key={index}
                            style={{
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                backgroundColor: COLORS.chip,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: COLORS.chipBorder,
                            }}
                        >
                            <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '500' }}>
                                {category}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* === Stats Overview === */}
            <View style={{ marginBottom: 24 }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: COLORS.text,
                    marginBottom: 12
                }}>
                    Stats
                </Text>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                }}>
                    <View style={{
                        flex: 1,
                        padding: 16,
                        backgroundColor: COLORS.card,
                        borderRadius: 12,
                        marginRight: 8,
                        alignItems: 'center',
                    }}>
                        <Text style={{ color: COLORS.textDime, fontSize: 12, marginBottom: 4 }}>
                            Total Workouts
                        </Text>
                        <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: '700' }}>
                            0
                        </Text>
                    </View>

                    <View style={{
                        flex: 1,
                        padding: 16,
                        backgroundColor: COLORS.card,
                        borderRadius: 12,
                        marginLeft: 8,
                        alignItems: 'center',
                    }}>
                        <Text style={{ color: COLORS.textDime, fontSize: 12, marginBottom: 4 }}>
                            This Week
                        </Text>
                        <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: '700' }}>
                            0
                        </Text>
                    </View>
                </View>

                <View style={{
                    padding: 16,
                    backgroundColor: COLORS.card,
                    borderRadius: 12,
                    alignItems: 'center',
                }}>
                    <Text style={{ color: COLORS.textDime, fontSize: 12, marginBottom: 4 }}>
                        Total Time
                    </Text>
                    <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: '700' }}>
                        0h 0m
                    </Text>
                </View>
            </View>

            </ScrollView>
        </SafeAreaView>
    );
}

