import { IUser } from './../../_interface/IUser';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSource = new ReplaySubject<IUser | null>(1)
  currentUser$ = this.currentUserSource.asObservable();
  authUserdata = JSON.parse(localStorage.getItem('0F340967EE56C835881A40DA48CE1D472C3DD368217A83DCB5074EB97BB367FBB3CB008FC9F7C86D075392F3D44DC97008BD04F328B36DED48DEC57230581E91')!) || null

  constructor(private http: HttpClient, private router: Router) { }

  login(model: any) {
    return this.http.post(environment.apiUrl + 'auth/login', model).pipe(
      map((response: any) => {
        //console.log(response)
        const user = response;
        if (user) {
          this.setCurrentUser(user)
        }
      })
    );
  }

  setCurrentUser(user: IUser) {
    if (user) {
      user.roles = []
      const userRoles = this.getDecodedToken(user.token).role;

      Array.isArray(userRoles) ? user.roles = userRoles : user.roles.push(userRoles);

      localStorage.setItem('0F340967EE56C835881A40DA48CE1D472C3DD368217A83DCB5074EB97BB367FBB3CB008FC9F7C86D075392F3D44DC97008BD04F328B36DED48DEC57230581E91', JSON.stringify(user))
      this.currentUserSource.next(user)
      this.authUserdata = JSON.parse(localStorage.getItem('0F340967EE56C835881A40DA48CE1D472C3DD368217A83DCB5074EB97BB367FBB3CB008FC9F7C86D075392F3D44DC97008BD04F328B36DED48DEC57230581E91')!)
    }
  }

  changePassword(model: any) {
    return this.http.post(environment.apiUrl + "auth/Change-Password", model).pipe(
      map((response: any) => {
        //console.log('dip',response)
        return response;
      })
    )
  }

  logout() {
    localStorage.removeItem('0F340967EE56C835881A40DA48CE1D472C3DD368217A83DCB5074EB97BB367FBB3CB008FC9F7C86D075392F3D44DC97008BD04F328B36DED48DEC57230581E91');
    this.currentUserSource.next(null)
    this.authUserdata = null;
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]))
  }

}
