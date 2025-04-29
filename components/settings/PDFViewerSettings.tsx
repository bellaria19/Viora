import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { FontAwesome6 } from '@expo/vector-icons';
import { PDFViewerOptions } from '@/types/option';

interface PDFViewerSettingsProps {
  options: PDFViewerOptions;
  onOptionsChange: (options: Partial<PDFViewerOptions>) => void;
}

export default function PDFViewerSettings({ options, onOptionsChange }: PDFViewerSettingsProps) {
  // 현재 설정 값을 로컬 상태로 관리
  const [localOptions, setLocalOptions] = useState<PDFViewerOptions>(options);

  // 설정 값 변경 핸들러
  const handleOptionChange = <K extends keyof PDFViewerOptions>(key: K, value: PDFViewerOptions[K]) => {
    // 로컬 상태 업데이트
    setLocalOptions((prev) => ({ ...prev, [key]: value }));
    // 부모 컴포넌트에 변경 사항 알림
    onOptionsChange({ [key]: value });
  };

  return (
    <View style={styles.container}>
      {/* 뷰어 모드 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>뷰어 모드</Text>
        <View style={styles.optionRow}>
          <View style={styles.optionGroup}>
            <TouchableOpacity
              style={[styles.modeButton, localOptions.viewMode === 'page' && styles.modeButtonActive]}
              onPress={() => handleOptionChange('viewMode', 'page')}
            >
              <FontAwesome6 name="file" size={16} color={localOptions.viewMode === 'page' ? '#fff' : '#666'} />
              <Text style={[styles.modeButtonText, localOptions.viewMode === 'page' && styles.modeButtonTextActive]}>
                페이지
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, localOptions.viewMode === 'scroll' && styles.modeButtonActive]}
              onPress={() => handleOptionChange('viewMode', 'scroll')}
            >
              <FontAwesome6 name="scroll" size={16} color={localOptions.viewMode === 'scroll' ? '#fff' : '#666'} />
              <Text style={[styles.modeButtonText, localOptions.viewMode === 'scroll' && styles.modeButtonTextActive]}>
                스크롤
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 페이지 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>페이지 설정</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>페이지 간격</Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={20}
              step={1}
              value={localOptions.pageSpacing}
              onValueChange={(value) => handleOptionChange('pageSpacing', value)}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#007AFF"
            />
            <Text style={styles.sliderValue}>{localOptions.pageSpacing}px</Text>
          </View>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>페이지 번호 표시</Text>
          <Switch
            value={localOptions.showPageNumbers}
            onValueChange={(value) => handleOptionChange('showPageNumbers', value)}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
          />
        </View>
      </View>

      {/* 성능 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>성능 설정</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>캐시 사용</Text>
          <Switch
            value={localOptions.enableCache}
            onValueChange={(value) => handleOptionChange('enableCache', value)}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>더블 탭 확대/축소</Text>
          <Switch
            value={localOptions.enableDoubleTapZoom}
            onValueChange={(value) => handleOptionChange('enableDoubleTapZoom', value)}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
          />
        </View>
      </View>

      {/* 화면 표시 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>화면 표시 설정</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>로딩 표시</Text>
          <Switch
            value={localOptions.showLoadingIndicator}
            onValueChange={(value) => handleOptionChange('showLoadingIndicator', value)}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>썸네일 표시</Text>
          <Switch
            value={localOptions.showThumbnails}
            onValueChange={(value) => handleOptionChange('showThumbnails', value)}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
          />
        </View>
      </View>

      {/* RTL 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>기타 설정</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>RTL 방향 (오른쪽에서 왼쪽)</Text>
          <Switch
            value={localOptions.enableRTL}
            onValueChange={(value) => handleOptionChange('enableRTL', value)}
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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
  },
  modeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  modeButtonTextActive: {
    color: '#fff',
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
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    width: 40,
    textAlign: 'right',
    fontSize: 14,
    color: '#666',
  },
});
