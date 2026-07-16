import { Component, OnInit } from '@angular/core';

import { User } from '../../core/models/user.model';
import { Product } from '../../core/models/product.model';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AppStateService } from '../../core/services/app-state.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.css'],
    imports: [FormsModule, CommonModule],
})
export class TransactionComponent implements OnInit {
    cart: Product[] = [];
    paymentMethod = 'COD';
    upiId = '';
    cardNumber = '';
    cardExpiry = '';
    cardCVV = '';
    bankName = '';
    accountNumber = '';
    ifscCode = '';
    total = 0;
    discount = 0;
    gstCharges = 0;
    deliveryCharges = 50;
    orderTotal = 0;

    constructor(
        private appStateService: AppStateService,
        private router: Router
    ) {}

    ngOnInit() {
        this.appStateService.cart$.subscribe((cart) => {
            this.cart = cart;
            this.calculateTotals();
        });
    }

    calculateTotals() {
        this.total = this.cart.reduce((sum, item) => sum + item.price!, 0);
        this.discount = this.total * 0.1;
        this.gstCharges = this.total * 0.18;
        this.orderTotal =
            this.total - this.discount + this.gstCharges + this.deliveryCharges;
    }

    togglePaymentDetails() {
        // Handled in template
    }

    async completeTransaction() {
        if (this.paymentMethod !== 'COD' && !this.validatePaymentDetails()) {
            return;
        }
        const transactionId = 'TXN' + Math.floor(Math.random() * 1000000);
        this.appStateService.setLastTransactionId(transactionId);
        this.router.navigate(['/success']);
    }

    validatePaymentDetails(): boolean {
        if (this.paymentMethod === 'UPI') {
            if (
                !this.upiId ||
                !/[A-Za-z0-9.]+@[A-Za-z0-9.]+/.test(this.upiId)
            ) {
                alert('Enter a valid UPI ID');
                return false;
            }
        } else if (
            this.paymentMethod === 'Credit Card' ||
            this.paymentMethod === 'Debit Card'
        ) {
            if (!this.cardNumber || !/^\d{15}$/.test(this.cardNumber)) {
                alert('Enter a 15-digit card number');
                return false;
            }
            if (!this.cardExpiry || !/^\d{2}\/\d{2}$/.test(this.cardExpiry)) {
                alert('Enter valid card expiry (MM/YY)');
                return false;
            }
            if (!this.cardCVV || !/^\d{3}$/.test(this.cardCVV)) {
                alert('Enter a 3-digit CVV');
                return false;
            }
        } else if (this.paymentMethod === 'Net Banking') {
            if (!this.bankName) {
                alert('Select a bank');
                return false;
            }
            if (!this.accountNumber || !/^\d{15}$/.test(this.accountNumber)) {
                alert('Enter a 15-digit account number');
                return false;
            }
            if (
                !this.ifscCode ||
                !/^[A-Z]{4}[A-Z0-9]{6}$/.test(this.ifscCode)
            ) {
                alert('Enter a valid 10-digit IFSC code');
                return false;
            }
        }
        return true;
    }
}
