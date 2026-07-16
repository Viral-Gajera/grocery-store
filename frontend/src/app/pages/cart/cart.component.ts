import { Component, OnInit } from '@angular/core';

import { User } from '../../core/models/user.model';
import { Product } from '../../core/models/product.model';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AppStateService } from '../../core/services/app-state.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartSummary } from '../../core/models/cart-item.model';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
    imports: [FormsModule, CommonModule, RouterLink],
})
export class CartComponent implements OnInit {
    cart: Product[] = [];
    cartSummary: CartSummary = {};
    total = 0;

    constructor(
        private appStateService: AppStateService,
        private router: Router
    ) {}

    ngOnInit() {
        this.appStateService.cart$.subscribe((cart) => {
            this.cart = cart; // Reflects user-specific cart from backend
            this.updateCartSummary();
        });
    }

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
    }

    async updateQuantity(productId: number, change: number) {

        let updatedCart = [...this.cart];
        let index = updatedCart.findIndex((item) => item.id === productId);
        let product = updatedCart[index];

        let productAvailableQuantity = product.quantity;
        let productCartQuantity = 1;

        this.cart.forEach((item) => {
            if (item.id === product.id) {
                productCartQuantity++;
            }
        });

        if (productCartQuantity > productAvailableQuantity!) {
            alert('Not enough quantity available. You already have ' + (productCartQuantity-1) + ' quantity of this product in your cart.');
            return;
        }

        if (change === 1) {
            updatedCart.push(updatedCart[index]);
        } else {
            updatedCart = updatedCart.filter(
                (item, i) => i !== index || updatedCart.indexOf(item) !== index
            );
        }
        await this.appStateService.updateCart(updatedCart); // Syncs with backend
    }

    async removeFromCart(productId: number) {
        const updatedCart = this.cart.filter((item) => item.id !== productId);
        await this.appStateService.updateCart(updatedCart); // Syncs with backend
    }

    checkout() {
        if (confirm('Proceed to checkout?')) {
            this.router.navigate(['/transaction']);
        }
    }
}
