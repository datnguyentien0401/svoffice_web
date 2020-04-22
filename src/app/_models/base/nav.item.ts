export interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  roleMenu: string;
  route?: string;
  children?: NavItem[];
  isOnlyIcon: boolean;
  expanded: boolean;
}
