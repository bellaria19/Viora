import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { TextViewerOptions } from '@/types/option';
import { SettingsSection } from '@/components/SettingsBottomSheet';

interface TextViewerSettingsProps {
  options: TextViewerOptions;
  onOptionsChange: (options: Partial<TextViewerOptions>) => void;
}

export default function TextViewerSettings({ options, onOptionsChange }: TextViewerSettingsProps) {
  // 현재 설정 값을 로컬 상태로 관리
  const [localOptions, setLocalOptions] = useState<TextViewerOptions>(options);

  // 설정 값 변경 핸들러
  const handleOptionChange = <K extends keyof TextViewerOptions>(key: K, value: TextViewerOptions[K]) => {
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
                      backgroundColor: getThemeBackground(localOptions.theme),
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
                      color: getThemeTextColor(localOptions.theme),
                    }}
                  >
                    이것은 미리보기 텍스트입니다. 설정을 변경하면 이 텍스트의 모양이 바뀝니다.
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

// 테마에 따른 배경색 가져오기
function getThemeBackground(theme: 'light' | 'dark' | 'sepia'): string {
  switch (theme) {
    case 'light':
      return '#fff';
    case 'dark':
      return '#1a1a1a';
    case 'sepia':
      return '#f8f1e3';
    default:
      return '#fff';
  }
}

// 테마에 따른 텍스트 색상 가져오기
function getThemeTextColor(theme: 'light' | 'dark' | 'sepia'): string {
  switch (theme) {
    case 'light':
      return '#333';
    case 'dark':
      return '#eee';
    case 'sepia':
      return '#5b4636';
    default:
      return '#333';
  }
}

const styles = StyleSheet.create({
  settingItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
