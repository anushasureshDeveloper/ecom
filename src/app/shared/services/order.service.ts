import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Params } from '../interface/core.interface';
import { CheckoutPayload, Order, OrderModel, OrderCheckout } from '../interface/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  configurl="http://localhost:3000"

  constructor(private http: HttpClient) {}

  getOrders(payload?: Params): Observable<OrderModel> {
    return this.http.get<OrderModel>(`${this.configurl}/getAllOrder`, { params: payload });
  }

  updateOrderStatus(orderId: string, status: string,): Observable<any> {
    return this.http.patch<any>(`${this.configurl}/updateOrder/${orderId}`, { status });
  }
 
}
