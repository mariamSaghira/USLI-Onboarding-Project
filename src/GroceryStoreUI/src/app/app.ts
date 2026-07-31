import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  // Root component of the grocery store application
  selector: 'app-root',

  // Indicated that this is a standalone Angular component
  standalone: true,

  // Required imports
  imports: [
    RouterOutlet,
    RouterLink,
    NgIf,
    NgFor,
    FormsModule,
    CommonModule
  ],

  // HTML and CSS associated with this component
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App {

  // Router is to navigate between app pages
  constructor(public router: Router) { }

  // Determines whether the user is currently on the home page
  get isHomePage() {
    return this.router.url == '/';
  }

  // Navigates to the customer page
  goToCustomer() {
    this.router.navigate(['/customer']);
  }

  // Navigates to the staff login page
  goToStaff() {
    this.router.navigate(['/staff-login']);
  }
}
