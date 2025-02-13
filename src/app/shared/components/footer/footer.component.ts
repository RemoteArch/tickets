import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed z-50 bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200">
      <div class="flex justify-around items-center py-2">
        <a routerLink="/" 
           routerLinkActive="bg-primary text-white" 
           [routerLinkActiveOptions]="{exact: true}"
           [queryParamsHandling]="'preserve'"
           class="flex flex-col items-center px-3 py-1.5 rounded-lg text-gray-600  transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs mt-1">Accueil</span>
        </a>

        <a routerLink="/categories" 
           routerLinkActive="bg-primary text-white"
           class="flex flex-col items-center px-3 py-1.5 rounded-lg text-gray-600  transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="text-xs mt-1">Catégories</span>
        </a>

        <a routerLink="/my-tickets" 
           routerLinkActive="bg-primary text-white"
           class="flex flex-col items-center px-3 py-1.5 rounded-lg text-gray-600  transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span class="text-xs mt-1">Mes billets</span>
        </a>

        <a routerLink="/profile" 
           routerLinkActive="bg-primary text-white"
           class="flex flex-col items-center px-3 py-1.5 rounded-lg text-gray-600  transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-xs mt-1">Profil</span>
        </a>
      </div>
    </nav>
  `
})
export class FooterComponent {}
