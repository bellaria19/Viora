export enum TabType {
  ALL_FILES = "all_files",
  RECENT = "recent",
}

export interface ToolbarProps {
  activeTab: TabType;
  currentFolderId: string;
  isImporting: boolean;
  onRefresh: () => void;
  onOpenSortModal: () => void;
  onPickDocuments: () => void;
}
