import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AppStateService } from '../../core/services/app-state.service';
import { Product } from '../../core/models/product.model';
import { User } from '../../core/models/user.model';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    imports: [FormsModule, CommonModule],
})
export class HomeComponent implements OnInit {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    searchString = '';
    currentUser: User | null = null;
    loading = true;

    constructor(
        private appStateService: AppStateService,
        private router: Router
    ) {}

    async ngOnInit() {
        this.appStateService.loadProducts();
        
        this.appStateService.products$.subscribe((products) => {
            this.products = products;
            this.filteredProducts = this.products;
        });

        this.appStateService.currentUser$.subscribe((user) => {
            this.currentUser = user;
        });

        this.loading = false;
    }

    onSearch() {
        this.filteredProducts = this.products.filter((product) =>
            product.name.toLowerCase().includes(this.searchString.toLowerCase())
        );
    }

    async addToCart(product: Product) {
        if (!this.currentUser) {
            alert('Please login to add items to the cart.');
            if (confirm('Do you want to login now?')) {
                this.router.navigate(['/login']);
            }
            return;
        }

        let productAvailableQuantity = product.quantity;
        let productCartQuantity = 1;
        this.appStateService.cart$.subscribe((cart) => {
            cart.forEach((item) => {
                if (item.id === product.id) {
                    productCartQuantity++;
                }
            });
        });

        if (productCartQuantity > productAvailableQuantity!) {
            alert('Not enough quantity available. You already have ' + (productCartQuantity-1) + ' quantity of this product in your cart.');
            return;
        }

        try {
            await this.appStateService.addToCart(product); // Updates backend and frontend
            alert(`${product.name} added to cart!`);
        } catch (error) {
            alert('Failed to add item to cart. Please try again.');
            console.error(error);
        }
    }
    async updateProduct(product: Product) {
        this.appStateService.setProductToEdit(product);
        this.router.navigate(['/product', 'update']);
    }
    async deleteProduct(product: Product) {
        if (!this.currentUser) {
            alert('Please login to delete items from the cart.');
            if (confirm('Do you want to login now?')) {
                this.router.navigate(['/login']);
            }
            return;
        }
        try {
            await this.appStateService.deleteProduct(product);
            alert(`${product.name} deleted!`);
        } catch (error) {
            alert('Failed to delete item. Please try again.');
            console.error(error);
        }
    }

    capitalizeFirstLetter(str: string): string {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    scrollToGroceries() {
        document.getElementById('groceries-list')?.scrollIntoView({ behavior: 'smooth' });
    }
}
