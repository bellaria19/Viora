import { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { ThemeType, ThemeContextType } from '@/types/theme';

const THEME_STORAGE_KEY = 'user_theme_preference';

// 기본 값으로 Context 생성
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  systemTheme: 'light',
  currentTheme: 'light',
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('system');
  const systemTheme = useColorScheme() || 'light';

  // AsyncStorage에서 저장된 테마 설정 불러오기
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('테마 설정을 불러오는 중 오류 발생:', error);
      }
    };

    loadTheme();
  }, []);

  // 테마 변경 함수
  const setTheme = useCallback(async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('테마 설정을 저장하는 중 오류 발생:', error);
    }
  }, []);

  // 현재 적용할 테마 계산 (system인 경우 시스템 테마 사용)
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const contextValue: ThemeContextType = {
    theme,
    systemTheme,
    currentTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
