import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  // HTML tag for displaying this component
  selector: 'app-staff-login',

  // Indicates that this is a standalone Angular component
  standalone: true,

  // Imports
  imports: [FormsModule, NgIf],

  // HTML and CSS files associated with this component
  templateUrl: './staff-login.html',
  styleUrls: ['./staff-login.css']
})

// Staff Login component used to authenticate staff members
// before granting access to the inventory management page.
export class StaffLogin {
  // Stores the username created by the user
  username = '';

  // Stores the password created by the user
  password = '';

  // Controls whether the login error message is displayed
  loginError = false;

  // Router is used to navigate to anothe page after a successful login
  constructor(private router: Router) {}

  //Validates the entered credentials
  login(): void {

    // check if both the username and the password match the hardcoded credentials
    if (
      this.username === 'admin' &&
      this.password === 'admin'
    ) {

      // Navigate to the staff inventory page after a successful login
      this.router.navigate(['/staff']);

    } else if (
      this.username === 'user' &&
      this.password === 'user'
    ) {
      this.router.navigate(['/customer']);
      //Display an error message if the credentials are incorrect
      this.loginError = true;
    }
  }
}

