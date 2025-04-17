export interface SortMenuItem {
  id: 'name_asc' | 'name_desc' | 'size_asc' | 'size_desc' | 'type_asc' | 'type_desc';
  label: string;
  icon: string;
}

export enum SortOption {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  SIZE_ASC = 'size_asc',
  SIZE_DESC = 'size_desc',
  TYPE_ASC = 'type_asc',
  TYPE_DESC = 'type_desc',
}

export const sortOptions: SortMenuItem[] = [
  { id: 'name_asc', label: '이름 (오름차순)', icon: 'sort-alpha-asc' },
  { id: 'name_desc', label: '이름 (내림차순)', icon: 'sort-alpha-desc' },
  { id: 'size_desc', label: '크기 (큰순)', icon: 'sort-amount-desc' },
  { id: 'size_asc', label: '크기 (작은순)', icon: 'sort-amount-asc' },
  { id: 'type_asc', label: '유형순', icon: 'th-large' },
  { id: 'type_desc', label: '유형순', icon: 'th-large' },
];
