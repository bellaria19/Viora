import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import * as Application from "expo-application";
import { useUserPreferences } from "@/contexts/UserPreferences";
import { useTheme } from "@react-navigation/native";

// settings.tsx에서 임시로 사용할 설정 값
const defaultPreferences = {
  textViewer: {
    fontSize: 16,
    theme: "light",
    fontFamily: "시스템 기본",
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
    theme: "light",
    fontFamily: "시스템 기본",
  },
};

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsSection = ({
  title,
  children,
  styles,
}: SettingsSectionProps & { styles: any }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

type SettingsItemProps = {
  icon: keyof typeof FontAwesome.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
};

const SettingsItem = ({
  icon,
  iconColor = "#007AFF",
  title,
  subtitle,
  right,
  onPress,
  styles,
}: SettingsItemProps & { styles: any }) => (
  <TouchableOpacity style={styles.item} onPress={onPress} disabled={!onPress}>
    <View style={[styles.itemIcon, { backgroundColor: `${iconColor}20` }]}>
      <FontAwesome name={icon} size={20} color={iconColor} />
    </View>
    <View style={styles.itemContent}>
      <Text style={styles.itemTitle}>{title}</Text>
      {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
    </View>
    <View style={styles.itemRight}>
      {right ||
        (onPress && (
          <FontAwesome name="chevron-right" size={20} color="#C7C7CC" />
        ))}
    </View>
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { preferences, setDarkMode, setAutoOpenLastFile } =
    useUserPreferences();
  const theme = useTheme();
  const [preferencesState, setPreferences] = useState(defaultPreferences);
  const appVersion = Application.nativeApplicationVersion || "1.0.0";

  // 설정 파일 경로
  const PREFERENCES_FILE = FileSystem.documentDirectory + "preferences.json";

  // 설정 불러오기 함수
  const loadPreferences = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(PREFERENCES_FILE);
      if (fileInfo.exists) {
        const data = await FileSystem.readAsStringAsync(PREFERENCES_FILE);
        const savedPreferences = JSON.parse(data);
        setPreferences(savedPreferences);
      } else {
        // 파일이 없으면 기본값 저장
        await savePreferences(defaultPreferences);
      }
    } catch (error) {
      console.error("설정 불러오기 오류:", error);
    }
  };

  // 설정 저장 함수
  const savePreferences = async (newPreferences: typeof defaultPreferences) => {
    try {
      await FileSystem.writeAsStringAsync(
        PREFERENCES_FILE,
        JSON.stringify(newPreferences)
      );
      setPreferences(newPreferences);
    } catch (error) {
      console.error("설정 저장 오류:", error);
    }
  };

  // 컴포넌트 마운트 시 설정 불러오기
  useEffect(() => {
    loadPreferences();
  }, []);

  // 텍스트 뷰어 설정 업데이트
  const updateTextViewerPrefs = (
    updates: Partial<typeof preferencesState.textViewer>
  ) => {
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
  const updatePdfViewerPrefs = (
    updates: Partial<typeof preferencesState.pdfViewer>
  ) => {
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
  const updateImageViewerPrefs = (
    updates: Partial<typeof preferencesState.imageViewer>
  ) => {
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
  const updateEpubViewerPrefs = (
    updates: Partial<typeof preferencesState.epubViewer>
  ) => {
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
  const handleTextThemeChange = (theme: "light" | "dark" | "sepia") => {
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    section: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
    },
    sectionContent: {
      backgroundColor: theme.colors.card,
      borderRadius: 10,
      marginHorizontal: 16,
      overflow: "hidden",
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    itemIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    itemContent: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: "400",
      color: theme.colors.text,
    },
    itemSubtitle: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.6,
      marginTop: 2,
    },
    itemRight: {
      marginLeft: 12,
    },
    versionContainer: {
      alignItems: "center",
      marginVertical: 20,
    },
    versionText: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.6,
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
  });

  return (
    <ScrollView style={styles.container}>
      <SettingsSection title="텍스트 뷰어 설정" styles={styles}>
        <SettingsItem
          icon="font"
          iconColor="#34C759"
          title="글꼴 크기"
          subtitle={`${preferencesState.textViewer.fontSize}px`}
          onPress={() => {
            /* 글꼴 크기 설정 모달 표시 */
          }}
          styles={styles}
        />
        <SettingsItem
          icon="paint-brush"
          iconColor="#5856D6"
          title="테마"
          subtitle={
            preferencesState.textViewer.theme === "light"
              ? "밝은 테마"
              : preferencesState.textViewer.theme === "dark"
              ? "어두운 테마"
              : "세피아"
          }
          onPress={() => {
            /* 테마 선택 모달 표시 */
          }}
          styles={styles}
        />
        <SettingsItem
          icon="text-width"
          iconColor="#FF9500"
          title="글꼴"
          subtitle={preferencesState.textViewer.fontFamily}
          onPress={() => {
            /* 글꼴 선택 모달 표시 */
          }}
          styles={styles}
        />
      </SettingsSection>

      <SettingsSection title="PDF 뷰어 설정" styles={styles}>
        <SettingsItem
          icon="search"
          iconColor="#FF3B30"
          title="기본 확대 배율"
          subtitle={`${preferencesState.pdfViewer.defaultZoom}x`}
          onPress={() => {
            /* 확대 배율 설정 모달 표시 */
          }}
          styles={styles}
        />
        <SettingsItem
          icon="arrows-v"
          iconColor="#AF52DE"
          title="페이지 간격"
          subtitle={`${preferencesState.pdfViewer.pageSpacing}px`}
          onPress={() => {
            /* 페이지 간격 설정 모달 표시 */
          }}
          styles={styles}
        />
        <SettingsItem
          icon="file-pdf-o"
          iconColor="#FF9500"
          title="페이지 번호 표시"
          right={
            <Switch
              value={preferencesState.pdfViewer.showPageNumbers}
              onValueChange={handlePdfShowPageNumbers}
              trackColor={{ false: "#D1D1D6", true: "#007AFF" }}
            />
          }
          styles={styles}
        />
      </SettingsSection>

      <SettingsSection title="이미지 뷰어 설정" styles={styles}>
        <SettingsItem
          icon="search-plus"
          iconColor="#5856D6"
          title="기본 확대 배율"
          subtitle={`${preferencesState.imageViewer.defaultZoom}x`}
          onPress={() => {
            /* 확대 배율 설정 모달 표시 */
          }}
          styles={styles}
        />
        <SettingsItem
          icon="hand-o-up"
          iconColor="#34C759"
          title="더블탭 확대 활성화"
          right={
            <Switch
              value={preferencesState.imageViewer.enableDoubleTapZoom}
              onValueChange={handleImageDoubleTapZoom}
              trackColor={{ false: "#D1D1D6", true: "#007AFF" }}
            />
          }
          styles={styles}
        />
      </SettingsSection>

      <SettingsSection title="EPUB 뷰어 설정" styles={styles}>
        <SettingsItem
          icon="font"
          iconColor="#FF3B30"
          title="글꼴 크기"
          subtitle={`${preferencesState.epubViewer.fontSize}px`}
          onPress={() => {
            /* 글꼴 크기 설정 모달 표시 */
          }}
          styles={styles}
        />
        <SettingsItem
          icon="paint-brush"
          iconColor="#FF9500"
          title="테마"
          subtitle={
            preferencesState.epubViewer.theme === "light"
              ? "밝은 테마"
              : preferencesState.epubViewer.theme === "dark"
              ? "어두운 테마"
              : "세피아"
          }
          onPress={() => {
            /* 테마 선택 모달 표시 */
          }}
          styles={styles}
        />
        <SettingsItem
          icon="text-width"
          iconColor="#AF52DE"
          title="글꼴"
          subtitle={preferencesState.epubViewer.fontFamily}
          onPress={() => {
            /* 글꼴 선택 모달 표시 */
          }}
          styles={styles}
        />
      </SettingsSection>

      <SettingsSection title="일반 설정" styles={styles}>
        <SettingsItem
          icon="file"
          iconColor="#007AFF"
          title="마지막 파일 자동 열기"
          subtitle="앱 시작 시 마지막으로 열었던 파일을 자동으로 엽니다"
          right={
            <Switch
              value={preferences.autoOpenLastFile}
              onValueChange={setAutoOpenLastFile}
              trackColor={{ false: "#D1D1D6", true: "#007AFF" }}
            />
          }
          styles={styles}
        />
        <SettingsItem
          icon="refresh"
          iconColor="#8E8E93"
          title="설정 초기화"
          subtitle="모든 뷰어 설정을 기본값으로 되돌립니다"
          onPress={resetPreferences}
          styles={styles}
        />
      </SettingsSection>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>다크 모드</Text>
        <Switch
          value={preferences.darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: "#767577", true: theme.colors.primary }}
          thumbColor={preferences.darkMode ? "#ffffff" : "#f4f3f4"}
        />
      </View>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>파일 뷰어 앱 v{appVersion}</Text>
      </View>
    </ScrollView>
  );
}
