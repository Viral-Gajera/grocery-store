export interface Product {
    id?: number | null | undefined;
    name: string;
    description: string;
    price: number | null;
    image: string;
    category: string;
    quantity: number | null;
}
