import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useViewerSettings } from '@/hooks/useViewerSettings';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

interface ZipViewerSettingsItemProps {
  onPress: () => void;
}

export default function ZipViewerSettingsItem({ onPress }: ZipViewerSettingsItemProps) {
  const { zipViewerOptions } = useViewerSettings();
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  // 현재 설정 상태를 요약하는 텍스트
  const getSummaryText = () => {
    const { sortImagesBy, autoPlayEnabled, autoPlayInterval, loopEnabled } = zipViewerOptions;

    let sortText;
    switch (sortImagesBy) {
      case 'name':
        sortText = '이름순 정렬';
        break;
      case 'date':
        sortText = '날짜순 정렬';
        break;
      case 'size':
        sortText = '크기순 정렬';
        break;
      default:
        sortText = '이름순 정렬';
    }

    const autoPlayText = autoPlayEnabled ? `자동 재생(${autoPlayInterval}초)` : '수동 재생';
    const loopText = loopEnabled ? '반복 활성화' : '반복 비활성화';

    return `${sortText}, ${autoPlayText}`;
  };

  return (
    <TouchableOpacity style={[styles.container, { borderBottomColor: colors.border }]} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]}>ZIP 이미지 뷰어 설정</Text>
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
