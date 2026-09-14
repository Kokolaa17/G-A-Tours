import { Component, computed, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ModalService } from '../../Services/modal-service';
import { LogInModal } from '../../Modals/log-in-modal/log-in-modal';

@Component({
  selector: 'app-nav-bar',
  imports: [TranslateModule, RouterLink, RouterLinkActive, LogInModal],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.scss'],
})
export class NavBar implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly viewport = inject(ViewportScroller);
  private readonly modalService = inject(ModalService);

  currentLang = 'en';
  menuOpen = false;
  isLogInModalOpen = computed(() => this.modalService.isLogInModalOpen());

  ngOnInit() {
    this.currentLang = this.translate.currentLang || this.translate.getDefaultLang() || 'en';
    
    this.translate.onLangChange
      .pipe(takeUntilDestroyed())
      .subscribe(event => {
        this.currentLang = event.lang;
      });
  }

  switchLanguage(lang: string, event: Event) {
    event.preventDefault();
    this.translate.use(lang);
    this.currentLang = lang; 
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  goToContact(event?: Event) {
    if (event) { event.preventDefault(); }
    this.closeMenu();
    const fragment = 'contact';

    const smoothScrollToAnchor = () => {
      const el = document.getElementById(fragment);
      if (el && 'scrollIntoView' in el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      }
      return false;
    };

    const scroll = () => setTimeout(() => {
      if (!smoothScrollToAnchor()) {
        this.viewport.scrollToAnchor(fragment);
      }
    }, 50);

    if (this.router.url === '/' || this.router.url === '') {
      scroll();
      return;
    }

    this.router.navigate(['/'], { fragment }).then(() => scroll());
  }

  goToHome() {
    this.closeMenu();
    this.router.navigate(['/']).then(() => {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        this.viewport.scrollToPosition([0, 0]);
      }
    });
  }

  openLogInModal(event?: Event) {
    if (event) { event.preventDefault(); }
    this.viewport.scrollToPosition([0, 0], { behavior: 'smooth' });
    this.closeMenu();
    this.modalService.openLogInModal();
  }
}