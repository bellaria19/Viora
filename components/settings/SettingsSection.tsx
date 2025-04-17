import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingsSection({
  title,
  children,
}: SettingsSectionProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    section: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
    },
    sectionContent: {
      backgroundColor: theme.colors.card,
      borderRadius: 10,
      marginHorizontal: 16,
      overflow: "hidden",
    },
  });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}
