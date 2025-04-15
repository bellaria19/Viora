import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AddFileButton from "@/components/common/AddFileButton";
import { useTheme } from "@react-navigation/native";

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
  const theme = useTheme();

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
      color: theme.colors.text + "80",
      marginTop: 12,
      marginBottom: 20,
    },
  });

  return (
    <View style={styles.emptyContainer}>
      <FontAwesome name="file-o" size={48} color={theme.colors.text + "40"} />
      <Text style={styles.emptyText}>{emptyMessage}</Text>
      <AddFileButton onPress={onAddFile} isDisabled={isAddingFiles} />
    </View>
  );
}
