export interface User {
  id: number;
  fullName: string;
  phoneNumber: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
