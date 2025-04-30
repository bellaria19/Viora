import { View, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  colors: {
    searchBackground: string;
    secondaryText: string;
    text: string;
    placeholder: string;
    border: string;
  };
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = '검색...',
  colors,
  style,
  inputStyle,
}: SearchBarProps) {
  return (
    <View
      style={[
        styles.searchContainer,
        { backgroundColor: colors.searchBackground, borderBottomColor: colors.border },
        style,
      ]}
    >
      <FontAwesome6 name="magnifying-glass" size={20} color={colors.secondaryText} style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, { color: colors.text }, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 0,
  },
  searchIcon: {
    marginHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});
