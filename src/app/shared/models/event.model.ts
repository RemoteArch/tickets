export interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  status: string;
  isFeatured: boolean;
  categoryId: number;
  organizerId: number;
  createdAt: string;
  updatedAt: string;
}
