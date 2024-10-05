import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";

import { jwtDecode } from "jwt-decode";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { environment } from "../../../environments/environment";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  //{ headers: { 'Content-Type': 'multipart/form-data' }
  constructor(private authService: AuthService, private _r: Router) { }
   appkey = environment.appKey;
   superTeam = environment.superTeam;
   superTeam1 = environment.superTeam1;

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.endsWith("/Authentication/Login")) {
      req = req.clone({
        setHeaders: {
          'x-app-key':this.appkey,
          'x-super-team':this.superTeam,
        }
        });
      return next.handle(req);
    }
    const authToken = this.authService.getToken();
    if (authToken) {
      try {
        let decodedToken = jwtDecode(authToken);
        console.log("decodedToken.exp", decodedToken.exp)
        const isExpired = decodedToken && decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : false;
        console.log("isExpired", isExpired);
        if (isExpired) {
          console.log("token expired");
          this.authService.doLogout();
          this._r.navigateByUrl('/auth/login');
        }
        else {
          console.log("token not expired");
        }
      }
      catch (e) {
        console.log("Invalid token")
        this.authService.doLogout();
        this._r.navigateByUrl('/auth/login');
      }
    }
    else {
      console.log("No token found");
      this._r.navigateByUrl('/auth/login');
    }

    req = req.clone({
      setHeaders: {
        Authorization: authToken ? "Bearer "+authToken : '',
        'x-app-key':this.appkey,
        'x-super-team':req.url.includes("http://52.77.162.250:5005/") ? this.superTeam1 : this.superTeam,
      }
    });
    return next.handle(req);
  }
}
