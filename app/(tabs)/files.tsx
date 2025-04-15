import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar";
import FileListContainer from "@/components/FileListContainer";
import { TabType, ViewMode } from "@/components/FileListToolbar";
import { FileItem } from "@/components/FileList";
import { SortOption, sortOptions } from "@/components/types";
import ModalContainer from "@/components/ModalContainer";

export default function FilesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingFiles, setIsAddingFiles] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOption>(SortOption.NAME_ASC);

  const onAddFile = () => {
    setIsAddingFiles(true);
  };

  const handleRefresh = () => {
    // 새로고침 로직
  };

  const pickDocuments = () => {
    setIsImporting(true);
    // 문서 선택 로직
  };

  const handleSortOptionSelect = (optionId: string) => {
    const option = sortOptions.find((opt) => opt.id === optionId);
    if (!option) return;

    switch (option.id) {
      case "name":
        setSortOrder(
          option.label.includes("오름차순")
            ? SortOption.NAME_ASC
            : SortOption.NAME_DESC
        );
        break;
      case "date":
        setSortOrder(
          option.label.includes("오래된순")
            ? SortOption.DATE_ASC
            : SortOption.DATE_DESC
        );
        break;
      case "size":
        setSortOrder(
          option.label.includes("작은순")
            ? SortOption.SIZE_ASC
            : SortOption.SIZE_DESC
        );
        break;
      case "type":
        setSortOrder(SortOption.TYPE_ASC);
        break;
    }
    setSortModalVisible(false);
  };

  const renderFileItem = (item: FileItem) => (
    <View style={styles.fileItem}>
      <Text>{item.name}</Text>
    </View>
  );

  const toolbarProps = {
    activeTab: TabType.ALL_FILES,
    currentFolderId,
    viewMode,
    isImporting,
    onRefresh: handleRefresh,
    onOpenSortModal: () => setSortModalVisible(true),
    onPickDocuments: pickDocuments,
  };

  const SortModal = () => (
    <ModalContainer
      visible={sortModalVisible}
      onClose={() => setSortModalVisible(false)}
      containerStyle={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>정렬 방식</Text>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.id + option.label}
            style={[
              styles.sortOption,
              sortOrder.startsWith(option.id) && styles.sortOptionSelected,
            ]}
            onPress={() => handleSortOptionSelect(option.id)}
          >
            <FontAwesome
              name={option.icon}
              size={20}
              color={sortOrder.startsWith(option.id) ? "#FFFFFF" : "#007AFF"}
            />
            <Text
              style={[
                styles.sortOptionText,
                sortOrder.startsWith(option.id) &&
                  styles.sortOptionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ModalContainer>
  );

  return (
    <View style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <FileListContainer
        data={files}
        renderItem={renderFileItem}
        isLoading={isLoading}
        isAddingFiles={isAddingFiles}
        onAddFile={onAddFile}
        showToolbar={true}
        toolbarProps={toolbarProps}
        sortOption={sortOrder}
      />
      <SortModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  fileItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  modalContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: "80%",
  },
  modalContent: {
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "#F8F8F8",
  },
  sortOptionSelected: {
    backgroundColor: "#007AFF",
  },
  sortOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#007AFF",
  },
  sortOptionTextSelected: {
    color: "#FFFFFF",
  },
});
