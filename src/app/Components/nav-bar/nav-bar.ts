import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  imports: [TranslateModule, RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  private readonly transelate = inject(TranslateService);

 switchLanguage(lang: string, event: Event) {
    event.preventDefault(); 
    this.transelate.use(lang);
    console.log('Language switched to:', lang);
  }
  menuOpen = false;
  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
}
