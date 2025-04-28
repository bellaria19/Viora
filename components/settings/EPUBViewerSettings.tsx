import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { FontAwesome6 } from '@expo/vector-icons';
import { EPUBViewerOptions } from '@/types/option';
import { SettingsSection } from '@/components/SettingsBottomSheet';

interface EPUBViewerSettingsProps {
  options: EPUBViewerOptions;
  onOptionsChange: (options: Partial<EPUBViewerOptions>) => void;
}

export default function EPUBViewerSettings({ options, onOptionsChange }: EPUBViewerSettingsProps) {
  // 현재 설정 값을 로컬 상태로 관리
  const [localOptions, setLocalOptions] = useState<EPUBViewerOptions>(options);

  // 설정 값 변경 핸들러
  const handleOptionChange = <K extends keyof EPUBViewerOptions>(key: K, value: EPUBViewerOptions[K]) => {
    // 로컬 상태 업데이트
    setLocalOptions((prev) => ({ ...prev, [key]: value }));
    // 부모 컴포넌트에 변경 사항 알림
    onOptionsChange({ [key]: value });
  };

  // 테마 옵션
  const themes = [
    { id: 'light', label: '라이트', bgColor: '#fff', textColor: '#333' },
    { id: 'dark', label: '다크', bgColor: '#1a1a1a', textColor: '#eee' },
    { id: 'sepia', label: '세피아', bgColor: '#f8f1e3', textColor: '#5b4636' },
  ] as const;

  // 폰트 옵션
  const fonts = [
    { id: 'System', label: '시스템' },
    { id: 'SpaceMono', label: '스페이스 모노' },
    { id: 'Arial', label: '아리알' },
    { id: 'Georgia', label: '조지아' },
  ];

  // 설정 섹션 구성
  const sections = useMemo<SettingsSection[]>(
    () => [
      {
        title: '뷰어 모드',
        data: [
          {
            key: 'viewMode',
            renderItem: () => (
              <View style={styles.optionRow}>
                <View style={styles.optionGroup}>
                  <TouchableOpacity
                    style={[styles.modeButton, localOptions.viewMode === 'page' && styles.modeButtonActive]}
                    onPress={() => handleOptionChange('viewMode', 'page')}
                  >
                    <FontAwesome6 name="file" size={16} color={localOptions.viewMode === 'page' ? '#fff' : '#666'} />
                    <Text
                      style={[styles.modeButtonText, localOptions.viewMode === 'page' && styles.modeButtonTextActive]}
                    >
                      페이지
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modeButton, localOptions.viewMode === 'scroll' && styles.modeButtonActive]}
                    onPress={() => handleOptionChange('viewMode', 'scroll')}
                  >
                    <FontAwesome6
                      name="scroll"
                      size={16}
                      color={localOptions.viewMode === 'scroll' ? '#fff' : '#666'}
                    />
                    <Text
                      style={[styles.modeButtonText, localOptions.viewMode === 'scroll' && styles.modeButtonTextActive]}
                    >
                      스크롤
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ),
          },
        ],
      },
      {
        title: '테마',
        data: [
          {
            key: 'theme',
            renderItem: () => (
              <View style={styles.settingItem}>
                <View style={styles.themeOptions}>
                  {themes.map((theme) => (
                    <TouchableOpacity
                      key={theme.id}
                      style={[
                        styles.themeOption,
                        { backgroundColor: theme.bgColor },
                        localOptions.theme === theme.id && styles.selectedThemeOption,
                      ]}
                      onPress={() => {
                        handleOptionChange('theme', theme.id);
                        handleOptionChange('backgroundColor', theme.bgColor);
                        handleOptionChange('textColor', theme.textColor);
                      }}
                    >
                      <Text style={[styles.themeLabel, { color: theme.textColor }]}>{theme.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ),
          },
        ],
      },
      {
        title: '글꼴',
        data: [
          {
            key: 'fontFamily',
            renderItem: () => (
              <View style={styles.settingItem}>
                <View style={styles.fontOptions}>
                  {fonts.map((font) => (
                    <TouchableOpacity
                      key={font.id}
                      style={[styles.fontOption, localOptions.fontFamily === font.id && styles.selectedFontOption]}
                      onPress={() => handleOptionChange('fontFamily', font.id)}
                    >
                      <Text
                        style={[
                          styles.fontLabel,
                          { fontFamily: font.id },
                          localOptions.fontFamily === font.id && styles.selectedFontLabel,
                        ]}
                      >
                        {font.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ),
          },
        ],
      },
      {
        title: '글자 크기',
        data: [
          {
            key: 'fontSize',
            renderItem: () => (
              <View style={styles.settingItem}>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderValueLabel}>작게</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={12}
                    maximumValue={28}
                    step={1}
                    value={localOptions.fontSize}
                    onValueChange={(value) => handleOptionChange('fontSize', value)}
                    minimumTrackTintColor="#007AFF"
                    maximumTrackTintColor="#ddd"
                    thumbTintColor="#007AFF"
                  />
                  <Text style={styles.sliderValueLabel}>크게</Text>
                  <Text style={styles.sliderValue}>{Math.round(localOptions.fontSize)}px</Text>
                </View>
              </View>
            ),
          },
        ],
      },
      {
        title: '줄 간격',
        data: [
          {
            key: 'lineHeight',
            renderItem: () => (
              <View style={styles.settingItem}>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderValueLabel}>좁게</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={1.0}
                    maximumValue={2.5}
                    step={0.1}
                    value={localOptions.lineHeight}
                    onValueChange={(value) => handleOptionChange('lineHeight', value)}
                    minimumTrackTintColor="#007AFF"
                    maximumTrackTintColor="#ddd"
                    thumbTintColor="#007AFF"
                  />
                  <Text style={styles.sliderValueLabel}>넓게</Text>
                  <Text style={styles.sliderValue}>{localOptions.lineHeight.toFixed(1)}</Text>
                </View>
              </View>
            ),
          },
        ],
      },
      {
        title: '여백',
        data: [
          {
            key: 'margin',
            renderItem: () => (
              <View style={styles.settingItem}>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderValueLabel}>좁게</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={8}
                    maximumValue={40}
                    step={2}
                    value={localOptions.marginHorizontal}
                    onValueChange={(value) => {
                      handleOptionChange('marginHorizontal', value);
                      handleOptionChange('marginVertical', value);
                    }}
                    minimumTrackTintColor="#007AFF"
                    maximumTrackTintColor="#ddd"
                    thumbTintColor="#007AFF"
                  />
                  <Text style={styles.sliderValueLabel}>넓게</Text>
                  <Text style={styles.sliderValue}>{Math.round(localOptions.marginHorizontal)}px</Text>
                </View>
              </View>
            ),
          },
        ],
      },
      {
        title: '기능 설정',
        data: [
          {
            key: 'enableTOC',
            renderItem: () => (
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>목차 표시</Text>
                <Switch
                  value={localOptions.enableTOC}
                  onValueChange={(value) => handleOptionChange('enableTOC', value)}
                  trackColor={{ false: '#ddd', true: '#007AFF' }}
                />
              </View>
            ),
          },
          {
            key: 'enableBookmark',
            renderItem: () => (
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>북마크 기능</Text>
                <Switch
                  value={localOptions.enableBookmark}
                  onValueChange={(value) => handleOptionChange('enableBookmark', value)}
                  trackColor={{ false: '#ddd', true: '#007AFF' }}
                />
              </View>
            ),
          },
          {
            key: 'enableSearch',
            renderItem: () => (
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>검색 기능</Text>
                <Switch
                  value={localOptions.enableSearch}
                  onValueChange={(value) => handleOptionChange('enableSearch', value)}
                  trackColor={{ false: '#ddd', true: '#007AFF' }}
                />
              </View>
            ),
          },
          {
            key: 'enableTextSelection',
            renderItem: () => (
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>텍스트 선택 기능</Text>
                <Switch
                  value={localOptions.enableTextSelection}
                  onValueChange={(value) => handleOptionChange('enableTextSelection', value)}
                  trackColor={{ false: '#ddd', true: '#007AFF' }}
                />
              </View>
            ),
          },
          {
            key: 'enableAnnotation',
            renderItem: () => (
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>주석 기능</Text>
                <Switch
                  value={localOptions.enableAnnotation}
                  onValueChange={(value) => handleOptionChange('enableAnnotation', value)}
                  trackColor={{ false: '#ddd', true: '#007AFF' }}
                />
              </View>
            ),
          },
          {
            key: 'enableRTL',
            renderItem: () => (
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>RTL 방향 (오른쪽에서 왼쪽)</Text>
                <Switch
                  value={localOptions.enableRTL}
                  onValueChange={(value) => handleOptionChange('enableRTL', value)}
                  trackColor={{ false: '#ddd', true: '#007AFF' }}
                />
              </View>
            ),
          },
        ],
      },
      {
        title: '미리보기',
        data: [
          {
            key: 'preview',
            renderItem: () => (
              <View style={styles.settingItem}>
                <View
                  style={[
                    styles.textPreview,
                    {
                      backgroundColor: localOptions.backgroundColor,
                      paddingHorizontal: localOptions.marginHorizontal,
                      paddingVertical: localOptions.marginVertical,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontFamily: localOptions.fontFamily,
                      fontSize: localOptions.fontSize,
                      lineHeight: localOptions.fontSize * localOptions.lineHeight,
                      color: localOptions.textColor,
                    }}
                  >
                    이것은 미리보기 텍스트입니다. 설정을 변경하면 이 텍스트의 모양이 바뀝니다.
                  </Text>
                  <Text
                    style={{
                      fontFamily: localOptions.fontFamily,
                      fontSize: localOptions.fontSize,
                      lineHeight: localOptions.fontSize * localOptions.lineHeight,
                      color: localOptions.linkColor,
                      textDecorationLine: 'underline',
                      marginTop: 8,
                    }}
                  >
                    이것은 링크 텍스트 예시입니다.
                  </Text>
                </View>
              </View>
            ),
          },
        ],
      },
    ],
    [localOptions, handleOptionChange],
  );

  return { sections };
}

const styles = StyleSheet.create({
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOption: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedThemeOption: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  themeLabel: {
    fontWeight: '500',
  },
  fontOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fontOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  selectedFontOption: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  fontLabel: {
    fontSize: 15,
    color: '#333',
  },
  selectedFontLabel: {
    color: '#007AFF',
    fontWeight: '500',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  sliderValueLabel: {
    fontSize: 13,
    color: '#888',
    width: 32,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    width: 45,
    textAlign: 'right',
  },
  textPreview: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
