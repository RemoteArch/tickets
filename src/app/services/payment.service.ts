import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentRequest {
  tel: string;
  ticketId: number;
  quantity: number;
  userId: number;
}

export interface PaymentResponse {
  status: boolean;
  message?: string;
  quantity?: number;
  totalAmount?: number;
}

export interface PaymentStatus {
  status: boolean;
  ticket?: {
      id: string;
      status: string;
      price: number;
      quantity: number;
      phone: string;
      totalAmount: number;
      paymentDate: string;
  };
  message?: string;
}


@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = `${environment.apiUrl}/pay.php`;

    constructor(private http: HttpClient) { }

    /**
     * Effectue un paiement pour un ticket
     * @param payment Les informations de paiement
     * @returns Observable avec la réponse du paiement
     */
    processPayment(payment: PaymentRequest): Observable<PaymentResponse> {
        return this.http.post<PaymentResponse>(this.apiUrl, payment);
    }

    /**
     * Vérifie le statut d'un paiement
     * @param ticketId L'identifiant du ticket
     * @returns Observable avec le statut du paiement
     */
    checkPaymentStatus(ticketId: string): Observable<PaymentStatus> {
        return this.http.get<PaymentStatus>(`${this.apiUrl}?ticketId=${ticketId}`);
    }
}
