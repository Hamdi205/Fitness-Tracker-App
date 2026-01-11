import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface WaterTrackerProps {
    current: number; // in liters
    target: number; // in liters (default 2L = 8 glasses)
    onAddGlass: () => void;
    glassSize?: number; // liters per glass (default 0.25L)
}

/**
 * WaterTracker Component
 * ---
 * Displays water intake with a glass-based UI similar to Yazio app
 * Each glass represents 0.25L, and users can tap to add water
 */
export function WaterTracker({ 
    current, 
    target, 
    onAddGlass, 
    glassSize = 0.25 
}: WaterTrackerProps) {
    const totalGlasses = Math.ceil(target / glassSize);
    const filledGlasses = Math.floor(current / glassSize);
    const remainingGlasses = totalGlasses - filledGlasses;
    
    // Calculate how much of the last glass is filled (if partially filled)
    const partialFill = (current % glassSize) / glassSize;
    const hasPartialFill = partialFill > 0 && partialFill < 1;
    
    // Calculate percentage for progress bar
    const progressPercentage = Math.min((current / target) * 100, 100);
    
    return (
        <View style={{ marginBottom: 24 }}>
            {/* Progress display */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ color: COLORS.text, fontSize: 32, fontWeight: '700', marginBottom: 4 }}>
                    {current.toFixed(2)} L
                </Text>
                <Text style={{ color: COLORS.textDime, fontSize: 14 }}>
                    av {target.toFixed(1)} L
                </Text>
            </View>
            
            {/* Glass grid */}
            <View style={{ 
                flexDirection: 'row', 
                flexWrap: 'wrap', 
                justifyContent: 'center',
                gap: 12,
                marginBottom: 20,
                paddingHorizontal: 8,
            }}>
                {/* Filled glasses */}
                {Array.from({ length: filledGlasses }).map((_, index) => (
                    <View
                        key={`filled-${index}`}
                        style={{
                            width: 50,
                            height: 60,
                            backgroundColor: COLORS.accentBlue + '30',
                            borderRadius: 8,
                            borderWidth: 2,
                            borderColor: COLORS.accentBlue,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons name="water" size={24} color={COLORS.accentBlue} />
                    </View>
                ))}
                
                {/* Partially filled glass (if any) */}
                {hasPartialFill && (
                    <Pressable
                        onPress={onAddGlass}
                        style={{
                            width: 50,
                            height: 60,
                            backgroundColor: COLORS.card,
                            borderRadius: 8,
                            borderWidth: 2,
                            borderColor: COLORS.accentBlue,
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: `${partialFill * 100}%`,
                                backgroundColor: COLORS.accentBlue + '30',
                            }}
                        />
                        <Ionicons name="water-outline" size={24} color={COLORS.accentBlue} />
                    </Pressable>
                )}
                
                {/* Empty glasses */}
                {Array.from({ length: Math.max(0, remainingGlasses - (hasPartialFill ? 1 : 0)) }).map((_, index) => (
                    <Pressable
                        key={`empty-${index}`}
                        onPress={onAddGlass}
                        style={{
                            width: 50,
                            height: 60,
                            backgroundColor: COLORS.card,
                            borderRadius: 8,
                            borderWidth: 2,
                            borderColor: COLORS.chipBorder,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {index === 0 && !hasPartialFill ? (
                            // First empty glass has plus icon
                            <Ionicons name="add-circle" size={28} color={COLORS.textDime} />
                        ) : (
                            <Ionicons name="water-outline" size={24} color={COLORS.textDime} />
                        )}
                    </Pressable>
                ))}
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
                    width: `${progressPercentage}%`,
                    backgroundColor: COLORS.accentBlue,
                    borderRadius: 4,
                }} />
            </View>
        </View>
    );
}

