import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Category, CategoryModel } from "../interface/category.interface";

@Injectable({
  providedIn: "root",
})
export class CategoryService {

  constructor(private http: HttpClient) {}
  configUrl="http://localhost:2000/"

  getCategories(payload?: Params): Observable<CategoryModel> {
    // If payload is passed, make sure it's serialized as query parameters
    const params = payload ? { ...payload } : {};
  
    return this.http.get<CategoryModel>(`${this.configUrl}getCategory`, { params });
  }
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.configUrl}createCategory`, category);
  }
  

}
