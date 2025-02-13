export interface Category {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  image: string;
  slug: string;
  eventCount: number;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}
