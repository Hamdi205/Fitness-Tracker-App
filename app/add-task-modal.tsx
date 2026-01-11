import { TopBar } from '@/components/common/TopBar';
import { COLORS } from '@/constants/colors';
import { validateRequired } from '@/utils/validation';
import { useDailyTargets } from '@/hooks/useDailyTargets';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTaskModal() {
    const { todayTarget, updateTasks } = useDailyTargets();
    const [taskTitle, setTaskTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        const validation = validateRequired(taskTitle, 'Task title');
        if (!validation.valid) {
            Alert.alert('Error', validation.error || 'Please enter a task title');
            return;
        }

        setIsLoading(true);
        try {
            // Add a new task (increment total)
            const newTotal = todayTarget.tasks.total + 1;
            await updateTasks(todayTarget.tasks.completed, newTotal);
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to add task. Please try again.');
            console.error('Error adding task:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
            {/* Header */}
            <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                <TopBar 
                    title="New Task" 
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
                {/* Task Title Input */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                        Task Title
                    </Text>
                    <TextInput
                        value={taskTitle}
                        onChangeText={setTaskTitle}
                        placeholder="Enter task title"
                        placeholderTextColor={COLORS.textDime}
                        style={{
                            backgroundColor: COLORS.card,
                            borderRadius: 12,
                            padding: 14,
                            color: COLORS.text,
                            fontSize: 16,
                        }}
                    />
                </View>

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
                            {todayTarget.tasks.completed} of {todayTarget.tasks.total} tasks completed
                        </Text>
                    </View>
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
                        {isLoading ? 'Adding...' : 'Add Task'}
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

