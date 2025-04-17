import { View, Text, Switch, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ImageViewerSettingsProps } from '@/types/option';

export default function ImageViewerSettings({ options, onOptionsChange, onClose, visible }: ImageViewerSettingsProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>이미지 뷰어 설정</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>닫기</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기능 설정</Text>
          <View style={styles.option}>
            <Text>더블 탭 확대/축소</Text>
            <Switch
              value={options.enableDoubleTapZoom}
              onValueChange={(value) => onOptionsChange({ enableDoubleTapZoom: value })}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>성능 설정</Text>
          <View style={styles.option}>
            <Text>다음 이미지 프리로딩</Text>
            <Switch
              value={options.enablePreload}
              onValueChange={(value) => onOptionsChange({ enablePreload: value })}
            />
          </View>
          <View style={styles.option}>
            <Text>이미지 캐싱</Text>
            <Switch value={options.enableCache} onValueChange={(value) => onOptionsChange({ enableCache: value })} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>화면 표시 설정</Text>
          <View style={styles.option}>
            <Text>로딩 표시</Text>
            <Switch
              value={options.showLoadingIndicator}
              onValueChange={(value) => onOptionsChange({ showLoadingIndicator: value })}
            />
          </View>
          <View style={styles.option}>
            <Text>오류 시 대체 이미지</Text>
            <Switch
              value={options.showFallbackImage}
              onValueChange={(value) => onOptionsChange({ showFallbackImage: value })}
            />
          </View>
          <View style={styles.option}>
            <Text>오버레이 표시</Text>
            <Switch value={options.showOverlay} onValueChange={(value) => onOptionsChange({ showOverlay: value })} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>스타일 설정</Text>
          <View style={styles.option}>
            <Text>로딩 표시 색상</Text>
            <TextInput
              style={styles.colorInput}
              value={options.loadingIndicatorColor}
              onChangeText={(value) => onOptionsChange({ loadingIndicatorColor: value })}
              placeholder="#0000ff"
            />
          </View>
          <View style={styles.option}>
            <Text>로딩 배경 색상</Text>
            <TextInput
              style={styles.colorInput}
              value={options.loadingBackgroundColor}
              onChangeText={(value) => onOptionsChange({ loadingBackgroundColor: value })}
              placeholder="rgba(0,0,0,0.3)"
            />
          </View>
        </View>
      </ScrollView>
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
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  colorInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 4,
    width: 120,
  },
});
