import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export enum ViewMode {
  LIST = "list",
  GRID = "grid",
}

export enum TabType {
  ALL_FILES = "all_files",
  RECENT = "recent",
}

interface FileListToolbarProps {
  activeTab: TabType;
  currentFolderId: string;
  viewMode: ViewMode;
  isImporting: boolean;
  onRefresh: () => void;
  onOpenSortModal: () => void;
  onPickDocuments: () => void;
}

export default function FileListToolbar({
  activeTab,
  currentFolderId,
  viewMode,
  isImporting,
  onRefresh,
  onOpenSortModal,
  onPickDocuments,
}: FileListToolbarProps) {
  return (
    <View style={styles.toolbar}>
      <View style={styles.toolbarLeft}>
        <TouchableOpacity style={styles.toolbarButton} onPress={onRefresh}>
          <FontAwesome name="refresh" size={20} color="#4a6da7" />
        </TouchableOpacity>
      </View>
      <View style={styles.toolbarRight}>
        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={onOpenSortModal}
        >
          <FontAwesome name="sort" size={20} color="#4a6da7" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={onPickDocuments}
          disabled={isImporting}
        >
          <FontAwesome name="plus" size={20} color="#4a6da7" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  toolbarLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolbarRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolbarButton: {
    padding: 8,
    marginHorizontal: 4,
  },
});
