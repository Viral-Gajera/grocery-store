import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CartComponent } from './pages/cart/cart.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { SuccessComponent } from './pages/success/success.component';
import { AddAdminComponent } from './pages/add-admin/add-admin.component';
import { AddProductComponent } from './pages/add-product/add-product.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'cart', component: CartComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'transaction', component: TransactionComponent },
    { path: 'success', component: SuccessComponent },
    { path: 'add-admin', component: AddAdminComponent },
    { path: 'product/:action', component: AddProductComponent },
    { path: '**', redirectTo: '' },
];
