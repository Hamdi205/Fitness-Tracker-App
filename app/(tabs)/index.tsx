import { Divider } from '@/components/common/Divider';
import { MinimalTopBar } from '@/components/common/MinimalTopBar';
import { WaterTracker } from '@/components/common/WaterTracker';
import { COLORS } from '@/constants/colors';
import { useDailyTargets } from '@/hooks/useDailyTargets';
import { useAppStore } from '@/store/useAppStore';
import { calculatePercentage, getDayName } from '@/utils/calculations';
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
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient colors={[...GRADIENT_COLORS]} style={{ flex: 1 }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <MinimalTopBar />
                <Divider />

                {/* --- Quick Notes --- */}
                <View style={{ marginBottom: 32 }}>
                    <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 8 }}>
                        QUICK ACCESS
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
                            <Ionicons name="document-text" size={21} color={COLORS.accentBlue} />
                        </View>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.text, letterSpacing: -0.3 }}>
                            Quick Notes
                        </Text>
                    </View>

                    <View style={SECTION_CARD}>
                        <Pressable
                            onPress={() => router.push('/add-note-modal')}
                            style={({ pressed }) => ({
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 18,
                                backgroundColor: pressed ? COLORS.chip : COLORS.cardSecondary,
                                borderBottomWidth: quickNotes.length > 0 ? 1 : 0,
                                borderBottomColor: COLORS.divider,
                            })}
                        >
                            <View style={{
                                width: 44,
                                height: 44,
                                borderRadius: 14,
                                backgroundColor: COLORS.accentBlue + '1A',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 16,
                            }}>
                                <Ionicons name="add" size={24} color={COLORS.accentBlue} />
                            </View>
                            <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600' }}>
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
                                        paddingVertical: 16,
                                        paddingHorizontal: 18,
                                        borderBottomWidth: i < quickNotes.length - 1 ? 1 : 0,
                                        borderBottomColor: COLORS.divider,
                                    }}
                                >
                                    <Ionicons name="document-text-outline" size={20} color={COLORS.textDime} style={{ marginRight: 14 }} />
                                    <Text style={{ color: COLORS.text, fontSize: 15, flex: 1 }} numberOfLines={1}>
                                        {note.title}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={18} color={COLORS.textDime} />
                                </View>
                            ))
                        ) : (
                            <View style={{ padding: 24, alignItems: 'center' }}>
                                <Text style={{ color: COLORS.textDime, fontSize: 14 }}>
                                    No notes yet — tap above to add one
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* --- Workout Tracker --- */}
                <View style={{ marginBottom: 32 }}>
                    <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 8 }}>
                        FITNESS
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
                            Workout Tracker
                        </Text>
                    </View>

                    <View style={SECTION_CARD}>
                        <View style={{
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: COLORS.divider,
                        }}>
                            <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', marginBottom: 6, letterSpacing: 1.2 }}>
                                NEXT UP
                            </Text>
                            <Text
                                style={{
                                    color: nextWorkout ? COLORS.text : COLORS.textDime,
                                    fontSize: 18,
                                    fontWeight: '600',
                                    fontStyle: nextWorkout ? 'normal' : 'italic',
                                }}
                            >
                                {nextWorkout ? nextWorkout.name : 'No plan yet'}
                            </Text>
                        </View>

                        <View style={{ padding: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '600' }}>
                                    {completedWorkoutsCount} of {workouts.length} completed
                                </Text>
                                <Text style={{ color: COLORS.accent, fontSize: 14, fontWeight: '700' }}>
                                    {Math.round(workoutProgress)}%
                                </Text>
                            </View>
                            <View style={{
                                height: 12,
                                backgroundColor: COLORS.chip,
                                borderRadius: 6,
                                overflow: 'hidden',
                            }}>
                                <View style={{
                                    height: '100%',
                                    width: `${Math.min(workoutProgress, 100)}%`,
                                    backgroundColor: COLORS.accent,
                                    borderRadius: 6,
                                }} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* --- Daily Targets --- */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 8 }}>
                        TODAY
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
                            <Ionicons name="water" size={21} color={COLORS.accentBlue} />
                        </View>
                        <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.text, letterSpacing: -0.3 }}>
                            {dayName} Targets
                        </Text>
                    </View>

                    <View style={SECTION_CARD}>
                        <View style={{ padding: 20 }}>
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
            </LinearGradient>
        </SafeAreaView>
    );
}