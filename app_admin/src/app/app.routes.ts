import { Routes } from '@angular/router';
import { AddTripComponent } from './add-trip/add-trip.component';
import { TripListingComponent } from './trip-listing/trip-listing.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './utils/auth.guard';

export const routes: Routes = [
  { path: 'add-trip', component: AddTripComponent, canActivate: [authGuard] },
  { path: 'edit-trip', component: EditTripComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: TripListingComponent, pathMatch: 'full' }
];
