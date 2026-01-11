import { TopBar } from '@/components/common/TopBar';
import { WaterTracker } from '@/components/common/WaterTracker';
import { COLORS } from '@/constants/colors';
import { useDailyTargets } from '@/hooks/useDailyTargets';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UpdateTargetModal() {
    const { type } = useLocalSearchParams<{ type: 'water' }>();
    const { todayTarget, addWaterGlass, removeWaterGlass } = useDailyTargets();
    if (type !== 'water') {
        router.back();
        return null;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
            {/* Header */}
            <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                <TopBar 
                    title="Update Water" 
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
                            {todayTarget.water.current.toFixed(2)} / {todayTarget.water.target.toFixed(1)} L
                        </Text>
                    </View>
                </View>

                {/* Water Tracker */}
                <View style={{ marginBottom: 24 }}>
                    <WaterTracker
                        current={todayTarget.water.current}
                        target={todayTarget.water.target}
                        onAddGlass={addWaterGlass}
                        onRemoveGlass={removeWaterGlass}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

