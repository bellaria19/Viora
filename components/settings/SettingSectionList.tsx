import React from 'react';
import { SectionList, SectionListProps } from 'react-native';
import SectionHeader from './SectionHeader';

interface SettingSectionListProps<ItemT, SectionT> extends SectionListProps<ItemT, SectionT> {
  sectionHeaderStyle?: any;
  sectionHeaderTextStyle?: any;
}

function SettingSectionList<ItemT, SectionT extends { title: string }>(
  props: SettingSectionListProps<ItemT, SectionT>,
) {
  const { renderSectionHeader, sectionHeaderStyle, sectionHeaderTextStyle, ...rest } = props;
  return (
    <SectionList
      {...rest}
      renderSectionHeader={
        renderSectionHeader ||
        (({ section }) => (
          <SectionHeader title={section.title} style={sectionHeaderStyle} textStyle={sectionHeaderTextStyle} />
        ))
      }
    />
  );
}

export default SettingSectionList;
