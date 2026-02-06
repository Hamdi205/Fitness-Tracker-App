import { Divider } from '@/components/common/Divider';
import { MinimalTopBar } from '@/components/common/MinimalTopBar';
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

const SECTION_CARD = {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.chipBorder,
    overflow: 'hidden' as const,
};

/**
 * DashboardScreen
 * ---
 * Main landing screen with quick notes, workout tracker, and daily targets.
 */
export default function DashboardScreen() {
    const { loadData, notes, workouts } = useAppStore();
    const { todayTarget, addWaterGlass, removeWaterGlass } = useDailyTargets();

    useEffect(() => {
        loadData();
    }, [loadData]);

    const quickNotes = useMemo(() => notes.slice(0, 3), [notes]);
    const nextWorkout = useMemo(() => workouts.find(w => !w.completedAt), [workouts]);
    const completedWorkoutsCount = useMemo(() => workouts.filter(w => w.completedAt).length, [workouts]);
    const workoutProgress = useMemo(
        () => calculatePercentage(completedWorkoutsCount, workouts.length),
        [workouts.length, completedWorkoutsCount]
    );
    const dayName = useMemo(() => getDayName(), []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                <MinimalTopBar />
                <Divider />

                {/* --- Quick Notes --- */}
                <View style={{ marginBottom: 28 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                        <View style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            backgroundColor: COLORS.accentBlue + '22',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                        }}>
                            <Ionicons name="document-text" size={20} color={COLORS.accentBlue} />
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.text }}>
                            Quick Notes
                        </Text>
                    </View>

                    <View style={SECTION_CARD}>
                        <Pressable
                            onPress={() => router.push('/add-note-modal')}
                            style={({ pressed }) => ({
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 16,
                                backgroundColor: pressed ? COLORS.chip : COLORS.cardSecondary,
                                borderBottomWidth: quickNotes.length > 0 ? 1 : 0,
                                borderBottomColor: COLORS.divider,
                            })}
                        >
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 12,
                                backgroundColor: COLORS.accentBlue + '20',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 14,
                            }}>
                                <Ionicons name="add" size={22} color={COLORS.accentBlue} />
                            </View>
                            <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '500' }}>
                                New quick note
                            </Text>
                        </Pressable>

                        {quickNotes.length > 0 ? (
                            quickNotes.map((note, i) => (
                                <View
                                    key={note.id}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingVertical: 14,
                                        paddingHorizontal: 16,
                                        borderBottomWidth: i < quickNotes.length - 1 ? 1 : 0,
                                        borderBottomColor: COLORS.divider,
                                    }}
                                >
                                    <Ionicons name="document-text-outline" size={20} color={COLORS.textDime} style={{ marginRight: 12 }} />
                                    <Text style={{ color: COLORS.text, fontSize: 15, flex: 1 }} numberOfLines={1}>
                                        {note.title}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={18} color={COLORS.textDime} />
                                </View>
                            ))
                        ) : (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <Text style={{ color: COLORS.textDime, fontSize: 14 }}>
                                    No notes yet — tap above to add one
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* --- Workout Tracker --- */}
                <View style={{ marginBottom: 28 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                        <View style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            backgroundColor: COLORS.accent + '22',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                        }}>
                            <Ionicons name="barbell" size={20} color={COLORS.accent} />
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.text }}>
                            Workout Tracker
                        </Text>
                    </View>

                    <View style={SECTION_CARD}>
                        <View style={{
                            padding: 18,
                            borderBottomWidth: 1,
                            borderBottomColor: COLORS.divider,
                        }}>
                            <Text style={{ color: COLORS.textDime, fontSize: 12, fontWeight: '600', marginBottom: 4, letterSpacing: 0.5 }}>
                                NEXT UP
                            </Text>
                            <Text
                                style={{
                                    color: nextWorkout ? COLORS.text : COLORS.textDime,
                                    fontSize: 17,
                                    fontWeight: '600',
                                    fontStyle: nextWorkout ? 'normal' : 'italic',
                                }}
                            >
                                {nextWorkout ? nextWorkout.name : 'No plan yet'}
                            </Text>
                        </View>

                        <View style={{ padding: 18 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '600' }}>
                                    {completedWorkoutsCount} of {workouts.length} completed
                                </Text>
                                <Text style={{ color: COLORS.accent, fontSize: 14, fontWeight: '700' }}>
                                    {Math.round(workoutProgress)}%
                                </Text>
                            </View>
                            <View style={{
                                height: 10,
                                backgroundColor: COLORS.chip,
                                borderRadius: 5,
                                overflow: 'hidden',
                            }}>
                                <View style={{
                                    height: '100%',
                                    width: `${Math.min(workoutProgress, 100)}%`,
                                    backgroundColor: COLORS.accent,
                                    borderRadius: 5,
                                }} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* --- Daily Targets --- */}
                <View style={{ marginBottom: 24 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                        <View style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            backgroundColor: COLORS.accentBlue + '22',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                        }}>
                            <Ionicons name="water" size={20} color={COLORS.accentBlue} />
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.text }}>
                            {dayName} Targets
                        </Text>
                    </View>

                    <View style={SECTION_CARD}>
                        <View style={{ padding: 18 }}>
                            <WaterTracker
                                current={todayTarget.water.current}
                                target={todayTarget.water.target}
                                onAddGlass={addWaterGlass}
                                onRemoveGlass={removeWaterGlass}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}