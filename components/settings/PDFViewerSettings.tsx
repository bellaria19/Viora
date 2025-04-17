import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import { PDFViewerSettingsProps } from '@/types/option';

export default function PDFViewerSettings({ options, onOptionsChange, onClose, visible }: PDFViewerSettingsProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PDF 뷰어 설정</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>닫기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* 뷰어 모드 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>뷰어 모드</Text>
          <View style={styles.modeOptions}>
            <TouchableOpacity
              style={[styles.modeOption, options.viewMode === 'scroll' && styles.selectedMode]}
              onPress={() => onOptionsChange({ viewMode: 'scroll' })}
            >
              <Icon name="arrows-v" size={20} color={options.viewMode === 'scroll' ? '#fff' : '#333'} />
              <Text style={[styles.modeText, options.viewMode === 'scroll' && styles.selectedText]}>스크롤 모드</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeOption, options.viewMode === 'page' && styles.selectedMode]}
              onPress={() => onOptionsChange({ viewMode: 'page' })}
            >
              <Icon name="book" size={20} color={options.viewMode === 'page' ? '#fff' : '#333'} />
              <Text style={[styles.modeText, options.viewMode === 'page' && styles.selectedText]}>페이지 모드</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* RTL 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RTL (오른쪽에서 왼쪽) 모드</Text>
          <TouchableOpacity
            style={[styles.rtlOption, options.enableRTL && styles.selectedMode]}
            onPress={() => onOptionsChange({ enableRTL: !options.enableRTL })}
          >
            <Icon
              name={options.enableRTL ? 'align-right' : 'align-left'}
              size={20}
              color={options.enableRTL ? '#fff' : '#333'}
            />
            <Text style={[styles.rtlOptionText, options.enableRTL && styles.selectedText]}>
              {options.enableRTL ? 'RTL 모드 켜짐' : 'RTL 모드 꺼짐'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    flex: 1,
    marginHorizontal: 5,
  },
  rtlOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedMode: {
    backgroundColor: '#007AFF',
  },
  modeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  rtlOptionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
});
