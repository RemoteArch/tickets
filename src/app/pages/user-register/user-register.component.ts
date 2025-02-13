import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User } from '../../shared/models';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Modal Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <!-- Modal Content -->
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Inscription</h2>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Full Name Input -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              id="fullName"
              formControlName="fullName"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              [class.border-red-500]="isFieldInvalid('fullName')"
            >
            <div *ngIf="isFieldInvalid('fullName')">
              <p class="mt-1 text-sm text-red-500">Le nom complet est requis</p>
            </div>
          </div>

          <!-- Phone Number Input -->
          <div>
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              id="phoneNumber"
              formControlName="phoneNumber"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              [class.border-red-500]="isFieldInvalid('phoneNumber')"
            >
            <div *ngIf="isFieldInvalid('phoneNumber')">
              <p class="mt-1 text-sm text-red-500">Un numéro de téléphone valide est requis</p>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="submit"
              [disabled]="registerForm.invalid || isSubmitting"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="isSubmitting">Inscription en cours...</span>
              <span *ngIf="!isSubmitting">S'inscrire</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class UserRegisterComponent {
  @Input() initialPhoneNumber: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() userRegistered = new EventEmitter<User>();

  registerForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
    });
  }

  ngOnInit() {
    if (this.initialPhoneNumber) {
      this.registerForm.patchValue({
        phoneNumber: this.initialPhoneNumber
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      const userData: User = {
        ...this.registerForm.value,
        role: 'user',
        isActive: true
      };

      this.apiService.create('user', userData).subscribe({
        next: (user: any) => {
          localStorage.setItem('user', JSON.stringify(user.data));
          this.userRegistered.emit(user.data);
          this.close.emit();
        },
        error: (error) => {
          console.error('Error creating user:', error);
          // Ici vous pourriez ajouter une gestion d'erreur plus sophistiquée
          this.isSubmitting = false;
        }
      });
    }
  }
}
