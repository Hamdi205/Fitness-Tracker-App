import { CircularProgress } from '@/components/common/CircularProgress';
import { Divider } from '@/components/common/Divider';
import { TopBar } from '@/components/common/TopBar';
import { COLORS } from '@/constants/colors';
import { calculatePercentage } from '@/utils/calculations';
import { useAppStore } from '@/store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * GoalsScreen
 * ---
 * This is the goals tracking screen of the app
 *
 * Its like view in MVC
 */

// Category configuration
const GOAL_CATEGORIES = [
    { category: 'fitness' as const, icon: 'barbell-outline' as const, title: 'Fitness Goals', color: '#E85C5C' },
    { category: 'health' as const, icon: 'heart-outline' as const, title: 'Health Goals', color: '#4A90E2' },
    { category: 'personal' as const, icon: 'person-outline' as const, title: 'Personal Goals', color: '#4A90E2' },
    { category: 'achievement' as const, icon: 'trophy-outline' as const, title: 'Achievement Goals', color: '#E85C5C' },
];

export default function GoalsScreen() {
    const { loadData, goals } = useAppStore();

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Ensure goals is always an array
    const goalsArray = goals || [];

    // Get active goals (not completed)
    const activeGoals = useMemo(() => {
        return goalsArray.filter(g => !g.completed);
    }, [goalsArray]);

    // Calculate goals per category
    const goalsByCategory = useMemo(() => {
        const categoryData: Record<string, { total: number; active: number; completed: number }> = {};
        
        GOAL_CATEGORIES.forEach(cat => {
            categoryData[cat.category] = { total: 0, active: 0, completed: 0 };
        });

        goalsArray.forEach(goal => {
            const cat = categoryData[goal.category] || categoryData['achievement'];
            cat.total++;
            if (goal.completed) {
                cat.completed++;
            } else {
                cat.active++;
            }
        });

        return categoryData;
    }, [goalsArray]);

    // Get active goals count per category for overview
    const activeGoalsByCategory = useMemo(() => {
        const counts: Record<string, number> = {};
        GOAL_CATEGORIES.forEach(cat => {
            counts[cat.category] = goalsArray.filter(g => !g.completed && g.category === cat.category).length;
        });
        return counts;
    }, [goalsArray]);

    // Get recent achievements (completed goals, sorted by completion date)
    const recentAchievements = useMemo(() => {
        // Since we don't have a completedAt field, we'll use createdAt and assume completed goals are recent
        // In a real app, you'd want to track when goals were completed
        return [...goalsArray]
            .filter(g => g.completed)
            .sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
            })
            .slice(0, 5);
    }, [goalsArray]);

    // Calculate statistics
    const statistics = useMemo(() => {
        const totalGoals = goalsArray.length;
        const completedGoals = goalsArray.filter(g => g.completed).length;
        return {
            total: totalGoals,
            completed: completedGoals,
        };
    }, [goalsArray]);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.bg}}>
            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            >

            {/* === Top Bar === */}
            <TopBar title="Goals" />

            {/* Subtle divider */}
            <Divider />

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
                    {GOAL_CATEGORIES.slice(0, 3).map((cat) => {
                        const activeCount = activeGoalsByCategory[cat.category] || 0;
                        const totalCount = goalsByCategory[cat.category]?.total || 0;
                        const percentage = Math.round(calculatePercentage(activeCount, totalCount));
                        
                        return (
                            <CircularProgress
                                key={cat.category}
                                percentage={percentage}
                                size={80}
                                strokeWidth={8}
                                color={cat.color}
                                label={cat.title.split(' ')[0]} // Just "Fitness", "Health", "Personal"
                                value={`${activeCount}/${totalCount}`}
                                subtitle="Goals"
                            />
                        );
                    })}
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
                    {GOAL_CATEGORIES.map((category, index) => {
                        const count = goalsByCategory[category.category]?.active || 0;
                        const hasGoals = count > 0;
                        
                        return (
                            <Pressable
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 16,
                                    backgroundColor: COLORS.card,
                                    borderRadius: 12,
                                    opacity: hasGoals ? 1 : 0.6,
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
                                    <Ionicons name={category.icon} size={20} color={category.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600' }}>
                                        {category.title}
                                    </Text>
                                    <Text style={{ color: COLORS.textDime, fontSize: 12, marginTop: 2 }}>
                                        {count} active goal{count !== 1 ? 's' : ''}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward-outline" size={20} color={COLORS.textDime} />
                            </Pressable>
                        );
                    })}
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

                {recentAchievements.length > 0 ? (
                    <View>
                        {recentAchievements.map((goal) => (
                            <View
                                key={goal.id}
                                style={{
                                    padding: 16,
                                    backgroundColor: COLORS.card,
                                    borderRadius: 12,
                                    marginBottom: 8,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <Ionicons name="trophy" size={20} color={COLORS.accent} style={{ marginRight: 12 }} />
                                    <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '600', flex: 1 }}>
                                        {goal.title}
                                    </Text>
                                </View>
                                {goal.description && (
                                    <Text style={{ color: COLORS.textDime, fontSize: 12, marginBottom: 4 }}>
                                        {goal.description}
                                    </Text>
                                )}
                                <Text style={{ color: COLORS.textSecondary, fontSize: 11 }}>
                                    {new Date(goal.createdAt).toLocaleDateString()}
                                </Text>
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
                        <Ionicons name="trophy-outline" size={48} color={COLORS.textDime} style={{ marginBottom: 12 }} />
                        <Text style={{ color: COLORS.textDime, fontSize: 14, fontStyle: 'italic', textAlign: 'center' }}>
                            No achievements yet. Start working towards your goals!
                        </Text>
                    </View>
                )}
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
                            Completed
                        </Text>
                        <Text style={{ color: COLORS.text, fontSize: 24, fontWeight: '700' }}>
                            {statistics.completed}
                        </Text>
                    </View>
                </View>
            </View>

            </ScrollView>
        </SafeAreaView>
    );
}
