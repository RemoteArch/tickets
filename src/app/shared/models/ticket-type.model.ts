export interface TicketType {
  id: number;
  eventId: number;
  name: string; // 'VIP', 'Standard', 'Gold'
  description: string | null;
  price: number;
  specialPrice: number;
  maxTickets: number;
  availableTickets: number;
  color: string | null; // Pour le style d'affichage
  benefits: any[] | null; // Liste des avantages
  position: number; // Pour l'ordre d'affichage
  createdAt: string;
  updatedAt: string;
}
