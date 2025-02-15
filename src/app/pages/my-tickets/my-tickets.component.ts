import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { environment } from '../../../environments/environment';
import { Ticket, TicketType } from '../../shared/models';
import { ApiService } from '../../services/api.service';
import {Event} from '../../shared/models'
import { TicketShare } from '../../shared/models/ticket-share.model';
import { FormsModule } from '@angular/forms';
import { TicketShareModalComponent } from '../../components/ticket-share-modal/ticket-share-modal.component';

interface TicketView {
  name: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  ticketType: string;
  quantity: number;
  status: 'upcoming' | 'expired';
  qrCode: string;
  paymentStatus: string;
}

interface EventTickets{
  image: string;
  eventName: string;
  tickets: any[];
  showTicket: boolean;
}

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule, FooterComponent, FormsModule, TicketShareModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50 pb-20">
      <!-- Header -->
      <div class="bg-white shadow-sm">
        <div class="px-4 py-4">
          <h1 class="text-2xl font-bold text-primary">Mes Tickets</h1>
        </div>
      </div>
      <!-- Tickets List -->
      <div class="p-4">
        <!-- Upcoming Tickets Section -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">À venir</h2>
          <div class="space-y-4">
            @for(eventTicket of eventTickets; track $index){
              <div class="bg-gray-100 rounded-lg">
                <div class="flex items-center justify-between gap-3 mb-2 bg-primary text-white p-3 rounded-lg shadow-md">
                  <img [src]="eventTicket.image" class="h-16 w-20 rounded-md object-cover">
                  
                  <div>
                    <p class="text-lg font-semibold ">{{ eventTicket.eventName }}</p>
                    <span class="font-bold text-xl ">{{ eventTicket.tickets.length }}</span> Billets
                  </div>
                  
                  <!-- Icône avec rotation dynamique -->
                  <svg 
                    [class.rotate-180]="showTicket == eventTicket.eventName" 
                    (click)="showTicket = eventTicket.eventName != showTicket ? eventTicket.eventName: '' "
                    xmlns="http://www.w3.org/2000/svg" 
                    class="w-10 cursor-pointer transition-transform duration-300" 
                    viewBox="0 0 24 24">
                    <path fill="currentColor" d="m7 10l5 5l5-5z"/>
                  </svg>
                </div>
                <div [class.hidden]="showTicket != eventTicket.eventName" class="space-y-4 mt-5 mx-2 pb-5">
                  @for (ticket of eventTicket.tickets; track $index) {
                    <div class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                      <!-- Event Header -->
                      <div class="p-4 bg-gradient-to-r from-primary to-primary/80">
                        <div class="flex justify-between items-start">
                          <div>
                            <h3 class="text-white font-bold text-lg">{{ticket.eventName}}</h3>
                            <div class="flex items-center mt-1 text-white/90">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span class="text-sm">{{ticket.eventDate}} • {{ticket.eventTime}}</span>
                            </div>
                          </div>
                          <div class="bg-white/20 px-3 py-1 rounded-full">
                            <span class="text-white text-sm font-medium">{{ticket.quantity}} {{ticket.quantity > 1 ? 'billets' : 'billet'}}</span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Ticket Details -->
                      <div class="p-4">
                        <div class="flex items-center justify-between mb-4">
                          <div>
                            <p class="text-gray-500 text-sm">Type de billet</p>
                            <p class="font-semibold text-gray-800">{{ticket.ticketType}}</p>
                          </div>
                          <div class="text-right">
                            <p class="text-gray-500 text-sm">Référence</p>
                            <p class="font-mono text-sm text-gray-800">{{ticket.name}}</p>
                          </div>
                        </div>
      
                        <!-- QR Code -->
                        <div class="relative">
                          <div class="absolute -left-4 -right-4 h-px bg-gray-200 border-dashed border-t border-gray-300"></div>
                        </div>
                        <div class="mt-4 flex justify-center">
                          <div class="bg-white p-4 rounded-xl shadow-inner">
                            <img [src]="ticket.qrCode" [alt]="'QR Code pour ' + ticket.eventName" 
                                 class="w-48 h-48">
                          </div>
                        </div>
                        <div>
                          @if(ticket.shared){
                            @if(ticket.shared.receiverPhone == user.phone){
                              <p class="mt-2 bg-primary/50 text-white py-1 px-4 rounded-full"> recu de  {{ticket.shared.senderPhone}}</p>
                            }@else {
                              <p class="mt-2 bg-primary/50 text-white py-1 px-4 rounded-full"> deja partager as {{ticket.shared.receiverName??ticket.shared.receiverPhone}}</p>
                            }
                          }@else {
                            <button (click)="shareModal.show(ticket,this.user.phoneNumber , this.address)" class="mt-2 bg-primary/50 text-white py-1 px-4 rounded-full" > Partager </button>
                          }
                        </div>
                      </div>
                    </div>
                  }@empty {
                    <p class="text-sm text-gray-500 font-bold text-center"> Aucun ticket a venir </p>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Past Tickets Section -->
        <div>
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Tickets passés</h2>
          <div class="space-y-4">
            @for (ticket of expiredTickets; track $index) {
              <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div class="p-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-gray-600 font-medium">{{ticket.eventName}}</h3>
                      <div class="flex items-center mt-1 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="text-sm">{{ticket.eventDate}} • {{ticket.eventTime}}</span>
                      </div>
                    </div>
                    <div class="bg-gray-100 px-3 py-1 rounded-full">
                      <span class="text-gray-600 text-sm">{{ticket.quantity}} {{ticket.quantity > 1 ? 'billets' : 'billet'}}</span>
                    </div>
                  </div>
                  <div class="mt-3 flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm">Expiré</span>
                  </div>
                </div>
              </div>
            }@empty {
              <p class="text-sm text-gray-500 font-bold text-center"> Aucun tickets passer ou expirer </p>
            }
          </div>
        </div>

      </div>
      <app-ticket-share-modal #shareModal
        (shared)="onTicketShared()"
      />
      <!-- Footer -->
      <app-footer />
    </div>
  `
})
export class MyTicketsComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  _events: Event[] = [];
  _tickets: Ticket[] = [];
  _ticketTypes: TicketType[] = [];
  _ticketShares: TicketShare[] = [];

  get address(){
    return this._ticketShares.filter(ticket => ticket.receiverName != null).map(ticket => ({name:ticket.receiverName , phone:ticket.receiverPhone.replace('237' , '')}))
  }

  user!: any;

  loadData(){ 
    this.apiService.readMultiple(['Event','Ticket','TicketType','TicketShare'])
    .subscribe({
      next: (data:any[]) => {
        this._events = data[0];
        this._tickets = data[1];
        this._ticketTypes = data[2];
        this._ticketShares = data[3];
        console.log('data loaded:', data);
      },
      error: (error) => {
        console.error('Error loading tickets:', error);
      }
    })
  }

  ngOnInit(): void {
    let user:any = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/']);
      return;
    }
    user = JSON.parse(user);
    this.loadData();
    this.user = user;
  }

  showTicket = ""

  qrApi = environment.qrApiUrl;

  get eventTickets(): EventTickets[]{
    return this._events.map(event => ({
      eventName: event.title,
      showTicket : false,
      image: event.image,
      tickets: this.upcomingTickets.filter(ticket => ticket.eventName == event.title)
    })).filter(eventTicket => eventTicket.tickets.length != 0)
  }


  get tickets(): any[] {
    return this._tickets.map(ticket => {
      const ticketType = this._ticketTypes.find(t => t.id === ticket.ticketTypeId);
      const event = this._events.find(e => e.id === ticketType?.eventId);
      const { formattedDate, formattedTime } = this.formatEventDateTime(event?.date || '');
      const ticketShare = this._ticketShares.find(ts => ts.ticketId === ticket.id);
      return {
        ...ticket,
        eventName: event?.title || 'Événement inconnu',
        eventDate: formattedDate,
        eventTime: formattedTime,
        ticketType: ticketType?.name || 'Type inconnu',
        quantity: 1,
        status: this.getTicketStatus(event?.date || ''),
        qrCode: `${this.qrApi}${ticket.qrCode}`,
        paymentStatus: ticket.status,
        price: ticket.price,
        shared: ticketShare,
      };
    }).filter(ticket => (ticket.shared && ticket.shared?.receiverPhone.includes(this.user.phoneNumber.slice(3))) || this.user.id == ticket.userId)
  }

  getPaymentStatusClass(status: string): string {
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

  private getTicketStatus(eventDate: string): 'upcoming' | 'expired' {
    if (!eventDate) return 'expired';
    const eventTime = new Date(eventDate).getTime();
    const now = new Date().getTime();
    return eventTime > now ? 'upcoming' : 'expired';
  }

  get upcomingTickets(): TicketView[] {
    return this.tickets.filter(ticket => ticket.status === 'upcoming');
  }

  get expiredTickets(): TicketView[] {
    return this.tickets.filter(ticket => ticket.status === 'expired');
  }

  onTicketShared() {
    this.loadData();
  }
}
