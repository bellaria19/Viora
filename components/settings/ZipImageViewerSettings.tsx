import { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ImageViewerOptions } from '@/types/option';

// ZIP 이미지 뷰어는 기본적으로 ImageViewer 설정을 사용하지만
// ZIP 압축 파일에 특화된 일부 설정이 추가될 수 있음
interface ZipImageViewerOptions extends ImageViewerOptions {
  sortImagesBy: 'name' | 'date' | 'size';
  autoPlayEnabled: boolean;
  autoPlayInterval: number; // 초 단위
  loopEnabled: boolean;
}

interface ZipImageViewerSettingsProps {
  options: ZipImageViewerOptions;
  onOptionsChange: (options: Partial<ZipImageViewerOptions>) => void;
}

export default function ZipImageViewerSettings({ options, onOptionsChange }: ZipImageViewerSettingsProps) {
  // 현재 설정 값을 로컬 상태로 관리
  const [localOptions, setLocalOptions] = useState<ZipImageViewerOptions>(options);

  // 설정 값 변경 핸들러
  const handleOptionChange = <K extends keyof ZipImageViewerOptions>(key: K, value: ZipImageViewerOptions[K]) => {
    // 로컬 상태 업데이트
    setLocalOptions((prev) => ({ ...prev, [key]: value }));
    // 부모 컴포넌트에 변경 사항 알림
    onOptionsChange({ [key]: value });
  };

  // 정렬 옵션
  const sortOptions = [
    { id: 'name', label: '이름', icon: 'arrow-down-a-z' },
    { id: 'date', label: '날짜', icon: 'calendar' },
    { id: 'size', label: '크기', icon: 'weight-scale' },
  ] as const;

  // 자동 재생 간격 옵션 (초)
  const intervals = [1, 2, 3, 5, 10];

  return (
    <View style={styles.container}>
      {/* 이미지 정렬 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>이미지 정렬</Text>
        <View style={styles.sortOptions}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.sortOption, localOptions.sortImagesBy === option.id && styles.selectedSortOption]}
              onPress={() => handleOptionChange('sortImagesBy', option.id)}
            >
              <FontAwesome6
                name={option.icon as any}
                size={16}
                color={localOptions.sortImagesBy === option.id ? '#007AFF' : '#666'}
              />
              <Text
                style={[
                  styles.sortOptionText,
                  localOptions.sortImagesBy === option.id && styles.selectedSortOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 자동 재생 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>자동 재생</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>자동 재생 사용</Text>
          <Switch
            value={localOptions.autoPlayEnabled}
            onValueChange={(value) => handleOptionChange('autoPlayEnabled', value)}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
          />
        </View>
        {localOptions.autoPlayEnabled && (
          <>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>반복 재생</Text>
              <Switch
                value={localOptions.loopEnabled}
                onValueChange={(value) => handleOptionChange('loopEnabled', value)}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
              />
            </View>
            <View style={styles.settingItemColumn}>
              <Text style={styles.settingLabel}>재생 간격</Text>
              <View style={styles.intervalOptions}>
                {intervals.map((interval) => (
                  <TouchableOpacity
                    key={interval}
                    style={[
                      styles.intervalOption,
                      localOptions.autoPlayInterval === interval && styles.selectedIntervalOption,
                    ]}
                    onPress={() => handleOptionChange('autoPlayInterval', interval)}
                  >
                    <Text
                      style={[
                        styles.intervalOptionText,
                        localOptions.autoPlayInterval === interval && styles.selectedIntervalOptionText,
                      ]}
                    >
                      {interval}초
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </View>

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
  sortOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  selectedSortOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  sortOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedSortOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingItemColumn: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 15,
    color: '#333',
  },
  intervalOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  intervalOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedIntervalOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  intervalOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedIntervalOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
