import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useViewerSettings } from '@/hooks/useViewerSettings';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

interface TextViewerSettingsItemProps {
  onPress: () => void;
}

export default function TextViewerSettingsItem({ onPress }: TextViewerSettingsItemProps) {
  const { textViewerOptions } = useViewerSettings();
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  // 현재 설정 상태를 요약하는 텍스트
  const getSummaryText = () => {
    const { fontSize, fontFamily, theme } = textViewerOptions;

    let themeText;
    switch (theme) {
      case 'light':
        themeText = '라이트';
        break;
      case 'dark':
        themeText = '다크';
        break;
      case 'sepia':
        themeText = '세피아';
        break;
      default:
        themeText = '라이트';
    }

    return `${fontFamily}, ${fontSize}pt, ${themeText}`;
  };

  return (
    <TouchableOpacity style={[styles.container, { borderBottomColor: colors.border }]} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }]}>텍스트 뷰어 설정</Text>
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
