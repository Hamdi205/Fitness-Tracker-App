import { Divider } from '@/components/common/Divider';
import { SimpleTopBar } from '@/components/common/SimpleTopBar';
import { COLORS } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';
import { formatDuration, isDateInCurrentWeek } from '@/utils/calculations';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GRADIENT_COLORS = ['#1a0a1f', '#16122a', '#0E0E10'] as const;

const SECTION_CARD = {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.chipBorder + '99',
    overflow: 'hidden' as const,
    ...(Platform.OS === 'ios'
        ? {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
          }
        : { elevation: 6 }),
};

/**
 * FitnessScreen
 * ---
 * This is the fitness/workout screen of the app
 *
 * Its like view in MVC
 */

export default function FitnessScreen() {
    const { loadData, workouts, startWorkoutSession } = useAppStore();

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

        // Calculate workouts completed this week using utility function
        const workoutsThisWeek = completedWorkouts.filter(w => {
            const completedDate = new Date(w.completedAt!);
            return isDateInCurrentWeek(completedDate);
        }).length;

        // Calculate total time using utility function
        const totalMinutes = completedWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        const totalTime = formatDuration(totalMinutes);

        return {
            total: totalWorkouts,
            thisWeek: workoutsThisWeek,
            totalTime,
        };
    }, [workoutsArray]);
    
    const handleStartWorkout = async () => {
        try {
            const workoutId = await startWorkoutSession();
            router.push(`/workout-session?workoutId=${workoutId}`);
        } catch (error) {
            console.error('Error starting workout', error);
        }
    };

    // Exercise categories (static for now, but could be derived from exercises in workouts)
    const exerciseCategories = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Cardio'];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient colors={[...GRADIENT_COLORS]} style={{ flex: 1 }}>
            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >

            {/* === Top Bar === */}
            <SimpleTopBar title="Fitness" subtitle="Your workouts" />

            {/* Subtle divider */}
            <Divider />

            {/* === Start Workout Section === */}
            <View style={{ marginBottom: 32 }}>
                <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 8 }}>
                    GET STARTED
                </Text>
                <Pressable
                    onPress={handleStartWorkout}
                    style={({ pressed }) => [
                        SECTION_CARD,
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 22,
                            opacity: activeWorkout ? 1 : 0.75,
                            backgroundColor: pressed ? COLORS.chip : COLORS.card,
                        },
                    ]}
                >
                    <View style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: COLORS.accent + '1E',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 14,
                    }}>
                        <Ionicons name="play" size={24} color={COLORS.accent} />
                    </View>
                    <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: '700', letterSpacing: -0.2 }}>
                        {activeWorkout ? `Start: ${activeWorkout.name}` : 'Start Workout'}
                    </Text>
                </Pressable>
            </View>

            {/* === Active Workout Plan === */}
            <View style={{ marginBottom: 32 }}>
                <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 8 }}>
                    YOUR PLAN
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: COLORS.accent + '1E',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 14,
                    }}>
                        <Ionicons name="barbell" size={21} color={COLORS.accent} />
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.text, letterSpacing: -0.3 }}>
                        Active Plan
                    </Text>
                </View>

                <View style={SECTION_CARD}>
                    {activeWorkout ? (
                        <View style={{
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: COLORS.divider,
                        }}>
                            <Text style={{ color: COLORS.text, fontSize: 17, fontWeight: '600', marginBottom: 8 }}>
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
                        <View style={{ padding: 20, opacity: 0.85 }}>
                            <Text style={{ color: COLORS.text, fontSize: 17, fontWeight: '600', fontStyle: 'italic', marginBottom: 8 }}>
                                No active plan
                            </Text>
                            <Text style={{ color: COLORS.textDime, fontSize: 14 }}>
                                Create or select a workout plan to get started
                            </Text>
                        </View>
                    )}

                    <Pressable
                        style={({ pressed }) => ({
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 18,
                            backgroundColor: pressed ? COLORS.chip : COLORS.cardSecondary,
                        })}
                    >
                        <Ionicons name="add-circle-outline" size={22} color={COLORS.textDime} style={{ marginRight: 10 }} />
                        <Text style={{ color: COLORS.textDime, fontSize: 16, fontWeight: '500' }}>
                            Create new plan
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* === Workout History === */}
            <View style={{ marginBottom: 32 }}>
                <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 8 }}>
                    HISTORY
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: COLORS.accentBlue + '1E',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 14,
                    }}>
                        <Ionicons name="time" size={21} color={COLORS.accentBlue} />
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.text, letterSpacing: -0.3 }}>
                        Recent Workouts
                    </Text>
                </View>

                <View style={SECTION_CARD}>
                    {recentWorkouts.length > 0 ? (
                        recentWorkouts.map((workout, i) => (
                            <View
                                key={workout.id}
                                style={{
                                    paddingVertical: 16,
                                    paddingHorizontal: 20,
                                    borderBottomWidth: i < recentWorkouts.length - 1 ? 1 : 0,
                                    borderBottomColor: COLORS.divider,
                                }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
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
                        ))
                    ) : (
                        <View style={{ padding: 24, alignItems: 'center' }}>
                            <Text style={{ color: COLORS.textDime, fontSize: 14, fontStyle: 'italic' }}>
                                No workouts completed yet
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* === Exercise Library === */}
            <View style={{ marginBottom: 32 }}>
                <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 8 }}>
                    LIBRARY
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: COLORS.accentBlue + '1E',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 14,
                    }}>
                        <Ionicons name="library" size={21} color={COLORS.accentBlue} />
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.text, letterSpacing: -0.3 }}>
                        Exercise Library
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    {exerciseCategories.map((category, index) => (
                        <Pressable
                            key={index}
                            style={({ pressed }) => ({
                                paddingVertical: 14,
                                paddingHorizontal: 22,
                                backgroundColor: pressed ? COLORS.chipBorder + '99' : COLORS.chip,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: COLORS.chipBorder + '99',
                            })}
                        >
                            <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '600' }}>
                                {category}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* === Stats Overview === */}
            <View style={{ marginBottom: 24 }}>
                <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 8 }}>
                    STATS
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: COLORS.accent + '1E',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 14,
                    }}>
                        <Ionicons name="stats-chart" size={21} color={COLORS.accent} />
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.text, letterSpacing: -0.3 }}>
                        Overview
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    gap: 12,
                }}>
                    <View style={[SECTION_CARD, { flex: 1, padding: 20, alignItems: 'center' }]}>
                        <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', marginBottom: 6, letterSpacing: 0.5 }}>
                            TOTAL WORKOUTS
                        </Text>
                        <Text style={{ color: COLORS.text, fontSize: 26, fontWeight: '700' }}>
                            {statistics.total}
                        </Text>
                    </View>

                    <View style={[SECTION_CARD, { flex: 1, padding: 20, alignItems: 'center' }]}>
                        <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', marginBottom: 6, letterSpacing: 0.5 }}>
                            THIS WEEK
                        </Text>
                        <Text style={{ color: COLORS.text, fontSize: 26, fontWeight: '700' }}>
                            {statistics.thisWeek}
                        </Text>
                    </View>
                </View>

                <View style={[SECTION_CARD, { padding: 20, alignItems: 'center' }]}>
                    <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', marginBottom: 6, letterSpacing: 0.5 }}>
                        TOTAL TIME
                    </Text>
                    <Text style={{ color: COLORS.text, fontSize: 26, fontWeight: '700' }}>
                        {statistics.totalTime.hours}h {statistics.totalTime.minutes}m
                    </Text>
                </View>
            </View>

            </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}
