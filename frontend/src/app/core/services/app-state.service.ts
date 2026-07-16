import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { CartSummary } from '../models/cart-item.model';

@Injectable({
    providedIn: 'root',
})
export class AppStateService {

    private productsSubject = new BehaviorSubject<Product[]>([]);
    public products$ = this.productsSubject.asObservable();

    private productToEditSubject = new BehaviorSubject<Product | null>(null);
    public productToEdit$ = this.productToEditSubject.asObservable();

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private cartSubject = new BehaviorSubject<Product[]>([]);
    public cart$ = this.cartSubject.asObservable();

    private cartIdSubject = new BehaviorSubject<number | null>(null);

    private lastTransactionIdSubject = new BehaviorSubject<string | null>(null);
    public lastTransactionId$ = this.lastTransactionIdSubject.asObservable();

    constructor(private apiService: ApiService, private router: Router) {
        const user = localStorage.getItem('currentUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            this.currentUserSubject.next(parsedUser);
            this.loadCart(parsedUser.id!); // Load cart on init
        }
    }

    async loadProducts() {
        const products = await this.apiService.getProducts();
        this.setProducts(products);
    }

    async setProducts(products: Product[]) {
        this.productsSubject.next(products);
    }

    async deleteProduct(product: Product) {
        const currentUser = this.currentUserSubject.value;
        if (!currentUser || !currentUser.id) {
            alert('Please login to delete items from the cart.');
            if (confirm('Do you want to login now?')) {
                this.router.navigate(['/login']);
            }
            return;
        }
        await this.apiService.deleteProduct(product.id!);
        this.setProducts(this.productsSubject.value.filter(p => p.id !== product.id));
    }

    async setProductToEdit(product: Product | null) {
        this.productToEditSubject.next(product);
    }

    async setCurrentUser(user: User | null) {
        this.currentUserSubject.next(user);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            await this.loadCart(user.id!);
        } else {
            localStorage.removeItem('currentUser');
            this.cartSubject.next([]);
            this.cartIdSubject.next(null);
        }
    }

    async loadCart(userId: number) {
        const cartData = await this.apiService.getCartByUserId(userId);
        if (cartData) {
            this.cartSubject.next(cartData.items || []);
            this.cartIdSubject.next(cartData.id);
        } else {
            this.cartSubject.next([]);
            this.cartIdSubject.next(null);
        }
    }

    async addToCart(product: Product) {
        const currentUser = this.currentUserSubject.value;
        if (!currentUser || !currentUser.id) {
            throw new Error('No user logged in');
        }

        const currentCart = this.cartSubject.value;
        const updatedCart = [...currentCart, product];
        this.cartSubject.next(updatedCart);

        const cartId = this.cartIdSubject.value;
        if (cartId) {
            await this.apiService.updateCart(
                cartId,
                currentUser.id,
                updatedCart
            );
        } else {
            const newCart = await this.apiService.createCart(
                currentUser.id,
                updatedCart
            );
            this.cartIdSubject.next(newCart.id);
        }
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    async updateCart(cart: Product[]) {
        const currentUser = this.currentUserSubject.value;
        if (!currentUser || !currentUser.id) return;

        this.cartSubject.next(cart);
        const cartId = this.cartIdSubject.value;
        if (cartId) {
            await this.apiService.updateCart(cartId, currentUser.id, cart);
        } else if (cart.length > 0) {
            const newCart = await this.apiService.createCart(
                currentUser.id,
                cart
            );
            this.cartIdSubject.next(newCart.id);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    async clearCart() {
        const cartId = this.cartIdSubject.value;
        if (cartId) {
            await this.apiService.deleteCart(cartId);
        }
        this.cartSubject.next([]);
        this.cartIdSubject.next(null);
        localStorage.removeItem('cart');
    }

    setLastTransactionId(transactionId: string) {
        this.lastTransactionIdSubject.next(transactionId);
        localStorage.setItem('lastTransactionId', transactionId);
    }

    clearLastTransactionId() {
        this.lastTransactionIdSubject.next(null);
        localStorage.removeItem('lastTransactionId');
    }
}
