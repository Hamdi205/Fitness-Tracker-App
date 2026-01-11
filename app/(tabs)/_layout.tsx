import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

/**
 * TabsLayout
 * ----
 * Defines the bottom tab navigation for the app
 * 
 * Mental model:
 * - This file acts as the "navigation contller" for everything inside the (tabs) folder
 * - Each Tabs.Screen maps directly to a file in this folder
 * 
 * Example:
 * - name="fitness" -> fitness.tsx
 * - name="index" -> index.tsx (Dashboard)
 */

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                /**
                 * Hides the header at the top of each screen
                 * We do this because:
                 * - We want full controll over UI
                 * - We will design custom header later
                 */
                headerShown: false,

                /**
                 * Styles the bottom tab bar itself
                 * This is purely UI configiration
                 */
                tabBarStyle: {
                    backgroundColor: '#0E0E10',
                    borderTopColor: '#1A1A1E'
                },

                /**
                 * Active / inactive colors for tab icons & labels 
                 */
                tabBarActiveTintColor: '#E85C5C',
                tabBarInactiveTintColor: '#888'
            }}
        >
            {/* --- Dashboard Tab --- */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />

            {/* --- Fitness Tab --- */}
            <Tabs.Screen
                name="fitness"
                options={{
                    title: 'Fitness',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="barbell-outline" size={size} color={color} />
                    ),
                }}
            />

            {/* --- Notes Tab --- */}
            <Tabs.Screen
                name="notes"
                options={{
                    title: 'Notes',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="document-text-outline" size={size} color={color} />
                    ),
                }}
            />

            {/* --- Goals Tab --- */}
            <Tabs.Screen
                name="goals"
                options={{
                    title: 'Goals',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="flag-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
