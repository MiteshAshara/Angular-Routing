import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, AsyncPipe, FormsModule],
  templateUrl: './customers.component.html',
})
export class CustomersComponent {
  customers$: Observable<Customer[]>;
  newCustomer: Customer = { id: 0, name: '', email: '', phoneNumber: '', address: '' };
  isEditMode: boolean = false;

  constructor(private http: HttpClient) {
    this.customers$ = this.getCustomers();
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>('https://localhost:7073/api/Customer');
  }

  saveCustomer(): void {
    if (this.isEditMode) {
      this.updateCustomer();
    } else {
      this.addCustomer();
    }
  }

  addCustomer(): void {
    this.http.post('https://localhost:7073/api/Customer', this.newCustomer)
      .pipe(tap(() => this.customers$ = this.getCustomers()))
      .subscribe({
        next: () => {
          alert('Customer added successfully');
          this.resetForm();
        },
        error: (err) => console.error('Error adding Customer:', err)
      });
  }

  editCustomer(customer: Customer): void {
    this.newCustomer = { ...customer };
    this.isEditMode = true;
  }

  updateCustomer(): void {
    this.http.put(`https://localhost:7073/api/Customer/${this.newCustomer.id}`, this.newCustomer)
      .pipe(tap(() => this.customers$ = this.getCustomers()))
      .subscribe({
        next: () => {
          alert('Customer updated successfully');
          this.resetForm();
        },
        error: (err) => console.error('Error updating Customer:', err)
      });
  }

  confirmDelete(id: number): void {
    if (confirm('Are you sure you want to delete this Customer?')) {
      this.deleteCustomer(id);
    }
  }

  deleteCustomer(id: number): void {
    this.http.delete(`https://localhost:7073/api/Customer/${id}`)
      .pipe(tap(() => this.customers$ = this.getCustomers()))
      .subscribe({
        next: () => alert('Customer deleted successfully'),
        error: (err) => console.error('Error deleting Customer:', err)
      });
  }

  resetForm(): void {
    this.newCustomer = { id: 0, name: '', email: '', phoneNumber: '', address: '' };
    this.isEditMode = false;
  }
}
