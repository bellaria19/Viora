import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import TextViewerSettings from './TextViewerSettings';
import PDFViewerSettings from './PDFViewerSettings';
import ImageViewerSettings from './ImageViewerSettings';
import EPUBViewerSettings from './EPUBViewerSettings';
import ZipImageViewerSettings from './ZipImageViewerSettings';
import { useViewerSettings } from '@/hooks/useViewerSettings';

type ViewerType = 'text' | 'pdf' | 'image' | 'epub' | 'zip';

interface ViewerSettingsScreenProps {
  onBack: () => void;
  viewerType: ViewerType;
}

export default function ViewerSettingsScreen({ onBack, viewerType }: ViewerSettingsScreenProps) {
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];
  const {
    textViewerOptions,
    pdfViewerOptions,
    imageViewerOptions,
    epubViewerOptions,
    zipViewerOptions,
    updateTextViewerOptions,
    updatePDFViewerOptions,
    updateImageViewerOptions,
    updateEPUBViewerOptions,
    updateZipViewerOptions,
  } = useViewerSettings();

  // 제목 설정
  const getTitle = () => {
    switch (viewerType) {
      case 'text':
        return '텍스트 뷰어 설정';
      case 'pdf':
        return 'PDF 뷰어 설정';
      case 'image':
        return '이미지 뷰어 설정';
      case 'epub':
        return 'EPUB 뷰어 설정';
      case 'zip':
        return 'ZIP 이미지 뷰어 설정';
      default:
        return '뷰어 설정';
    }
  };

  // 설정 컴포넌트 선택
  const renderSettingsComponent = () => {
    switch (viewerType) {
      case 'text':
        return <TextViewerSettings options={textViewerOptions} onOptionsChange={updateTextViewerOptions} />;
      case 'pdf':
        return <PDFViewerSettings options={pdfViewerOptions} onOptionsChange={updatePDFViewerOptions} />;
      case 'image':
        return <ImageViewerSettings options={imageViewerOptions} onOptionsChange={updateImageViewerOptions} />;
      case 'epub':
        return <EPUBViewerSettings options={epubViewerOptions} onOptionsChange={updateEPUBViewerOptions} />;
      case 'zip':
        return <ZipImageViewerSettings options={zipViewerOptions} onOptionsChange={updateZipViewerOptions} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 헤더 */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <FontAwesome6 name="arrow-left" size={18} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{getTitle()}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>{renderSettingsComponent()}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 16,
  },
});
