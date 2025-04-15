export interface SortMenuItem {
  id: "name" | "size" | "type";
  label: string;
  icon: string;
}

export enum SortOption {
  NAME_ASC = "name_asc",
  NAME_DESC = "name_desc",
  SIZE_ASC = "size_asc",
  SIZE_DESC = "size_desc",
  TYPE_ASC = "type_asc",
  TYPE_DESC = "type_desc",
}

export const sortOptions: SortMenuItem[] = [
  { id: "name", label: "이름 (오름차순)", icon: "sort-alpha-asc" },
  { id: "name", label: "이름 (내림차순)", icon: "sort-alpha-desc" },
  { id: "size", label: "크기 (큰순)", icon: "sort-amount-desc" },
  { id: "size", label: "크기 (작은순)", icon: "sort-amount-asc" },
  { id: "type", label: "유형순", icon: "th-large" },
];
