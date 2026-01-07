import { useAppStore } from '@/store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
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
    const { loadData, workouts } = useAppStore();

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Ensure workouts is always an array
    const workoutsArray = workouts || [];

    // Get active workout (first incomplete workout)
    const activeWorkout = useMemo(() => {
        return workoutsArray.find(w => !w.completedAt);
    }, [workoutsArray]);

    // Get completed workouts sorted by completion date (most recent first)
    const recentWorkouts = useMemo(() => {
        return [...workoutsArray]
            .filter(w => w.completedAt)
            .sort((a, b) => {
                const dateA = new Date(a.completedAt!).getTime();
                const dateB = new Date(b.completedAt!).getTime();
                return dateB - dateA;
            })
            .slice(0, 5);
    }, [workoutsArray]);

    // Calculate statistics
    const statistics = useMemo(() => {
        const completedWorkouts = workoutsArray.filter(w => w.completedAt);
        const totalWorkouts = completedWorkouts.length;

        // Calculate workouts completed this week
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);

        const workoutsThisWeek = completedWorkouts.filter(w => {
            const completedDate = new Date(w.completedAt!);
            return completedDate >= startOfWeek;
        }).length;

        // Calculate total time (sum of all completed workout durations)
        const totalMinutes = completedWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return {
            total: totalWorkouts,
            thisWeek: workoutsThisWeek,
            totalTime: { hours, minutes },
        };
    }, [workoutsArray]);

    // Exercise categories (static for now, but could be derived from exercises in workouts)
    const exerciseCategories = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Cardio'];

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
                {/* space for profil pic */}
                <Pressable 
                    onPress={() => router.push('/profile')}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    style={{ width: 64, height: 64, justifyContent: 'center', alignItems: 'center' }}
                >
                    <View style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: '#4A90E2',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Ionicons name="person" size={24} color={COLORS.text} />
                    </View>
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
                        opacity: activeWorkout ? 1 : 0.7,
                    }}
                >
                    <Ionicons name="play-circle" size={32} color="#E85C5C" style={{ marginRight: 12 }} />
                    <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: '700' }}>
                        {activeWorkout ? `Start: ${activeWorkout.name}` : 'Start Workout'}
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

                {activeWorkout ? (
                    <View style={{
                        padding: 16,
                        backgroundColor: COLORS.card,
                        borderRadius: 12,
                        marginBottom: 12,
                    }}>
                        <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                            {activeWorkout.name}
                        </Text>
                        <Text style={{ color: COLORS.textDime, fontSize: 14, marginBottom: 4 }}>
                            {activeWorkout.exercises.length} exercise{activeWorkout.exercises.length !== 1 ? 's' : ''}
                        </Text>
                        {activeWorkout.duration > 0 && (
                            <Text style={{ color: COLORS.textDime, fontSize: 14 }}>
                                Duration: {activeWorkout.duration} min
                            </Text>
                        )}
                    </View>
                ) : (
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
                )}

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

                {recentWorkouts.length > 0 ? (
                    <View>
                        {recentWorkouts.map((workout) => (
                            <View
                                key={workout.id}
                                style={{
                                    padding: 16,
                                    backgroundColor: COLORS.card,
                                    borderRadius: 12,
                                    marginBottom: 8,
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600' }}>
                                        {workout.name}
                                    </Text>
                                    {workout.completedAt && (
                                        <Text style={{ color: COLORS.textDime, fontSize: 12 }}>
                                            {new Date(workout.completedAt).toLocaleDateString()}
                                        </Text>
                                    )}
                                </View>
                                <View style={{ flexDirection: 'row', gap: 16 }}>
                                    {workout.exercises.length > 0 && (
                                        <Text style={{ color: COLORS.textDime, fontSize: 12 }}>
                                            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                                        </Text>
                                    )}
                                    {workout.duration > 0 && (
                                        <Text style={{ color: COLORS.textDime, fontSize: 12 }}>
                                            {workout.duration} min
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
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
                )}
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
                    {exerciseCategories.map((category, index) => (
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
                            {statistics.total}
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
                            {statistics.thisWeek}
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
                        {statistics.totalTime.hours}h {statistics.totalTime.minutes}m
                    </Text>
                </View>
            </View>

            </ScrollView>
        </SafeAreaView>
    );
}
