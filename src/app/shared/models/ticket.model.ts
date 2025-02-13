export interface Ticket {
  id: number;
  name: string; // Format: TKT-2025-XX-000
  userId: number;
  eventId: number
  ticketTypeId: number;
  orderId:number
  price: number;
  status: 'pending' | 'used' | "pass" | "reject";
  qrCode: string | null;
  isUsed: boolean;
  usageDate: string | null;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}
