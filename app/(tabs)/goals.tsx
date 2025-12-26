import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
    bg: '#0E0E10',
    topBar: '#151517', // slithly different shade the the bg
    divider: '#212124', // hairline separator 
    chip: '#2E2E33',
    chipBorder: '#3A3A40',
    text: '#FFFFFF',
    textDime: '#AAAAAA',
    card: '#1A1A1E',
    cardSecondary: '#2A2A2A',
    textSecondary: '#777777'
}

/**
 * GoalsScreen
 * ---
 * This is the goals tracking screen of the app
 *
 * Its like view in MVC
 */

// Circular Progress Component
function CircularProgress({ 
    percentage, 
    size = 80, 
    strokeWidth = 8, 
    color = '#4A90E2',
    label,
    value,
    subtitle 
}: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label: string;
    value: string;
    subtitle?: string;
}) {
    return (
        <View style={{ alignItems: 'center', marginHorizontal: 8 }}>
            <View style={{ position: 'relative', width: size, height: size }}>
                {/* Background circle */}
                <View
                    style={{
                        position: 'absolute',
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: '#2A2A2E',
                    }}
                />
                {/* Progress circle - simplified version using border segments */}
                <View
                    style={{
                        position: 'absolute',
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderTopColor: percentage > 0 ? color : 'transparent',
                        borderRightColor: percentage > 25 ? color : 'transparent',
                        borderBottomColor: percentage > 50 ? color : 'transparent',
                        borderLeftColor: percentage > 75 ? color : 'transparent',
                        transform: [{ rotate: '-90deg' }],
                    }}
                />
                {/* Center content */}
                <View
                    style={{
                        position: 'absolute',
                        width: size,
                        height: size,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '600' }}>
                        {value}
                    </Text>
                    {subtitle && (
                        <Text style={{ color: COLORS.textDime, fontSize: 10, marginTop: 2 }}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
            <Text style={{ color: COLORS.text, fontSize: 12, fontWeight: '500', marginTop: 8 }}>
                {label}
            </Text>
        </View>
    );
}

export default function GoalsScreen() {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.bg}}>
            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            >

            {/* === Top Bar === */}
            <View
                style={{
                    height: 48,
                    marginTop: 4,
                    backgroundColor: COLORS.topBar,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 14,
                    position: 'relative',
                    
                }}>
                {/* space for profil pic */}
                <View style={{ width: 48, justifyContent: 'center' }}>
                    <View style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: '#4A90E2',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Ionicons name="person" size={16} color={COLORS.text} />
                    </View>
                </View>

                {/* Centered Page title */}
                    <Text style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: '700',
                        color: COLORS.text
                    }}>
                        Goals
                    </Text>

                {/* Right side icons */}
                <View style={{
                    marginLeft: 'auto',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12
                }}>
                    {/* Notification icon with badge */}
                    <View style={{ position: 'relative' }}>
                        <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
                        <View style={{
                            position: 'absolute',
                            top: -2,
                            right: -2,
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#E85C5C',
                        }} />
                    </View>
                    
                    {/* Settings icon */}
                    <Ionicons name="settings-outline" size={24} color={COLORS.text} />
                </View>
            </View>

            {/* Subtle divider */}
            <View style={{
                height: 1,
                backgroundColor: COLORS.divider,
                marginTop: 8,
                marginBottom: 24
            }} />

            {/* === Active Goals Overview === */}
            <View style={{ marginBottom: 24 }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: COLORS.text,
                    marginBottom: 16
                }}>
                    Active Goals
                </Text>

                {/* Circular Progress Indicators */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
                    <CircularProgress
                        percentage={0}
                        size={80}
                        strokeWidth={8}
                        color="#4A90E2"
                        label="Fitness"
                        value="0/3"
                        subtitle="Goals"
                    />
                    <CircularProgress
                        percentage={0}
                        size={80}
                        strokeWidth={8}
                        color="#E85C5C"
                        label="Health"
                        value="0/2"
                        subtitle="Goals"
                    />
                    <CircularProgress
                        percentage={0}
                        size={80}
                        strokeWidth={8}
                        color="#4A90E2"
                        label="Personal"
                        value="0/1"
                        subtitle="Goals"
                    />
                </View>
            </View>

            {/* === Create New Goal === */}
            <View style={{ marginBottom: 24 }}>
                <Pressable style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 16,
                    backgroundColor: COLORS.card,
                    borderRadius: 12,
                    marginBottom: 16,
                }}>
                    <Ionicons name="add-circle-outline" size={24} color={COLORS.textDime} style={{ marginRight: 12 }} />
                    <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: '600' }}>
                        + Create New Goal
                    </Text>
                </Pressable>
            </View>

            {/* === Goal Categories === */}
            <View style={{ marginBottom: 24 }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: COLORS.text,
                    marginBottom: 12
                }}>
                    Goal Categories
                </Text>

                <View style={{ gap: 12 }}>
                    {[
                        { icon: 'barbell-outline', title: 'Fitness Goals', count: 0, color: '#E85C5C' },
                        { icon: 'heart-outline', title: 'Health Goals', count: 0, color: '#4A90E2' },
                        { icon: 'person-outline', title: 'Personal Goals', count: 0, color: '#4A90E2' },
                        { icon: 'trophy-outline', title: 'Achievement Goals', count: 0, color: '#E85C5C' },
                    ].map((category, index) => (
                        <Pressable
                            key={index}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 16,
                                backgroundColor: COLORS.card,
                                borderRadius: 12,
                                opacity: 0.6,
                            }}
                        >
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: category.color + '20',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                            }}>
                                <Ionicons name={category.icon as any} size={20} color={category.color} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600' }}>
                                    {category.title}
                                </Text>
                                <Text style={{ color: COLORS.textDime, fontSize: 12, marginTop: 2 }}>
                                    {category.count} active goals
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward-outline" size={20} color={COLORS.textDime} />
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* === Recent Achievements === */}
            <View style={{ marginBottom: 24 }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: COLORS.text,
                    marginBottom: 12
                }}>
                    Recent Achievements
                </Text>

                <View style={{
                    padding: 20,
                    backgroundColor: COLORS.card,
                    borderRadius: 12,
                    alignItems: 'center',
                    opacity: 0.6,
                }}>
                    <Ionicons name="trophy-outline" size={48} color={COLORS.textDime} style={{ marginBottom: 12 }} />
                    <Text style={{ color: COLORS.textDime, fontSize: 14, fontStyle: 'italic', textAlign: 'center' }}>
                        No achievements yet. Start working towards your goals!
                    </Text>
                </View>
            </View>

            {/* === Goal Statistics === */}
            <View style={{ marginBottom: 24 }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: COLORS.text,
                    marginBottom: 12
                }}>
                    Statistics
                </Text>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <View style={{
                        flex: 1,
                        padding: 16,
                        backgroundColor: COLORS.card,
                        borderRadius: 12,
                        marginRight: 8,
                        alignItems: 'center',
                    }}>
                        <Text style={{ color: COLORS.textDime, fontSize: 12, marginBottom: 4 }}>
                            Total Goals
                        </Text>
                        <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: '700' }}>
                            0
                        </Text>
                    </View>

                    <View style={{
                        flex: 1,
                        padding: 16,
                        backgroundColor: COLORS.card,
                        borderRadius: 12,
                        marginLeft: 8,
                        alignItems: 'center',
                    }}>
                        <Text style={{ color: COLORS.textDime, fontSize: 12, marginBottom: 4 }}>
                            Completed
                        </Text>
                        <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: '700' }}>
                            0
                        </Text>
                    </View>
                </View>
            </View>

            </ScrollView>
        </SafeAreaView>
    );
}

