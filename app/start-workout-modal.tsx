import { SimpleTopBar } from '@/components/common/SimpleTopBar';
import { COLORS } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, Text, TextInput, View } from 'react-native';
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

function getDefaultSessionName() {
    return `Workout ${new Date().toLocaleDateString()}`;
}

export default function StartWorkoutModal() {
    const { startWorkoutSession } = useAppStore();
    const [sessionTitle, setSessionTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleStart = async () => {
        const name = sessionTitle.trim() || getDefaultSessionName();
        setIsLoading(true);
        try {
            const workoutId = await startWorkoutSession(name);
            router.replace(`/workout-session?workoutId=${workoutId}`);
        } catch (error) {
            Alert.alert('Error', 'Kunne ikke starte økten. Prøv igjen.');
            console.error('Error starting workout:', error);
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient colors={[...GRADIENT_COLORS]} style={{ flex: 1 }}>
                <SimpleTopBar
                    title="Ny økt"
                    subtitle="Gi økten et navn"
                    showProfile={false}
                    showBack
                    onBackPress={() => router.back()}
                />

                <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ color: COLORS.textDime, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 8 }}>
                            SESSION TITTEL
                        </Text>
                        <View style={SECTION_CARD}>
                            <View style={{ padding: 20 }}>
                                <TextInput
                                    value={sessionTitle}
                                    onChangeText={setSessionTitle}
                                    placeholder="f.eks. Leg day, Morgenløp"
                                    placeholderTextColor={COLORS.textDime}
                                    autoFocus
                                    style={{
                                        backgroundColor: COLORS.chip,
                                        borderRadius: 14,
                                        padding: 16,
                                        color: COLORS.text,
                                        fontSize: 18,
                                        fontWeight: '600',
                                        borderWidth: 1,
                                        borderColor: COLORS.chipBorder + '99',
                                    }}
                                />
                                <Text style={{ color: COLORS.textDime, fontSize: 13, marginTop: 10 }}>
                                    Tom = bruk standardnavn ({getDefaultSessionName()})
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Pressable
                        onPress={handleStart}
                        disabled={isLoading}
                        style={({ pressed }) => ({
                            ...SECTION_CARD,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            padding: 18,
                            backgroundColor: isLoading ? COLORS.accent + '99' : pressed ? COLORS.accent + 'dd' : COLORS.accent,
                            opacity: isLoading ? 0.9 : 1,
                        })}
                    >
                        <Ionicons name="play" size={22} color={COLORS.text} />
                        <Text style={{ color: COLORS.text, fontSize: 17, fontWeight: '700' }}>
                            {isLoading ? 'Starter…' : 'Start økt'}
                        </Text>
                    </Pressable>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}
