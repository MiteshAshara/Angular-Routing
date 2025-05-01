import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, AsyncPipe, FormsModule],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})
export class SuppliersComponent {
  suppliers$: Observable<Supplier[]>;
  newSupplier: Supplier = { id: 0, name: '', phoneNumber: '' };
  isEditMode: boolean = false;

  constructor(private http: HttpClient) {
    this.suppliers$ = this.getSuppliers();
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>('https://localhost:7073/api/Supplier');
  }

  saveSupplier(): void {
    if (this.isEditMode) {
      this.updateSupplier();
    } else {
      this.addSupplier();
    }
  }

  addSupplier(): void {
    this.http.post('https://localhost:7073/api/Supplier', this.newSupplier)
      .pipe(tap(() => this.suppliers$ = this.getSuppliers()))
      .subscribe({
        next: () => {
          alert('Supplier added successfully');
          this.resetForm();
        },
        error: (err) => console.error('Error adding Supplier:', err)
      });
  }

  editSupplier(supplier: Supplier): void {
    this.newSupplier = { ...supplier };
    this.isEditMode = true;
  }

  updateSupplier(): void {
    this.http.put(`https://localhost:7073/api/Supplier/${this.newSupplier.id}`, this.newSupplier)
      .pipe(tap(() => this.suppliers$ = this.getSuppliers()))
      .subscribe({
        next: () => {
          alert('Supplier updated successfully');
          this.resetForm();
        },
        error: (err) => console.error('Error updating Supplier:', err)
      });
  }

  confirmDelete(id: number): void {
    if (confirm('Are you sure you want to delete this Supplier?')) {
      this.deleteSupplier(id);
    }
  }

  deleteSupplier(id: number): void {
    this.http.delete(`https://localhost:7073/api/Supplier/${id}`)
      .pipe(tap(() => this.suppliers$ = this.getSuppliers()))
      .subscribe({
        next: () => alert('Supplier deleted successfully'),
        error: (err) => console.error('Error deleting Supplier:', err)
      });
  }

  resetForm(): void {
    this.newSupplier = { id: 0, name: '', phoneNumber: '' };
    this.isEditMode = false;
  }
}
