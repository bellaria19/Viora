import { View, TextInput, StyleSheet, Platform } from "react-native";
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
      backgroundColor: theme.dark ? theme.colors.card : "#F2F2F7",
      borderRadius: 10,
      margin: 12,
      paddingHorizontal: 12,
      height: 44,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    searchIconContainer: {
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: 44,
      fontSize: 17,
      color: theme.colors.text,
      paddingVertical: 0,
    },
  });

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchIconContainer}>
        <FontAwesome name="search" size={16} color={theme.colors.text + "80"} />
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text + "80"}
        value={value}
        onChangeText={onChangeText}
        clearButtonMode="while-editing"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}
