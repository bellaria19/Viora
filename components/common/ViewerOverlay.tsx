import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

interface ViewerOverlayProps {
  fileName: string;
  currentPage: number;
  totalPages: number;
  onBack: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  visible: boolean;
  onToggle: () => void;
  onPageChange?: (page: number) => void;
  mode?: "scroll" | "page";
  onModeChange?: (mode: "scroll" | "page") => void;
}

export default function ViewerOverlay({
  fileName,
  currentPage,
  totalPages,
  onBack,
  onPrevPage,
  onNextPage,
  visible,
  onToggle,
  onPageChange,
  mode = "scroll",
  onModeChange,
}: ViewerOverlayProps) {
  const [settingVisible, setSettingVisible] = useState(false);
  if (!visible) return null;

  // 페이지가 1개 이하일 때 비활성화
  const isSinglePage = totalPages <= 1;

  return (
    <>
      {/* 오버레이 전체를 터치하면 숨김/표시 토글 */}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlayTouchable}
        onPress={onToggle}
      />
      {/* 상단 오버레이 - SafeAreaView로 감쌈 */}
      <SafeAreaView style={styles.safeTop} edges={["top"]}>
        <View style={styles.topOverlay} pointerEvents="box-none">
          <TouchableOpacity onPress={onBack} style={styles.backButtonArea}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.fileName} numberOfLines={1}>
            {fileName}
          </Text>
        </View>
      </SafeAreaView>
      {/* 하단 오버레이 */}
      <View style={styles.bottomOverlay} pointerEvents="box-none">
        {/* 1. 페이지 이동 버튼과 페이지 정보 */}
        {!isSinglePage && (
          <View style={styles.pageRow}>
            <TouchableOpacity
              onPress={onPrevPage}
              style={styles.pageButtonArea}
            >
              <Text style={styles.pageButton}>이전</Text>
            </TouchableOpacity>
            <Text style={styles.pageInfo}>
              {currentPage} / {totalPages}
            </Text>
            <TouchableOpacity
              onPress={onNextPage}
              style={styles.pageButtonArea}
            >
              <Text style={styles.pageButton}>다음</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* 2. 슬라이더 */}
        {!isSinglePage && (
          <View style={styles.sliderRow}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={totalPages > 0 ? totalPages : 1}
              value={currentPage}
              step={1}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#888"
              thumbTintColor="#fff"
              onSlidingComplete={(value) => {
                if (onPageChange) onPageChange(value);
              }}
            />
          </View>
        )}
        {/* 3. 뷰어 설정 버튼 */}
        <View style={styles.settingRow}>
          <TouchableOpacity
            style={styles.settingIconButton}
            onPress={() => setSettingVisible(true)}
          >
            <FontAwesome name="cog" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {/* 설정 모달 */}
      <Modal
        visible={settingVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => setSettingVisible(false)}
        >
          <View style={styles.settingModal}>
            <Text style={styles.settingTitle}>뷰어 모드 선택</Text>
            <TouchableOpacity
              style={[
                styles.modeOption,
                mode === "scroll" && styles.selectedMode,
              ]}
              onPress={() => {
                onModeChange && onModeChange("scroll");
                setSettingVisible(false);
              }}
            >
              <Text
                style={[
                  styles.modeOptionText,
                  mode === "scroll" && styles.selectedModeText,
                ]}
              >
                스크롤 모드
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeOption,
                mode === "page" && styles.selectedMode,
              ]}
              onPress={() => {
                onModeChange && onModeChange("page");
                setSettingVisible(false);
              }}
            >
              <Text
                style={[
                  styles.modeOptionText,
                  mode === "page" && styles.selectedModeText,
                ]}
              >
                페이지 모드
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  safeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  topOverlay: {
    height: 56,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButtonArea: {
    padding: 8,
    marginRight: 8,
  },
  backButton: {
    color: "#fff",
    fontSize: 24,
  },
  fileName: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 20,
  },
  pageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  sliderRow: {
    alignItems: "center",
    marginBottom: 8,
  },
  slider: {
    width: width * 0.8,
    height: 24,
  },
  settingRow: {
    alignItems: "center",
  },
  settingIconButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  pageButtonArea: {
    padding: 8,
    marginHorizontal: 8,
  },
  pageButton: {
    color: "#fff",
    fontSize: 18,
  },
  pageInfo: {
    color: "#fff",
    fontSize: 16,
    marginHorizontal: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  settingModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: 260,
    alignItems: "center",
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },
  modeOption: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  selectedMode: {
    backgroundColor: "#007AFF",
  },
  modeOptionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedModeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.4,
  },
  disabledButtonText: {
    color: "#aaa",
  },
});
