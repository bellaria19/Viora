import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableWithoutFeedback } from 'react-native';
import * as FileSystem from 'expo-file-system';
import ViewerOverlay from './ViewerOverlay';
import { useNavigation } from '@react-navigation/native';
import { TextViewerOptions } from '@/types/option';
import SettingsBottomSheet from '@/components/SettingsBottomSheet';
import TextViewerSettings from '@/components/settings/TextViewerSettings';

interface TextViewerProps {
  uri: string;
  onSettings?: () => void;
}

export default function TextViewer({ uri, onSettings }: TextViewerProps) {
  const [content, setContent] = useState<string>('');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const navigation = useNavigation();

  // 텍스트 뷰어 설정
  const [viewerOptions, setViewerOptions] = useState<TextViewerOptions>({
    fontSize: 16,
    lineHeight: 1.5,
    fontFamily: 'System',
    theme: 'light',
    textColor: '#333',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 16,
  });

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

  // 설정 변경 핸들러
  const handleSettingsChange = (newOptions: Partial<TextViewerOptions>) => {
    setViewerOptions((prev) => ({ ...prev, ...newOptions }));
  };

  // 테마에 따른 배경색과 텍스트 색상 가져오기
  const getThemeStyles = () => {
    switch (viewerOptions.theme) {
      case 'light':
        return { backgroundColor: '#fff', textColor: '#333' };
      case 'dark':
        return { backgroundColor: '#1a1a1a', textColor: '#eee' };
      case 'sepia':
        return { backgroundColor: '#f8f1e3', textColor: '#5b4636' };
      default:
        return { backgroundColor: viewerOptions.backgroundColor, textColor: viewerOptions.textColor };
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
                paddingHorizontal: viewerOptions.marginHorizontal,
                paddingVertical: viewerOptions.marginVertical,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  fontFamily: viewerOptions.fontFamily,
                  fontSize: viewerOptions.fontSize,
                  lineHeight: viewerOptions.fontSize * viewerOptions.lineHeight,
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
        <TextViewerSettings options={viewerOptions} onOptionsChange={handleSettingsChange} />
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
