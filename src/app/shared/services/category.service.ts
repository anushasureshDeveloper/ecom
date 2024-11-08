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
  configurl="http://localhost:3000"

  getCategories(payload?: Params): Observable<CategoryModel> {
    return this.http.get<CategoryModel>(`${environment.URL}/category.json`, { params: payload });
  }
  postCategories(payload:CategoryModel){
    return this.http.post<CategoryModel>(`${this.configurl}/createCategory`,payload)
  }

  editCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.configurl}/${id}`);
  }

}
