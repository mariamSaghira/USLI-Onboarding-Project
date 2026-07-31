import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  // Makes this service available throughout the application
  providedIn: 'root'
})
export class ProductService {

  // URL for the products API
  private apiUrl = 'https://localhost:7294/api/products';

  // Injects the HttpClient for making HTTP requests
  constructor(private http: HttpClient) { }

  // Retrives the list of products from the API
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
