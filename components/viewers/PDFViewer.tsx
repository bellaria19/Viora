import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Pdf from 'react-native-pdf';
import { useState, useRef } from 'react';
import Overlay from '../common/Overlay';
import { useNavigation } from '@react-navigation/native';
import SettingsBottomSheet from '@/components/common/SettingsBottomSheet';
import PDFViewerSettings from '@/components/settings/PDFViewerSettings';
import { useViewerSettings } from '@/hooks/useViewerSettings';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

interface PDFViewerProps {
  uri: string;
}

export default function PDFViewer({ uri }: PDFViewerProps) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const pdfRef = useRef<any>(null);
  const navigation = useNavigation();
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  // PDF 뷰어 설정
  const { pdfViewerOptions, updatePDFViewerOptions } = useViewerSettings();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    pdfRef.current?.setPage(page);
  };

  // 설정에 따른 PDF 속성 계산
  const pdfHorizontal = pdfViewerOptions.viewMode === 'page';
  const pdfSpacing = pdfViewerOptions.pageSpacing;
  const pdfEnablePaging = pdfViewerOptions.viewMode === 'page';

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setOverlayVisible((v) => !v)}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            enableRTL={pdfViewerOptions.enableRTL}
            enableDoubleTapZoom={pdfViewerOptions.enableDoubleTapZoom}
          />
          <Overlay
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
        <PDFViewerSettings options={pdfViewerOptions} onOptionsChange={updatePDFViewerOptions} />
      </SettingsBottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});
