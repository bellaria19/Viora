import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableWithoutFeedback } from 'react-native';
import * as FileSystem from 'expo-file-system';
import ViewerOverlay from './ViewerOverlay';
import { useNavigation } from '@react-navigation/native';
import SettingsBottomSheet from '@/components/SettingsBottomSheet';
import TextViewerSettings from '@/components/settings/TextViewerSettings';
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
          <ViewerOverlay
            visible={overlayVisible}
            onBack={() => navigation.goBack()}
            onSettings={() => setSettingsVisible(true)}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* 설정 바텀 시트 */}
      <SettingsBottomSheet title="텍스트 설정" isVisible={settingsVisible} onClose={() => setSettingsVisible(false)}>
        <TextViewerSettings options={textViewerOptions} onOptionsChange={updateTextViewerOptions} />
      </SettingsBottomSheet>
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
