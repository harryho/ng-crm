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
    route: '/user',
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
  },
  {
    displayName: 'Cart',
    iconName: 'shopping-bag',
    route: '/cart',
  },

  {
    navCap: 'Marketing',
  },
  {
    displayName: 'Staff',
    iconName: 'adjustments',
    route: '/staff',
  },
  {
    displayName: 'Blog',
    iconName: 'file-text-ai',
    route: '/blog',
  }
];
