import { Product } from './product.model';

export interface CartItem extends Product {
    quantity: number;
}

export interface Cart {
    id?: number;
    customerId: string;
    items: Product[];
}

export interface CartSummary {
    [key: string]: Product & { quantity: number };
}