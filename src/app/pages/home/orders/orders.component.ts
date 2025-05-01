import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, AsyncPipe, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  orders$: Observable<Order[]>;
  newOrder: Order = { id: 0, productName: '', quantity: 0, price: 0 };
  isEditMode: boolean = false;

  constructor(private http: HttpClient) {
    this.orders$ = this.getOrders();
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('https://localhost:7073/api/Order');
  }

  saveOrder(): void {
    if (this.isEditMode) {
      this.updateOrder();
    } else {
      this.addOrder();
    }
  }

  addOrder(): void {
    this.http.post('https://localhost:7073/api/Order', this.newOrder)
      .pipe(tap(() => this.orders$ = this.getOrders()))
      .subscribe({
        next: () => {
          alert('Order added successfully');
          this.resetForm();
        },
        error: (err) => console.error('Error adding Order:', err)
      });
  }

  editOrder(order: Order): void {
    this.newOrder = { ...order };
    this.isEditMode = true;
  }

  updateOrder(): void {
    this.http.put(`https://localhost:7073/api/Order/${this.newOrder.id}`, this.newOrder)
      .pipe(tap(() => this.orders$ = this.getOrders()))
      .subscribe({
        next: () => {
          alert('Order updated successfully');
          this.resetForm();
        },
        error: (err) => console.error('Error updating Order:', err)
      });
  }

  confirmDelete(id: number): void {
    if (confirm('Are you sure you want to delete this Order?')) {
      this.deleteOrder(id);
    }
  }

  deleteOrder(id: number): void {
    this.http.delete(`https://localhost:7073/api/Order/${id}`)
      .pipe(tap(() => this.orders$ = this.getOrders()))
      .subscribe({
        next: () => alert('Order deleted successfully'),
        error: (err) => console.error('Error deleting Order:', err)
      });
  }

  resetForm(): void {
    this.newOrder = { id: 0, productName: '', quantity: 0, price: 0 };
    this.isEditMode = false;
  }
}
