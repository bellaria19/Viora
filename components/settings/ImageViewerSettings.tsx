import React from 'react';
import { ImageViewerSettingsProps } from '@/types/option';
import ViewerSettingsSheet, { ViewerSettingSection } from './ViewerSettingsBase';

export default function ImageViewerSettings({ options, onOptionsChange, visible, onClose }: ImageViewerSettingsProps) {
  const sections: ViewerSettingSection[] = [
    {
      title: '기능 설정',
      data: [
        {
          key: 'enableDoubleTapZoom',
          label: '더블 탭 확대/축소',
          type: 'switch',
          value: options.enableDoubleTapZoom,
          onValueChange: (value) => onOptionsChange({ enableDoubleTapZoom: value }),
        },
      ],
    },
    {
      title: '성능 설정',
      data: [
        {
          key: 'enablePreload',
          label: '다음 이미지 프리로딩',
          type: 'switch',
          value: options.enablePreload,
          onValueChange: (value) => onOptionsChange({ enablePreload: value }),
        },
        {
          key: 'enableCache',
          label: '이미지 캐싱',
          type: 'switch',
          value: options.enableCache,
          onValueChange: (value) => onOptionsChange({ enableCache: value }),
        },
      ],
    },
    {
      title: '화면 표시 설정',
      data: [
        {
          key: 'showLoadingIndicator',
          label: '로딩 표시',
          type: 'switch',
          value: options.showLoadingIndicator,
          onValueChange: (value) => onOptionsChange({ showLoadingIndicator: value }),
        },
        {
          key: 'showFallbackImage',
          label: '오류 시 대체 이미지',
          type: 'switch',
          value: options.showFallbackImage,
          onValueChange: (value) => onOptionsChange({ showFallbackImage: value }),
        },
      ],
    },
    {
      title: '스타일 설정',
      data: [
        {
          key: 'loadingIndicatorColor',
          label: '로딩 표시 색상',
          type: 'color',
          value: options.loadingIndicatorColor,
          onValueChange: (value) => onOptionsChange({ loadingIndicatorColor: value }),
        },
        {
          key: 'loadingBackgroundColor',
          label: '로딩 배경 색상',
          type: 'color',
          value: options.loadingBackgroundColor,
          onValueChange: (value) => onOptionsChange({ loadingBackgroundColor: value }),
        },
      ],
    },
  ];

  return <ViewerSettingsSheet visible={visible} onClose={onClose} sections={sections} />;
}
