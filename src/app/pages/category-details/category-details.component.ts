import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Event } from '../../shared/models/event.model';
import { Category, TicketType } from '../../shared/models';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  template: `
    <div class="pt-3 pb-20 px-4">
      <!-- Back button and Category name -->
      <div class="flex items-center mb-6">
        <a routerLink="/categories" class="mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </a>
        <h1 class="text-2xl font-bold text-primary">{{category?.name}}</h1>
      </div>

      <!-- Category Image Banner -->
      <div class="relative w-full h-40 mb-6 rounded-xl overflow-hidden">
        <img [src]="category?.image" [alt]="category?.name" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div class="absolute bottom-0 p-4 w-full">
            <p class="text-white text-lg">{{events.length}} événements disponibles</p>
          </div>
        </div>
      </div>

      <!-- Events List -->
      <div class="space-y-4">
        <ng-container *ngFor="let event of events; trackBy: trackEventById">
          <a [routerLink]="['/event', event.id]" 
             class="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div class="flex h-32">
              <!-- Event Image -->
              <div class="w-1/3">
                <img [src]="event.image" [alt]="event.title" class="w-full h-full object-cover">
              </div>
              <!-- Event Details -->
              <div class="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h3 class="font-semibold text-lg mb-1">{{event.title}}</h3>
                  <div class="flex items-center text-sm text-gray-600 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{event.date}} à {{event.time}}
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{event.location}}
                  </div>
                </div>
                <div class="text-primary font-semibold">
                  {{event.price}} XAF
                </div>
              </div>
            </div>
          </a>
        </ng-container>

        <ng-container *ngIf="events.length === 0">
          <div class="text-center py-8 text-gray-500">
            Aucun événement disponible dans cette catégorie
          </div>
        </ng-container>
      </div>
      <!-- Footer -->
      <app-footer />
    </div>
  `
})
export class CategoryDetailsComponent implements OnInit {
  private _category: Category | null = null;
  private _events: Event[] = [];
  private categoryId: number | null = null;
  private _ticketTypes: TicketType[] = [];

  /**
   * Getter pour la catégorie courante
   */
  get category(): Category | null {
    return this._category;
  }

  /**
   * Getter pour les événements de la catégorie
   */
  get events(): any[] {
    return this._events.filter(event => event.categoryId === this.categoryId).map(event => {
      const ticketType = this._ticketTypes.find(t => t.eventId === event.id);
      return {
        ...event,
        price: ticketType?.price || 0,
        specialPrice: ticketType?.specialPrice || 0
      };
    });
  }

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de la catégorie depuis l'URL et charger les données
    this.route.params.pipe(
      switchMap(params => {
        this.categoryId = +params['id']; // Convertir en nombre
        console.log('Category ID:', this.categoryId);
        return forkJoin({
          category: this.apiService.getById('category', this.categoryId),
          events: this.apiService.read('event'),
          ticketTypes: this.apiService.read('tickettype')
        });
      })
    ).subscribe({
      next: (data: { category: Category, events: Event[], ticketTypes: TicketType[] }) => {
        this._category = data.category;
        this._events = data.events;
        this._ticketTypes = data.ticketTypes;
        console.log('Category loaded:', this._category);
        console.log('Events loaded:', this.events);
        console.log('Ticket types loaded:', this._ticketTypes);
      },
      error: (error) => {
        console.error('Error loading category details:', error);
        this._category = null;
        this._events = [];
      }
    });
  }

  trackEventById(index: number, event: Event): number {
    return event.id;
  }
}