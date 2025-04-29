import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Pdf from 'react-native-pdf';
import React, { useState, useRef, useCallback } from 'react';
import ViewerOverlay from './ViewerOverlay';
import { useNavigation } from '@react-navigation/native';
import { PDFViewerOptions } from '@/types/option';
import SettingsBottomSheet from '@/components/SettingsBottomSheet';
import PDFViewerSettings from '@/components/settings/PDFViewerSettings';

interface PDFViewerProps {
  uri: string;
  onSettings?: () => void;
}

export default function PDFViewer({ uri }: PDFViewerProps) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const pdfRef = useRef<any>(null);
  const navigation = useNavigation();

  // PDF 뷰어 설정
  const [viewerOptions, setViewerOptions] = useState<PDFViewerOptions>({
    viewMode: 'page',
    enableRTL: false,
    pageSpacing: 0,
    showPageNumbers: true,
    enableCache: true,
    enableDoubleTapZoom: true,
    showLoadingIndicator: true,
    showThumbnails: false,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    pdfRef.current?.setPage(page);
  };

  const handleSettingsChange = useCallback((newOptions: Partial<PDFViewerOptions>) => {
    setViewerOptions((prev) => ({ ...prev, ...newOptions }));

    // 여기서 필요한 실시간 설정 적용 로직을 구현
    // 예: 모드 변경이나 간격 설정 등의 즉시 적용이 필요한 기능
  }, []);

  // 설정에 따른 PDF 속성 계산
  const pdfHorizontal = viewerOptions.viewMode === 'page';
  const pdfSpacing = viewerOptions.pageSpacing;
  const pdfEnablePaging = viewerOptions.viewMode === 'page';

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setOverlayVisible((v) => !v)}>
        <View style={styles.container}>
          <Pdf
            ref={pdfRef}
            source={{ uri }}
            style={styles.pdf}
            enablePaging={pdfEnablePaging}
            horizontal={pdfHorizontal}
            spacing={pdfSpacing}
            onPageChanged={(page, numberOfPages) => {
              setCurrentPage(page);
              setTotalPages(numberOfPages);
            }}
            onLoadComplete={(numberOfPages) => setTotalPages(numberOfPages)}
            enableRTL={viewerOptions.enableRTL}
            enableDoubleTapZoom={viewerOptions.enableDoubleTapZoom}
          />
          <ViewerOverlay
            visible={overlayVisible}
            onBack={() => navigation.goBack()}
            onSettings={() => setSettingsVisible(true)}
            showSlider={totalPages > 1}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* 설정 바텀 시트 */}
      <SettingsBottomSheet title="PDF 설정" isVisible={settingsVisible} onClose={() => setSettingsVisible(false)}>
        <PDFViewerSettings options={viewerOptions} onOptionsChange={handleSettingsChange} />
      </SettingsBottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});
