import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ModalService } from '../../Services/modal-service';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth-service';

@Component({
  selector: 'app-admin-panel',
  imports: [],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
})
export class AdminPanel {
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);

  admin = {
    name: 'Giorgi',
    email: 'giorgi@georgianadventures.ge',
    role: 'Administrator',
  };
 
  // Replace with counts from your API
  stats = {
    tours: 5,
    bookings: 11,
    users: 5,
    gallery: 8, // Example count for gallery records
  };
 
  get initials(): string {
    // "GB" in the screenshot: first letters of first and last name
    // (your admin only has "Giorgi", so add a lastName field if you want "GB")
    return this.admin.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  private readonly _http = inject(HttpClient);

  getAllUsers(){
    this._http.get("https://localhost:7058/api/User?page=1&pageSize=20", { withCredentials: true }).subscribe({
      next: (response) => {
        console.log(response);
      }
    })
  }

  logOut() {
  this._authService.logout();
  this._router.navigate(['/']).then(() => {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });
}
}
