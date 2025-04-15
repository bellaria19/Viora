import { View, TextInput, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "파일 검색...",
}: SearchBarProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.dark ? theme.colors.card : "#EFEFEF",
      borderRadius: 10,
      margin: 12,
      paddingHorizontal: 10,
      height: 40,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      height: 40,
      fontSize: 16,
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.searchContainer}>
      <FontAwesome
        name="search"
        size={20}
        color={theme.colors.text}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text + "80"}
        value={value}
        onChangeText={onChangeText}
        clearButtonMode="while-editing"
      />
    </View>
  );
}
