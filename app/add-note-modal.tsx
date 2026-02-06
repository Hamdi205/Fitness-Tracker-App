import { TopBar } from '@/components/common/TopBar';
import { COLORS } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';
import { validateNoteTitle } from '@/utils/validation';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = [
    'Fitness',
    'Meal Plans',
    'Ideas',
    'Shopping',
    'Research',
    'Other',
];

export default function AddNoteModal() {
    const { addNote } = useAppStore();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Other');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        const validation = validateNoteTitle(title);
        if (!validation.valid) {
            Alert.alert('Error', validation.error || 'Please enter a title for your note');
            return;
        }

        setIsLoading(true);
        try {
            await addNote({
                title: title.trim(),
                content: content.trim(),
                category,
            });
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to save note. Please try again.');
            console.error('Error saving note:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
            {/* Header */}
            <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                <TopBar 
                    title="New Note" 
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
                {/* Title Input */}
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                        Title
                    </Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter note title"
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

                {/* Content Input */}
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                        Content
                    </Text>
                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        placeholder="Enter note content (optional)"
                        placeholderTextColor={COLORS.textDime}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        style={{
                            backgroundColor: COLORS.card,
                            borderRadius: 12,
                            padding: 14,
                            color: COLORS.text,
                            fontSize: 16,
                            minHeight: 120,
                        }}
                    />
                </View>

                {/* Category Selection */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                        Category
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {CATEGORIES.map((cat) => (
                            <Pressable
                                key={cat}
                                onPress={() => setCategory(cat)}
                                style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 16,
                                    backgroundColor: category === cat ? COLORS.accentBlue : COLORS.chip,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: category === cat ? COLORS.accentBlue : COLORS.chipBorder,
                                }}
                            >
                                <Text
                                    style={{
                                        color: category === cat ? COLORS.buttonText : COLORS.text,
                                        fontSize: 14,
                                        fontWeight: category === cat ? '600' : '500',
                                    }}
                                >
                                    {cat}
                                </Text>
                            </Pressable>
                        ))}
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
                        {isLoading ? 'Saving...' : 'Save Note'}
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

