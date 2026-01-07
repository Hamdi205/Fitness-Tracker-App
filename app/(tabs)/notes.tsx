import { useAppStore } from '@/store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
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
 * NotesScreen
 * ---
 * This is the notes screen of the app
 *
 * Its like view in MVC
 */

// Category configuration
const CATEGORIES = [
    { name: 'Fitness', icon: 'barbell-outline' as const },
    { name: 'Meal Plans', icon: 'restaurant-outline' as const },
    { name: 'Ideas', icon: 'bulb-outline' as const },
    { name: 'Shopping', icon: 'cart-outline' as const },
    { name: 'Research', icon: 'search-outline' as const },
    { name: 'Other', icon: 'folder-outline' as const },
];

export default function NotesScreen() {
    const { loadData, notes } = useAppStore();

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Get quick notes (first 3 notes)
    const quickNotes = useMemo(() => {
        return notes.slice(0, 3);
    }, [notes]);

    // Get all notes sorted by updatedAt (most recent first)
    const allNotes = useMemo(() => {
        return [...notes].sort((a, b) => {
            const dateA = new Date(a.updatedAt).getTime();
            const dateB = new Date(b.updatedAt).getTime();
            return dateB - dateA;
        });
    }, [notes]);

    // Get recent notes (last 5 notes by updatedAt)
    const recentNotes = useMemo(() => {
        return [...notes]
            .sort((a, b) => {
                const dateA = new Date(a.updatedAt).getTime();
                const dateB = new Date(b.updatedAt).getTime();
                return dateB - dateA;
            })
            .slice(0, 5);
    }, [notes]);

    // Calculate notes count per category
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        CATEGORIES.forEach(cat => {
            counts[cat.name] = 0;
        });
        notes.forEach(note => {
            if (counts[note.category] !== undefined) {
                counts[note.category]++;
            } else {
                // If category doesn't match any predefined, count as "Other"
                counts['Other'] = (counts['Other'] || 0) + 1;
            }
        });
        return counts;
    }, [notes]);

    // Calculate statistics
    const statistics = useMemo(() => {
        const totalNotes = notes.length;
        
        // Calculate notes created this week
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
        startOfWeek.setHours(0, 0, 0, 0);
        
        const notesThisWeek = notes.filter(note => {
            const noteDate = new Date(note.createdAt);
            return noteDate >= startOfWeek;
        }).length;

        return {
            total: totalNotes,
            thisWeek: notesThisWeek,
        };
    }, [notes]);

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
                <Pressable 
                    onPress={() => router.push('/add-note-modal')}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 14,
                        borderRadius: 12,
                        backgroundColor: COLORS.cardSecondary,
                        marginBottom: 12
                    }}
                >
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

                {quickNotes.length > 0 ? (
                    <View>
                        {quickNotes.map((note) => (
                            <View
                                key={note.id}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 12,
                                    paddingHorizontal: 8,
                                }}
                            >
                                <Ionicons name="document-text-outline" size={18} color={COLORS.textDime}
                                          style={{ marginRight: 12 }} />
                                <Text style={{ color: COLORS.text, fontSize: 14 }}>
                                    {note.title}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={{
                        paddingVertical: 12,
                        paddingHorizontal: 8,
                        opacity: 0.6,
                    }}>
                        <Text style={{ color: COLORS.textDime, fontSize: 14, fontStyle: 'italic' }}>
                            No quick notes yet
                        </Text>
                    </View>
                )}
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

                {allNotes.length > 0 ? (
                    <View>
                        {allNotes.map((note) => (
                            <View
                                key={note.id}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 14,
                                    backgroundColor: COLORS.card,
                                    borderRadius: 12,
                                    marginBottom: 8,
                                }}
                            >
                                <Ionicons name="document-text-outline" size={18} color={COLORS.textDime}
                                          style={{ marginRight: 12 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '500', marginBottom: 4 }}>
                                        {note.title}
                                    </Text>
                                    {note.content && (
                                        <Text 
                                            style={{ color: COLORS.textSecondary, fontSize: 12 }}
                                            numberOfLines={2}
                                        >
                                            {note.content}
                                        </Text>
                                    )}
                                    <Text style={{ color: COLORS.textDime, fontSize: 10, marginTop: 4 }}>
                                        {note.category} • {new Date(note.updatedAt).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
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
                )}
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
                    {CATEGORIES.map((category, index) => {
                        const count = categoryCounts[category.name] || 0;
                        return (
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
                                    opacity: count > 0 ? 1 : 0.6,
                                }}
                            >
                                <Ionicons name={category.icon} size={16} color={COLORS.textDime} style={{ marginRight: 8 }} />
                                <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '500', marginRight: 8 }}>
                                    {category.name}
                                </Text>
                                <Text style={{ color: COLORS.textDime, fontSize: 12 }}>
                                    ({count})
                                </Text>
                            </Pressable>
                        );
                    })}
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

                {recentNotes.length > 0 ? (
                    <View>
                        {recentNotes.map((note) => (
                            <View
                                key={note.id}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 14,
                                    backgroundColor: COLORS.card,
                                    borderRadius: 12,
                                    marginBottom: 8,
                                }}
                            >
                                <Ionicons name="document-text-outline" size={18} color={COLORS.textDime}
                                          style={{ marginRight: 12 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '500' }}>
                                        {note.title}
                                    </Text>
                                    <Text style={{ color: COLORS.textDime, fontSize: 11, marginTop: 4 }}>
                                        {new Date(note.updatedAt).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
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
                )}
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
                            {statistics.total}
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
                            {statistics.thisWeek}
                        </Text>
                    </View>
                </View>
            </View>

            </ScrollView>
        </SafeAreaView>
    );
}
