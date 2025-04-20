import React from 'react';
import { PDFViewerSettingsProps } from '@/types/option';
import ViewerSettingsSheet, { ViewerSettingSection } from './ViewerSettingsBase';

export default function PDFViewerSettings({ options, onOptionsChange, visible, onClose }: PDFViewerSettingsProps) {
  const sections: ViewerSettingSection[] = [
    {
      title: '기능 설정',
      data: [
        {
          key: 'enablePaging',
          label: '페이징 모드',
          type: 'switch',
          value: options.enablePaging,
          onValueChange: (value) => onOptionsChange({ enablePaging: value }),
        },
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
          key: 'enableCache',
          label: 'PDF 캐싱',
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
          key: 'showPageNumber',
          label: '페이지 번호 표시',
          type: 'switch',
          value: options.showPageNumber,
          onValueChange: (value) => onOptionsChange({ showPageNumber: value }),
        },
        {
          key: 'showLoadingIndicator',
          label: '로딩 표시',
          type: 'switch',
          value: options.showLoadingIndicator,
          onValueChange: (value) => onOptionsChange({ showLoadingIndicator: value }),
        },
        {
          key: 'showThumbnails',
          label: '썸네일 표시',
          type: 'switch',
          value: options.showThumbnails,
          onValueChange: (value) => onOptionsChange({ showThumbnails: value }),
        },
      ],
    },
  ];

  return <ViewerSettingsSheet visible={visible} onClose={onClose} sections={sections} />;
}
