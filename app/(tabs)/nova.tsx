import { COLORS } from '@/constants/colors';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Nova — AI assistant chatroom (placeholder).
 * Build this screen yourself when ready.
 */
export default function NovaScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                <Text style={{ color: COLORS.textDime, fontSize: 16, textAlign: 'center' }}>
                    AI assistant chatroom — coming soon.
                </Text>
            </View>
        </SafeAreaView>
    );
}
