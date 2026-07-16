import { Component, OnDestroy, OnInit } from '@angular/core';

import { User } from '../../core/models/user.model';
import { Product } from '../../core/models/product.model';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AppStateService } from '../../core/services/app-state.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartSummary } from '../../core/models/cart-item.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.css'],
    imports: [FormsModule, CommonModule],
})
export class SuccessComponent implements OnInit, OnDestroy {
    transactionId: string | null = null;
    user: User | null = null;
    products: Product[] = [];
    cart: Product[] = [];
    cartSummary: CartSummary = {};
    total = 0;
    discount = 0;
    gstCharges = 0;
    deliveryCharges = 50;
    orderTotal = 0;
    subscriptions: Subscription[] = [];

    constructor(private appStateService: AppStateService, private apiService: ApiService) {}

    ngOnInit() {
        this.subscriptions.push(
            this.appStateService.currentUser$.subscribe(
                (user) => (this.user = user)
            ),
            this.appStateService.lastTransactionId$.subscribe(
                (id) => (this.transactionId = id)
            ),
            this.appStateService.products$.subscribe((products) => {
                this.products = products;
            }),
            this.appStateService.cart$.subscribe((cart) => {
                this.cart = cart;
                this.updateCartSummary();
                if(Object.values(this.cartSummary).length > 0){
                    this.apiService.processCart(this.cartSummary);
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.appStateService.clearCart(); // Clears cart in frontend and backend
    }

    // new logic
    updateCartSummary() {
        this.cartSummary = {};
        this.total = 0;
        this.cart.forEach((item) => {
            if (this.cartSummary[item.id!]) {
                this.cartSummary[item.id!].quantity += 1;
            } else {
                this.cartSummary[item.id!] = { ...item, quantity: 1 };
            }
            this.total += item.price!;
        });
        this.discount = this.total * 0.1;
        this.gstCharges = this.total * 0.18;
        this.orderTotal =
            this.total - this.discount + this.gstCharges + this.deliveryCharges;
    }

    downloadInvoice() {
        window.print();
    }
}
