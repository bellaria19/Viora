import { Tabs } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '최근 파일',
          tabBarIcon: ({ color, size }) => <FontAwesome6 name="clock-rotate-left" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: '모든 파일',
          tabBarIcon: ({ color, size }) => <FontAwesome6 name="folder" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color, size }) => <FontAwesome6 name="gear" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
