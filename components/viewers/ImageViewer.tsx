import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ViewerOverlay from "@/components/common/ViewerOverlay";

interface ImageViewerProps {
  fileUri: string;
  fileName?: string;
  images?: string[];
}

export default function ImageViewer({
  fileUri,
  fileName = "이미지 파일",
  images: propImages,
}: ImageViewerProps) {
  const images = propImages && propImages.length > 0 ? propImages : [fileUri];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [viewMode, setViewMode] = useState<"scroll" | "page">("page");
  const navigation = useNavigation();

  const goToPrevPage = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goToNextPage = () => {
    if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= images.length) setCurrentIndex(page - 1);
  };

  const handleModeChange = (mode: "scroll" | "page") => {
    setViewMode(mode);
  };

  const handleBack = () => {
    if (navigation && navigation.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else if (typeof window !== "undefined" && window.history) {
      window.history.back();
    } else {
      alert("뒤로가기 기능을 구현하세요.");
    }
  };

  const handleToggleOverlay = () => setOverlayVisible((v) => !v);

  if (viewMode === "scroll") {
    return (
      <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={handleToggleOverlay}
        >
          <FlatList
            data={images}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
            keyExtractor={(item, idx) => item + idx}
            pagingEnabled={false}
            horizontal={false}
            showsVerticalScrollIndicator={true}
          />
          <ViewerOverlay
            fileName={fileName}
            currentPage={currentIndex + 1}
            totalPages={images.length}
            onBack={handleBack}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
            visible={overlayVisible}
            onToggle={handleToggleOverlay}
            onPageChange={handlePageChange}
            mode={viewMode}
            onModeChange={handleModeChange}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1 }}
        onPress={handleToggleOverlay}
      >
        <Image
          source={{ uri: images[currentIndex] }}
          style={styles.image}
          resizeMode="contain"
        />
        <ViewerOverlay
          fileName={fileName}
          currentPage={currentIndex + 1}
          totalPages={images.length}
          onBack={handleBack}
          onPrevPage={goToPrevPage}
          onNextPage={goToNextPage}
          visible={overlayVisible}
          onToggle={handleToggleOverlay}
          onPageChange={handlePageChange}
          mode={viewMode}
          onModeChange={handleModeChange}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    resizeMode: "contain",
  },
});
