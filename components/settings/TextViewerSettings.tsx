import React from 'react';
import { TextViewerSettingsProps } from '@/types/option';
import ViewerSettingsSheet, { ViewerSettingSection } from './ViewerSettingsBase';

export default function TextViewerSettings({ options, onOptionsChange, visible, onClose }: TextViewerSettingsProps) {
  const sections: ViewerSettingSection[] = [
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
