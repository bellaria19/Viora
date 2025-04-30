import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { resetAllFiles } from '@/utils/fileManager';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import TextViewerSettingsItem from '@/components/settings/TextViewerSettingsItem';
import PDFViewerSettingsItem from '@/components/settings/PDFViewerSettingsItem';
import ImageViewerSettingsItem from '@/components/settings/ImageViewerSettingsItem';
import EPUBViewerSettingsItem from '@/components/settings/EPUBViewerSettingsItem';
import ZipViewerSettingsItem from '@/components/settings/ZipImageViewerSettingsItem';
import ViewerSettingsScreen from '@/components/settings/ViewerSettingsScreen';
import SettingItem from '@/components/settings/SettingItem';
import ResetButton from '@/components/settings/ResetButton';
import SettingSectionList from '@/components/settings/SettingSectionList';

// 섹션 데이터 타입 정의
interface SettingsSection {
  title: string;
  data: SettingsItem[];
}

interface SettingsItem {
  key: string;
  render: () => JSX.Element;
}

export default function SettingsScreen() {
  const [autoOpen, setAutoOpen] = useState(true);
  const { theme, currentTheme, setTheme } = useTheme();
  const colors = Colors[currentTheme];

  // 현재 보고있는 설정 화면 상태
  const [currentViewerSettings, setCurrentViewerSettings] = useState<string | null>(null);

  // 테마 선택 모달 표시 함수
  const handleThemeSelection = () => {
    Alert.alert('테마 설정', '원하는 테마를 선택하세요', [
      {
        text: '라이트 모드',
        onPress: () => setTheme('light'),
        style: theme === 'light' ? 'default' : 'default',
      },
      {
        text: '다크 모드',
        onPress: () => setTheme('dark'),
        style: theme === 'dark' ? 'default' : 'default',
      },
      {
        text: '시스템 설정 따르기',
        onPress: () => setTheme('system'),
        style: theme === 'system' ? 'default' : 'default',
      },
      {
        text: '취소',
        style: 'cancel',
      },
    ]);
  };

  // 현재 선택된 테마 텍스트
  const getThemeText = () => {
    switch (theme) {
      case 'light':
        return '라이트 모드';
      case 'dark':
        return '다크 모드';
      case 'system':
        return '시스템 설정 따름';
      default:
        return '';
    }
  };

  // 앱 초기화 함수
  const handleResetFiles = () => {
    Alert.alert('파일 초기화', '모든 파일이 삭제됩니다. 계속하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '초기화',
        style: 'destructive',
        onPress: async () => {
          try {
            await resetAllFiles();
            Alert.alert('완료', '모든 파일이 초기화되었습니다.');
          } catch (error) {
            Alert.alert('오류', '파일 초기화 중 오류가 발생했습니다.');
          }
        },
      },
    ]);
  };

  // 섹션 데이터 생성
  const sections: SettingsSection[] = [
    {
      title: '앱 설정',
      data: [
        {
          key: 'theme',
          render: () => (
            <SettingItem
              title="테마"
              onPress={handleThemeSelection}
              rightElement={
                <View style={styles.themeSelector}>
                  <Text style={[styles.themeText, { color: colors.secondaryText }]}>{getThemeText()}</Text>
                  <FontAwesome6 name="chevron-right" size={14} color={colors.secondaryText} />
                </View>
              }
              style={{ borderBottomColor: colors.border }}
              titleStyle={{ color: colors.text }}
            />
          ),
        },
        {
          key: 'autoOpen',
          render: () => (
            <SettingItem
              title="파일 자동 열기"
              rightElement={
                <Switch
                  value={autoOpen}
                  onValueChange={setAutoOpen}
                  trackColor={{ false: colors.buttonBackground, true: colors.primary }}
                />
              }
              style={{ borderBottomColor: colors.border }}
              titleStyle={{ color: colors.text }}
            />
          ),
        },
      ],
    },
    {
      title: '뷰어 설정',
      data: [
        {
          key: 'textViewer',
          render: () => <TextViewerSettingsItem onPress={() => setCurrentViewerSettings('text')} />,
        },
        {
          key: 'pdfViewer',
          render: () => <PDFViewerSettingsItem onPress={() => setCurrentViewerSettings('pdf')} />,
        },
        {
          key: 'imageViewer',
          render: () => <ImageViewerSettingsItem onPress={() => setCurrentViewerSettings('image')} />,
        },
        {
          key: 'epubViewer',
          render: () => <EPUBViewerSettingsItem onPress={() => setCurrentViewerSettings('epub')} />,
        },
        {
          key: 'zipViewer',
          render: () => <ZipViewerSettingsItem onPress={() => setCurrentViewerSettings('zip')} />,
        },
      ],
    },
    {
      title: '정보',
      data: [
        {
          key: 'version',
          render: () => (
            <SettingItem
              title="버전"
              rightElement={<Text style={{ color: colors.secondaryText }}>1.0.0</Text>}
              style={{ borderBottomColor: colors.border }}
              titleStyle={{ color: colors.text }}
            />
          ),
        },
      ],
    },
    {
      title: '데이터 관리',
      data: [
        {
          key: 'reset',
          render: () => <ResetButton label="모든 파일 초기화" onPress={handleResetFiles} color={colors.errorText} />,
        },
      ],
    },
  ];

  // 뷰어 설정 화면이 열려있을 때 렌더링
  if (currentViewerSettings) {
    return (
      <ViewerSettingsScreen viewerType={currentViewerSettings as any} onBack={() => setCurrentViewerSettings(null)} />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SettingSectionList
        sections={sections}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => item.render()}
        sectionHeaderStyle={{ backgroundColor: colors.background }}
        sectionHeaderTextStyle={{ color: colors.secondaryText }}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 16,
  },
  themeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeText: {
    fontSize: 14,
  },
  resetButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
