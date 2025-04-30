import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useViewerSettings } from '@/hooks/useViewerSettings';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

interface ImageViewerSettingsItemProps {
  onPress: () => void;
}

export default function ImageViewerSettingsItem({ onPress }: ImageViewerSettingsItemProps) {
  const { imageViewerOptions } = useViewerSettings();
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  // 현재 설정 상태를 요약하는 텍스트
  const getSummaryText = () => {
    const { enableDoubleTapZoom, enablePreload, enableCache } = imageViewerOptions;

    const zoomText = enableDoubleTapZoom ? '확대/축소 활성화' : '확대/축소 비활성화';
    const preloadText = enablePreload ? '미리 로드 활성화' : '미리 로드 비활성화';
    const cacheText = enableCache ? '캐시 활성화' : '캐시 비활성화';

    return `${zoomText}, ${preloadText}`;
  };

  return (
    <TouchableOpacity style={[styles.container, { borderBottomColor: colors.border }]} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]}>이미지 뷰어 설정</Text>
        <Text style={[styles.summary, { color: colors.secondaryText }]}>{getSummaryText()}</Text>
      </View>
      <FontAwesome6 name="chevron-right" size={16} color={colors.secondaryText} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  summary: {
    fontSize: 14,
  },
});
