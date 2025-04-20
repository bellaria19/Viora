import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetSectionList,
} from '@gorhom/bottom-sheet';
import { useTheme, Theme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

export interface ViewerSettingItem {
  key: string;
  label: string;
  type: 'switch' | 'slider' | 'select' | 'color';
  value: boolean | number | string;
  onValueChange: (value: any) => void;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export interface ViewerSettingSection {
  title: string;
  data: ViewerSettingItem[];
}

interface ViewerSettingsBaseProps {
  visible: boolean;
  onClose: () => void;
  sections: ViewerSettingSection[];
}

export default function ViewerSettingsBase({ visible, onClose, sections }: ViewerSettingsBaseProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  // 스냅 포인트 설정
  const snapPoints = React.useMemo(() => ['50%', '90%'], []);

  // 백드롭 렌더링 함수
  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
        pressBehavior="close"
        enableTouchThrough={false}
      />
    ),
    [],
  );

  // Bottom Sheet 열기/닫기 처리
  React.useEffect(() => {
    if (visible && !isOpen) {
      setIsOpen(true);
      bottomSheetRef.current?.expand();
    } else if (!visible && isOpen) {
      bottomSheetRef.current?.close();
    }
  }, [visible, isOpen]);

  // Bottom Sheet 닫힐 때 처리
  const handleSheetChanges = React.useCallback(
    (index: number) => {
      if (index === -1) {
        setIsOpen(false);
        onClose();
      }
    },
    [onClose],
  );

  if (!visible) {
    return null;
  }

  const handleModalPress = (e: any) => {
    e.stopPropagation();
  };

  const renderSectionHeader = ({ section }: { section: ViewerSettingSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  const renderSliderItem = (item: ViewerSettingItem) => (
    <View style={styles.sliderContainer}>
      <Slider
        style={styles.slider}
        minimumValue={item.min}
        maximumValue={item.max}
        step={item.step}
        value={item.value as number}
        onValueChange={item.onValueChange}
      />
      <Text style={styles.valueText}>
        {item.key === 'lineHeight' ? (item.value as number).toFixed(1) : Math.round(item.value as number)}
        {item.key.includes('margin') || item.key === 'fontSize' ? 'px' : ''}
      </Text>
    </View>
  );

  const renderSelectItem = (item: ViewerSettingItem) => (
    <View style={styles.selectContainer}>
      {item.options?.map((option) => (
        <TouchableWithoutFeedback key={option} onPress={() => item.onValueChange(option)}>
          <View style={[styles.selectOption, item.value === option && styles.selectedOption]}>
            <Text style={[styles.selectOptionText, item.value === option && styles.selectedOptionText]}>{option}</Text>
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );

  const renderColorItem = (item: ViewerSettingItem) => (
    <TextInput
      style={styles.colorInput}
      value={item.value as string}
      onChangeText={item.onValueChange}
      placeholder={item.key.includes('Background') ? 'rgba(0,0,0,0.3)' : '#0000ff'}
    />
  );

  const renderItem = ({ item }: { item: ViewerSettingItem }) => (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>{item.label}</Text>
      {item.type === 'slider' ? (
        renderSliderItem(item)
      ) : item.type === 'select' ? (
        renderSelectItem(item)
      ) : item.type === 'color' ? (
        renderColorItem(item)
      ) : (
        <Switch value={item.value as boolean} onValueChange={item.onValueChange} />
      )}
    </View>
  );

  return (
    <View style={styles.overlay}>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.handle}
        enablePanDownToClose
        enableOverDrag
        style={styles.bottomSheet}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>뷰어 설정</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome name="times" size={22} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <BottomSheetSectionList
              sections={sections}
              renderSectionHeader={renderSectionHeader}
              renderItem={renderItem}
              contentContainerStyle={styles.contentContainer}
              stickySectionHeadersEnabled={false}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: 'transparent',
      zIndex: 9999999,
    },
    bottomSheet: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    closeButton: {
      padding: 8,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: 20,
    },
    handle: {
      width: 40,
      height: 5,
      borderRadius: 3,
      backgroundColor: theme.colors.border,
      alignSelf: 'center',
      marginTop: 10,
    },
    sectionHeader: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: theme.colors.background,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      opacity: 0.8,
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: theme.colors.card,
    },
    itemLabel: {
      fontSize: 16,
      color: theme.colors.text,
    },
    sliderContainer: {
      flex: 1,
      marginLeft: 20,
      alignItems: 'stretch',
    },
    slider: {
      width: '100%',
    },
    valueText: {
      fontSize: 14,
      color: theme.colors.text,
      textAlign: 'right',
      marginTop: 4,
    },
    selectContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    selectOption: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.border,
    },
    selectedOption: {
      backgroundColor: theme.colors.primary,
    },
    selectOptionText: {
      color: theme.colors.text,
      fontSize: 14,
    },
    selectedOptionText: {
      color: theme.colors.background,
      fontWeight: '600',
    },
    colorInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 4,
      padding: 4,
      width: 120,
      color: theme.colors.text,
    },
  });
