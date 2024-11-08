import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { ProductModel } from "../interface/product.interface";
import { Product } from "../interface/menu.interface";
import { Stores } from "../interface/store.interface";
import { Tag } from "../interface/tag.interface";
import { Attachment } from "../interface/attachment.interface";
import { Tax } from "../interface/tax.interface";
import { Category } from "../interface/category.interface";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  configurl="http://localhost:3000/"

  constructor(private http: HttpClient) {}
    

  getProducts(payload?: Params): Observable<ProductModel> {
    
    return this.http.get<ProductModel>(`${this.configurl}getProduct`, { params: payload }
     ) 
  
  }
//   postProduct(
//      id: number,
//     name: string,
//      slug: string,
//       short_description: string,
//        description: string,
//         store:Stores,
//         type: string,
//         unit:string,
//         weight: number,
//         stock_status: string,
//         sku:string,
//         quantity: number,
//         price: number,
//         discount: number,
//         sale_price: number,
//         status:boolean,
//         sale_starts_at:string,
//         sale_expired_at:string,
//         tags:Tag[], 
//         categories:Category[],
//         is_random_related_products:boolean,
//         related_products:number[],
//         cross_sell_products:number[],
//         product_thumbnail:Attachment,
//         size_chart_image:Attachment,
//         meta_title:string,
//         meta_description:string,
//         product_meta_image:Attachment,
//         is_free_shipping:boolean,
//         tax:Tax,
//         estimated_delivery_text:string,
//         return_policy_text:string,
//         is_featured:boolean,
//         safe_checkout:boolean,
//         secure_checkout:boolean,
//         social_share:boolean,
//         encourage_order:boolean,
//         encourage_view:boolean,
//         is_trending:boolean,
//         is_return:boolean,
//       ):Observable<any>{
//     const payload={
//      id,
//       name,
//       slug,
//       short_description,
//       description,
//        type,
//        store,
//        unit,
//        weight,stock_status,
//        sku,quantity,
//        price,discount,
//        sale_price,status,
//        sale_starts_at,sale_expired_at,
//        tags,categories,is_random_related_products,
//        related_products,cross_sell_products,
//        product_thumbnail,size_chart_image,
//        meta_title,meta_description,product_meta_image,
//        is_free_shipping,tax,estimated_delivery_text,
//        return_policy_text,is_featured,safe_checkout,secure_checkout,
//        social_share,encourage_order,encourage_view,is_trending,is_return

//     }
//     return this.http.post<any>(`${this.configurl}/addProduct`,payload)
//   }


create(payload: Params): Observable<ProductModel> {
  return this.http.post<ProductModel>(`${this.configurl}addProduct`, {params: payload} )
   
}
  
update(product: Product): Observable<any> {
  return this.http.put<any>(`${this.configurl}update/:id`, product);
}

}