import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { WebView } from 'react-native-webview';
import { useState, useRef, useMemo } from 'react';
import Overlay from '../common/Overlay';
import { useNavigation } from '@react-navigation/native';
import SettingsBottomSheet from '@/components/common/SettingsBottomSheet';
import { useViewerSettings } from '@/hooks/useViewerSettings';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

interface EPUBViewerProps {
  uri: string;
}

export default function EPUBViewer({ uri }: EPUBViewerProps) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const navigation = useNavigation();
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  // EPUB 뷰어 설정
  const { epubViewerOptions, updateEPUBViewerOptions } = useViewerSettings();

  // 설정을 WebView의 EPUB 리더에 적용하는 함수
  const applySettingsToReader = () => {
    if (!webViewRef.current) return;

    // 실제로는 EPUB 리더에 설정을 적용하는 JavaScript 코드를 실행
    // 이는 사용하는 EPUB 리더 라이브러리에 따라 달라질 수 있음
    const js = `
      // 예시: 설정을 EPUB 리더에 적용하는 JavaScript 코드
      if (window.EPUBReader) {
        window.EPUBReader.setFontSize(${epubViewerOptions.fontSize});
        window.EPUBReader.setFontFamily('${epubViewerOptions.fontFamily}');
        window.EPUBReader.setTheme('${epubViewerOptions.theme}');
        // 기타 설정들...
      }
      true;
    `;

    webViewRef.current.injectJavaScript(js);
  };

  // 웹뷰에 삽입할 초기 JavaScript
  const injectedJavaScript = useMemo(() => {
    return `
      // EPUB 리더 초기 설정을 위한 JavaScript
      document.body.style.backgroundColor = '${epubViewerOptions.backgroundColor}';
      document.body.style.color = '${epubViewerOptions.textColor}';
      // 기타 초기 설정...
      true;
    `;
  }, [epubViewerOptions.backgroundColor, epubViewerOptions.textColor]);

  // WebView가 로드될 때 호출되는 핸들러
  const handleWebViewLoad = () => {
    applySettingsToReader();
  };

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
  const sections = [
    {
      title: '뷰어 모드',
      data: [
        {
          key: 'viewMode',
          type: 'button-group',
          value: epubViewerOptions.viewMode,
          label: '뷰어 모드',
          options: [
            { value: 'page', label: '페이지', icon: 'file' },
            { value: 'scroll', label: '스크롤', icon: 'scroll' },
          ],
        },
      ],
    },
    {
      title: '테마',
      data: [
        {
          key: 'theme',
          type: 'button-group',
          value: epubViewerOptions.theme,
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
          value: epubViewerOptions.fontFamily,
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
          value: epubViewerOptions.fontSize,
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
          value: epubViewerOptions.lineHeight,
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
          value: epubViewerOptions.marginHorizontal,
          label: '여백',
          min: 8,
          max: 40,
          step: 2,
          unit: 'px',
        },
      ],
    },
    {
      title: '기능 설정',
      data: [
        {
          key: 'enableTOC',
          type: 'switch',
          value: epubViewerOptions.enableTOC,
          label: '목차 표시',
        },
        {
          key: 'enableBookmark',
          type: 'switch',
          value: epubViewerOptions.enableBookmark,
          label: '북마크 기능',
        },
      ],
    },
  ];

  const handleOptionChange = (key: string, value: any) => {
    if (key === 'theme') {
      const themeObj = themes.find((t) => t.value === value);
      updateEPUBViewerOptions({ theme: value, backgroundColor: themeObj?.bgColor, textColor: themeObj?.textColor });
    } else if (key === 'marginHorizontal') {
      updateEPUBViewerOptions({ marginHorizontal: value, marginVertical: value });
    } else {
      updateEPUBViewerOptions({ [key]: value });
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setOverlayVisible((v) => !v)}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <WebView
            ref={webViewRef}
            source={{ uri }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            injectedJavaScript={injectedJavaScript}
            onLoad={handleWebViewLoad}
          />
          <Overlay
            visible={overlayVisible}
            onBack={() => navigation.goBack()}
            onSettings={() => setSettingsVisible(true)}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* 설정 바텀 시트 */}
      <SettingsBottomSheet
        title="EPUB 설정"
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
  },
  webview: {
    flex: 1,
  },
});
