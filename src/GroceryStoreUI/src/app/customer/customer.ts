import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({

  // HTML tag for displaying this component
  selector: 'app-customer',

  // Indicates that this is a standalone component
  standalone: true,

  // Imports
  imports: [CommonModule, FormsModule],

  // HTML & CSS files associated with this component
  templateUrl: './customer.html',
  styleUrls: ['./customer.css']
})

// Costumer component that manages the customer shopping experience
export class Customer implements OnInit {

  // Controls whether the product inventory is displayed
  showProducts = false;

  // Controls whether the shopping cart is displayed
  showCart = false;

  // Stores the user's search input for filtering products
  searchText = '';

  // Stores all items currently added to the shopping cart
  cart: any[] = [];

  // Stores the list of products retrieved from the API
  products: any[] = [];

  // Stores the success message after checkout
  checkoutMessage = '';

  // Stores the error message displayed to the customer 
  checkoutError = '';

  // Indicated whether a checkout request is currently being processed
  isProcessing = false;
  receiptItems: any[] = [];

  // Stores the total amount for the receipt 
  receiptTotal = 0;

  // Controls whether the receipt is showing or not
  showReceipt = false;

  // Add the current date to the receipt
  receiptDate = new Date();

  // Injects the HttpClient for API requests and ChangeDetectorRef to refresh the UI
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // Angular calls this when the customer opens the page to show the current inventory.
  // So automatically loads the product inventory when the page is initialized
  ngOnInit(): void {
    this.viewProducts();
  }

  // Retrieves the current inventory from the API
  viewProducts(): void {
    console.log('Loading products...');

    // Sends a GET request to the API.
    this.http
      .get<any[]>('https://localhost:7294/api/products')
      .subscribe({
      // Executes when the API successfully retrieves product data.
      next: data => {
        this.products = data;
          this.showProducts = true;
          this.showCart = false;
          console.log('Products loaded:', data);
          this.cdr.detectChanges();
      },
      // Excecutes if the API request fails
      error: error => {
        console.error('Could not load products:', error);
        this.checkoutError = 'Could not load the inventory.';
        this.cdr.detectChanges();
      }
    });
  } 

  // Updates the search text entered by the customer
  searchProduct() {
    this.searchText = prompt('Enter product name, category or ID:') || '';
    this.showProducts = true;
  }

  // Returns products that match the customer's search criteria
  getFilteredProducts() {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.products;
    }

    return this.products.filter(product => product.productName?.toLowerCase().includes(search)
      || product.category?.toLowerCase().includes(search) || product.productID?.toString() === search);
  }

  // Controls whether the add product form is visible
  showAddForm = false;

  // Adds the selected product to the shopping cart
  addToCart(product: any): void {
    const existingItem = this.cart.find(
      p => p.productID === product.productID
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({
        ...product,
        quantity: 1
      });
    }
    console.log('Cart', this.cart);
    console.log('Cart count:', this.getCartItemCount());

    this.cdr.detectChanges();
  }

  // Removes one quantity of a product from the shopping cart
  // If only one remains, the product if removed completely
  removeFromCart(item: any) {
    const index = this.cart.findIndex(
      p => p.productID === item.productID
    );

    if (index !== -1) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--;
      } else {
        this.cart.splice(index, 1);
      }
    }
  }

  // Displays the shopping cart
  viewCart(): void {
    if (this.showCart) {
      //return to inventory
      this.showCart = false;
      this.showProducts = true;
    } else {
      this.showCart = true;
      this.showProducts = false;
    }
  }

  // Calculates the total number of items currently in the cart
  // using a reduce method, reduce(accumulator, currentItem), 0 is the starting value
  getCartItemCount(): number {
    return this.cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  // Processes the customer's order and submits it to the API
  // Detailed steps:
  // - Clear previous UI messages
  // - Validate cart is not empty
  // - Mark UI as processing to prevent duplicate submissions
  // - Build an order payload with product IDs and quantities
  // - POST the order to the backend API
  // - On success, prepare a receipt, clear the cart and show a message
  // - On error, show an error message and allow retry
  checkout() {

    // 1) Clear any previous success or error messages shown to the user
    this.checkoutMessage = '';
    this.checkoutError = '';

    // 2) Guard clause: do not proceed if the cart is empty
    if (this.cart.length === 0) {
      this.checkoutMessage = 'Your cart is empty.';
      return;
    }

    // 3) Prevent duplicate submissions by showing a processing state
    this.isProcessing = true;

    // 4) Compute the total locally (used for display, not required by API)
    const total = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log('First cart item:', this.cart[0]);

    // 5) Build the request payload expected by the backend
    const order = {
      items: this.cart.map(item => ({
        productId: item.productID,
        quantity: item.quantity
      }))
    };

    console.log(' Before checkout POST');

    // 6) Send the order to the backend and handle the observable response
    this.http.post<{ message: string }>('https://localhost:7294/api/Products/checkout', order)
      .subscribe({
        // a) Success handler: prepare receipt and clear cart
        next: response => {
          // recompute total defensively
          const total = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

          // copy items for the receipt view
          this.receiptItems = this.cart.map(item => ({ ...item }));
          this.receiptTotal = total;
          this.showReceipt = true;

          console.log('Checkout success:', response);
          this.checkoutMessage = `Order has been placed successfully!`;

          // reset cart and UI sections
          this.cart = [];
          this.showCart = false;
          this.showProducts = false;
          this.isProcessing = false;

          // force view update
          this.cdr.detectChanges();
        },

        // b) Error handler: display message and clear processing state
        error: error => {
          console.error('Checkout failed:', error);

          this.checkoutError = error.error?.message ??
            'The transaction could not be completed. No charges were made to your account. Please try again.';

          this.isProcessing = false;
          this.cdr.detectChanges();
        },

        // c) Executes after the HTTP request finishes
        complete: () => {
          console.log('Checkout request completed');
        }
      });

    console.log('After checkout POST');
  }

  // Returns the customer to the home page
  exit() {
    window.location.assign('/');
  }
}
