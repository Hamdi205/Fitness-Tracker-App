import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface TaskTrackerProps {
    completed: number;
    total: number;
    onIncrement: () => void;
    onDecrement: () => void;
}

/**
 * TaskTracker Component
 * ---
 * Displays task progress with +/- buttons for easy interaction
 * Similar UX to WaterTracker but for tasks
 */
export function TaskTracker({ 
    completed, 
    total, 
    onIncrement,
    onDecrement 
}: TaskTrackerProps) {
    const percentage = total > 0 ? Math.min((completed / total) * 100, 100) : 0;
    const canIncrement = completed < total;
    const canDecrement = completed > 0;

    return (
        <View style={{ marginBottom: 24 }}>
            {/* Progress display */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <Text style={{ color: COLORS.text, fontSize: 32, fontWeight: '700', marginBottom: 4 }}>
                    {completed} / {total}
                </Text>
                <Text style={{ color: COLORS.textDime, fontSize: 14 }}>
                    Tasks Completed
                </Text>
            </View>

            {/* Control buttons */}
            <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'center',
                alignItems: 'center',
                gap: 20,
                marginBottom: 24,
            }}>
                {/* Decrement button */}
                <Pressable
                    onPress={onDecrement}
                    disabled={!canDecrement}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: canDecrement ? COLORS.card : COLORS.chip,
                        borderWidth: 2,
                        borderColor: canDecrement ? COLORS.accent : COLORS.chipBorder,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: canDecrement ? 1 : 0.5,
                    }}
                >
                    <Ionicons 
                        name="remove" 
                        size={28} 
                        color={canDecrement ? COLORS.accent : COLORS.textDime} 
                    />
                </Pressable>

                {/* Task count display */}
                <View style={{
                    minWidth: 80,
                    alignItems: 'center',
                    paddingHorizontal: 20,
                }}>
                    <Text style={{ 
                        color: COLORS.text, 
                        fontSize: 24, 
                        fontWeight: '700' 
                    }}>
                        {completed}
                    </Text>
                </View>

                {/* Increment button */}
                <Pressable
                    onPress={onIncrement}
                    disabled={!canIncrement}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: canIncrement ? COLORS.accentBlue : COLORS.chip,
                        borderWidth: 2,
                        borderColor: canIncrement ? COLORS.accentBlue : COLORS.chipBorder,
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: canIncrement ? 1 : 0.5,
                    }}
                >
                    <Ionicons 
                        name="add" 
                        size={28} 
                        color={canIncrement ? COLORS.buttonText : COLORS.textDime} 
                    />
                </Pressable>
            </View>

            {/* Progress bar */}
            <View style={{
                height: 8,
                backgroundColor: COLORS.chip,
                borderRadius: 4,
                overflow: 'hidden',
            }}>
                <View style={{
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: COLORS.accentBlue,
                    borderRadius: 4,
                }} />
            </View>

            {/* Task indicators */}
            {total > 0 && (
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 16,
                }}>
                    {Array.from({ length: total }).map((_, index) => {
                        const isCompleted = index < completed;
                        return (
                            <View
                                key={index}
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: isCompleted ? COLORS.accentBlue : COLORS.chip,
                                    borderWidth: 1,
                                    borderColor: isCompleted ? COLORS.accentBlue : COLORS.chipBorder,
                                }}
                            />
                        );
                    })}
                </View>
            )}
        </View>
    );
}

