import { StyleSheet } from 'react-native';

// 설정 컴포넌트들에서 공통으로 사용되는 스타일
export const settingsStyles = StyleSheet.create({
  // 설정 아이템
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingItemColumn: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 15,
    color: '#333',
  },

  // 옵션 행 및 그룹
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionGroup: {
    flexDirection: 'row',
    gap: 12,
  },

  // 모드 버튼
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

  // 테마 옵션
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

  // 폰트 옵션
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

  // 슬라이더
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

  // 미리보기
  textPreview: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  // 정렬 옵션
  sortOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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

  // 간격 옵션
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

  // 색상 옵션
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
