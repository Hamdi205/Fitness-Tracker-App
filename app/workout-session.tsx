import { TopBar } from '@/components/common/TopBar';
import { COLORS } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutSession() {
    const {workoutId} = useLocalSearchParams<{ workoutId?: string }>();
    const {workouts, startWorkoutSession, addExerciseToWorkout, loadData} = useAppStore();
    const [exerciseName, setExerciseName] = useState('');
    const [currentWorkoutId, setCurrentWorkoutId] = useState<string | null>(null);
    
    const currentWorkout = useMemo(() => {
        if (!currentWorkoutId) return null;
        return workouts.find(w => w.id === currentWorkoutId) || null;
    }, [workouts, currentWorkoutId]);
        
    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (workoutId) {
            setCurrentWorkoutId(workoutId);
        } else {
            // Start a new workout session
            startWorkoutSession().then(id => {
                setCurrentWorkoutId(id);
            });
        }
    }, [workoutId, startWorkoutSession]);

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

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.bg}}>
            <View style={{marginHorizontal: 16, marginBottom: 16}}>
                <TopBar
                    title="Workout Session"
                    showProfile={false}
                    showNotifications={false}
                    showSettings={false}
                    onBackPress={() => router.back()}
                />
            </View>

            <ScrollView
                style={{flex: 1}}
                contentContainerStyle={{padding: 16}}
                showsVerticalScrollIndicator={false}
            >
                {/* Workout Info */}
                {currentWorkout && (
                    <View style={{
                        padding: 16,
                        backgroundColor: COLORS.card,
                        borderRadius: 12,
                        marginBottom: 16,
                    }}>
                        <Text style={{color: COLORS.text, fontSize: 18, fontWeight: '600', marginBottom: 8}}>
                            {currentWorkout.name}
                        </Text>
                        <Text style={{color: COLORS.textDime, fontSize: 14}}>
                            {`${currentWorkout.exercises?.length || 0} exercise${(currentWorkout.exercises?.length || 0) !== 1 ? 's' : ''}`}
                        </Text>
                    </View>
                )}


                {/* Add Exercise Section */}
                <View style={{marginBottom: 24}}>
                    <Text style={{color: COLORS.text, fontSize: 16, fontWeight: '600', marginBottom: 12}}>
                        Add Exercise
                    </Text>
                    <View style={{flexDirection: 'row', gap: 8}}>
                        <TextInput
                            value={exerciseName}
                            onChangeText={setExerciseName}
                            placeholder="Exercise name"
                            placeholderTextColor={COLORS.textDime}
                            style={{
                                flex: 1,
                                backgroundColor: COLORS.card,
                                borderRadius: 12,
                                padding: 14,
                                color: COLORS.text,
                                fontSize: 16,
                            }}
                        />
                        <Pressable
                            onPress={handleAddExercise}
                            style={{
                                backgroundColor: COLORS.accentBlue,
                                borderRadius: 12,
                                padding: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons name="add" size={24} color={COLORS.buttonText}/>
                        </Pressable>
                    </View>
                </View>

                {/* Exercises List */}
                <View>
                    <Text style={{color: COLORS.text, fontSize: 16, fontWeight: '600', marginBottom: 12}}>
                        Exercises
                    </Text>

                    {currentWorkout && currentWorkout.exercises && currentWorkout.exercises.length > 0 ? (
                        <View>
                            {currentWorkout.exercises.map((exercise, index) => (
                                <View
                                    key={exercise.id || index}
                                    style={{
                                        padding: 16,
                                        backgroundColor: COLORS.card,
                                        borderRadius: 12,
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text style={{color: COLORS.text, fontSize: 16, fontWeight: '600'}}>
                                        {exercise.name || 'Unnamed Exercise'}
                                    </Text>
                                    {(() => {
                                        const parts = [];
                                        if (exercise.sets) parts.push(`${exercise.sets} sets`);
                                        if (exercise.reps) parts.push(`${exercise.reps} reps`);
                                        if (exercise.weight) parts.push(`${exercise.weight}kg`);
                                        return parts.length > 0 ? (
                                            <Text style={{color: COLORS.textDime, fontSize: 14, marginTop: 4}}>
                                                {parts.join(' × ')}
                                            </Text>
                                        ) : null;
                                    })()}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={{
                            padding: 24,
                            backgroundColor: COLORS.card,
                            borderRadius: 12,
                            alignItems: 'center',
                        }}>
                            <Text style={{color: COLORS.textDime, fontSize: 14, fontStyle: 'italic'}}>
                                No exercises added yet. Add your first exercise above!
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}    