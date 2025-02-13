import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Event } from '../../shared/models/event.model';
import { PaymentService } from '../../services/payment.service';
import { PurchaseConfirmationComponent } from "../purchase-confirmation/purchase-confirmation.component";

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
  selector: 'app-purchase',
  standalone: true,
  imports: [CommonModule, RouterLink, PurchaseConfirmationComponent],
  template: `
    <div class="min-h-screen bg-gray-50 pb-20">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200">
        <div class="px-4 py-4">
          <div class="flex items-center">
            <button class="mr-4" routerLink="/event/1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-gray-900">Confirmation d'achat</h1>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-4 py-6">
        <!-- Event Summary -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 class="font-semibold text-gray-900">{{ event.title }}</h2>
          <p class="text-gray-600 text-sm mt-1">{{ event.date }} • {{ event.time }}</p>
          <p class="text-gray-600 text-sm">{{ event.location }}</p>
        </div>

        <!-- Selected Ticket -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 class="font-medium text-gray-900">Billet sélectionné</h3>
          <div class="mt-3 flex justify-between items-center">
            <div>
              <p class="text-gray-900">{{ ticketType.name }}</p>
              <p class="text-sm text-gray-500">{{ticketType.maxTickets}} billets maximum</p>
            </div>
            <div class="text-right">
              <p class="text-gray-500 line-through">{{ ticketType.price }} XAF</p>
              <p class="text-secondary font-bold">{{ ticketType.price }} XAF</p>
            </div>
          </div>
          
          <!-- Quantity Selector -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Quantité</label>
            <div class="mt-2 flex items-center">
              <button (click)="decrementQuantity()" 
                      class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              <span class="mx-4 w-8 text-center">{{quantity}}</span>
              <button (click)="incrementQuantity()" 
                      class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 class="font-medium text-gray-900">Informations de contact</h3>
          <div class="mt-3">
            <p class="text-gray-600">Numéro de téléphone</p>
            <p class="text-gray-900 font-medium">{{user.phoneNumber}}</p>
            <p class="text-sm text-gray-500 mt-1">
              Récupéré automatiquement via Ayoba
            </p>
          </div>
        </div>

        <!-- Price Summary -->
        <div class="bg-white rounded-lg shadow-sm p-4">
          <h3 class="font-medium text-gray-900">Récapitulatif</h3>
          <div class="mt-3 space-y-2">
            <div class="flex justify-between">
              <p class="text-gray-600">Prix unitaire</p>
              <p class="text-gray-900">{{ ticketType.price }} XAF</p>
            </div>
            <div class="flex justify-between">
              <p class="text-gray-600">Quantité</p>
              <p class="text-gray-900">{{quantity}}</p>
            </div>
            <div class="flex justify-between font-medium pt-2 border-t">
              <p class="text-gray-900">Total</p>
              <p class="text-primary">{{quantity * ticketType.price}} XAF</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Fixed Bottom Button -->
      <div class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
        <button (click)="purchase()" 
                class="w-full bg-primary text-white rounded-lg py-3 font-medium hover:bg-primary/90 transition-colors">
                Confirmer et payer
        </button>
      </div>
      <app-purchase-confirmation #pushaseConfirm></app-purchase-confirmation>
    </div>
  `
})
export class PurchaseComponent implements OnInit {
  private _ticketType!: TicketType;
  private _event!: Event;

  @ViewChild("pushaseConfirm") pushaseConfirm!: PurchaseConfirmationComponent;

  get ticketType(): TicketType {
    return this._ticketType;
  }

  get event(): Event {
    return this._event;
  }

  quantity: number = 1;

  user!: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      // Rediriger vers la page d'accueil si l'utilisateur n'est pas connecté
      this.router.navigate(['/']);
      return;
    }

    this.user = JSON.parse(storedUser);

    this.route.params.pipe(
      switchMap(params => {
        const ticketTypeId = +params['id'];
        console.log('TicketType ID:', ticketTypeId);
        return this.apiService.getById('ticketType', ticketTypeId).pipe(
          switchMap((ticketType: TicketType) => {
            this._ticketType = ticketType;
            return this.apiService.getById('event', ticketType.eventId);
          })
        );
      })
    ).subscribe({
      next: (event: Event) => {
        this._event = event;
        console.log('TicketType loaded:', this._ticketType);
        console.log('Event loaded:', this._event);
      },
      error: (error) => {
        console.error('Error loading purchase details:', error);
        // this._ticketType = null;
        // this._event = null;
      }
    });
  }

  incrementQuantity() {
    if (this.quantity < this.ticketType.maxTickets) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  purchase() {
    // Logique pour acheter les billets
    this.pushaseConfirm.show('loading' , 'Processing payment...');
    this.paymentService.processPayment({
      ticketId: this.ticketType.id,
      quantity: this.quantity,
      tel: this.user.phoneNumber,
      userId: this.user.id
    }).subscribe({
      next: (response) => {
        console.log('Payment successful:', response);
        this.pushaseConfirm.show('success' , 'Payment initialisation successful!');
      },
      error: (error) => {
        console.error('Payment error:', error);
        this.pushaseConfirm.show('error' , 'Payment error!');
      }
    });
    console.log('Purchasing quantity:', this.quantity);
  }
}
