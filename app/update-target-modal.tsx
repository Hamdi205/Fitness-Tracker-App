import { TaskTracker } from '@/components/common/TaskTracker';
import { TopBar } from '@/components/common/TopBar';
import { WaterTracker } from '@/components/common/WaterTracker';
import { COLORS } from '@/constants/colors';
import { formatCalories, formatNumber } from '@/utils/calculations';
import { validateNumber } from '@/utils/validation';
import { useDailyTargets } from '@/hooks/useDailyTargets';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UpdateTargetModal() {
    const { type } = useLocalSearchParams<{ type: 'water' | 'calories' | 'tasks' }>();
    const { todayTarget, updateWater, updateCalories,, addWaterGlass } = useDailyTargets();
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getTitle = () => {
        switch (type) {
            case 'water':
                return 'Update Water';
            case 'calories':
                return 'Update Calories';
            case 'tasks':
                return 'Update Tasks';
            default:
                return 'Update Target';
        }
    };

    const getCurrentValue = () => {
        switch (type) {
            case 'water':
                return todayTarget.water.current;
            case 'calories':
                return todayTarget.calories.current;
            case 'tasks':
                return todayTarget.tasks.completed;
            default:
                return 0;
        }
    };

    const getTargetValue = () => {
        switch (type) {
            case 'water':
                return todayTarget.water.target;
            case 'calories':
                return todayTarget.calories.target;
            case 'tasks':
                return todayTarget.tasks.total;
            default:
                return 0;
        }
    };

    const getPlaceholder = () => {
        switch (type) {
            case 'water':
                return `Current: ${todayTarget.water.current.toFixed(2)} L`;
            case 'calories':
                return `Current: ${formatCalories(todayTarget.calories.current)} kcal`;
            case 'tasks':
                return `Completed: ${todayTarget.tasks.completed} tasks`;
            default:
                return 'Enter value';
        }
    };

    const handleSave = async () => {
        const validation = validateNumber(value);
        if (!validation.valid) {
            Alert.alert('Error', validation.error || 'Please enter a valid number');
            return;
        }
        const numValue = parseFloat(value);

        setIsLoading(true);
        try {
            switch (type) {
                case 'water':
                    await updateWater(numValue);
                    break;
                case 'calories':
                    await updateCalories(numValue);
                    break;
                case 'tasks':
                    // For tasks, we update completed count
                    await updateTasks(numValue, todayTarget.tasks.total);
                    break;
            }
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to update target. Please try again.');
            console.error('Error updating target:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!type) {
        return null;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
            {/* Header */}
            <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                <TopBar 
                    title={getTitle()} 
                    showProfile={false}
                    showNotifications={false}
                    showSettings={false}
                    onBackPress={() => router.back()}
                />
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Current Stats */}
                <View style={{ marginBottom: 24 }}>
                    <View
                        style={{
                            backgroundColor: COLORS.card,
                            borderRadius: 12,
                            padding: 16,
                        }}
                    >
                        <Text style={{ color: COLORS.textDime, fontSize: 12, marginBottom: 8 }}>
                            Current Progress
                        </Text>
                        <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600' }}>
                            {type === 'water' 
                                ? `${getCurrentValue().toFixed(2)} / ${getTargetValue().toFixed(1)} L`
                                : `${formatNumber(getCurrentValue())} / ${formatNumber(getTargetValue())}${type === 'calories' ? ' kcal' : ' tasks'}`
                            }
                        </Text>
                    </View>
                </View>

                {/* Water Tracker for water, TaskTracker for tasks, otherwise text input */}
                {type === 'water' ? (
                    <View style={{ marginBottom: 24 }}>
                        <WaterTracker
                            current={todayTarget.water.current}
                            target={todayTarget.water.target}
                            onAddGlass={addWaterGlass}
                        />
                    </View>
                ) : type === 'tasks' ? (
                    <View style={{ marginBottom: 24 }}>
                        <TaskTracker
                            completed={todayTarget.tasks.completed}
                            total={todayTarget.tasks.total}
                            onIncrement={async () => {
                                if (todayTarget.tasks.completed < todayTarget.tasks.total) {
                                    await updateTasks(todayTarget.tasks.completed + 1, todayTarget.tasks.total);
                                }
                            }}
                            onDecrement={async () => {
                                if (todayTarget.tasks.completed > 0) {
                                    await updateTasks(todayTarget.tasks.completed - 1, todayTarget.tasks.total);
                                }
                            }}
                        />
                    </View>
                ) : (
                    <>
                        {/* Value Input for calories */}
                        <View style={{ marginBottom: 24 }}>
                            <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                                Calories
                            </Text>
                            <TextInput
                                value={value}
                                onChangeText={setValue}
                                placeholder={getPlaceholder()}
                                placeholderTextColor={COLORS.textDime}
                                keyboardType="numeric"
                                style={{
                                    backgroundColor: COLORS.card,
                                    borderRadius: 12,
                                    padding: 14,
                                    color: COLORS.text,
                                    fontSize: 16,
                                }}
                            />
                        </View>

                        {/* Save Button */}
                        <Pressable
                            onPress={handleSave}
                            disabled={isLoading}
                            style={{
                                backgroundColor: COLORS.accentBlue,
                                borderRadius: 12,
                                padding: 16,
                                alignItems: 'center',
                                opacity: isLoading ? 0.6 : 1,
                            }}
                        >
                            <Text style={{ color: COLORS.buttonText, fontSize: 16, fontWeight: '600' }}>
                                {isLoading ? 'Updating...' : 'Update'}
                            </Text>
                        </Pressable>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

