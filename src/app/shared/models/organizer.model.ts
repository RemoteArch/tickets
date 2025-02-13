export interface Organizer {
  id: number;
  name: string;
  description: string | null;
  logo: string | null;
  email: string | null;
  phoneNumber: string;
  website: string | null;
  address: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
