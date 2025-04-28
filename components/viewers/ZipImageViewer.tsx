import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableWithoutFeedback } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ZipArchive from 'react-native-zip-archive';
import ImageViewer from './ImageViewer';
import ViewerOverlay from './ViewerOverlay';
import { useNavigation } from '@react-navigation/native';

interface ZipImageViewerProps {
  uri: string;
  onSettings?: () => void;
}

export default function ZipImageViewer({ uri, onSettings }: ZipImageViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const navigation = useNavigation();

  const tempDirectory = useMemo(() => `${FileSystem.cacheDirectory}zip-viewer-${Date.now()}/`, []);

  const extractAndLoadImages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 임시 디렉토리 생성
      await FileSystem.makeDirectoryAsync(tempDirectory, {
        intermediates: true,
      });

      // ZIP 파일 압축 해제
      await ZipArchive.unzip(uri, tempDirectory);

      // 이미지 파일 찾기
      const files = await FileSystem.readDirectoryAsync(tempDirectory);
      const imageFiles = files
        .filter((file) => {
          const lower = file.toLowerCase();
          return lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif');
        })
        .sort();

      if (imageFiles.length === 0) {
        setError('ZIP 파일에 이미지가 없습니다.');
        return;
      }

      setImages(imageFiles.map((file) => `${tempDirectory}${file}`));
    } catch (err) {
      console.error('Error extracting ZIP:', err);
      setError('ZIP 파일을 처리하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [tempDirectory, uri]);

  useEffect(() => {
    extractAndLoadImages();
    return () => {
      // 임시 디렉토리 정리
      if (tempDirectory) {
        FileSystem.deleteAsync(tempDirectory, { idempotent: true });
      }
    };
  }, [extractAndLoadImages, tempDirectory]);

  const handlePageChange = (page: number) => {
    setCurrentIndex(page - 1);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>ZIP 파일 처리 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => setOverlayVisible((v) => !v)}>
      <View style={styles.container}>
        {images.length > 0 && <ImageViewer uri={images[currentIndex]} />}
        <ViewerOverlay
          visible={overlayVisible}
          onBack={() => navigation.goBack()}
          onSettings={onSettings}
          showSlider={images.length > 1}
          currentPage={currentIndex + 1}
          totalPages={images.length}
          onPageChange={handlePageChange}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
