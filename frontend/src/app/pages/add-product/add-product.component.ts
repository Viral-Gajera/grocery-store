import { Component } from '@angular/core';
import { User } from '../../core/models/user.model';
import { Product } from '../../core/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AppStateService } from '../../core/services/app-state.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrl: './add-product.component.css',
    imports: [FormsModule, CommonModule],
})
export class AddProductComponent {
    categories = [
        { name: 'Groceries' },
        { name: 'Dairy' },
        { name: 'Bakery' },
        { name: 'Meat' },
        { name: 'Beverages' },
    ];
    product: Product = {
        name: '',
        description: '',
        price: null,
        image: '',
        category: '',
        quantity: null,
    };
    action: string | null = null;

    constructor(
        private apiService: ApiService,
        private appStateService: AppStateService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.paramMap.subscribe(paramMap => {
            this.action = paramMap.get('action');
            if (this.action == 'update') {
                this.appStateService.productToEdit$.subscribe(product => {
                    if (product) {
                        this.product = product;
                    }
                });
            }
            if (this.action == 'add') {
                this.product = {
                    name: '',
                    description: '',
                    price: null,
                    image: '',
                    category: '',
                    quantity: null,
                };
            }
        });
    }

    async productAction() {
        if (this.action == 'add') {
            await this.addProduct();
        }
        if (this.action == 'update') {
            await this.updateProduct();
        }
    }

    validateFields() {
        if (!this.product.name) {
            alert('Product Name cannot be empty.');
            return false;
        }
        if (!this.product.price) {
            alert('Product Price cannot be empty.');
            return false;
        }
        if(this.product.price<0){
            alert('Cannot add negative price.');
            return false;
        }
        if (!this.product.image) {
            alert('Product Image cannot be empty.');
            return false;
        }
        if (!this.product.description) {
            alert('Product Description cannot be empty.');
            return false;
        }
        if (!this.product.category) {
            alert('Product Category cannot be empty.');
            return false;
        }
        if (this.product.quantity==null || this.product.quantity==undefined) {
            alert('Product Quantity cannot be empty.');
            return false;
        }
        if((this.product.quantity!)<0){
            alert('Cannot add negative quantity.');
            return false;
        }

        return true;
    }

    async updateProduct() {
        if (!this.validateFields()) return;

        await this.apiService.updateProduct(this.product);
        alert('Product updated successfully.');
        this.router.navigate(['/products']);
    }

    async addProduct() {
        if (!this.validateFields()) return;

        const newProduct = await this.apiService.addProduct(this.product);
        this.product.id = newProduct.id;
        alert('Product added successfully.');
        this.router.navigate(['/products']);
    }
}
