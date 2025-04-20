import React from 'react';
import { EPUBViewerSettingsProps } from '@/types/option';
import ViewerSettingsSheet, { ViewerSettingSection } from './ViewerSettingsBase';

export default function EPUBViewerSettings({ options, onOptionsChange, visible, onClose }: EPUBViewerSettingsProps) {
  const sections: ViewerSettingSection[] = [
    {
      title: '기능 설정',
      data: [
        {
          key: 'enableTOC',
          label: '목차 기능',
          type: 'switch',
          value: options.enableTOC,
          onValueChange: (value) => onOptionsChange({ enableTOC: value }),
        },
        {
          key: 'enableAnnotation',
          label: '주석 기능',
          type: 'switch',
          value: options.enableAnnotation,
          onValueChange: (value) => onOptionsChange({ enableAnnotation: value }),
        },
        {
          key: 'enableBookmark',
          label: '북마크 기능',
          type: 'switch',
          value: options.enableBookmark,
          onValueChange: (value) => onOptionsChange({ enableBookmark: value }),
        },
      ],
    },
    {
      title: '읽기 설정',
      data: [
        {
          key: 'enableRTL',
          label: '오른쪽에서 왼쪽으로 읽기',
          type: 'switch',
          value: options.enableRTL,
          onValueChange: (value) => onOptionsChange({ enableRTL: value }),
        },
        {
          key: 'enableTextSelection',
          label: '텍스트 선택 허용',
          type: 'switch',
          value: options.enableTextSelection,
          onValueChange: (value) => onOptionsChange({ enableTextSelection: value }),
        },
        {
          key: 'enableSearch',
          label: '검색 기능',
          type: 'switch',
          value: options.enableSearch,
          onValueChange: (value) => onOptionsChange({ enableSearch: value }),
        },
      ],
    },
    {
      title: '텍스트 설정',
      data: [
        {
          key: 'fontSize',
          label: '글자 크기',
          type: 'slider',
          value: options.fontSize,
          onValueChange: (value) => onOptionsChange({ fontSize: value }),
          min: 12,
          max: 32,
          step: 1,
        },
        {
          key: 'lineHeight',
          label: '줄 간격',
          type: 'slider',
          value: options.lineHeight,
          onValueChange: (value) => onOptionsChange({ lineHeight: value }),
          min: 1,
          max: 2.5,
          step: 0.1,
        },
      ],
    },
    {
      title: '글꼴 설정',
      data: [
        {
          key: 'fontFamily',
          label: '글꼴',
          type: 'select',
          value: options.fontFamily,
          onValueChange: (value) => onOptionsChange({ fontFamily: value }),
          options: ['System', 'Helvetica', 'Times New Roman', 'Courier'],
        },
      ],
    },
    {
      title: '테마 설정',
      data: [
        {
          key: 'theme',
          label: '테마',
          type: 'select',
          value: options.theme,
          onValueChange: (value) => {
            if (value === 'light' || value === 'dark' || value === 'sepia') {
              onOptionsChange({ theme: value });
            }
          },
          options: ['light', 'dark', 'sepia'],
        },
      ],
    },
    {
      title: '여백 설정',
      data: [
        {
          key: 'marginHorizontal',
          label: '가로 여백',
          type: 'slider',
          value: options.marginHorizontal,
          onValueChange: (value) => onOptionsChange({ marginHorizontal: value }),
          min: 8,
          max: 32,
          step: 2,
        },
        {
          key: 'marginVertical',
          label: '세로 여백',
          type: 'slider',
          value: options.marginVertical,
          onValueChange: (value) => onOptionsChange({ marginVertical: value }),
          min: 8,
          max: 32,
          step: 2,
        },
      ],
    },
  ];

  return <ViewerSettingsSheet visible={visible} onClose={onClose} sections={sections} />;
}
