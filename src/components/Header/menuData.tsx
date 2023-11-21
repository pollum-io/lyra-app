export type Menu = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
  icon?: any;
};

export const menuData: Menu[] = [
  {
    id: 1,
    title: 'Prices',
    path: '/',
    newTab: false,
  },
  {
    id: 2,
    title: 'Airdrop',
    path: '/airdrop',
    newTab: false,
  },
];
