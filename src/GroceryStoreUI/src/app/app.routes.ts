import { Routes } from '@angular/router';

import { App } from './app';
import { Customer } from './customer/customer';
import { Staff } from './staff/staff';
import { StaffLogin } from './staff-login/staff-login';

// Defines the navigation routes for the grocery store application
// it connects each URL to the component the user sees
export const routes: Routes = [

  // Displays the home page when the application first loads
  { path: '', component: App },

  // Displays the customer page
  { path: 'customer', component: Customer },

  // Displays the staff login page
  { path: 'staff-login', component: StaffLogin },

  // Displays the staff inventory management page
  { path: 'staff', component: Staff }

];
