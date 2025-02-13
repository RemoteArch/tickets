import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Event } from '../../shared/models/event.model';
import { Category, TicketType, User } from '../../shared/models';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { UserRegisterComponent } from '../user-register/user-register.component';

interface FeaturedEvent {
  id: number;
  title: string;
  date: string;
  price: number;
  specialPrice: number;
  image: string;
}

interface CategoryEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  specialPrice: number;
  image: string;
  category: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, FormsModule, UserRegisterComponent],
  template: `
    <!-- Search and Filter Bar -->
    <div class="fixed top-0 left-0 w-full bg-white shadow-md z-10">
      <div class="flex items-center justify-between p-4">
        <div class="flex-1 relative">
          <input type="search" [(ngModel)]="eventsearch"
                 placeholder="Rechercher un événement..." 
                 class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
          >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button class="ml-4 p-2 rounded-lg bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Featured Events Slider -->
    <div class="mt-20 mb-6 ">
      <h2 class="text-2xl font-bold mb-4 text-primary px-4">À la une</h2>
      <div class="flex overflow-x-auto space-x-4 pb-4 px-4 scrollbar-hide">
        @for (event of filteredEvents; track event.id) {
          <div [routerLink]="['/event', event.id]" class="flex-none bg-white w-80 rounded-lg overflow-hidden shadow-lg">
            <img [src]="event.image" 
                 [alt]="event.title" 
                 class="w-full h-48 object-cover"
                 (error)="handleImageError($event)"
                 loading="lazy">
            <div class="p-4">
              <h3 class="font-semibold text-lg">{{event.title}}</h3>
              <p class="text-gray-600">{{event.date}}</p>
              <div class="mt-2 flex justify-between items-center">
                <div>
                  <p class="text-gray-500 line-through">{{event.price}} XAF</p>
                  <p class="text-primary font-bold">{{event.specialPrice}} XAF</p>
                </div>
                <span class="bg-primary/20 text-primary px-2 py-1 rounded-full text-sm">
                  Tickets Assaillés
                </span>
              </div>
            </div>
          </div>
        }@empty {
          <p>Aucun événement à afficher.</p>
        }
      </div>
    </div>

    <!-- Events by Category -->
    <div class="mb-20 px-4">
      @for (category of categories; track category) {
        @if (categoryEvents[category]) {
          <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-900">{{category}}</h2>
              <a [routerLink]="['/categories',$index+1]" 
                 class="text-primary text-sm font-medium">
                Voir tout
              </a>
            </div>
            <div class="grid grid-cols-2 gap-4">
              @for (event of categoryEvents[category].slice(0, 4); track event.id) {
                <a [routerLink]="['/event', event.id]" 
                   class="rounded-lg overflow-hidden shadow-sm bg-white">
                  <img [src]="event.image" 
                       [alt]="event.title" 
                       class="w-full aspect-[4/3] object-cover"
                       (error)="handleImageError($event)"
                       loading="lazy">
                  <div class="p-3">
                    <h3 class="font-medium text-sm line-clamp-2">{{event.title}}</h3>
                    <p class="text-xs text-gray-500 mt-1">{{event.date}} • {{event.time}}</p>
                    <p class="text-xs text-gray-500">{{event.location}}</p>
                    <div class="mt-2 flex justify-between items-center">
                      <p class="text-secondary font-bold text-sm">{{event.specialPrice}} XAF</p>
                      <span class="text-xs text-gray-500 line-through">{{event.price}} XAF</span>
                    </div>
                  </div>
                </a>
              }
            </div>
          </div>
        }
      }
    </div>

    <!-- Footer -->
    <app-footer />

    <!-- User Register Modal -->
    @if (showRegisterModal) {
      <app-user-register 
        [initialPhoneNumber]="initialPhoneNumber"
        (close)="closeRegisterModal()"
        (userRegistered)="onUserRegistered($event)">
      </app-user-register>
    }
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class HomeComponent implements OnInit {

  private _ticketTypes: TicketType[] = [];
  private _events:Event[] = [];
  private _categories:Category[] = [];
  private _user: User | null = null;
  showRegisterModal = false;

  initialPhoneNumber: string | null = null;

  /**
   * Retourne la liste des noms de catégories
   */
  get categories(): string[] {
    return this._categories.map(cat => cat.name);
  }

  /**
   * Transforme les événements en y incluant les informations de catégorie
   * @returns Un objet avec les événements groupés par catégorie
   */
  get categoryEvents(): { [key: string]: CategoryEvent[] } {
    const eventsByCategory: { [key: string]: CategoryEvent[] } = {};
    
    // Initialiser les tableaux vides pour chaque catégorie
    this._categories.forEach(cat => {
      eventsByCategory[cat.name] = [];
    });

    // Grouper les événements par catégorie
    this._events.forEach(event => {
      const category = this._categories.find(cat => cat.id === event.categoryId);
      if (category) {
        const categoryEvent: CategoryEvent = {
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location,
          price: this._ticketTypes.find(t => t.eventId === event.id)?.price || 0,
          specialPrice: this._ticketTypes.find(t => t.eventId === event.id)?.specialPrice || 0,
          image: event.image,
          category: category.name
        };
        eventsByCategory[category.name].push(categoryEvent);
      }
    });

    // Ne retourner que les catégories qui ont des événements
    return Object.fromEntries(
      Object.entries(eventsByCategory).filter(([_, events]) => events.length > 0)
    );
  }

  // Image de remplacement par défaut
  private defaultImage = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80';

  eventsearch = ""

  // Gestionnaire d'erreur pour les images
  handleImageError(event: any) {
    const img = event.target;
    if (img.src !== this.defaultImage) {
      img.src = this.defaultImage;
    }
  }

  get filteredEvents() {
    return this.featuredEvents.filter(event =>
      event.title.toLowerCase().includes(this.eventsearch.toLowerCase())
    );
  }

  /**
   * Transforme un Event en FeaturedEvent
   * @param event L'événement complet à transformer
   * @returns Un événement au format FeaturedEvent
   */
  get featuredEvents(): FeaturedEvent[] {
    return this._events
      .filter(event => event.isFeatured)
      .map(event => ({
        ...event,
        ...(():{price:number , specialPrice:number}=>{
          let t = this._ticketTypes.find(t => t.eventId == event.id);
          console.log(t , this._ticketTypes)
          if(t) return {price:t.price , specialPrice:t.specialPrice}
          return {price:0 , specialPrice:0}
        })()
      }));
  }

  constructor(private apiService: ApiService, private route: ActivatedRoute){}

  private loadHomeData() {
    return forkJoin({
      ticketTypes: this.apiService.read('tickettype'),
      events: this.apiService.read('event'),
      categories: this.apiService.read('category')
    });
  }

  private getStoredUser(): User | null {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  private handleExistingUser(storedUser: User, phone: string | null): boolean {
    if (!phone || storedUser.phoneNumber === phone) {
      this._user = storedUser;
      console.log('User found in localStorage:', storedUser);
      return true;
    }
    return false;
  }

  private handleUserByPhone(phone: string) {
    return this.apiService.read('user', { phoneNumber: phone }).pipe(
      tap(users => {
        if (users && users.length > 0) {
          // Utilisateur trouvé, le sauvegarder dans le localStorage
          this._user = users[0];
          localStorage.setItem('user', JSON.stringify(this._user));
        } else {
          // Utilisateur non trouvé, afficher la modal avec le numéro pré-rempli
          this.initialPhoneNumber = phone;
          this.apiService.create('user', {fullName: '', phoneNumber: phone }).subscribe({
            next: (user: any) => {
              localStorage.setItem('user', JSON.stringify(user.data));
              this._user = user.data;
            },
            error: (error) => {
              console.error('Error creating user:', error);
            }
          });
        }
      }),
      switchMap(() => this.loadHomeData())
    );
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap(params => {
        const phone = params['phone'];
        const storedUser = this.getStoredUser();

        // Si on a un utilisateur stocké, vérifier s'il correspond au numéro de téléphone
        if (storedUser && this.handleExistingUser(storedUser, phone)) {
          return this.loadHomeData();
        }

        // Si on a un numéro de téléphone mais pas d'utilisateur correspondant
        if (phone) {
          return this.handleUserByPhone(phone);
        }

        // Dans tous les autres cas, afficher la modal d'inscription
        this.showRegisterModal = true;
        return this.loadHomeData();
      })
    ).subscribe({
      next: (data) => {
        this._categories = data.categories;
        this._events = data.events;
        this._ticketTypes = data.ticketTypes
        console.log('Categories loaded:', this._categories);
        console.log('Events loaded:', this._events);
      },
      error: (error) => {
        console.error('Error loading home data:', error);
        this._categories = [];
        this._events = [];
      }
    });
  }

  closeRegisterModal(): void {
    this.showRegisterModal = false;
  }

  onUserRegistered(user: User): void {
    this._user = user;
    console.log('User registered:', user);
  }
}
