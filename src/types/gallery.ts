export type GalleryImage = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  type: 'RAVINTOLA' | 'BAARI';
  isActive: boolean;
}; 