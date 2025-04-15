import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface IconButtonProps {
  icon: keyof typeof FontAwesome.glyphMap;
  text?: string;
  onPress: () => void;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const IconButton = ({
  icon,
  text,
  onPress,
  color = "#007AFF",
  size = 24,
  style,
  textStyle,
  disabled = false,
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <FontAwesome
        name={icon}
        size={size}
        color={disabled ? "#8E8E93" : color}
      />
      {text && (
        <Text
          style={[
            styles.text,
            { color: disabled ? "#8E8E93" : color },
            textStyle,
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
  },
});
