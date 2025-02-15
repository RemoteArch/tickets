import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Event } from '../../shared/models/event.model';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface TicketType {
  id: number;
  eventId: number;
  name: string;
  description: string | null;
  price: number;
  maxTickets: number;
  availableTickets: number;
  color: string | null;
  benefits: string[] | null;
  position: number;
}

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pb-20">
      <!-- Header Image -->
      <div class="relative h-64">
        <img [src]="event?.image" 
             alt="Event Cover" 
             class="w-full h-full object-cover">
        <button class="absolute top-4 left-4 p-2 rounded-full bg-black/30 text-white"
                routerLink="/events">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <!-- Event Info -->
      <div class="px-4 py-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ event?.title }}</h1>
            <p class="text-gray-600 mt-1">{{ event?.date }} • {{ event?.time }}</p>
          </div>
        <span [class.hidden]="!event?.isFeatured" class="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm font-medium">
            À la une
          </span>
        </div>

        <div class="mt-6">
          <h2 class="text-lg font-semibold text-gray-900">Lieu</h2>
          <p class="text-gray-600 mt-1">{{ event?.location }}</p>
          <p class="text-gray-600">{{ event?.venue }}</p>
        </div>

        <div class="mt-6">
          <h2 class="text-lg font-semibold text-gray-900">Description</h2>
          <p class="text-gray-600 mt-1">
            {{ event?.description }}
          </p>
        </div>

        <div class="mt-6 hidden">
          <h2 class="text-lg font-semibold text-gray-900">Artistes</h2>
          <div class="mt-2 flex flex-wrap gap-2">
            <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">MC Solaar</span>
            <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">IAM</span>
            <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Oxmo Puccino</span>
          </div>
        </div>

        <!-- Ticket Types -->
        <div class="mt-8">
          <h2 class="text-lg font-semibold text-gray-900">Billets disponibles</h2>
          <div class="mt-4 space-y-4">
            <div *ngFor="let ticketType of ticketTypes; trackBy: trackTicketTypeById">
              <div class="border border-gray-200 rounded-lg p-4 bg-white">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-medium text-gray-900">{{ ticketType.name }}</h3>
                    <p class="text-sm text-gray-500 mt-1">{{ ticketType.availableTickets }} places restantes</p>
                    <p class="text-xs text-gray-500">Max {{ ticketType.maxTickets }} billets/personne</p>
                  </div>
                  <div class="text-right flex flex-col items-end gap-2">
                    <div>
                      <p class="text-gray-500 line-through">{{ ticketType.price }} XAF</p>
                      <p class="text-secondary font-bold">{{ ticketType.price }} XAF</p>
                    </div>
                    <button [routerLink]="['/purchase', ticketType.id]"
                            [disabled]="!isTicketAvailable(ticketType)"
                            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      {{ isTicketAvailable(ticketType) ? 'Acheter' : 'Épuisé' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fixed Bottom Button -->
      <!-- <div class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
        <button routerLink="/purchase" 
                class="w-full bg-primary text-white rounded-lg py-3 font-medium hover:bg-primary/90 transition-colors">
          Acheter un billet
        </button>
      </div> -->
    </div>
  `
})
export class EventDetailsComponent implements OnInit {
  private _event!: Event;
  private _ticketTypes: TicketType[] = [];
  private eventId: number | null = null;

  /**
   * Getter pour l'événement courant
   */
  get event(): Event | null {
    return this._event;
  }

  /**
   * Getter pour les types de billets de l'événement, triés par position
   */
  get ticketTypes(): TicketType[] {
    return [...this._ticketTypes].sort((a, b) => a.position - b.position);
  }

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'événement depuis l'URL et charger les données
    this.route.params.pipe(
      switchMap(params => {
        this.eventId = +params['id'];
        console.log('Event ID:', this.eventId);
        return forkJoin({
          event: this.apiService.getById('Event', this.eventId),
          ticketTypes: this.apiService.read('TicketType', { eventId: this.eventId })
        });
      })
    ).subscribe({
      next: (data: { event: Event, ticketTypes: TicketType[] }) => {
        this._event = data.event;
        this._ticketTypes = data.ticketTypes;
        console.log('Event loaded:', this._event);
        console.log('Ticket types loaded:', this.ticketTypes);
      },
      error: (error) => {
        console.error('Error loading event details:', error);
        // this._event = null;
        this._ticketTypes = [];
      }
    });
  }

  /**
   * Vérifie si un type de billet a encore des places disponibles
   */
  isTicketAvailable(ticketType: TicketType): boolean {
    return ticketType.availableTickets > 0;
  }

  /**
   * Calcule le pourcentage de billets restants
   */
  getAvailabilityPercentage(ticketType: TicketType): number {
    return (ticketType.availableTickets / ticketType.maxTickets) * 100;
  }

  trackTicketTypeById(index: number, ticketType: TicketType): number {
    return ticketType.id;
  }
}
