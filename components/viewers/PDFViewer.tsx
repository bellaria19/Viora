import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import Pdf from 'react-native-pdf';
import ViewerOverlay from '@/components/common/ViewerOverlay';

interface PDFViewerProps {
  fileUri: string;
  fileName?: string;
}

export default function PDFViewer({ fileUri, fileName = 'PDF 파일' }: PDFViewerProps) {
  const [viewMode, setViewMode] = useState<'scroll' | 'page'>('scroll');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const pdfRef = useRef<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const checkFileExists = async () => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
          setError('PDF 파일을 찾을 수 없습니다.');
          setIsLoading(false);
          return;
        }
        if (fileInfo.size === 0) {
          setError('PDF 파일이 비어있습니다.');
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError('PDF 파일을 확인하는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };
    checkFileExists();
  }, [fileUri]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const source = { uri: fileUri, cache: true };

  const goToPrevPage = () => {
    if (currentPage > 1 && pdfRef.current) {
      pdfRef.current.setPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages && pdfRef.current) {
      pdfRef.current.setPage(currentPage + 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (pdfRef.current && page >= 1 && page <= totalPages) {
      pdfRef.current.setPage(page);
    }
  };

  const handleModeChange = (mode: 'scroll' | 'page') => {
    setViewMode(mode);
  };

  const handleBack = () => {
    if (navigation && navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else if (typeof window !== 'undefined' && window.history) {
      window.history.back();
    } else {
      alert('뒤로가기 기능을 구현하세요.');
    }
  };

  const handleToggleOverlay = () => setOverlayVisible((v) => !v);

  return (
    <View style={styles.pdfContainer}>
      <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={handleToggleOverlay}>
        <Pdf
          ref={pdfRef}
          source={source}
          style={styles.pdf}
          onLoadComplete={(numberOfPages) => {
            setTotalPages(numberOfPages);
            setIsLoading(false);
          }}
          onPageChanged={(page) => {
            setCurrentPage(page);
          }}
          onError={() => {
            setError('PDF를 불러오는 중 오류가 발생했습니다.');
          }}
          enablePaging={viewMode === 'page'}
          horizontal={viewMode === 'page'}
          spacing={viewMode === 'page' ? 10 : 0}
        />
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>PDF를 불러오는 중...</Text>
          </View>
        )}
        <ViewerOverlay
          fileName={fileName}
          currentPage={currentPage}
          totalPages={totalPages}
          onBack={handleBack}
          onPrevPage={goToPrevPage}
          onNextPage={goToNextPage}
          visible={overlayVisible}
          onToggle={handleToggleOverlay}
          onPageChange={handlePageChange}
          mode={viewMode}
          onModeChange={handleModeChange}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pdfContainer: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    backgroundColor: '#f8f8f8',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
});
