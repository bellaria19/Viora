import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/hooks/useTheme';

export function ThemedStatusBar() {
  const { currentTheme } = useTheme();
  return <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />;
}
