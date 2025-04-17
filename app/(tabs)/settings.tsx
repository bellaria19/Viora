import { View, StyleSheet, Text, Switch, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { useUserPreferences } from '@/contexts/UserPreferences';
import { useTheme, Theme } from '@react-navigation/native';
import SettingsSection from '@/components/settings/SettingsSection';
import SettingsItem from '@/components/settings/SettingsItem';

// settings.tsx에서 임시로 사용할 설정 값
const defaultPreferences = {
  textViewer: {
    fontSize: 16,
    theme: 'light',
    fontFamily: '시스템 기본',
  },
  pdfViewer: {
    defaultZoom: 1.0,
    pageSpacing: 8,
    showPageNumbers: true,
  },
  imageViewer: {
    defaultZoom: 1.0,
    enableDoubleTapZoom: true,
  },
  epubViewer: {
    fontSize: 18,
    theme: 'light',
    fontFamily: '시스템 기본',
  },
};

// 스타일 함수를 컴포넌트 외부로 분리
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      backgroundColor: theme.colors.card,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
    settingLabel: {
      fontSize: 16,
      color: theme.colors.text,
    },
    versionContainer: {
      alignItems: 'center',
      marginVertical: 20,
    },
    versionText: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.6,
    },
  });

export default function SettingsScreen() {
  const { preferences, setDarkMode } = useUserPreferences();
  const theme = useTheme();
  const styles = createStyles(theme);

  const [preferencesState, setPreferencesState] = useState(defaultPreferences);
  const [appVersion, setAppVersion] = useState<string>('알 수 없음');

  // 설정 파일 경로
  const PREFERENCES_FILE = FileSystem.documentDirectory + 'preferences.json';

  // 설정 불러오기 함수
  const loadPreferences = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(PREFERENCES_FILE);
      if (fileInfo.exists) {
        const data = await FileSystem.readAsStringAsync(PREFERENCES_FILE);
        const savedPreferences = JSON.parse(data);
        setPreferencesState(savedPreferences);
      } else {
        // 파일이 없으면 기본값 저장
        await savePreferences(defaultPreferences);
      }
    } catch (error) {
      console.error('설정 불러오기 오류:', error);
    }
  };

  // 설정 저장 함수
  const savePreferences = async (newPreferences: typeof defaultPreferences) => {
    try {
      await FileSystem.writeAsStringAsync(PREFERENCES_FILE, JSON.stringify(newPreferences));
      setPreferencesState(newPreferences);
    } catch (error) {
      console.error('설정 저장 오류:', error);
    }
  };

  // 컴포넌트 마운트 시 설정 불러오기
  useEffect(() => {
    loadPreferences();
  }, []);

  // 텍스트 뷰어 설정 업데이트
  const updateTextViewerPrefs = (updates: Partial<typeof preferencesState.textViewer>) => {
    const newPreferences = {
      ...preferencesState,
      textViewer: {
        ...preferencesState.textViewer,
        ...updates,
      },
    };
    savePreferences(newPreferences);
  };

  // PDF 뷰어 설정 업데이트
  const updatePdfViewerPrefs = (updates: Partial<typeof preferencesState.pdfViewer>) => {
    const newPreferences = {
      ...preferencesState,
      pdfViewer: {
        ...preferencesState.pdfViewer,
        ...updates,
      },
    };
    savePreferences(newPreferences);
  };

  // 이미지 뷰어 설정 업데이트
  const updateImageViewerPrefs = (updates: Partial<typeof preferencesState.imageViewer>) => {
    const newPreferences = {
      ...preferencesState,
      imageViewer: {
        ...preferencesState.imageViewer,
        ...updates,
      },
    };
    savePreferences(newPreferences);
  };

  // EPUB 뷰어 설정 업데이트
  const updateEpubViewerPrefs = (updates: Partial<typeof preferencesState.epubViewer>) => {
    const newPreferences = {
      ...preferencesState,
      epubViewer: {
        ...preferencesState.epubViewer,
        ...updates,
      },
    };
    savePreferences(newPreferences);
  };

  // 설정 초기화
  const resetPreferences = () => {
    savePreferences(defaultPreferences);
  };

  // 텍스트 뷰어 테마 설정
  const handleTextThemeChange = (theme: 'light' | 'dark' | 'sepia') => {
    updateTextViewerPrefs({ theme });
  };

  // PDF 페이지 번호 표시 설정
  const handlePdfShowPageNumbers = (showPageNumbers: boolean) => {
    updatePdfViewerPrefs({ showPageNumbers });
  };

  // 이미지 더블탭 줌 설정
  const handleImageDoubleTapZoom = (enableDoubleTapZoom: boolean) => {
    updateImageViewerPrefs({ enableDoubleTapZoom });
  };

  return (
    <ScrollView style={styles.container}>
      <SettingsSection title="텍스트 뷰어 설정">
        <SettingsItem
          icon="font"
          iconColor="#34C759"
          title="글꼴 크기"
          subtitle={`${preferencesState.textViewer.fontSize}px`}
          onPress={() => {
            /* 글꼴 크기 설정 모달 표시 */
          }}
        />
        <SettingsItem
          icon="paint-brush"
          iconColor="#5856D6"
          title="테마"
          subtitle={
            preferencesState.textViewer.theme === 'light'
              ? '밝은 테마'
              : preferencesState.textViewer.theme === 'dark'
                ? '어두운 테마'
                : '세피아'
          }
          onPress={() => {
            /* 테마 선택 모달 표시 */
          }}
        />
        <SettingsItem
          icon="text-width"
          iconColor="#FF9500"
          title="글꼴"
          subtitle={preferencesState.textViewer.fontFamily}
          onPress={() => {
            /* 글꼴 선택 모달 표시 */
          }}
        />
      </SettingsSection>

      <SettingsSection title="PDF 뷰어 설정">
        <SettingsItem
          icon="search"
          iconColor="#FF3B30"
          title="기본 확대 배율"
          subtitle={`${preferencesState.pdfViewer.defaultZoom}x`}
          onPress={() => {
            /* 확대 배율 설정 모달 표시 */
          }}
        />
        <SettingsItem
          icon="arrows-v"
          iconColor="#AF52DE"
          title="페이지 간격"
          subtitle={`${preferencesState.pdfViewer.pageSpacing}px`}
          onPress={() => {
            /* 페이지 간격 설정 모달 표시 */
          }}
        />
        <SettingsItem
          icon="file-pdf-o"
          iconColor="#FF9500"
          title="페이지 번호 표시"
          right={
            <Switch
              value={preferencesState.pdfViewer.showPageNumbers}
              onValueChange={handlePdfShowPageNumbers}
              trackColor={{ false: '#D1D1D6', true: '#007AFF' }}
            />
          }
        />
      </SettingsSection>

      <SettingsSection title="이미지 뷰어 설정">
        <SettingsItem
          icon="search-plus"
          iconColor="#5856D6"
          title="기본 확대 배율"
          subtitle={`${preferencesState.imageViewer.defaultZoom}x`}
          onPress={() => {
            /* 확대 배율 설정 모달 표시 */
          }}
        />
        <SettingsItem
          icon="hand-o-up"
          iconColor="#34C759"
          title="더블탭 확대 활성화"
          right={
            <Switch
              value={preferencesState.imageViewer.enableDoubleTapZoom}
              onValueChange={handleImageDoubleTapZoom}
              trackColor={{ false: '#D1D1D6', true: '#007AFF' }}
            />
          }
        />
      </SettingsSection>

      <SettingsSection title="EPUB 뷰어 설정">
        <SettingsItem
          icon="font"
          iconColor="#FF3B30"
          title="글꼴 크기"
          subtitle={`${preferencesState.epubViewer.fontSize}px`}
          onPress={() => {
            /* 글꼴 크기 설정 모달 표시 */
          }}
        />
        <SettingsItem
          icon="paint-brush"
          iconColor="#FF9500"
          title="테마"
          subtitle={
            preferencesState.epubViewer.theme === 'light'
              ? '밝은 테마'
              : preferencesState.epubViewer.theme === 'dark'
                ? '어두운 테마'
                : '세피아'
          }
          onPress={() => {
            /* 테마 선택 모달 표시 */
          }}
        />
        <SettingsItem
          icon="text-width"
          iconColor="#AF52DE"
          title="글꼴"
          subtitle={preferencesState.epubViewer.fontFamily}
          onPress={() => {
            /* 글꼴 선택 모달 표시 */
          }}
        />
      </SettingsSection>

      <SettingsSection title="일반 설정">
        <SettingsItem
          icon="refresh"
          iconColor="#8E8E93"
          title="설정 초기화"
          subtitle="모든 뷰어 설정을 기본값으로 되돌립니다"
          onPress={resetPreferences}
        />
      </SettingsSection>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>다크 모드</Text>
        <Switch
          value={preferences.darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#767577', true: theme.colors.primary }}
          thumbColor={preferences.darkMode ? '#ffffff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>파일 뷰어 앱 v{appVersion}</Text>
      </View>
    </ScrollView>
  );
}
