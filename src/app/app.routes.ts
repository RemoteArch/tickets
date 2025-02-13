import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryDetailsComponent } from './pages/category-details/category-details.component';
import { EventDetailsComponent } from './pages/event-details/event-details.component';
import { PurchaseComponent } from './pages/purchase/purchase.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PurchaseHistoryComponent } from './pages/purchase-history/purchase-history.component';
import { MyTicketsComponent } from './pages/my-tickets/my-tickets.component';
import { UserRegisterComponent } from './pages/user-register/user-register.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'categories/:id',
    component: CategoryDetailsComponent
  },
  {
    path: 'event/:id',
    component: EventDetailsComponent
  },
  {
    path: 'purchase/:id',
    component: PurchaseComponent
  },
  {
    path: 'purchase-history',
    component: PurchaseHistoryComponent
  },
  {
    path: 'my-tickets',
    component: MyTicketsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'register',
    component: UserRegisterComponent
  }
];
