import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Ticket, TicketType, Event, Order } from '../../shared/models';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';

interface PurchaseHistoryItem {
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  paymentStatusClass: string;
  orderDate: string;
  image: string;
  location: string;
}

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  template: `
    <div class="min-h-screen pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <!-- Header avec fond dégradé -->
      <div class="bg-gradient-to-r from-primary/90 to-primary pt-3 pb-16 relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div class="px-4 relative z-10">
          <h1 class="text-xl font-semibold text-white/90">Historique des achats</h1>
        </div>
      </div>

      <!-- Content -->
      <div class="px-4 -mt-8 relative z-20 max-w-lg mx-auto">
        <!-- Filters -->
        <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center space-x-2">

              <button (click)="statusSearch = ''" [ngClass]="{'bg-primary text-white':statusSearch == '', 'bg-white text-gray-600':statusSearch != ''}" class="px-4 py-2 rounded-lg  text-sm font-medium transition-colors">
                Tous
              </button>
              @for(status of statusList; track $index){
                <button (click)="statusSearch = status" [ngClass]="{'bg-primary text-white':statusSearch == status, 'bg-white text-gray-600':statusSearch != status}" class="px-4 py-2 rounded-lg text-sm font-mediumtransition-colors">
                  {{status}}
                </button>
              }

            </div>
            <div class="relative">
              <input 
                type="text" 
                placeholder="Rechercher un événement..."
                [(ngModel)]="eventSearch"
                class="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div class="space-y-4 px-4 pb-16">
        <div *ngFor="let purchase of purchaseHistory; trackBy: trackById" class="bg-white rounded-2xl shadow-lg">
          <div class="flex flex-col sm:flex-row items-start p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div class="w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden mb-4 sm:mb-0">
              <img [src]="purchase.image" [alt]="purchase.eventName" class="w-full h-full object-cover" />
            </div>
            <div class="sm:ml-4 flex-1 w-full">
              <div class="flex flex-col sm:flex-row justify-between items-start">
                <div>
                  <h3 class="font-medium text-gray-900">{{purchase.eventName}}</h3>
                  <div class="mt-1 flex flex-row items-center text-sm text-gray-500 space-x-2">
                    <span>{{purchase.eventDate}}</span>
                    <span class="inline">•</span>
                    <span>{{purchase.eventTime}}</span>
                    <span class="inline">•</span>
                    <span>{{purchase.location}}</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    Commandé le {{purchase.orderDate}}
                  </p>
                </div>
                <div class="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0">
                  <span [class]="purchase.paymentStatusClass">
                    {{purchase.totalAmount}} €
                  </span>
                  <span class="ml-2 sm:ml-0 sm:mt-1 text-xs" [class]="purchase.paymentStatusClass">
                    {{purchase.paymentStatus}}
                  </span>
                </div>
              </div>
              <div class="mt-4  flex-wrap gap-2 hidden">
                <button class="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Voir le billet
                </button>
                <button class="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Télécharger
                </button>
                <button *ngIf="purchase.paymentStatus === 'Validé'" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-footer>
  `,
  styles: [`
    .purchase-history {
      padding: 20px;
    }
  `]
})
export class PurchaseHistoryComponent implements OnInit {
  _events: Event[] = [];
  _tickets: Ticket[] = [];
  _ticketTypes: TicketType[] = [];
  _orders: Order[] = []

  user:any = {}

  eventSearch=""
  statusSearch=""
  get statusList(): string[]{
    // return this.purchaseHistory.map(purchase=> purchase.paymentStatus).flat()
    return [...new Set(this._orders.map(purchase => purchase.paymentStatus))];
  }

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    let user: any = localStorage.getItem('user');
    if (!user) {
      return;
    }
    user = JSON.parse(user);
    this.loadData();
    this.user = user
  }

  loadData() {
    this.apiService.readMultiple(['Event','Ticket','TicketType','Orders']).subscribe({
      next: (data:any[]) => {
        this._events = data[0];
        this._tickets = data[1];
        this._ticketTypes = data[2];
        this._orders = data[3]
        console.log(data)
      },
      error: (error) => {
        console.error('Error loading data:', error);
      }
    });
  }

  get purchaseHistory(): PurchaseHistoryItem[] {
    return this._orders
      .filter(order => order.userId == this.user.id)
      .map(order => {
        const ticketType = this._ticketTypes.find(t => t.id === order.ticketTypeId);
        const event = this._events.find(e => e.id === ticketType?.eventId);
        const { formattedDate, formattedTime } = this.formatEventDateTime(event?.date || '');

        return {
          id: order.orderNumber,
          eventName: event?.title || 'Événement inconnu',
          eventDate: formattedDate,
          eventTime: formattedTime,
          ticketType: ticketType?.name || 'Type inconnu',
          quantity: 1,
          totalAmount: order.totalAmount,
          paymentStatus: order.paymentStatus,
          paymentStatusClass: this.getPaymentStatusClass(order.paymentStatus),
          orderDate: this.formatDate(order.paymentDate ?? ''),
          image: event?.image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
          location: event?.location || 'Lieu inconnu'
        };
      })
      .filter(purchase => purchase.eventName.toLowerCase().includes(this.eventSearch.toLowerCase()) || this.eventSearch == '' )
      .filter(purchase => purchase.paymentStatus == this.statusSearch || this.statusSearch == '' )
      ;
  }

  private getPaymentStatusLabel(status: string): string {
    switch (status) {
      case 'completed':
        return 'Validé';
      case 'pending':
        return 'En attente';
      case 'refunded':
        return 'Remboursé';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  }

  private getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  private formatEventDateTime(dateStr: string): { formattedDate: string, formattedTime: string } {
    if (!dateStr) return { formattedDate: '', formattedTime: '' };

    const date = new Date(dateStr);
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);

    const formattedTime = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);

    return { formattedDate, formattedTime };
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  trackById(index: number, item: PurchaseHistoryItem): string {
    return item.id;
  }
}