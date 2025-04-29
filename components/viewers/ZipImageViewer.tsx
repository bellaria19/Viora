import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableWithoutFeedback } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ZipArchive from 'react-native-zip-archive';
import ImageViewer from './ImageViewer';
import ViewerOverlay from './ViewerOverlay';
import { useNavigation } from '@react-navigation/native';
import SettingsBottomSheet from '@/components/SettingsBottomSheet';
import ZipImageViewerSettings from '@/components/settings/ZipImageViewerSettings';
import { useViewerSettings } from '@/hooks/useViewerSettings';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

interface ZipImageViewerProps {
  uri: string;
}

export default function ZipImageViewer({ uri }: ZipImageViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const navigation = useNavigation();
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  // ZIP 이미지 뷰어 설정
  const { zipViewerOptions, updateZipViewerOptions } = useViewerSettings();

  const tempDirectory = useMemo(() => `${FileSystem.cacheDirectory}zip-viewer-${Date.now()}/`, []);

  // 이미지 정렬 함수
  const sortImages = useCallback(
    (imageFiles: string[]) => {
      return [...imageFiles].sort((a, b) => {
        switch (zipViewerOptions.sortImagesBy) {
          case 'name':
            return a.localeCompare(b);
          case 'date':
          case 'size':
            // 실제로는 파일 메타데이터를 사용하여 정렬하지만
            // 여기서는 간단히 이름 기준 정렬로 대체
            return a.localeCompare(b);
          default:
            return 0;
        }
      });
    },
    [zipViewerOptions.sortImagesBy],
  );

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
      const imageFiles = files.filter((file) => {
        const lower = file.toLowerCase();
        return lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif');
      });

      if (imageFiles.length === 0) {
        setError('ZIP 파일에 이미지가 없습니다.');
        return;
      }

      // 설정에 따라 이미지 정렬
      const sortedImages = sortImages(imageFiles);
      setImages(sortedImages.map((file) => `${tempDirectory}${file}`));
    } catch (err) {
      console.error('Error extracting ZIP:', err);
      setError('ZIP 파일을 처리하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [tempDirectory, uri, sortImages]);

  useEffect(() => {
    extractAndLoadImages();
    return () => {
      // 임시 디렉토리 정리
      if (tempDirectory) {
        FileSystem.deleteAsync(tempDirectory, { idempotent: true });
      }

      // 자동 재생 타이머 정리
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [extractAndLoadImages, tempDirectory]);

  // 자동 재생 설정 적용
  useEffect(() => {
    // 기존 타이머 제거
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    // 자동 재생이 활성화된 경우 타이머 설정
    if (zipViewerOptions.autoPlayEnabled && images.length > 0) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= images.length - 1) {
            return zipViewerOptions.loopEnabled ? 0 : prevIndex;
          }
          return prevIndex + 1;
        });
      }, zipViewerOptions.autoPlayInterval * 1000);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [
    zipViewerOptions.autoPlayEnabled,
    zipViewerOptions.autoPlayInterval,
    zipViewerOptions.loopEnabled,
    images.length,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentIndex(page - 1);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>ZIP 파일 처리 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.errorText }]}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setOverlayVisible((v) => !v)}>
        <View style={styles.container}>
          {images.length > 0 && <ImageViewer uri={images[currentIndex]} />}
          <ViewerOverlay
            visible={overlayVisible}
            onBack={() => navigation.goBack()}
            onSettings={() => setSettingsVisible(true)}
            showSlider={images.length > 1}
            currentPage={currentIndex + 1}
            totalPages={images.length}
            onPageChange={handlePageChange}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* 설정 바텀 시트 */}
      <SettingsBottomSheet
        title="ZIP 이미지 설정"
        isVisible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      >
        <ZipImageViewerSettings options={zipViewerOptions} onOptionsChange={updateZipViewerOptions} />
      </SettingsBottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
