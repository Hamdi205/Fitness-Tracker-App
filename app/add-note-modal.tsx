import { useAppStore } from '@/store/useAppStore';
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
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title for your note');
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
                    New Note
                </Text>

                <View style={{ width: 44 }} />
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
                                    backgroundColor: category === cat ? COLORS.button : COLORS.chip,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: category === cat ? COLORS.button : COLORS.chipBorder,
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
                        backgroundColor: COLORS.button,
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

