// app/(tabs)/settings.tsx
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
}: SettingsSectionProps): JSX.Element => (
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
}: SettingsItemProps): JSX.Element => (
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
  const [preferences, setPreferences] = useState(defaultPreferences);
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
    updates: Partial<typeof preferences.textViewer>
  ) => {
    const newPreferences = {
      ...preferences,
      textViewer: {
        ...preferences.textViewer,
        ...updates,
      },
    };
    savePreferences(newPreferences);
  };

  // PDF 뷰어 설정 업데이트
  const updatePdfViewerPrefs = (
    updates: Partial<typeof preferences.pdfViewer>
  ) => {
    const newPreferences = {
      ...preferences,
      pdfViewer: {
        ...preferences.pdfViewer,
        ...updates,
      },
    };
    savePreferences(newPreferences);
  };

  // 이미지 뷰어 설정 업데이트
  const updateImageViewerPrefs = (
    updates: Partial<typeof preferences.imageViewer>
  ) => {
    const newPreferences = {
      ...preferences,
      imageViewer: {
        ...preferences.imageViewer,
        ...updates,
      },
    };
    savePreferences(newPreferences);
  };

  // EPUB 뷰어 설정 업데이트
  const updateEpubViewerPrefs = (
    updates: Partial<typeof preferences.epubViewer>
  ) => {
    const newPreferences = {
      ...preferences,
      epubViewer: {
        ...preferences.epubViewer,
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

  return (
    <ScrollView style={styles.container}>
      <SettingsSection title="텍스트 뷰어 설정">
        <SettingsItem
          icon="font"
          iconColor="#34C759"
          title="글꼴 크기"
          subtitle={`${preferences.textViewer.fontSize}px`}
          onPress={() => {
            /* 글꼴 크기 설정 모달 표시 */
          }}
        />
        <SettingsItem
          icon="paint-brush"
          iconColor="#5856D6"
          title="테마"
          subtitle={
            preferences.textViewer.theme === "light"
              ? "밝은 테마"
              : preferences.textViewer.theme === "dark"
              ? "어두운 테마"
              : "세피아"
          }
          onPress={() => {
            /* 테마 선택 모달 표시 */
          }}
        />
        <SettingsItem
          icon="text-width"
          iconColor="#FF9500"
          title="글꼴"
          subtitle={preferences.textViewer.fontFamily}
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
          subtitle={`${preferences.pdfViewer.defaultZoom}x`}
          onPress={() => {
            /* 확대 배율 설정 모달 표시 */
          }}
        />
        <SettingsItem
          icon="arrows-v"
          iconColor="#AF52DE"
          title="페이지 간격"
          subtitle={`${preferences.pdfViewer.pageSpacing}px`}
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
              value={preferences.pdfViewer.showPageNumbers}
              onValueChange={handlePdfShowPageNumbers}
              trackColor={{ false: "#D1D1D6", true: "#007AFF" }}
            />
          }
        />
      </SettingsSection>

      <SettingsSection title="이미지 뷰어 설정">
        <SettingsItem
          icon="search-plus"
          iconColor="#5856D6"
          title="기본 확대 배율"
          subtitle={`${preferences.imageViewer.defaultZoom}x`}
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
              value={preferences.imageViewer.enableDoubleTapZoom}
              onValueChange={handleImageDoubleTapZoom}
              trackColor={{ false: "#D1D1D6", true: "#007AFF" }}
            />
          }
        />
      </SettingsSection>

      <SettingsSection title="EPUB 뷰어 설정">
        <SettingsItem
          icon="font"
          iconColor="#FF3B30"
          title="글꼴 크기"
          subtitle={`${preferences.epubViewer.fontSize}px`}
          onPress={() => {
            /* 글꼴 크기 설정 모달 표시 */
          }}
        />
        <SettingsItem
          icon="paint-brush"
          iconColor="#FF9500"
          title="테마"
          subtitle={
            preferences.epubViewer.theme === "light"
              ? "밝은 테마"
              : preferences.epubViewer.theme === "dark"
              ? "어두운 테마"
              : "세피아"
          }
          onPress={() => {
            /* 테마 선택 모달 표시 */
          }}
        />
        <SettingsItem
          icon="text-width"
          iconColor="#AF52DE"
          title="글꼴"
          subtitle={preferences.epubViewer.fontFamily}
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

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>파일 뷰어 앱 v{appVersion}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  sectionContent: {
    backgroundColor: "white",
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
    borderBottomColor: "#E5E5EA",
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
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
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
    color: "#8E8E93",
  },
});
