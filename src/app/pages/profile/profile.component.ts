import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Ticket, TicketType,Event } from '../../shared/models';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';

interface PurchaseHistory {
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  date: string;
  price: number;
  status: 'completed' | 'refunded' | 'pending';
  image: string;
  location: string;
  orderDate: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br pb-16 from-gray-50 via-white to-gray-50">
      <!-- Header avec fond dégradé -->
      <div class="bg-gradient-to-r pt-3 from-primary/90 to-primary pt-safe pb-24 relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div class="px-4 relative z-10">
          <h1 class="text-xl font-semibold text-white/90"></h1>
        </div>
      </div>

      <!-- Profile Info Card -->
      <div class="px-4 -mt-16 relative z-20 max-w-lg mx-auto">
        <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div class="flex flex-col sm:flex-row sm:items-start">
            <div class="relative mx-auto sm:mx-0">
              <div class="w-24 h-24 sm:w-20 sm:h-20 rounded-full bg-gradient-to-t from-gray-100 to-white p-0.5">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMzVkOWEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxLjUiIGQ9Ik02LjU3OCAxNS40ODJjLTEuNDE1Ljg0Mi01LjEyNSAyLjU2Mi0yLjg2NSA0LjcxNUM0LjgxNiAyMS4yNDggNi4wNDUgMjIgNy41OSAyMmg4LjgxOGMxLjU0NiAwIDIuNzc1LS43NTIgMy44NzgtMS44MDNjMi4yNi0yLjE1My0xLjQ1LTMuODczLTIuODY1LTQuNzE1YTEwLjY2IDEwLjY2IDAgMCAwLTEwLjg0NCAwTTE2LjUgNi41YTQuNSA0LjUgMCAxIDEtOSAwYTQuNSA0LjUgMCAwIDEgOSAwIiBjb2xvcj0iIzAzNWQ5YSIvPjwvc3ZnPg=="
                  alt="Profile"
                  class="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div class="absolute bottom-0 right-0 transform translate-x-1/4">
                <span class="block w-4 h-4 rounded-full bg-green-400 ring-2 ring-white"></span>
              </div>
              <button class="hidden absolute -right-2 -bottom-2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 text-gray-600 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div class="mt-4 sm:mt-0 sm:ml-6 flex-1 text-center sm:text-left">
              <div class="flex flex-col sm:flex-row justify-between items-center sm:items-start">
                <div>
                  <h2 class="text-xl font-bold text-gray-900">{{ user?.fullName }}</h2>
                </div>
              </div>
              <div class="mt-4 flex flex-col sm:flex-row items-center sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div class="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="text-sm">{{ user?.phoneNumber }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Purchases -->
        <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div class="flex justify-between items-center mb-4 sm:mb-6">
            <h2 class="text-lg font-bold text-gray-900">Achats récents</h2>
            <a routerLink="/purchase-history" 
               class="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium transition-colors">
              Voir tout
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div class="space-y-4">
            @for (purchase of recentPurchases; track purchase.id) {
              <div class="flex flex-col sm:flex-row items-start p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div class="w-full sm:w-16 h-32 sm:h-16 rounded-lg overflow-hidden mb-4 sm:mb-0">
                  <img [src]="purchase.image" [alt]="purchase.eventName" class="w-full h-full object-cover" />
                </div>
                <div class="sm:ml-4 flex-1 w-full">
                  <div class="flex flex-col sm:flex-row justify-between items-start">
                    <div>
                      <h3 class="font-medium text-gray-900">{{purchase.eventName}}</h3>
                      <div class="mt-1 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-2">
                        <span>{{purchase.eventDate}}</span>
                        <span class="hidden sm:inline">•</span>
                        <span>{{purchase.eventTime}}</span>
                        <span class="hidden sm:inline">•</span>
                        <span>{{purchase.location}}</span>
                      </div>
                    </div>
                    <div class="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0">
                      <span [class]="purchase.status === 'completed' ? 'text-green-600 font-medium' : purchase.status === 'pending' ? 'text-amber-600 font-medium' : 'text-red-600 font-medium'">
                        {{purchase.status === 'completed' ? '+' : purchase.status === 'pending' ? '~' : '-'}}{{purchase.price}} XAF
                      </span>
                      <span class="ml-2 sm:ml-0 sm:mt-1 text-xs" [class]="
                        purchase.status === 'completed' ? 'text-green-500 bg-green-50 px-2 py-0.5 rounded-full' : 
                        purchase.status === 'pending' ? 'text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full' :
                        'text-red-500 bg-red-50 px-2 py-0.5 rounded-full'
                      ">
                        {{purchase.status === 'completed' ? 'Validé' : purchase.status === 'pending' ? 'En attente' : 'Remboursé'}}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            }@empty {
              <p class="text-sm text-gray-500 font-bold text-center"> Aucun achats recent </p>
            }
          </div>
        </div>

        <!-- Support -->
        <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4 sm:mb-6">Support client</h3>
          <div class="grid gap-3 sm:gap-4">
            <a href="#" class="hidden flex items-center p-3 sm:p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 group">
              <div class="p-2 sm:p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div class="ml-3 sm:ml-4 flex-1">
                <div class="flex justify-between items-center">
                  <div>
                    <h4 class="font-medium text-gray-900">Chat en direct</h4>
                    <p class="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Réponse immédiate</p>
                  </div>
                  <span class="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    En ligne
                  </span>
                </div>
              </div>
            </a>

            <a href="tel:+33612345678" class="flex items-center p-3 sm:p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 group">
              <div class="p-2 sm:p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div class="ml-3 sm:ml-4">
                <h4 class="font-medium text-gray-900">Support téléphonique</h4>
                <p class="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">+33 6 12 34 56 78</p>
              </div>
            </a>

            <a href="mailto:support@ticketsassailles.com" class="flex items-center p-3 sm:p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 group">
              <div class="p-2 sm:p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-3 sm:ml-4">
                <h4 class="font-medium text-gray-900">Support par email</h4>
                <p class="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Réponse sous 24h</p>
              </div>
            </a>

            <a class="hidden flex items-center p-3 sm:p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 group">
              <div class="p-2 sm:p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-3 sm:ml-4">
                <h4 class="font-medium text-gray-900">Mes tickets support</h4>
                <p class="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Suivre mes demandes</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <app-footer />
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user!: any;

  constructor(private apiService: ApiService , private router: Router) {}
  
  _events: Event[] = [];
  _tickets: Ticket[] = [];
  _ticketTypes: TicketType[] = [];

  get recentPurchases(): PurchaseHistory[] {
    return this._tickets
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 2)
      .map(ticket => {
        const ticketType = this._ticketTypes.find(t => t.id === ticket.ticketTypeId);
        const event = this._events.find(e => e.id === ticketType?.eventId);
        
        return {
          id: ticket.name,
          eventName: event?.title || 'Événement inconnu',
          eventDate: event?.date || 'Date inconnue',
          eventTime: event?.time || 'Heure inconnue',
          date: ticket.orderDate,
          price: ticket.price,
          status: this.getPaymentStatusLabel(ticket.status),
          image: event?.image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
          location: event?.location || 'Lieu inconnu',
          orderDate: this.formatDate(ticket.orderDate)
        };
      });
  }

  private getPaymentStatusLabel(status: string): any {
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

  private formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  ngOnInit(): void {
    let user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }
    user = JSON.parse(user);
    this.user = user;
    this.loadData();
  }

  loadData() {
    forkJoin([
      this.apiService.read('Event'),
      this.apiService.read('Ticket'),
      this.apiService.read('TicketType')
    ]).subscribe({
      next: ([events, tickets, ticketTypes]) => {
        this._events = events;
        this._tickets = tickets;
        this._ticketTypes = ticketTypes;
      },
      error: (error) => {
        console.error('Error loading data:', error);
      }
    });
  }

}
