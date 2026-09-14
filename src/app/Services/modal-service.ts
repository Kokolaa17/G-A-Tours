import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  // log-in modal
  isLogInModalOpen = signal(false);

  openLogInModal() {
    this.isLogInModalOpen.set(true);
  }

  closeLogInModal() {
    this.isLogInModalOpen.set(false);
  }
}
