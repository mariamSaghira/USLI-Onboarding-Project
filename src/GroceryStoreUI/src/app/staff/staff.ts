import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Defines the available roles
export enum Role {
  Manager = 1,
  Employee = 2,
  Customer = 3
}

@Component({
  // HTML selector used to display this component
  selector: 'app-staff',
  // Imports
  imports: [NgIf, NgFor, FormsModule],

  // Associated HTML and CSS files
  templateUrl: './staff.html',
  styleUrl: './staff.css',
})

export class Staff implements OnInit {

  showAdd = false;
  showUpdate = false;
  showDelete = false;

  showAddForm = false;
  showUpdateForm = false;

  deleteProductId = 0;
  showDeleteForm = false;

  products: any[] = [];

  categories: string[] = [
    'Produce',
    'Dairy',
    'Meat',
    'Bakery',
    'Frozen',
    'Beverages',
    'Snacks',
    'Household',
    'Condiment',
    'Drink',
    'Fruit',
    'Vegetable',
];

  ngOnInit(): void {
    this.showInventory();
  }

  openAddForm() {
    this.showAddForm = true;
    this.showUpdateForm = false;
  }

  openUpdateForm() {
    this.showAddForm = false;
    this.showUpdateForm = true;
  }

  openDeleteForm() {
    this.showDeleteForm = true;
    this.showAddForm = false;
    this.showUpdateForm = false;
  }

  staffRole = Role.Employee;
  Role = Role;

  searchText = '';
  selectedRoleId: number = 0;

  newProduct = {
    productName: '',
    category: '',
    price: 0,
    stockQuantity: 0
  };

  constructor (
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  showInventory(): void {
    this.http.
      get<any[]>('https://localhost:7294/api/products')
      .subscribe({
        next: (data: any[]) => {
          this.products = data;
          //this.showProducts = true;

          //Immediately refresh the HTML after receiving the products
          console.log(this.products);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Could not load inventory:', error);
        }
      });
  }

  addProducts() {
    this.http.post(
      'https://localhost:7294/api/products',
      this.newProduct
    ).subscribe(() => {

      this.showInventory();

      this.newProduct = {
        productName: '',
        category: '',
        price: 0,
        stockQuantity: 0
      };
    });
  }

  updatedProduct = {
    productID: 0,
    productName: '',
    category: '',
    price: 0,
    stockQuantity: 0
  }

  // Copies the selected product's existing information into the update form
  onSelectProductToUpdate(productId: number) {
    const selected = this.products.find(product => product.productID === +productId);

    if (selected) {
      this.updatedProduct = {
        productID: selected.productID,
        productName: selected.productName,
        category: selected.category,
        price: selected.price,
        stockQuantity: selected.stockQuantity
      };
    }
  }

  updateProducts() {
    this.http.put(
      `https://localhost:7294/api/products/${this.updatedProduct.productID}`,
      this.updatedProduct
    ).subscribe({
      next: () => {
        console.log('Product updated');
        this.showInventory();
      },
      error: error => {
        console.error('Update failed:', error);
      }
    })
  }

  deleteProduct() {
    this.http.delete(
      `https://localhost:7294/api/products/${this.deleteProductId}`
    ).subscribe({
      next: () => {
        console.log('Product deleted successfully');

        this.deleteProductId = 0;
        this.showDeleteForm = false;

        this.showInventory();
      },
      error: error => {
        console.error('Delete failed:', error);
      }
    });
  }

  getFilteredProducts() {
    return this.products.filter(product => {
      return product.productName.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }

  onRoleChange() {
    this.showDelete = this.staffRole === Role.Manager;

    this.showAdd =
      this.staffRole === Role.Manager ||
      this.staffRole === Role.Employee;

    this.showUpdate =
      this.staffRole === Role.Manager ||
      this.staffRole === Role.Employee;
  }
}

export enum PermissionId {
  View = 1,
  Add = 2,
  Update = 3,
  Delete = 4
}
