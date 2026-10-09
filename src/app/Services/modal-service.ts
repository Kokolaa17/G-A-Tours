import { inject, Injectable, signal, computed } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly _cookieService = inject(CookieService);

  // Computed სიგნალები ავტომატურად რეაგირებენ კუკის ცვლილებაზე
  isUserLoggedIn = computed(() => !!this._cookieService.get('token'));

  loggedInUserId = computed(() => {
    const user = this._getDecodedUser();
    return user?.id ?? null;
  });

  loggedInUserName = computed(() => {
    const user = this._getDecodedUser();
    return user?.name ?? null;
  });

  private _getDecodedUser(): any | null {
    const token = this._cookieService.get('token');
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded JWT inside service:', decoded); // ახლა უკვე აუცილებლად დალოგავს

      const idClaim =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? 
        decoded['sub'] ?? 
        decoded['id'];

      const nameClaim =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? 
        decoded['name'] ?? 
        decoded['unique_name'] ?? 
        decoded['given_name'];

      if (!idClaim) return null;

      return { 
        id: idClaim, 
        name: nameClaim ?? '' 
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
  // email modal
  userEmail = signal('');

  setUserEmail(email: string) {
    this.userEmail.set(email);
  }

  unsetUserEmail() {
    this.userEmail.set('');
  }

  // log-in modal
  isLogInModalOpen = signal(false);

  openLogInModal() {
    this.isLogInModalOpen.set(true);
  }

  closeLogInModal() {
    this.isLogInModalOpen.set(false);
  }

  // verify-email modal
  isVerifyEmailModalOpen = signal(false);

  openVerifyEmailModal() {
    this.isVerifyEmailModalOpen.set(true);
  }

  closeVerifyEmailModal() {
    this.isVerifyEmailModalOpen.set(false);
  }
}