import { SimpleTopBar } from '@/components/common/SimpleTopBar';
import { COLORS } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
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

export default function WorkoutSession() {
    const { workoutId } = useLocalSearchParams<{ workoutId?: string }>();
    const { workouts, startWorkoutSession, addExerciseToWorkout, loadData, updateWorkout, completeWorkout } = useAppStore();
    const [exerciseName, setExerciseName] = useState('');
    const [currentWorkoutId, setCurrentWorkoutId] = useState<string | null>(null);
    const [sessionTitle, setSessionTitle] = useState('');

    const currentWorkout = useMemo(() => {
        if (!currentWorkoutId) return null;
        return workouts.find(w => w.id === currentWorkoutId) || null;
    }, [workouts, currentWorkoutId]);

    useEffect(() => {
        if (currentWorkout?.name != null) {
            setSessionTitle(currentWorkout.name);
        }
    }, [currentWorkout?.id, currentWorkout?.name]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (workoutId) {
            setCurrentWorkoutId(workoutId);
        } else {
            startWorkoutSession().then(id => {
                setCurrentWorkoutId(id);
            });
        }
    }, [workoutId, startWorkoutSession]);

    const handleSaveSessionTitle = () => {
        const trimmed = sessionTitle.trim();
        if (currentWorkoutId && trimmed) {
            updateWorkout(currentWorkoutId, { name: trimmed });
        } else if (currentWorkoutId) {
            const fallback = 'Untitled workout';
            setSessionTitle(fallback);
            updateWorkout(currentWorkoutId, { name: fallback });
        }
    };

    const handleAddExercise = async () => {
        if (!exerciseName.trim()) {
            Alert.alert('Error', 'Please enter an exercise name');
            return;
        }
        if (!currentWorkoutId) {
            Alert.alert('Error', 'No active workout session');
            return;
        }
        try {
            await addExerciseToWorkout(currentWorkoutId, {
                name: exerciseName.trim(),
            });
            setExerciseName('');
        } catch (error) {
            Alert.alert('Error', 'Failed to add exercise');
            console.error('Error adding exercise:', error);
        }
    };

    const handleEndSession = () => {
        if (!currentWorkoutId) return;
        Alert.alert(
            'Avslutt økt',
            'Er du sikker på at du vil avslutte økten? Den markeres som fullført.',
            [
                { text: 'Avbryt', style: 'cancel' },
                {
                    text: 'Avslutt økt',
                    style: 'destructive',
                    onPress: async () => {
                        await completeWorkout(currentWorkoutId);
                        router.back();
                    },
                },
            ]
        );
    };

    const exerciseCount = currentWorkout?.exercises?.length ?? 0;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient colors={[...GRADIENT_COLORS]} style={{ flex: 1 }}>
                <SimpleTopBar
                    title="Workout Session"
                    subtitle={currentWorkout ? currentWorkout.name : 'Log your exercises'}
                    showProfile={false}
                    showBack
                    onBackPress={() => router.back()}
                />

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {currentWorkout && (
                        <View style={{ marginBottom: 32 }}>
                            <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 8 }}>
                                SESSION TITLE
                            </Text>
                            <View style={SECTION_CARD}>
                                <View style={{ padding: 20 }}>
                                    <TextInput
                                        value={sessionTitle}
                                        onChangeText={setSessionTitle}
                                        onEndEditing={handleSaveSessionTitle}
                                        placeholder="e.g. Morning run, Push day"
                                        placeholderTextColor={COLORS.textDime}
                                        style={{
                                            backgroundColor: COLORS.chip,
                                            borderRadius: 14,
                                            padding: 16,
                                            color: COLORS.text,
                                            fontSize: 18,
                                            fontWeight: '700',
                                            borderWidth: 1,
                                            borderColor: COLORS.chipBorder + '99',
                                            marginBottom: 10,
                                        }}
                                    />
                                    <Text style={{ color: COLORS.textDime, fontSize: 14 }}>
                                        {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    <View style={{ marginBottom: 32 }}>
                        <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 12 }}>
                            ADD EXERCISE
                        </Text>
                        <View style={[SECTION_CARD, { padding: 20 }]}>
                            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                                <TextInput
                                    value={exerciseName}
                                    onChangeText={setExerciseName}
                                    placeholder="Exercise name"
                                    placeholderTextColor={COLORS.textDime}
                                    style={{
                                        flex: 1,
                                        backgroundColor: COLORS.chip,
                                        borderRadius: 14,
                                        padding: 16,
                                        color: COLORS.text,
                                        fontSize: 16,
                                        fontWeight: '500',
                                        borderWidth: 1,
                                        borderColor: COLORS.chipBorder + '99',
                                    }}
                                />
                                <Pressable
                                    onPress={handleAddExercise}
                                    style={({ pressed }) => ({
                                        width: 52,
                                        height: 52,
                                        borderRadius: 16,
                                        backgroundColor: pressed ? COLORS.accentBlue + 'dd' : COLORS.accentBlue,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    })}
                                >
                                    <Ionicons name="add" size={28} color={COLORS.buttonText} />
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 12 }}>
                            EXERCISES
                        </Text>
                        <View style={SECTION_CARD}>
                            {currentWorkout && currentWorkout.exercises && currentWorkout.exercises.length > 0 ? (
                                currentWorkout.exercises.map((exercise, index) => (
                                    <View
                                        key={exercise.id || index}
                                        style={{
                                            paddingVertical: 16,
                                            paddingHorizontal: 20,
                                            borderBottomWidth: index < currentWorkout.exercises!.length - 1 ? 1 : 0,
                                            borderBottomColor: COLORS.divider,
                                        }}
                                    >
                                        <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600' }}>
                                            {exercise.name || 'Unnamed Exercise'}
                                        </Text>
                                        {(() => {
                                            const parts = [];
                                            if (exercise.sets) parts.push(`${exercise.sets} sets`);
                                            if (exercise.reps) parts.push(`${exercise.reps} reps`);
                                            if (exercise.weight) parts.push(`${exercise.weight} kg`);
                                            return parts.length > 0 ? (
                                                <Text style={{ color: COLORS.textDime, fontSize: 14, marginTop: 4 }}>
                                                    {parts.join(' × ')}
                                                </Text>
                                            ) : null;
                                        })()}
                                    </View>
                                ))
                            ) : (
                                <View style={{ padding: 24, alignItems: 'center' }}>
                                    <Text style={{ color: COLORS.textDime, fontSize: 14, fontStyle: 'italic' }}>
                                        No exercises yet. Add your first exercise above!
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {currentWorkoutId && (
                        <View style={{ marginTop: 32 }}>
                            <Pressable
                                onPress={handleEndSession}
                                style={({ pressed }) => ({
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 10,
                                    padding: 18,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: COLORS.accent + '99',
                                    backgroundColor: pressed ? COLORS.accent + '22' : 'transparent',
                                })}
                            >
                                <Ionicons name="checkmark-done" size={22} color={COLORS.accent} />
                                <Text style={{ color: COLORS.accent, fontSize: 16, fontWeight: '600' }}>
                                    Avslutt økt
                                </Text>
                            </Pressable>
                        </View>
                    )}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}
