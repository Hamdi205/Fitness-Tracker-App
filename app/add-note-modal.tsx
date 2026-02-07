import { SimpleTopBar } from '@/components/common/SimpleTopBar';
import { COLORS } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';
import { validateNoteTitle } from '@/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
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
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient colors={[...GRADIENT_COLORS]} style={{ flex: 1 }}>
                <SimpleTopBar
                    title="New Note"
                    subtitle="Add a quick note"
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
                    {/* Title + Content in one card */}
                    <View style={[SECTION_CARD, { marginBottom: 24 }]}>
                        <View style={{ padding: 20 }}>
                            <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 10 }}>
                                TITLE
                            </Text>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Enter note title"
                                placeholderTextColor={COLORS.textDime}
                                style={{
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
                        </View>
                        <View style={{ height: 1, backgroundColor: COLORS.divider, marginHorizontal: 20 }} />
                        <View style={{ padding: 20 }}>
                            <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 10 }}>
                                CONTENT (OPTIONAL)
                            </Text>
                            <TextInput
                                value={content}
                                onChangeText={setContent}
                                placeholder="Add details, links, or ideas…"
                                placeholderTextColor={COLORS.textDime}
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                style={{
                                    backgroundColor: COLORS.chip,
                                    borderRadius: 14,
                                    padding: 16,
                                    color: COLORS.text,
                                    fontSize: 16,
                                    minHeight: 120,
                                    borderWidth: 1,
                                    borderColor: COLORS.chipBorder + '99',
                                }}
                            />
                        </View>
                    </View>

                    {/* Category */}
                    <View style={{ marginBottom: 28 }}>
                        <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 12 }}>
                            CATEGORY
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                            {CATEGORIES.map((cat) => (
                                <Pressable
                                    key={cat}
                                    onPress={() => setCategory(cat)}
                                    style={({ pressed }) => ({
                                        paddingVertical: 14,
                                        paddingHorizontal: 20,
                                        backgroundColor: category === cat ? COLORS.accentBlue : pressed ? COLORS.chipBorder + '99' : COLORS.chip,
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: category === cat ? COLORS.accentBlue : COLORS.chipBorder + '99',
                                    })}
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
                        style={({ pressed }) => ({
                            ...SECTION_CARD,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            padding: 18,
                            backgroundColor: isLoading ? COLORS.accentBlue + '99' : pressed ? COLORS.accentBlue + 'dd' : COLORS.accentBlue,
                            opacity: isLoading ? 0.9 : 1,
                        })}
                    >
                        <Ionicons name="checkmark-circle" size={22} color={COLORS.buttonText} />
                        <Text style={{ color: COLORS.buttonText, fontSize: 17, fontWeight: '700' }}>
                            {isLoading ? 'Saving…' : 'Save Note'}
                        </Text>
                    </Pressable>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

