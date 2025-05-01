import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableWithoutFeedback } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Overlay from '../common/Overlay';
import { useNavigation } from '@react-navigation/native';
import SettingsBottomSheet, { SettingsSection } from '@/components/common/SettingsBottomSheet';
import { useViewerSettings } from '@/hooks/useViewerSettings';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

interface TextViewerProps {
  uri: string;
}

export default function TextViewer({ uri }: TextViewerProps) {
  const [content, setContent] = useState<string>('');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const navigation = useNavigation();
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  // 텍스트 뷰어 설정
  const { textViewerOptions, updateTextViewerOptions } = useViewerSettings();

  const loadTextContent = useCallback(async () => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(uri);
      setContent(fileContent);
    } catch (error) {
      console.error('Error reading text file:', error);
      setContent('파일을 읽을 수 없습니다.');
    }
  }, [uri]);

  useEffect(() => {
    loadTextContent();
  }, [loadTextContent]);

  // 테마에 따른 배경색과 텍스트 색상 가져오기
  const getThemeStyles = () => {
    switch (textViewerOptions.theme) {
      case 'light':
        return { backgroundColor: '#fff', textColor: '#333' };
      case 'dark':
        return { backgroundColor: '#1a1a1a', textColor: '#eee' };
      case 'sepia':
        return { backgroundColor: '#f8f1e3', textColor: '#5b4636' };
      default:
        return { backgroundColor: textViewerOptions.backgroundColor, textColor: textViewerOptions.textColor };
    }
  };

  const themeStyles = getThemeStyles();

  // SectionList 데이터 구조 정의
  const themes = [
    { value: 'light', label: '라이트', bgColor: '#fff', textColor: '#333' },
    { value: 'dark', label: '다크', bgColor: '#1a1a1a', textColor: '#eee' },
    { value: 'sepia', label: '세피아', bgColor: '#f8f1e3', textColor: '#5b4636' },
  ];
  const fonts = [
    { value: 'System', label: '시스템' },
    { value: 'SpaceMono', label: '스페이스 모노' },
    { value: 'Arial', label: '아리알' },
    { value: 'Georgia', label: '조지아' },
  ];
  const sections: SettingsSection[] = [
    {
      title: '테마',
      data: [
        {
          key: 'theme',
          type: 'button-group',
          value: textViewerOptions.theme,
          label: '테마',
          options: themes.map((t) => ({ value: t.value, label: t.label })),
        },
      ],
    },
    {
      title: '글꼴',
      data: [
        {
          key: 'fontFamily',
          type: 'button-group',
          value: textViewerOptions.fontFamily,
          label: '글꼴',
          options: fonts,
        },
      ],
    },
    {
      title: '글자 크기',
      data: [
        {
          key: 'fontSize',
          type: 'slider',
          value: textViewerOptions.fontSize,
          label: '글자 크기',
          min: 12,
          max: 28,
          step: 1,
          unit: 'px',
        },
      ],
    },
    {
      title: '줄 간격',
      data: [
        {
          key: 'lineHeight',
          type: 'slider',
          value: textViewerOptions.lineHeight,
          label: '줄 간격',
          min: 1.0,
          max: 2.5,
          step: 0.1,
        },
      ],
    },
    {
      title: '여백',
      data: [
        {
          key: 'marginHorizontal',
          type: 'slider',
          value: textViewerOptions.marginHorizontal,
          label: '여백',
          min: 8,
          max: 40,
          step: 2,
          unit: 'px',
        },
      ],
    },
  ];

  const handleOptionChange = (key: string, value: any) => {
    if (key === 'theme') {
      const themeObj = themes.find((t) => t.value === value);
      updateTextViewerOptions({ theme: value, backgroundColor: themeObj?.bgColor, textColor: themeObj?.textColor });
    } else if (key === 'marginHorizontal') {
      updateTextViewerOptions({ marginHorizontal: value, marginVertical: value });
    } else {
      updateTextViewerOptions({ [key]: value });
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setOverlayVisible((v) => !v)}>
        <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
          <ScrollView
            style={[
              styles.scrollView,
              {
                paddingHorizontal: textViewerOptions.marginHorizontal,
                paddingVertical: textViewerOptions.marginVertical,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  fontFamily: textViewerOptions.fontFamily,
                  fontSize: textViewerOptions.fontSize,
                  lineHeight: textViewerOptions.fontSize * textViewerOptions.lineHeight,
                  color: themeStyles.textColor,
                },
              ]}
            >
              {content}
            </Text>
          </ScrollView>
          <Overlay
            visible={overlayVisible}
            onBack={() => navigation.goBack()}
            onSettings={() => setSettingsVisible(true)}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* 설정 바텀 시트 */}
      <SettingsBottomSheet
        title="텍스트 설정"
        isVisible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        sections={sections}
        onOptionChange={handleOptionChange}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
