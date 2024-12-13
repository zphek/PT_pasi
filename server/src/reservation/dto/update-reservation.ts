export interface ReservationUpdateInputDTO {
    customerId?: string;
    customerName?: string;
    date?: string;
    status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    total?: number;
    products?: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }[];
}