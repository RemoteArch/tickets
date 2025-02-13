import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-purchase-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div [class.hidden]="!isShow" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <!-- Loading State -->
        <div *ngIf="status === 'loading'" class="p-6 flex flex-col items-center">
          <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600">{{ message || 'Vérification du paiement en cours...' }}</p>
        </div>

        <!-- Error State -->
        <div *ngIf="status === 'error'" class="p-6">
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Paiement échoué</h2>
            <p class="text-gray-600 text-center mb-6">{{ message || 'Une erreur est survenue lors du paiement.' }}</p>
            <button (click)="hide()" 
                    class="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90">
              Réessayer
            </button>
          </div>
        </div>

        <!-- Pending State -->
        <div *ngIf="status === 'pending'" class="p-6">
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Paiement en attente</h2>
            <p class="text-gray-600 text-center mb-6">
              {{ message || 'Votre paiement est en cours de traitement. Veuillez patienter...' }}
            </p>
            <button routerLink="/my-tickets" 
                    class="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90">
              Voir mes tickets
            </button>
          </div>
        </div>

        <!-- Success State -->
        <div *ngIf="status === 'success'" class="p-6">
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Paiement réussi</h2>
            <p class="text-gray-600 text-center mb-6">
              {{ message || 'Votre paiement a été confirmé. Vos billets sont maintenant disponibles.' }}
            </p>
            <button routerLink="/my-tickets" 
                    class="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90">
              Voir mes tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PurchaseConfirmationComponent {
  status: 'loading' | 'success' | 'pending' | 'error' = 'loading';
  message?: string;
  isShow = false;

  show(status:'loading' | 'success' | 'pending' | 'error', message?: string){
    this.status = status;
    this.message = message;
    this.isShow = true;
  }

  hide(){
    this.isShow = false;
  }
}
