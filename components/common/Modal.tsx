import { Modal as RNModal, View, Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme, Theme } from '@react-navigation/native';

interface ModalContainerProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
  closeOnOverlayPress?: boolean;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '90%',
      maxWidth: 400,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      overflow: 'hidden',
      elevation: 5,
      shadowColor: theme.dark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      padding: 20,
    },
  });

export const ModalContainer = ({
  visible,
  onClose,
  children,
  containerStyle,
  overlayStyle,
  closeOnOverlayPress = true,
}: ModalContainerProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <RNModal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <Pressable style={[styles.modalOverlay, overlayStyle]} onPress={() => closeOnOverlayPress && onClose()}>
        <View style={[styles.modalContainer, containerStyle]}>{children}</View>
      </Pressable>
    </RNModal>
  );
};
