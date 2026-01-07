import { useDailyTargets } from '@/hooks/useDailyTargets';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

export default function AddTaskModal() {
    const { todayTarget, updateTasks } = useDailyTargets();
    const [taskTitle, setTaskTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!taskTitle.trim()) {
            Alert.alert('Error', 'Please enter a task title');
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
                    New Task
                </Text>

                <View style={{ width: 44 }} />
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
                        backgroundColor: COLORS.button,
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

