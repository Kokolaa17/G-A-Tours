import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero-section',
  imports: [TranslateModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
  stats = [
    { label: 'heroSection.tours', value: 120 },
    { label: 'heroSection.countries', value: 15 },
    { label: 'heroSection.customers', value: 5000 },
  ];
}
