import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Category } from '../../shared/models';
import { ApiService } from '../../services/api.service';

interface CategoryView {
  id: number;
  name: string;
  image: string;
  eventCount: number;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, FormsModule],
  template: `
    <div class="pt-3 pb-20 px-4">
      <h1 class="text-2xl font-bold mb-6 text-primary">Catégories</h1>
      
      <!-- Search Bar -->
      <div class="mb-6">
        <div class="relative">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="filterCategories"
            placeholder="Rechercher une catégorie..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-2 gap-4">
        @for (category of filterCategories; track category.id) {
          <a [routerLink]="['/categories', category.id]" 
             class="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img [src]="category.image" [alt]="category.name" 
                 class="w-full h-32 object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div class="absolute bottom-0 p-3 w-full">
                <h3 class="text-white font-semibold">{{category.name}}</h3>
                <p class="text-gray-200 text-sm">{{category.eventCount}} événements</p>
              </div>
            </div>
          </a>
        }

        @if (filterCategories.length === 0) {
          <div class="col-span-2 text-center py-8 text-gray-500">
            Aucune catégorie trouvée pour "{{searchTerm}}"
          </div>
        }
      </div>
    </div>

    <!-- Footer -->
    <app-footer />
  `
})
export class CategoriesComponent implements OnInit {

  _categories: Category[] = [];

  /**
   * Transforme la liste des catégories en CategoryView
   * @returns Une liste de catégories formatées pour l'affichage
   */
  get categories(): CategoryView[] {
    return this._categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      image: cat.image || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80', // Image par défaut
      eventCount: cat.eventCount || 0
    }));
  }

  searchTerm: string = '';

  /**
   * Filtre les catégories en fonction du terme de recherche
   */
  get filterCategories(): CategoryView[] {
    return this.categories.filter(category =>
      category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.read('Category').subscribe({
      next: (data: Category[]) => {
        this._categories = data;
        console.log('Categories loaded:', this._categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }
}
