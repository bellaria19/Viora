import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useState, useRef, useMemo } from 'react';
import ViewerOverlay from './ViewerOverlay';
import { useNavigation } from '@react-navigation/native';
import { EPUBViewerOptions } from '@/types/option';
import SettingsBottomSheet from '@/components/SettingsBottomSheet';
import EPUBViewerSettings from '@/components/settings/EPUBViewerSettings';

interface EPUBViewerProps {
  uri: string;
  onSettings?: () => void;
}

export default function EPUBViewer({ uri }: EPUBViewerProps) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const navigation = useNavigation();

  // EPUB 뷰어 설정
  const [viewerOptions, setViewerOptions] = useState<EPUBViewerOptions>({
    viewMode: 'page',
    enableRTL: false,
    fontSize: 16,
    lineHeight: 1.5,
    fontFamily: 'System',
    theme: 'light',
    textColor: '#333',
    backgroundColor: '#fff',
    linkColor: '#0066cc',
    marginHorizontal: 16,
    marginVertical: 16,
    enableTOC: true,
    enableAnnotation: false,
    enableBookmark: true,
    enableSearch: true,
    enableTextSelection: true,
  });

  // 설정 변경 핸들러
  const handleSettingsChange = (newOptions: Partial<EPUBViewerOptions>) => {
    setViewerOptions((prev) => ({ ...prev, ...newOptions }));
    applySettingsToReader();
  };

  // 설정을 WebView의 EPUB 리더에 적용하는 함수
  const applySettingsToReader = () => {
    if (!webViewRef.current) return;

    // 실제로는 EPUB 리더에 설정을 적용하는 JavaScript 코드를 실행
    // 이는 사용하는 EPUB 리더 라이브러리에 따라 달라질 수 있음
    const js = `
      // 예시: 설정을 EPUB 리더에 적용하는 JavaScript 코드
      if (window.EPUBReader) {
        window.EPUBReader.setFontSize(${viewerOptions.fontSize});
        window.EPUBReader.setFontFamily('${viewerOptions.fontFamily}');
        window.EPUBReader.setTheme('${viewerOptions.theme}');
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
      document.body.style.backgroundColor = '${viewerOptions.backgroundColor}';
      document.body.style.color = '${viewerOptions.textColor}';
      // 기타 초기 설정...
      true;
    `;
  }, []);

  // WebView가 로드될 때 호출되는 핸들러
  const handleWebViewLoad = () => {
    applySettingsToReader();
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setOverlayVisible((v) => !v)}>
        <View style={styles.container}>
          <WebView
            ref={webViewRef}
            source={{ uri }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            injectedJavaScript={injectedJavaScript}
            onLoad={handleWebViewLoad}
          />
          <ViewerOverlay
            visible={overlayVisible}
            onBack={() => navigation.goBack()}
            onSettings={() => setSettingsVisible(true)}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* 설정 바텀 시트 */}
      <SettingsBottomSheet title="EPUB 설정" isVisible={settingsVisible} onClose={() => setSettingsVisible(false)}>
        <EPUBViewerSettings options={viewerOptions} onOptionsChange={handleSettingsChange} />
      </SettingsBottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
});
