import { useDailyTargets } from '@/hooks/useDailyTargets';
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
 * DashboardScreen
 * ---
 * This is the main landing screen of the app
 *
 * Its like view in MVC
 */

// Circular Progress Component
function CircularProgress({
    percentage,
    size = 80,
    strokeWidth = 8,
    color = '#4A90E2',
    label,
    value,
    subtitle
}: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label: string;
    value: string;
    subtitle?: string;
}) {
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

export default function DashboardScreen() {
    const { loadData, notes, workouts } = useAppStore();
    const { todayTarget } = useDailyTargets();

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Calculate percentages
    const waterPercentage = useMemo(() => {
        if (todayTarget.water.target === 0) return 0;
        return Math.min((todayTarget.water.current / todayTarget.water.target) * 100, 100);
    }, [todayTarget.water]);

    const caloriesPercentage = useMemo(() => {
        if (todayTarget.calories.target === 0) return 0;
        return Math.min((todayTarget.calories.current / todayTarget.calories.target) * 100, 100);
    }, [todayTarget.calories]);

    const tasksPercentage = useMemo(() => {
        if (todayTarget.tasks.total === 0) return 0;
        return Math.min((todayTarget.tasks.completed / todayTarget.tasks.total) * 100, 100);
    }, [todayTarget.tasks]);

    // Get quick notes (filter by category or get first 3)
    const quickNotes = useMemo(() => {
        return notes.slice(0, 3);
    }, [notes]);

    // Get next workout (first incomplete workout)
    const nextWorkout = useMemo(() => {
        return workouts.find(w => !w.completedAt);
    }, [workouts]);

    // Count completed workouts
    const completedWorkoutsCount = useMemo(() => {
        return workouts.filter(w => w.completedAt).length;
    }, [workouts]);

    // Calculate workout progress percentage
    const workoutProgress = useMemo(() => {
        if (workouts.length === 0) return 0;
        return (completedWorkoutsCount / workouts.length) * 100;
    }, [workouts.length, completedWorkoutsCount]);

    // Get current day name
    const dayName = useMemo(() => {
        return new Date().toLocaleDateString('en-US', { weekday: 'long' });
    }, []);

    // Format calories target with commas
    const formattedCaloriesTarget = useMemo(() => {
        return todayTarget.calories.target.toLocaleString('en-US');
    }, [todayTarget.calories.target]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
                <ScrollView
                    style={{flex: 1}}
                    contentContainerStyle={{padding: 16}}
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
                            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                            style={{width: 64, height: 64, justifyContent: 'center', alignItems: 'center'}}
                        >
                            <View style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                backgroundColor: '#4A90E2',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Ionicons name="person" size={24} color={COLORS.text}/>
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
                            Dashboard
                        </Text>

                        {/* Right side icons */}
                        <View style={{
                            marginLeft: 'auto',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12
                        }}>
                            {/* Notification icon with badge */}
                            <View style={{position: 'relative'}}>
                                <Ionicons name="notifications-outline" size={24} color={COLORS.text}/>
                                <View style={{
                                    position: 'absolute',
                                    top: -2,
                                    right: -2,
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: '#E85C5C',
                                }}/>
                            </View>

                            {/* Settings icon */}
                            <Ionicons name="settings-outline" size={24} color={COLORS.text}/>
                        </View>
                    </View>

                    {/* Subtle divider */}
                    <View style={{
                        height: 1,
                        backgroundColor: COLORS.divider,
                        marginTop: 8,
                        marginBottom: 24
                    }}/>

                    {/* === Quick Notes Section === */}
                    <View style={{marginBottom: 24}}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: '600',
                            color: COLORS.text,
                            marginBottom: 12
                        }}>
                            Quick Notes
                        </Text>

                        {/* New Quick Notes*/}
                        <Pressable 
                            onPress={() => router.push('/add-note-modal')}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 14,
                                borderRadius: 12,
                                backgroundColor: COLORS.cardSecondary,
                                marginBottom: 12
                            }}
                        >
                            <Ionicons name="add-circle-outline" size={20} color={COLORS.textDime}
                                      style={{marginRight: 8}}/>
                            <Text style={{color: COLORS.textDime, fontSize: 16}}>
                                + New quick notes ...
                            </Text>
                        </Pressable>

                        {/* Notes List */}
                        <View>
                            {quickNotes.length > 0 ? (
                                quickNotes.map((note) => (
                                    <View
                                        key={note.id}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingVertical: 12,
                                            paddingHorizontal: 8,
                                        }}
                                    >
                                        <Ionicons name="document-text-outline" size={18} color={COLORS.textDime}
                                                  style={{ marginRight: 12 }} />
                                        <Text style={{ color: COLORS.text, fontSize: 14 }}>
                                            {note.title}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <View style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 8,
                                    opacity: 0.6,
                                }}>
                                    <Text style={{ color: COLORS.textDime, fontSize: 14, fontStyle: 'italic' }}>
                                        No notes yet
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* === Workout Tracker Section === */}
                    <View style={{marginBottom: 24}}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: '600',
                            color: COLORS.text,
                            marginBottom: 12
                        }}>
                            Workout Tracker
                        </Text>

                        {/* Next Workout Card */}
                        <View style={{
                            padding: 16,
                            backgroundColor: COLORS.card,
                            borderRadius: 12,
                            marginBottom: 16,
                            opacity: nextWorkout ? 1 : 0.6,
                        }}>
                            <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600', fontStyle: nextWorkout ? 'normal' : 'italic' }}>
                                {nextWorkout ? `Next up: ${nextWorkout.name}` : 'Next up: No plan yet'}
                            </Text>
                        </View>

                        {/* Workouts Completed */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600', marginRight: 8 }}>
                                {completedWorkoutsCount} Workout{completedWorkoutsCount !== 1 ? 's' : ''} Completed
                            </Text>
                            <Ionicons name="barbell-outline" size={20} color="#E85C5C" />
                        </View>

                        {/* Progress Bar */}
                        <View style={{
                            height: 8,
                            backgroundColor: '#2A2A2E',
                            borderRadius: 4,
                            overflow: 'hidden',
                        }}>
                            <View style={{
                                height: '100%',
                                width: `${Math.min(workoutProgress, 100)}%`,
                                backgroundColor: '#4A90E2',
                                borderRadius: 4,
                            }} />
                        </View>
                    </View>

                    {/* === Daily Targets Section === */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: '600',
                            color: COLORS.text,
                            marginBottom: 16
                        }}>
                            {dayName} Targets
                        </Text>

                        {/* Circular Progress Indicators */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
                            <Pressable onPress={() => router.push('/update-target-modal?type=water')}>
                                <CircularProgress
                                    percentage={waterPercentage}
                                    size={80}
                                    strokeWidth={8}
                                    color="#4A90E2"
                                    label="Water"
                                    value={`${Math.round(waterPercentage)}%`}
                                    subtitle={`${todayTarget.water.current}/${todayTarget.water.target}`}
                                />
                            </Pressable>
                            <Pressable onPress={() => router.push('/update-target-modal?type=calories')}>
                                <CircularProgress
                                    percentage={caloriesPercentage}
                                    size={80}
                                    strokeWidth={8}
                                    color="#E85C5C"
                                    label="Calories"
                                    value={todayTarget.calories.current.toLocaleString('en-US')}
                                    subtitle={`/${todayTarget.calories.target.toLocaleString('en-US')}`}
                                />
                            </Pressable>
                            <Pressable onPress={() => router.push('/update-target-modal?type=tasks')}>
                                <CircularProgress
                                    percentage={tasksPercentage}
                                    size={80}
                                    strokeWidth={8}
                                    color="#4A90E2"
                                    label="Tasks"
                                    value={`${todayTarget.tasks.completed}/${todayTarget.tasks.total}`}
                                    subtitle={todayTarget.tasks.total > 0 ? "Done" : "No tasks"}
                                />
                            </Pressable>
                        </View>

                        {/* Calories Target */}
                        <View style={{ alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{ color: COLORS.textDime, fontSize: 12 }}>
                                {formattedCaloriesTarget} kcal
                            </Text>
                        </View>

                        {/* New Task Button */}
                        <Pressable
                            onPress={() => router.push('/add-task-modal')}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 12,
                                backgroundColor: COLORS.card,
                                borderRadius: 12,
                            }}
                        >
                            <Ionicons name="add-circle-outline" size={20} color={COLORS.textDime}
                                      style={{marginRight: 8}}/>
                            <Text style={{color: COLORS.textDime, fontSize: 14}}>
                                + New task
                            </Text>
                        </Pressable>
                    </View>

                </ScrollView>
            </SafeAreaView>
        );
}