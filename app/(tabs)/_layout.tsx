import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof FontAwesome.glyphMap = 'file-o';

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'files') {
            iconName = focused ? 'folder' : 'folder-o';
          } else if (route.name === 'settings') {
            iconName = focused ? 'cog' : 'cog';
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '최근 파일',
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: '모든 파일',
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          headerTitleAlign: 'center',
        }}
      />
    </Tabs>
  );
}
