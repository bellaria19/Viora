import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { EPUBViewerSettingsProps } from '@/types/option';
import Icon from '@expo/vector-icons/FontAwesome';

const FONT_FAMILIES = ['System', 'Helvetica', 'Times New Roman', 'Courier'];
const THEMES = [
  { id: 'light', label: '라이트', backgroundColor: '#FFFFFF', textColor: '#000000' },
  { id: 'dark', label: '다크', backgroundColor: '#1A1A1A', textColor: '#FFFFFF' },
  { id: 'sepia', label: '세피아', backgroundColor: '#F4ECD8', textColor: '#5B4636' },
];

export default function EPUBViewerSettings({ options, onOptionsChange, onClose, visible }: EPUBViewerSettingsProps) {
  const handleViewModeChange = (mode: 'scroll' | 'page') => {
    onOptionsChange({ viewMode: mode });
  };

  const handleRTLChange = (value: boolean) => {
    onOptionsChange({ enableRTL: value });
  };

  const handleFontSizeChange = (value: number) => {
    onOptionsChange({ fontSize: value });
  };

  const handleLineHeightChange = (value: number) => {
    onOptionsChange({ lineHeight: value });
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    onOptionsChange({ fontFamily });
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'sepia') => {
    onOptionsChange({ theme });
  };

  const handleMarginChange = (horizontal: number, vertical: number) => {
    onOptionsChange({
      marginHorizontal: horizontal,
      marginVertical: vertical,
    });
  };

  const handleFeatureToggle = (
    feature: keyof Pick<
      typeof options,
      'enableTOC' | 'enableAnnotation' | 'enableBookmark' | 'enableSearch' | 'enableTextSelection'
    >,
  ) => {
    onOptionsChange({ [feature]: !options[feature] });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.content}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>EPUB 뷰어 설정</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="times" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* 뷰어 모드 설정 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>뷰어 모드</Text>
              <View style={styles.viewModeContainer}>
                <TouchableOpacity
                  style={[styles.viewModeButton, options.viewMode === 'scroll' && styles.selectedViewMode]}
                  onPress={() => handleViewModeChange('scroll')}
                >
                  <Icon name="arrows-v" size={20} color={options.viewMode === 'scroll' ? '#fff' : '#333'} />
                  <Text style={[styles.viewModeText, options.viewMode === 'scroll' && styles.selectedViewModeText]}>
                    스크롤 모드
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.viewModeButton, options.viewMode === 'page' && styles.selectedViewMode]}
                  onPress={() => handleViewModeChange('page')}
                >
                  <Icon name="book" size={20} color={options.viewMode === 'page' ? '#fff' : '#333'} />
                  <Text style={[styles.viewModeText, options.viewMode === 'page' && styles.selectedViewModeText]}>
                    페이지 모드
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* RTL 설정 */}
            <View style={styles.section}>
              <View style={styles.switchRow}>
                <Text style={styles.sectionTitle}>RTL (오른쪽에서 왼쪽) 모드</Text>
                <Switch
                  value={options.enableRTL}
                  onValueChange={handleRTLChange}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={options.enableRTL ? '#007AFF' : '#f4f3f4'}
                />
              </View>
            </View>

            {/* 글자 크기 설정 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>글자 크기</Text>
              <Slider
                style={styles.slider}
                minimumValue={12}
                maximumValue={32}
                step={1}
                value={options.fontSize}
                onValueChange={handleFontSizeChange}
              />
              <Text style={styles.valueText}>{options.fontSize}px</Text>
            </View>

            {/* 줄 간격 설정 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>줄 간격</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={2.5}
                step={0.1}
                value={options.lineHeight}
                onValueChange={handleLineHeightChange}
              />
              <Text style={styles.valueText}>{options.lineHeight.toFixed(1)}</Text>
            </View>

            {/* 글꼴 설정 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>글꼴</Text>
              <View style={styles.fontFamilyContainer}>
                {FONT_FAMILIES.map((font) => (
                  <TouchableOpacity
                    key={font}
                    style={[styles.fontFamilyButton, options.fontFamily === font && styles.selectedFontFamily]}
                    onPress={() => handleFontFamilyChange(font)}
                  >
                    <Text style={[styles.fontFamilyText, options.fontFamily === font && styles.selectedFontFamilyText]}>
                      {font}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 테마 설정 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>테마</Text>
              <View style={styles.themeContainer}>
                {THEMES.map((theme) => (
                  <TouchableOpacity
                    key={theme.id}
                    style={[
                      styles.themeButton,
                      { backgroundColor: theme.backgroundColor },
                      options.theme === theme.id && styles.selectedTheme,
                    ]}
                    onPress={() => handleThemeChange(theme.id as 'light' | 'dark' | 'sepia')}
                  >
                    <Text
                      style={[
                        styles.themeText,
                        { color: theme.textColor },
                        options.theme === theme.id && styles.selectedThemeText,
                      ]}
                    >
                      {theme.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 여백 설정 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>여백</Text>
              <View style={styles.marginContainer}>
                <View style={styles.marginSliderContainer}>
                  <Text style={styles.marginLabel}>가로 여백</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={8}
                    maximumValue={32}
                    step={2}
                    value={options.marginHorizontal}
                    onValueChange={(value) => handleMarginChange(value, options.marginVertical)}
                  />
                  <Text style={styles.valueText}>{options.marginHorizontal}px</Text>
                </View>
                <View style={styles.marginSliderContainer}>
                  <Text style={styles.marginLabel}>세로 여백</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={8}
                    maximumValue={32}
                    step={2}
                    value={options.marginVertical}
                    onValueChange={(value) => handleMarginChange(options.marginHorizontal, value)}
                  />
                  <Text style={styles.valueText}>{options.marginVertical}px</Text>
                </View>
              </View>
            </View>

            {/* 기능 설정 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>기능 설정</Text>
              <View style={styles.featureContainer}>
                <View style={styles.switchRow}>
                  <Text style={styles.featureText}>목차</Text>
                  <Switch
                    value={options.enableTOC}
                    onValueChange={() => handleFeatureToggle('enableTOC')}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={options.enableTOC ? '#007AFF' : '#f4f3f4'}
                  />
                </View>
                <View style={styles.switchRow}>
                  <Text style={styles.featureText}>주석</Text>
                  <Switch
                    value={options.enableAnnotation}
                    onValueChange={() => handleFeatureToggle('enableAnnotation')}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={options.enableAnnotation ? '#007AFF' : '#f4f3f4'}
                  />
                </View>
                <View style={styles.switchRow}>
                  <Text style={styles.featureText}>북마크</Text>
                  <Switch
                    value={options.enableBookmark}
                    onValueChange={() => handleFeatureToggle('enableBookmark')}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={options.enableBookmark ? '#007AFF' : '#f4f3f4'}
                  />
                </View>
                <View style={styles.switchRow}>
                  <Text style={styles.featureText}>검색</Text>
                  <Switch
                    value={options.enableSearch}
                    onValueChange={() => handleFeatureToggle('enableSearch')}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={options.enableSearch ? '#007AFF' : '#f4f3f4'}
                  />
                </View>
                <View style={styles.switchRow}>
                  <Text style={styles.featureText}>텍스트 선택</Text>
                  <Switch
                    value={options.enableTextSelection}
                    onValueChange={() => handleFeatureToggle('enableTextSelection')}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={options.enableTextSelection ? '#007AFF' : '#f4f3f4'}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  viewModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  viewModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    gap: 8,
  },
  selectedViewMode: {
    backgroundColor: '#007AFF',
  },
  viewModeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedViewModeText: {
    color: '#fff',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  valueText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
  },
  fontFamilyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fontFamilyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  selectedFontFamily: {
    backgroundColor: '#007AFF',
  },
  fontFamilyText: {
    color: '#333',
    fontSize: 16,
  },
  selectedFontFamilyText: {
    color: '#fff',
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  themeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedTheme: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  themeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedThemeText: {
    fontWeight: '600',
  },
  marginContainer: {
    gap: 16,
  },
  marginSliderContainer: {
    marginBottom: 8,
  },
  marginLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  featureContainer: {
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
  },
});
