import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Product, ProductModel } from "../interface/product.interface";

@Injectable({
  providedIn: "root",
})
export class ProductService {

  constructor(private http: HttpClient) {}
  configUrl="http://localhost:2000/"

  // getProducts(payload?: Params): Observable<ProductModel> {
  //   return this.http.get<ProductModel>(`${this.configUrl}getProduct`, { params: payload });
  // }



  getProducts(payload?: Params): Observable<ProductModel> {
    let params = new HttpParams();
    if (payload) {
      Object.keys(payload).forEach(key => {
        params = params.set(key, payload[key]);
      });
    }
    return this.http.get<ProductModel>(`${this.configUrl}getProduct`, { params });
}


  createProduct(payload: Product): Observable<Product> {
    return this.http.post<Product>(`${this.configUrl}addProduct`, payload);
  }

}
