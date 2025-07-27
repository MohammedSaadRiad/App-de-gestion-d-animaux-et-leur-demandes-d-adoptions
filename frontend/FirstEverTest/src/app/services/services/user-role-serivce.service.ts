import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type UserRole = 'user' | 'admin';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  // BehaviorSubject with default value 'user'
  private userRoleSubject = new BehaviorSubject<UserRole>('user');
  
  // Expose as Observable for components to subscribe to
  public userRole$: Observable<UserRole> = this.userRoleSubject.asObservable();
  
  constructor() { }
  
  // Method to update the current role
  setUserRole(role: UserRole): void {
    this.userRoleSubject.next(role);
    console.log(this.userRoleSubject.getValue())
  }
  
  // Method to get current role value immediately
  getCurrentRole(): UserRole {
    return this.userRoleSubject.getValue();
  }
}