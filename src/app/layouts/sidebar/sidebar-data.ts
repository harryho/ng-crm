import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard',
  },
  {
    displayName: 'Customer',
    iconName: 'phone',
    route: '/customer',
  },
  {
    displayName: 'Product',
    iconName: 'stack-backward',
    route: '/product',
  },
  {
    displayName: 'Order',
    iconName: 'shopping-cart',
    route: '/order',
  }
  ,
  {
    navCap: 'Marketing',
  },
  {
    displayName: 'Blog',
    iconName: 'file-text-ai',
    route: '/blog',
  },

  {
    displayName: 'Staff',
    iconName: 'adjustments',
    route: '/staff',
  },
  {
    navCap: 'Ui Components',
  },
  {
    displayName: 'Badge',
    iconName: 'archive',
    route: '/ui-components/badge',
  },
  {
    displayName: 'Chips',
    iconName: 'info-circle',
    route: '/ui-components/chips',
  },
  {
    displayName: 'Lists',
    iconName: 'list-details',
    route: '/ui-components/lists',
  },
  {
    displayName: 'Menu',
    iconName: 'file-text',
    route: '/ui-components/menu',
  },
  {
    displayName: 'Tooltips',
    iconName: 'file-text-ai',
    route: '/ui-components/tooltips',
  },
  {
    displayName: 'Forms',
    iconName: 'clipboard-text',
    route: '/ui-components/forms',
  },
  {
    displayName: 'Tables',
    iconName: 'table',
    route: '/ui-components/tables',
  },


 
];
