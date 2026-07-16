import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { CartSummary } from '../models/cart-item.model';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private apiUrl = 'http://localhost:3000';

    async registerUser(user: User): Promise<User> {
        const response = await fetch(`${this.apiUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        return response.json();
    }

    async loginUser(email: string, password: string): Promise<User[]> {
        const response = await fetch(
            `${this.apiUrl}/users?email=${email}&password=${password}`
        );
        return response.json();
    }

    async getUserById(id: number): Promise<User> {
        const response = await fetch(`${this.apiUrl}/users/${id}`);
        return response.json();
    }

    async updateUser(id: number, user: User): Promise<User> {
        const response = await fetch(`${this.apiUrl}/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        return response.json();
    }

    async getProducts(): Promise<Product[]> {
        const response = await fetch(`${this.apiUrl}/products`);
        return response.json();
    }

    async addProduct(product: Product): Promise<Product> {
        const response = await fetch(`${this.apiUrl}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        console.log(response);
        return response.json();
    }

    async updateProduct(product: Product): Promise<Product> {
        const response = await fetch(`${this.apiUrl}/products/${product.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        return response.json();
    }

    async updateProducts(products: Product[]): Promise<Product[]> {
        const response = await fetch(`${this.apiUrl}/products`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(products),
        });
        return response.json();
    }

    async deleteProduct(productId: number): Promise<Product[]> {
        const response = await fetch(`${this.apiUrl}/products/${productId}`, {
            method: 'DELETE',
        });
        return response.json();
    }

    async getCartByUserId(userId: number): Promise<any> {
        const response = await fetch(`${this.apiUrl}/carts?userId=${userId}`);
        const carts = await response.json();
        return carts.length > 0 ? carts[0] : null; // Return first cart or null
    }

    async createCart(userId: number, items: Product[]): Promise<any> {
        const response = await fetch(`${this.apiUrl}/carts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, items }),
        });
        return response.json();
    }

    async updateCart(
        cartId: number,
        userId: number,
        items: Product[]
    ): Promise<any> {
        const response = await fetch(`${this.apiUrl}/carts/${cartId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, items }),
        });
        return response.json();
    }

    async processCart(cartSummary: CartSummary) {
        try {
            const response = await fetch(`${this.apiUrl}/carts/process`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartSummary),
            });
            return response.json();
        } catch (error) {
            console.log('Error processing cart:', error);
        }
    }

    async deleteCart(cartId: number): Promise<void> {
        await fetch(`${this.apiUrl}/carts/${cartId}`, {
            method: 'DELETE',
        });
    }
}
