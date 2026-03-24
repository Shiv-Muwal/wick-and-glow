import {
  DashboardIcon,
  ProductsIcon,
  OrdersIcon,
  CustomersIcon,
  ContactsIcon,
  BlogsIcon,
  InventoryIcon,
  ReviewsIcon,
  CouponsIcon,
  SettingsIcon,
} from './components/logos.jsx';

export const MAIN_LINKS = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon, exact: true },
  { to: '/products', label: 'Products', icon: ProductsIcon },
  { to: '/orders', label: 'Orders', icon: OrdersIcon, badge: '7' },
  { to: '/customers', label: 'Customers', icon: CustomersIcon },
  { to: '/contacts', label: 'Contacts', icon: ContactsIcon },
];

export const CONTENT_LINKS = [
  { to: '/blogs', label: 'Blogs', icon: BlogsIcon },
  { to: '/inventory', label: 'Inventory', icon: InventoryIcon },
  { to: '/reviews', label: 'Reviews', icon: ReviewsIcon },
  { to: '/coupons', label: 'Coupons', icon: CouponsIcon },
];

export const SYSTEM_LINKS = [
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

