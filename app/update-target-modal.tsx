import { useDailyTargets } from '@/hooks/useDailyTargets';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
    bg: '#0E0E10',
    topBar: '#151517',
    divider: '#212124',
    chip: '#2E2E33',
    chipBorder: '#3A3A40',
    text: '#FFFFFF',
    textDime: '#AAAAAA',
    card: '#1A1A1E',
    cardSecondary: '#2A2A2A',
    textSecondary: '#777777',
    button: '#4A90E2',
    buttonText: '#FFFFFF',
};

export default function UpdateTargetModal() {
    const { type } = useLocalSearchParams<{ type: 'water' | 'calories' | 'tasks' }>();
    const { todayTarget, updateWater, updateCalories, updateTasks } = useDailyTargets();
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
                return `Current: ${todayTarget.water.current} cups`;
            case 'calories':
                return `Current: ${todayTarget.calories.current.toLocaleString()} kcal`;
            case 'tasks':
                return `Completed: ${todayTarget.tasks.completed} tasks`;
            default:
                return 'Enter value';
        }
    };

    const handleSave = async () => {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
            Alert.alert('Error', 'Please enter a valid number');
            return;
        }

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
            <View
                style={{
                    height: 64,
                    marginTop: 4,
                    backgroundColor: COLORS.topBar,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 14,
                    marginHorizontal: 16,
                    marginBottom: 16,
                }}
            >
                <Pressable
                    onPress={() => router.back()}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Ionicons name="close" size={24} color={COLORS.text} />
                </Pressable>

                <Text
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: '700',
                        color: COLORS.text,
                    }}
                >
                    {getTitle()}
                </Text>

                <View style={{ width: 44 }} />
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
                            {getCurrentValue().toLocaleString()} / {getTargetValue().toLocaleString()}
                            {type === 'water' && ' cups'}
                            {type === 'calories' && ' kcal'}
                            {type === 'tasks' && ' tasks'}
                        </Text>
                    </View>
                </View>

                {/* Value Input */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                        {type === 'water' && 'Cups of Water'}
                        {type === 'calories' && 'Calories'}
                        {type === 'tasks' && 'Completed Tasks'}
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
                        backgroundColor: COLORS.button,
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
            </ScrollView>
        </SafeAreaView>
    );
}

