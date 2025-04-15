import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface SortToolbarProps {
  onOpenSortModal: () => void;
}

export default function SortToolbar({ onOpenSortModal }: SortToolbarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toolbarButton} onPress={onOpenSortModal}>
        <FontAwesome name="sort" size={20} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  toolbarButton: {
    padding: 8,
    marginHorizontal: 4,
  },
});
