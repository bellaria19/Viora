export type ThemeType = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: ThemeType;
  systemTheme: 'light' | 'dark';
  currentTheme: 'light' | 'dark';
  setTheme: (theme: ThemeType) => void;
}
