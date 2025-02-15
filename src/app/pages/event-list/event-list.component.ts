import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Category, Event, TicketType } from '../../shared/models';
import { FooterComponent } from '../../shared/components/footer/footer.component';

interface GroupedEvents {
  [key: string]: {
    [key: string]: Event[];
  };
}

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, FooterComponent],
  template: `
    <div class="min-h-screen p-2 ">
      <h1 class="text-2xl font-bold mb-3 text-primary p-2">Evenements</h1>      
      <!-- Content -->
      <div class="pb-20 p-2">

      <!-- categories -->
        <div>
          <p class="text-xl font-bold mb-4 text-primary">Par catégories</p>
          <div class="w-full overflow-x-scroll scrollbar-hide flex items-center space-x-4">
            <p (click)="categorieSelectId = ''" [ngClass]="{ 'bg-primary text-white': categorieSelectId === '', 'text-primary': categorieSelectId !== '' }" class="text-lg rounded-full border-primary border px-3 pb-1">Tous</p>
            @for (category of categories; track category) {
            <p (click)="categorieSelectId = category" [ngClass]="{ 'bg-primary text-white': categorieSelectId === category, 'text-primary': categorieSelectId !== category }" class="text-lg rounded-full border-primary border px-3 pb-1">{{category}}</p>
            }
          </div>
          <div class="grid grid-cols-2 gap-4 mt-5">
            @for (event of Events; track $index) {
              <a [routerLink]="['/event', event.id]" class="block">
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div class="relative pb-[56.25%]">
                    <img 
                      [src]="event.image || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80'" 
                      [alt]="event.title"
                      class="absolute inset-0 w-full h-full object-cover"
                    >
                  </div>
                  <div class="p-3">
                    <h4 class="font-medium text-gray-900 truncate">{{ event.title }}</h4>
                    <p class="text-sm text-gray-500">{{ formatDate(event.date) }}</p>
                    <div class="flex items-center justify-between mt-2">
                      <span class="text-sm font-medium text-primary">{{ formatPrice(event.price) }}</span>
                      <span class="text-xs text-gray-500">{{ event.location }}</span>
                    </div>
                  </div>
                </div>
              </a>
              }@empty {
                <div class="flex flex-col items-center justify-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p class="text-gray-500">Aucun événement trouvé</p>
                </div>
              }
    
          </div>
        </div>

      <!-- villes location -->
        <div class="mt-10">
          <p class="text-xl font-bold mb-4 text-primary">Par Villes</p>
          <div class="w-full overflow-x-scroll scrollbar-hide flex items-center space-x-4">
            <p (click)="villeSelect = ''" [ngClass]="{ 'bg-primary text-white': villeSelect === '', 'text-primary': villeSelect !== '' }" class="text-lg rounded-full border-primary border px-3 pb-1">Tous</p>
            @for (ville of villes; track $index) {
            <p (click)="villeSelect = ville" [ngClass]="{ 'bg-primary text-white': villeSelect === ville, 'text-primary': villeSelect !== ville }" class="text-lg rounded-full border-primary border px-3 pb-1">{{ville}}</p>
            }
          </div>
          <div class="grid grid-cols-2 gap-4 mt-5">
            @for (event of Events; track $index) {
              <a [routerLink]="['/event', event.id]" class="block">
                <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div class="relative pb-[56.25%]">
                    <img 
                      [src]="event.image || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80'" 
                      [alt]="event.title"
                      class="absolute inset-0 w-full h-full object-cover"
                    >
                  </div>
                  <div class="p-3">
                    <h4 class="font-medium text-gray-900 truncate">{{ event.title }}</h4>
                    <p class="text-sm text-gray-500">{{ formatDate(event.date) }}</p>
                    <div class="flex items-center justify-between mt-2">
                      <span class="text-sm font-medium text-primary">{{ formatPrice(event.price) }}</span>
                      <span class="text-xs text-gray-500">{{ event.location }}</span>
                    </div>
                  </div>
                </div>
              </a>
              }@empty {
                <div class="flex flex-col items-center justify-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p class="text-gray-500">Aucun événement trouvé</p>
                </div>
              }
    
          </div>
        </div>

      </div>
      <!-- Footer -->
      <app-footer />
    </div>
  `
})
export class EventListComponent implements OnInit {
  private _events!: Event[];
  private _categories!: Category[];
  private _ticketTypes!: TicketType[];
  categories! : string[]
  categorieSelectId = ""
  villes! : string[]
  villeSelect = ""
  groupedEvents: GroupedEvents = {};
  searchTerm: string = '';
  
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.readMultiple(["Event" , "Category" , "TicketType"]).subscribe({
      next:(data:any[])=>{
        this._events = data[0];
        this._categories = data[1];
        this._ticketTypes = data[2];
        this.categories = this._categories.map(cat => cat.name)
        this.villes = this._events.map(ev=>ev.location)
        console.log(data)
      },
      error: (error) => {
        console.error('Error loading events:', error);
      }
    })
  }

  get Events() {
    return this._events.map(event=>({
      ...event,
      price: this._ticketTypes.find((ticket) => ticket.eventId == event.id)?.specialPrice || 0
    }))
  }

  getCategoryEvent(event:any){
    return {
      ...event,
      price: this._ticketTypes.find(t => t.eventId === event.id)?.price || 0,
      specialPrice: this._ticketTypes.find(t => t.eventId === event.id)?.specialPrice || 0,
    };
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  }

  get Object() {
    return Object;
  }
}
