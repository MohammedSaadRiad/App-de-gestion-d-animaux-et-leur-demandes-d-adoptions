import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserRole,UserRoleService } from '../../services/services/user-role-serivce.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports:[RouterLink]
})
export class NavbarComponent implements OnInit {
  currentRole: UserRole = 'user';

  constructor(private userRoleService: UserRoleService) { }

  ngOnInit(): void {
    // Initialize the dropdown with the current role
    this.currentRole = this.userRoleService.getCurrentRole();
    
    // Subscribe to role changes (useful if role is changed from somewhere else)
    this.userRoleService.userRole$.subscribe(role => {
      this.currentRole = role;
    });
  }

  onRoleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newRole = selectElement.value as UserRole;
    this.userRoleService.setUserRole(newRole);
  } 

}