export interface Order {
  id: number;
  userId: number;
  ticketTypeId:number;
  payNumber: string | null;
  orderNumber: string;
  totalAmount: number;
  qte:number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer';
  paymentReference: string | null;
  paymentDate: string | null;
  createdAt: string;
  updatedAt: string;
}
