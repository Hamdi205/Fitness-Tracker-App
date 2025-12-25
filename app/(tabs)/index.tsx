import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


/**
 * DashboardScreen
 * ---
 * This is the main landing screen of the app
 *
 * Its like view in MVC
 */

export default function DashboardScreen() {
    return (
        <SafeAreaView style={{flex: 1, padding: 16, backgroundColor: '#0E0E10'}}>

            {/* === Header Section === */}
            <View style={{marginBottom: 24}}>
                <Text style={{ fontSize: 24, fontWeight: '600', color: '#FFFFFF' }}>
                    Dashboard
                </Text>
                <Text style={{color: '#AAAAAA', marginTop: 4}}>
                    Welcome back
                </Text>
            </View>

            {/* === Stats Row === */}
            <View style={{flexDirection: 'row', gap: 12, marginBottom: 24}}>

                {/* Stat Card */}
                <View
                    style={{
                        flex: 1,
                        padding: 16,
                        backgroundColor: '#1A1A1E',
                        borderRadius: 12,
                    }}
                >
                    <Text style={{color: '#AAAAAA', fontSize: 14}}>
                        Workouts
                    </Text>
                    <Text style={{color: '#FFFFFF', fontSize: 20, fontWeight: '600'}}>
                        0
                    </Text>
                </View>

                {/* Stat Card */}
                <View
                    style={{
                        flex: 1,
                        padding: 16,
                        backgroundColor: '#1A1A1E',
                        borderRadius: 12,
                    }}
                >
                    <Text style={{color: '#AAAAAA', fontSize: 14}}>
                        Notes
                    </Text>
                    <Text style={{color: '#FFFFFF', fontSize: 20, fontWeight: '600'}}>
                        0
                    </Text>
                </View>

            </View>

            {/* === Today Section === */}
            <View>
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: 18,
                        fontWeight: '600',
                        marginBottom: 12,
                    }}
                >
                    Today
                </Text>

                <View
                    style={{
                        height: 120,
                        backgroundColor: '#1A1A1E',
                        borderRadius: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{color: '#777777'}}>
                        Content coming soon
                    </Text>
                </View>
            </View>


        </SafeAreaView>
    );
}
