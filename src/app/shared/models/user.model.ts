export interface User {
  id: number;
  fullName: string;
  phoneNumber: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
