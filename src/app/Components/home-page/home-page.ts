import { Component } from '@angular/core';
import { HeroSection } from "./hero-section/hero-section";
import { OurTours } from './our-tours/our-tours';
import { WhyUs } from "./why-us/why-us";
import { GalleryComponent } from "./gallery-component/gallery-component";
import { ContactComponent } from "./contact-component/contact-component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-page',
  imports: [HeroSection, OurTours, WhyUs, GalleryComponent, ContactComponent, TranslateModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {

}
