import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";

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

function TextViewer({ fileUri }: { fileUri: string }) {
  const [content, setContent] = useState<string>("로딩 중...");

  useEffect(() => {
    const loadTextFile = async () => {
      try {
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        setContent(fileContent);
      } catch (error) {
        console.error("텍스트 파일 읽기 오류:", error);
        setContent("파일을 읽을 수 없습니다.");
      }
    };

    loadTextFile();
  }, [fileUri]);

  return (
    <View style={styles.textContainer}>
      <Text style={styles.textContent}>{content}</Text>
    </View>
  );
}

function ImageViewer({ fileUri }: { fileUri: string }) {
  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: fileUri }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

function PDFViewer({ fileUri }: { fileUri: string }) {
  return <WebView source={{ uri: fileUri }} style={styles.webview} />;
}

function EPUBViewer({ fileUri }: { fileUri: string }) {
  return <WebView source={{ uri: fileUri }} style={styles.webview} />;
}

function ZipViewer({ fileUri }: { fileUri: string }) {
  return (
    <View style={styles.zipContainer}>
      <Text style={styles.zipText}>압축 파일 내용:</Text>
      {/* 여기에 압축 파일 내용을 보여주는 컴포넌트 추가 */}
    </View>
  );
}

function UnsupportedFile({ fileType }: { fileType: string }) {
  return (
    <View style={styles.unsupportedContainer}>
      <Text style={styles.unsupportedText}>
        지원하지 않는 파일 형식입니다: {fileType}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  textContainer: {
    flex: 1,
    padding: 16,
  },
  textContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  webview: {
    flex: 1,
  },
  zipContainer: {
    flex: 1,
    padding: 16,
  },
  zipText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  unsupportedText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
  },
});
