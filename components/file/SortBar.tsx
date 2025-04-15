import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

interface SortToolbarProps {
  onOpenSortModal: () => void;
}

export default function SortToolbar({ onOpenSortModal }: SortToolbarProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    toolbarButton: {
      padding: 8,
      marginHorizontal: 4,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toolbarButton} onPress={onOpenSortModal}>
        <FontAwesome name="sort" size={20} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
}
