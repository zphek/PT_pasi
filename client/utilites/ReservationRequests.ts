import sendRequest, { requestMethods } from "./sendRequest";

/* TIPOS */
interface ReservationProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/* CREATE RESERVATION */
interface ReservationCreateDTO {
  customerId: string;
  customerName: string;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  total: number;
  products: ReservationProduct[];
}

export async function createReservation(data: ReservationCreateDTO) {
  const response = await sendRequest("/reservation", requestMethods.POST, data);
  return response;
}

/* FETCH ALL RESERVATIONS */
export async function getAllReservations(page: number = 1) {
  const response = await sendRequest(
    `/reservation${page > 1 ? `?page=${page}` : ''}`,
    requestMethods.GET
  );
  return response;
}

/* FETCH ONE RESERVATION BY ID */
export async function getReservationById(id: string) {
  const response = sendRequest(`/reservation/${id}`, requestMethods.GET);
  return response;
}

/* UPDATE RESERVATION */
interface ReservationUpdateDTO {
  customerId?: string;
  customerName?: string;
  date?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  total?: number;
  products?: ReservationProduct[];
}

export async function updateReservation(id: string, data: ReservationUpdateDTO) {
  const response = sendRequest(`/reservation/${id}`, requestMethods.PATCH, data);
  return response;
}

/* DELETE RESERVATION */
export async function deleteReservation(id: string) {
  const response = sendRequest(`/reservation/${id}`, requestMethods.DELETE);
  return response;
}