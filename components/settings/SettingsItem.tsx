import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

export interface SettingsItemProps {
  icon: keyof typeof FontAwesome.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}

export default function SettingsItem({
  icon,
  iconColor = "#007AFF",
  title,
  subtitle,
  right,
  onPress,
}: SettingsItemProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    item: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    itemIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    itemContent: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: "400",
      color: theme.colors.text,
    },
    itemSubtitle: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.6,
      marginTop: 2,
    },
    itemRight: {
      marginLeft: 12,
    },
  });

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} disabled={!onPress}>
      <View style={[styles.itemIcon, { backgroundColor: `${iconColor}20` }]}>
        <FontAwesome name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.itemRight}>
        {right ||
          (onPress && (
            <FontAwesome name="chevron-right" size={20} color="#C7C7CC" />
          ))}
      </View>
    </TouchableOpacity>
  );
}
