import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Pdf from 'react-native-pdf';
import React, { useState, useRef } from 'react';
import ViewerOverlay from './ViewerOverlay';
import { useNavigation } from '@react-navigation/native';
import PDFSettingsSheet from '@/components/viewers/PDFSettingsSheet';

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    pdfRef.current?.setPage(page);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setOverlayVisible((v) => !v)}>
        <View style={styles.container}>
          <Pdf
            ref={pdfRef}
            source={{ uri }}
            style={styles.pdf}
            enablePaging={true}
            horizontal={false}
            spacing={0}
            onPageChanged={(page, numberOfPages) => {
              setCurrentPage(page);
              setTotalPages(numberOfPages);
            }}
            onLoadComplete={(numberOfPages) => setTotalPages(numberOfPages)}
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
      <PDFSettingsSheet visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
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
