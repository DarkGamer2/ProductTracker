// types.ts
export interface Customer {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface TabItem extends Product {
  status: 'pending' | 'paid' | 'credit';
}
