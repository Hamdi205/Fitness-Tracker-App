import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

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
 * NotesScreen
 * ---
 * This is the notes screen of the app
 *
 * Its like view in MVC
 */

export default function NotesScreen() {
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
                    height: 64,
                    marginTop: 4,
                    backgroundColor: COLORS.topBar,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 14,
                    position: 'relative',
                    
                }}>
                {/* space for profil pic */}
                <Pressable 
                    onPress={() => router.push('/profile')}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    style={{ width: 64, height: 64, justifyContent: 'center', alignItems: 'center' }}
                >
                    <View style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: '#4A90E2',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Ionicons name="person" size={24} color={COLORS.text} />
                    </View>
                </Pressable>

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
                        Notes
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

            {/* === Create New Note === */}
            <View style={{ marginBottom: 24 }}>
                <Pressable style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor: COLORS.cardSecondary,
                    marginBottom: 12
                }}>
                    <Ionicons name="add-circle-outline" size={20} color={COLORS.textDime} style={{ marginRight: 8 }} />
                    <Text style={{ color: COLORS.textDime, fontSize: 16 }}>
                        + New note ...
                    </Text>
                </Pressable>
            </View>

            {/* === Quick Notes Section === */}
            <View style={{ marginBottom: 24 }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: COLORS.text,
                    marginBottom: 12
                }}>
                    Quick Notes
                </Text>

                <View>
                    {['Example: Weekly meal plan', 'Example: Stretching routine research', 'Example: Order new resistance bands'].map((note, index) => (
                        <Pressable
                            key={index}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 12,
                                paddingHorizontal: 8,
                                opacity: 0.6,
                                marginBottom: 8,
                            }}
                        >
                            <Ionicons name="document-text-outline" size={18} color={COLORS.textDime} style={{ marginRight: 12 }} />
                            <Text style={{ color: COLORS.text, fontSize: 14, fontStyle: 'italic', flex: 1 }}>
                                {note}
                            </Text>
                            <Ionicons name="chevron-forward-outline" size={16} color={COLORS.textDime} />
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* === All Notes Section === */}
            <View style={{ marginBottom: 24 }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: COLORS.text,
                    marginBottom: 12
                }}>
                    All Notes
                </Text>

                <View style={{
                    padding: 20,
                    backgroundColor: COLORS.card,
                    borderRadius: 12,
                    alignItems: 'center',
                    opacity: 0.6,
                }}>
                    <Ionicons name="document-text-outline" size={48} color={COLORS.textDime} style={{ marginBottom: 12 }} />
                    <Text style={{ color: COLORS.textDime, fontSize: 14, fontStyle: 'italic', textAlign: 'center' }}>
                        No notes yet. Create your first note to get started!
                    </Text>
                </View>
            </View>

            {/* === Note Categories === */}
            <View style={{ marginBottom: 24 }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: COLORS.text,
                    marginBottom: 12
                }}>
                    Categories
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    {[
                        { name: 'Fitness', icon: 'barbell-outline', count: 0 },
                        { name: 'Meal Plans', icon: 'restaurant-outline', count: 0 },
                        { name: 'Ideas', icon: 'bulb-outline', count: 0 },
                        { name: 'Shopping', icon: 'cart-outline', count: 0 },
                        { name: 'Research', icon: 'search-outline', count: 0 },
                        { name: 'Other', icon: 'folder-outline', count: 0 },
                    ].map((category, index) => (
                        <Pressable
                            key={index}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 10,
                                paddingHorizontal: 16,
                                backgroundColor: COLORS.chip,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: COLORS.chipBorder,
                                opacity: 0.6,
                            }}
                        >
                            <Ionicons name={category.icon as any} size={16} color={COLORS.textDime} style={{ marginRight: 8 }} />
                            <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '500', marginRight: 8 }}>
                                {category.name}
                            </Text>
                            <Text style={{ color: COLORS.textDime, fontSize: 12 }}>
                                ({category.count})
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* === Recent Notes === */}
            <View style={{ marginBottom: 24 }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: COLORS.text,
                    marginBottom: 12
                }}>
                    Recent Notes
                </Text>

                <View style={{
                    padding: 16,
                    backgroundColor: COLORS.card,
                    borderRadius: 12,
                    opacity: 0.6,
                }}>
                    <Text style={{ color: COLORS.textDime, fontSize: 14, fontStyle: 'italic', textAlign: 'center' }}>
                        No recent notes
                    </Text>
                </View>
            </View>

            {/* === Statistics === */}
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
                            Total Notes
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
                            This Week
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

