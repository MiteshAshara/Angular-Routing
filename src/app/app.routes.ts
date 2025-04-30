import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SuppliersComponent } from './pages/home/suppliers/suppliers.component';
import { CustomersComponent } from './pages/home/customers/customers.component';
import { OrdersComponent } from './pages/home/orders/orders.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'suppliers', component: SuppliersComponent },
    { path: 'customers', component: CustomersComponent },
    { path: 'orders', component: OrdersComponent },
];
