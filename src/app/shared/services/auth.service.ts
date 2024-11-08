import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthUserForgotModel, AuthUserStateModel, UpdatePasswordModel, VerifyEmailOtpModel } from "../interface/auth.interface";
import { UpdatePassword } from "../action/auth.action";
import { UserAddress } from "../interface/user.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  constructor(private http: HttpClient) {}
  configurl="http://localhost:3000/"


  postLogin(payload:AuthUserStateModel){
    return this.http.post<AuthUserStateModel>(`${this.configurl}adminLogin`,payload)
  }

}
