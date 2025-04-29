import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import ViewerOverlay from './ViewerOverlay';
import { useNavigation } from '@react-navigation/native';
import { ImageViewerOptions } from '@/types/option';
import SettingsBottomSheet from '@/components/SettingsBottomSheet';
import ImageViewerSettings from '@/components/settings/ImageViewerSettings';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
};

interface ImageViewerProps {
  uri: string;
  onSettings?: () => void;
}

export default function ImageViewer({ uri }: ImageViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const navigation = useNavigation();

  // 이미지 뷰어 설정
  const [viewerOptions, setViewerOptions] = useState<ImageViewerOptions>({
    enableDoubleTapZoom: true,
    enablePreload: true,
    enableCache: true,
    showLoadingIndicator: true,
    showFallbackImage: true,
    loadingIndicatorColor: '#fff',
    loadingBackgroundColor: 'rgba(0,0,0,0.5)',
  });

  // 제스처 상태값
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // 핀치 제스처
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  // 팬 제스처
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value > 1) {
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;

      // 이미지가 화면 밖으로 너무 많이 벗어나지 않도록 조정
      const maxTranslateX = (SCREEN_WIDTH * (scale.value - 1)) / 2;
      const maxTranslateY = (SCREEN_HEIGHT * (scale.value - 1)) / 2;

      if (Math.abs(translateX.value) > maxTranslateX) {
        translateX.value = withSpring(Math.sign(translateX.value) * maxTranslateX, SPRING_CONFIG);
        savedTranslateX.value = translateX.value;
      }

      if (Math.abs(translateY.value) > maxTranslateY) {
        translateY.value = withSpring(Math.sign(translateY.value) * maxTranslateY, SPRING_CONFIG);
        savedTranslateY.value = translateY.value;
      }
    });

  // 더블 탭 제스처
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (!viewerOptions.enableDoubleTapZoom) return;

      if (scale.value > 1) {
        scale.value = withSpring(1, SPRING_CONFIG);
        translateX.value = withSpring(0, SPRING_CONFIG);
        translateY.value = withSpring(0, SPRING_CONFIG);
        savedScale.value = 1;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        scale.value = withSpring(2, SPRING_CONFIG);
        savedScale.value = 2;
      }
    });

  const composed = Gesture.Simultaneous(Gesture.Race(pinchGesture, doubleTapGesture), panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }));

  // 설정 변경 핸들러
  const handleSettingsChange = (newOptions: Partial<ImageViewerOptions>) => {
    setViewerOptions((prev) => ({ ...prev, ...newOptions }));
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setOverlayVisible((v) => !v)}>
        <View style={styles.container}>
          <GestureDetector gesture={composed}>
            <Animated.View style={animatedStyle}>
              <Image
                source={{ uri }}
                style={styles.image}
                resizeMode="contain"
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
              />
              {isLoading && viewerOptions.showLoadingIndicator && (
                <ActivityIndicator
                  size="large"
                  color={viewerOptions.loadingIndicatorColor}
                  style={[styles.loading, { backgroundColor: viewerOptions.loadingBackgroundColor }]}
                />
              )}
            </Animated.View>
          </GestureDetector>
          <ViewerOverlay
            visible={overlayVisible}
            onBack={() => navigation.goBack()}
            onSettings={() => setSettingsVisible(true)}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* 설정 바텀 시트 */}
      <SettingsBottomSheet title="이미지 설정" isVisible={settingsVisible} onClose={() => setSettingsVisible(false)}>
        <ImageViewerSettings options={viewerOptions} onOptionsChange={handleSettingsChange} />
      </SettingsBottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
