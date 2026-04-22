import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from "./Components/nav-bar/nav-bar";
import { Footer } from "./Components/footer/footer";
// Fixed the typo from 'TranselateModule' to 'TranslateModule'
import { TranslateModule, TranslateService } from '@ngx-translate/core'; 

@Component({
  selector: 'app-root',
  standalone: true, // Ensure standalone is true
  imports: [RouterOutlet, NavBar, Footer, TranslateModule], // Fixed name here
  templateUrl: './app.html',
  styleUrl: './app.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App {
  protected readonly title = signal('GATours');

  

  constructor(private translate: TranslateService) {
    // This tells the app which languages are available
    this.translate.addLangs(['en', 'ka']);
    
    // Sets the fallback language if a translation is missing
    this.translate.setDefaultLang('en');

    // Detects browser language or falls back to English
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|ka/) ? browserLang : 'en');
  }
}