import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private isAuthenticated: boolean = false

 login(){
  this.isAuthenticated = true
  localStorage.setItem('isAuthenticated', 'true')
 }

 logout() {
  this.isAuthenticated = false
  localStorage.removeItem('isAuthenticated')
 }

 isAuthenticatedUser(): boolean {
  if(typeof localStorage !== 'undefined') {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    return isAuthenticated === 'true'; 
  }

  return false
}

  constructor() { }
}
