import { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ImageViewerOptions } from '@/types/option';

interface ImageViewerSettingsProps {
  options: ImageViewerOptions;
  onOptionsChange: (options: Partial<ImageViewerOptions>) => void;
}

export default function ImageViewerSettings({ options, onOptionsChange }: ImageViewerSettingsProps) {
  // 현재 설정 값을 로컬 상태로 관리
  const [localOptions, setLocalOptions] = useState<ImageViewerOptions>(options);

  // 설정 값 변경 핸들러
  const handleOptionChange = <K extends keyof ImageViewerOptions>(key: K, value: ImageViewerOptions[K]) => {
    // 로컬 상태 업데이트
    setLocalOptions((prev) => ({ ...prev, [key]: value }));
    // 부모 컴포넌트에 변경 사항 알림
    onOptionsChange({ [key]: value });
  };

  return (
    <View style={styles.container}>
      {/* 제스처 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>제스처 설정</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>더블 탭 확대/축소</Text>
          <Switch
            value={localOptions.enableDoubleTapZoom}
            onValueChange={(value) => handleOptionChange('enableDoubleTapZoom', value)}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
          />
        </View>
      </View>

      {/* 성능 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>성능 설정</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>이미지 미리 로드</Text>
          <Switch
            value={localOptions.enablePreload}
            onValueChange={(value) => handleOptionChange('enablePreload', value)}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>이미지 캐싱</Text>
          <Switch
            value={localOptions.enableCache}
            onValueChange={(value) => handleOptionChange('enableCache', value)}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
          />
        </View>
      </View>

      {/* 표시 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>표시 설정</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>로딩 인디케이터 표시</Text>
          <Switch
            value={localOptions.showLoadingIndicator}
            onValueChange={(value) => handleOptionChange('showLoadingIndicator', value)}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>오류 시 기본 이미지 표시</Text>
          <Switch
            value={localOptions.showFallbackImage}
            onValueChange={(value) => handleOptionChange('showFallbackImage', value)}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
          />
        </View>
      </View>

      {/* 로딩 인디케이터 색상 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>색상 설정</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>로딩 인디케이터 색상</Text>
          <View style={styles.colorOptions}>
            <TouchableOpacity
              style={[
                styles.colorOption,
                { backgroundColor: '#fff' },
                localOptions.loadingIndicatorColor === '#fff' && styles.selectedColorOption,
              ]}
              onPress={() => handleOptionChange('loadingIndicatorColor', '#fff')}
            />
            <TouchableOpacity
              style={[
                styles.colorOption,
                { backgroundColor: '#007AFF' },
                localOptions.loadingIndicatorColor === '#007AFF' && styles.selectedColorOption,
              ]}
              onPress={() => handleOptionChange('loadingIndicatorColor', '#007AFF')}
            />
            <TouchableOpacity
              style={[
                styles.colorOption,
                { backgroundColor: '#FF9500' },
                localOptions.loadingIndicatorColor === '#FF9500' && styles.selectedColorOption,
              ]}
              onPress={() => handleOptionChange('loadingIndicatorColor', '#FF9500')}
            />
            <TouchableOpacity
              style={[
                styles.colorOption,
                { backgroundColor: '#FF2D55' },
                localOptions.loadingIndicatorColor === '#FF2D55' && styles.selectedColorOption,
              ]}
              onPress={() => handleOptionChange('loadingIndicatorColor', '#FF2D55')}
            />
          </View>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>로딩 배경 색상</Text>
          <View style={styles.colorOptions}>
            <TouchableOpacity
              style={[
                styles.colorOption,
                { backgroundColor: 'rgba(0,0,0,0.2)' },
                localOptions.loadingBackgroundColor === 'rgba(0,0,0,0.2)' && styles.selectedColorOption,
              ]}
              onPress={() => handleOptionChange('loadingBackgroundColor', 'rgba(0,0,0,0.2)')}
            />
            <TouchableOpacity
              style={[
                styles.colorOption,
                { backgroundColor: 'rgba(0,0,0,0.5)' },
                localOptions.loadingBackgroundColor === 'rgba(0,0,0,0.5)' && styles.selectedColorOption,
              ]}
              onPress={() => handleOptionChange('loadingBackgroundColor', 'rgba(0,0,0,0.5)')}
            />
            <TouchableOpacity
              style={[
                styles.colorOption,
                { backgroundColor: 'rgba(0,0,0,0.8)' },
                localOptions.loadingBackgroundColor === 'rgba(0,0,0,0.8)' && styles.selectedColorOption,
              ]}
              onPress={() => handleOptionChange('loadingBackgroundColor', 'rgba(0,0,0,0.8)')}
            />
            <TouchableOpacity
              style={[
                styles.colorOption,
                { backgroundColor: 'transparent' },
                localOptions.loadingBackgroundColor === 'transparent' && styles.selectedColorOption,
              ]}
              onPress={() => handleOptionChange('loadingBackgroundColor', 'transparent')}
            >
              <FontAwesome6 name="slash" size={16} color="#ddd" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 15,
    color: '#333',
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  colorOption: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorOption: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
});
