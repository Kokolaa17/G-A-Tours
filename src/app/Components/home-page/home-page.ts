import { Component, computed, inject } from '@angular/core';
import { HeroSection } from "./hero-section/hero-section";
import { OurTours } from './our-tours/our-tours';
import { WhyUs } from "./why-us/why-us";
import { GalleryComponent } from "./gallery-component/gallery-component";
import { ContactComponent } from "./contact-component/contact-component";
import { TranslateModule } from '@ngx-translate/core';
import { ApiConnectionService } from '../../Services/api-connection-service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-page',
  imports: [HeroSection, OurTours, WhyUs, GalleryComponent, ContactComponent, TranslateModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss'],
})
export class HomePage {
  private readonly _apiConnectionService = inject(ApiConnectionService);

  gallery = rxResource({
    stream: () => this._apiConnectionService.getAllImages(1, 12),
  });
  
  hasGallery = computed(() => (this.gallery.value()?.data?.items?.length ?? 0) > 0);
}
