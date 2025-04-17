import { View, StyleSheet } from "react-native";
import TextViewer from "@/components/viewers/TextViewer";
import ImageViewer from "@/components/viewers/ImageViewer";
import PDFViewer from "@/components/viewers/PDFViewer";
import EPUBViewer from "@/components/viewers/EPUBViewer";
import ZipViewer from "@/components/viewers/ZipViewer";
import UnsupportedFile from "@/components/viewers/UnsupportedFile";

interface FileViewerProps {
  fileUri: string;
  fileType: string;
}

export default function FileTypeHandler({
  fileUri,
  fileType,
}: FileViewerProps) {
  const renderContent = () => {
    switch (fileType) {
      case "text/plain":
        return <TextViewer fileUri={fileUri} />;
      case "image/jpeg":
      case "image/png":
      case "image/gif":
        return <ImageViewer fileUri={fileUri} />;
      case "application/pdf":
        return <PDFViewer fileUri={fileUri} />;
      case "application/epub+zip":
        return <EPUBViewer fileUri={fileUri} />;
      case "application/zip":
      case "application/x-zip-compressed":
        return <ZipViewer fileUri={fileUri} />;
      default:
        return <UnsupportedFile fileType={fileType} />;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
