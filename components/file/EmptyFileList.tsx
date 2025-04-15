import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AddFileButton from "@/components/common/AddFileButton";

interface EmptyComponentProps {
  onAddFile: () => void;
  isAddingFiles?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function EmptyComponent({
  onAddFile,
  isAddingFiles = false,
  isLoading = false,
  emptyMessage = "파일이 없습니다",
}: EmptyComponentProps) {
  return (
    <View style={styles.emptyContainer}>
      <FontAwesome name="file-o" size={48} color="#C7C7CC" />
      <Text style={styles.emptyText}>{emptyMessage}</Text>
      <AddFileButton onPress={onAddFile} isDisabled={isAddingFiles} />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 12,
    marginBottom: 20,
  },
});
