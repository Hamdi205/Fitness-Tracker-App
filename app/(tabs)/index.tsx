import { Divider } from '@/components/common/Divider';
import { TopBar } from '@/components/common/TopBar';
import { WaterTracker } from '@/components/common/WaterTracker';
import { COLORS } from '@/constants/colors';
import { useDailyTargets } from '@/hooks/useDailyTargets';
import { useAppStore } from '@/store/useAppStore';
import { calculatePercentage, getDayName } from '@/utils/calculations';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * DashboardScreen
 * ---
 * This is the main landing screen of the app
 *
 * Its like view in MVC
 */

export default function DashboardScreen() {
    const { loadData, notes, workouts } = useAppStore();
    const { todayTarget, addWaterGlass, removeWaterGlass } = useDailyTargets();

    useEffect(() => {
        loadData();
    }, [loadData]);

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
        return calculatePercentage(completedWorkoutsCount, workouts.length);
    }, [workouts.length, completedWorkoutsCount]);

    // Get current day name using utility function
    const dayName = useMemo(() => {
        return getDayName();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
                <ScrollView
                    style={{flex: 1}}
                    contentContainerStyle={{padding: 16}}
                    showsVerticalScrollIndicator={false}
                >

                    {/* === Top Bar === */}
                    <TopBar title="Dashboard" />

                    {/* Subtle divider */}
                    <Divider />

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
                            <Ionicons name="barbell-outline" size={20} color={COLORS.accent} />
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
                                backgroundColor: COLORS.accentBlue,
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

                        {/* Water Tracker */}
                        <View style={{ marginBottom: 24 }}>
                            <WaterTracker
                                current={todayTarget.water.current}
                                target={todayTarget.water.target}
                                onAddGlass={addWaterGlass}
                                onRemoveGlass={removeWaterGlass}
                            />
                        </View>
                      
                    </View>

                </ScrollView>
            </SafeAreaView>
        );
}