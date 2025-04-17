import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/FontAwesome';
import PDFViewerSettings from '@/components/settings/PDFViewerSettings';
import TextViewerSettings from '@/components/settings/TextViewerSettings';
import EPUBViewerSettings from '@/components/settings/EPUBViewerSettings';
import ImageViewerSettings from '@/components/settings/ImageViewerSettings';
import { TextViewerOptions, EPUBViewerOptions, PDFViewerOptions, ImageViewerOptions } from '@/types/option';

type ViewerType = 'text' | 'epub' | 'pdf' | 'image';

interface ViewerOverlayBaseProps {
  fileName: string;
  currentPage: number;
  totalPages: number;
  onBack: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  visible: boolean;
  onToggle: () => void;
  onPageChange?: (page: number) => void;
  viewerType: ViewerType;
}

interface TextViewerOverlayProps extends ViewerOverlayBaseProps {
  viewerType: 'text';
  options: TextViewerOptions;
  onOptionsChange: (newOptions: Partial<TextViewerOptions>) => void;
}

interface EPUBViewerOverlayProps extends ViewerOverlayBaseProps {
  viewerType: 'epub';
  options: EPUBViewerOptions;
  onOptionsChange: (newOptions: Partial<EPUBViewerOptions>) => void;
}

interface PDFViewerOverlayProps extends ViewerOverlayBaseProps {
  viewerType: 'pdf';
  options: PDFViewerOptions;
  onOptionsChange: (newOptions: Partial<PDFViewerOptions>) => void;
}

interface ImageViewerOverlayProps extends ViewerOverlayBaseProps {
  viewerType: 'image';
  options: ImageViewerOptions;
  onOptionsChange: (newOptions: Partial<ImageViewerOptions>) => void;
}

type ViewerOverlayProps =
  | TextViewerOverlayProps
  | EPUBViewerOverlayProps
  | PDFViewerOverlayProps
  | ImageViewerOverlayProps;

const { width, height } = Dimensions.get('window');
const TOUCH_AREA_HEIGHT = height * 0.7;
const TOUCH_AREA_Y_OFFSET = (height - TOUCH_AREA_HEIGHT) / 2;

export default function ViewerOverlay({
  fileName,
  currentPage,
  totalPages,
  onBack,
  onPrevPage,
  onNextPage,
  visible,
  onToggle,
  onPageChange,
  viewerType,
  options,
  onOptionsChange,
}: ViewerOverlayProps) {
  const [showSettings, setShowSettings] = useState(false);
  if (!visible) return null;

  // 페이지가 1개 이하일 때 비활성화
  const isSinglePage = totalPages <= 1;

  const renderSettings = () => {
    switch (viewerType) {
      case 'text':
        return (
          <TextViewerSettings
            visible={showSettings}
            options={options as TextViewerOptions}
            onOptionsChange={onOptionsChange}
            onClose={() => setShowSettings(false)}
          />
        );
      case 'epub':
        return (
          <EPUBViewerSettings
            visible={showSettings}
            options={options as EPUBViewerOptions}
            onOptionsChange={onOptionsChange}
            onClose={() => setShowSettings(false)}
          />
        );
      case 'pdf':
        return (
          <PDFViewerSettings
            visible={showSettings}
            options={options as PDFViewerOptions}
            onOptionsChange={onOptionsChange}
            onClose={() => setShowSettings(false)}
          />
        );
      case 'image':
        return (
          <ImageViewerSettings
            visible={showSettings}
            options={options as ImageViewerOptions}
            onOptionsChange={onOptionsChange}
            onClose={() => setShowSettings(false)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 오버레이 전체를 터치하면 숨김/표시 토글 */}
      <TouchableOpacity activeOpacity={1} style={styles.overlayTouchable} onPress={onToggle}>
        {visible && (
          <View style={styles.touchArea}>
            <Text style={styles.touchGuideText}>터치하여 메뉴 숨기기</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* 상단 오버레이 */}
      <SafeAreaView style={styles.safeTop} edges={['top']}>
        <View style={styles.topOverlay} pointerEvents="box-none">
          <TouchableOpacity onPress={onBack} style={styles.button}>
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.fileName} numberOfLines={1}>
            {fileName}
          </Text>
          <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.button}>
            <Icon name="cog" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* 하단 오버레이 */}
      <View style={styles.bottomOverlay} pointerEvents="box-none">
        {/* 페이지 이동 버튼과 페이지 정보 */}
        {!isSinglePage && (
          <View style={styles.pageRow}>
            <TouchableOpacity onPress={onPrevPage} style={styles.pageButtonArea}>
              <Icon name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.pageInfo}>
              {currentPage} / {totalPages}
            </Text>
            <TouchableOpacity onPress={onNextPage} style={styles.pageButtonArea}>
              <Icon name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* 슬라이더 */}
        {!isSinglePage && (
          <View style={styles.sliderRow}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={totalPages > 0 ? totalPages : 1}
              value={currentPage}
              step={1}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#888"
              thumbTintColor="#fff"
              onSlidingComplete={(value) => onPageChange?.(value)}
            />
          </View>
        )}
      </View>

      {/* 설정 패널 */}
      {renderSettings()}
    </>
  );
}

const styles = StyleSheet.create({
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  touchArea: {
    position: 'absolute',
    width: width * 0.6,
    height: TOUCH_AREA_HEIGHT,
    top: TOUCH_AREA_Y_OFFSET,
    left: width * 0.2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchGuideText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  safeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  topOverlay: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  button: {
    padding: 8,
  },
  fileName: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 20,
  },
  pageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sliderRow: {
    alignItems: 'center',
    marginBottom: 8,
  },
  slider: {
    width: width * 0.8,
    height: 24,
  },
  pageButtonArea: {
    padding: 8,
    marginHorizontal: 8,
  },
  pageInfo: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 16,
  },
});
