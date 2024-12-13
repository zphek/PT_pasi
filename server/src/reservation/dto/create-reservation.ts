export interface ReservationCreateInputDTO {
    customerId: string;
    customerName: string;
    date: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    total: number; // Cambiado a number ya que es un monto
    products: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }[];
    createdAt?: string; // Opcional, generalmente se genera automáticamente
  }