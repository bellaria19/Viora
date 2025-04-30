import { useFonts } from 'expo-font';
import { initializeFileSystem } from '@/utils/fileManager';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider as NavigationThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ViewerSettingsProvider } from '@/contexts/ViewerSettingsContext';
import { useTheme } from '@/hooks/useTheme';
import { ThemedStatusBar } from '@/components/common/ThemedStatusBar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// 네비게이션 테마 적용을 위한 컴포넌트
function NavigationTheme({ children }: { children: React.ReactNode }) {
  const { currentTheme } = useTheme();
  const theme = currentTheme === 'dark' ? DarkTheme : DefaultTheme;

  return <NavigationThemeProvider value={theme}>{children}</NavigationThemeProvider>;
}

export default function RootLayout() {
  useEffect(() => {
    initializeFileSystem();
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ViewerSettingsProvider>
          <NavigationTheme>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="viewer/[id]"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            <ThemedStatusBar />
          </NavigationTheme>
        </ViewerSettingsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
