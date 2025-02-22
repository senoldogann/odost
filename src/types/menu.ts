export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  familyPrice?: number | null;
  category: string;
  image?: string;
  allergens?: string[];
  type: 'RAVINTOLA' | 'BAARI';
  isActive: boolean;
  isFeatured: boolean;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  type: 'RAVINTOLA' | 'BAARI';
  isActive: boolean;
  order?: number;
} 