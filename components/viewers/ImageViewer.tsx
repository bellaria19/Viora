import { View, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import ViewerOverlay from '@/components/common/ViewerOverlay';
import { ImageViewerOptions } from '@/types/option';
import { useUserPreferences, defaultPreferences } from '@/contexts/UserPreferences';

interface ImageViewerProps {
  fileUri: string;
  fileName?: string;
  images?: string[];
  fallbackImage?: string;
  resizeMode?: keyof typeof FastImage.resizeMode;
  initialOptions?: Partial<ImageViewerOptions>;
  onOptionsChange?: (options: ImageViewerOptions) => void;
}

export default function ImageViewer({
  fileUri,
  fileName = '이미지 파일',
  images: propImages,
  fallbackImage = 'https://via.placeholder.com/400x400?text=이미지+로드+실패',
  resizeMode = 'contain',
  initialOptions,
  onOptionsChange,
}: ImageViewerProps) {
  const { preferences, updateImageViewerSettings, isLoading: preferencesLoading } = useUserPreferences();
  const [showSettings, setShowSettings] = useState(false);
  const images = propImages && propImages.length > 0 ? propImages : [fileUri];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const navigation = useNavigation();

  // 현재 설정 (preferences가 로드되지 않았을 때는 기본값 사용)
  const options = preferencesLoading
    ? { ...defaultPreferences.imageViewer, ...initialOptions }
    : { ...preferences.imageViewer, ...initialOptions };

  const handleOptionsChange = (newOptions: Partial<ImageViewerOptions>) => {
    const updatedOptions = { ...options, ...newOptions };
    onOptionsChange?.(updatedOptions);
    updateImageViewerSettings(newOptions);
  };

  // 이미지 프리로딩
  useEffect(() => {
    if (!options.enablePreload) return;

    const preloadNextImage = () => {
      if (currentIndex < images.length - 1) {
        FastImage.preload([{ uri: images[currentIndex + 1] }]);
      }
    };

    preloadNextImage();

    // 컴포넌트 언마운트 시 메모리 정리
    return () => {
      if (options.enableCache) {
        FastImage.clearMemoryCache();
      }
    };
  }, [currentIndex, images, options.enablePreload, options.enableCache]);

  const goToPrevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsLoading(true);
      setLoadError(false);
    }
  };

  const goToNextPage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsLoading(true);
      setLoadError(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= images.length) {
      setCurrentIndex(page - 1);
      setIsLoading(true);
      setLoadError(false);
    }
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

  const handleToggleOverlay = () => {
    if (options.showOverlay) {
      setOverlayVisible((v) => !v);
    }
  };

  const toggleSettings = () => setShowSettings((v) => !v);

  // FastImage 설정
  const fastImageProps = {
    style: styles.image,
    resizeMode: FastImage.resizeMode[resizeMode],
    priority: FastImage.priority[options.imagePriority],
    cache: options.enableCache ? FastImage.cacheControl.immutable : FastImage.cacheControl.web,
    onLoadStart: () => setIsLoading(true),
    onLoad: () => {
      setIsLoading(false);
      setLoadError(false);
    },
    onError: () => {
      setIsLoading(false);
      setLoadError(true);
    },
  };

  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={handleToggleOverlay}>
        <FastImage
          source={{
            uri: loadError && options.showFallbackImage ? fallbackImage : images[currentIndex],
          }}
          {...fastImageProps}
        />
        {isLoading && options.showLoadingIndicator && (
          <View style={[styles.loadingContainer, { backgroundColor: options.loadingBackgroundColor }]}>
            <ActivityIndicator size="large" color={options.loadingIndicatorColor} />
          </View>
        )}
        {options.showOverlay && (
          <ViewerOverlay
            fileName={fileName}
            currentPage={currentIndex + 1}
            totalPages={images.length}
            onBack={handleBack}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
            visible={overlayVisible}
            onToggle={handleToggleOverlay}
            onPageChange={handlePageChange}
            viewerType={'image'}
            options={options}
            onOptionsChange={handleOptionsChange}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
