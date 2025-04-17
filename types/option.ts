import FastImage from 'react-native-fast-image';

export interface ImageViewerOptions {
  enableDoubleTapZoom: boolean;

  // 성능 설정
  enablePreload: boolean;
  enableCache: boolean;

  // 화면 표시 설정
  showLoadingIndicator: boolean;
  showFallbackImage: boolean;
  showOverlay: boolean;

  // 스타일 설정
  loadingIndicatorColor: string;
  loadingBackgroundColor: string;
  imagePriority: keyof typeof FastImage.priority;
}

export interface ImageViewerSettingsProps {
  options: ImageViewerOptions;
  onOptionsChange: (newOptions: Partial<ImageViewerOptions>) => void;
  onClose: () => void;
  visible: boolean;
}

export interface PDFViewerOptions {
  viewMode: 'scroll' | 'page';
  enableRTL: boolean;
  pageSpacing: number;
  // showPageNumbers: boolean;
  // rotation: number;
}

export interface PDFViewerSettingsProps {
  options: PDFViewerOptions;
  onOptionsChange: (newOptions: Partial<PDFViewerOptions>) => void;
  onClose: () => void;
  visible: boolean;
}

export interface TextViewerOptions {
  // 텍스트 표시 설정
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'sepia';

  // 색상 설정
  textColor: string;
  backgroundColor: string;

  // 여백 설정
  marginHorizontal: number;
  marginVertical: number;

  // 기타 설정
  // enableRTL: boolean;
  // enableLineNumbers: boolean;
  // enableWordWrap: boolean;
}

export interface TextViewerSettingsProps {
  options: TextViewerOptions;
  onOptionsChange: (newOptions: Partial<TextViewerOptions>) => void;
  onClose: () => void;
  visible: boolean;
}

export interface EPUBViewerOptions {
  // 뷰어 모드 설정
  viewMode: 'scroll' | 'page';
  enableRTL: boolean;

  // 텍스트 설정
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'sepia';

  // 색상 설정
  textColor: string;
  backgroundColor: string;
  linkColor: string;

  // 여백 설정
  marginHorizontal: number;
  marginVertical: number;

  // 기타 설정
  enableTOC: boolean; // 목차 표시 여부
  enableAnnotation: boolean; // 주석 기능 활성화
  enableBookmark: boolean; // 북마크 기능 활성화
  enableSearch: boolean; // 검색 기능 활성화
  enableTextSelection: boolean; // 텍스트 선택 기능 활성화
}

export interface EPUBViewerSettingsProps {
  options: EPUBViewerOptions;
  onOptionsChange: (newOptions: Partial<EPUBViewerOptions>) => void;
  onClose: () => void;
  visible: boolean;
}
