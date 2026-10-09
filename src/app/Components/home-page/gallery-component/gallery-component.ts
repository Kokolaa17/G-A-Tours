import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ApiConnectionService } from '../../../Services/api-connection-service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-gallery-component',
  imports: [TranslateModule],
  templateUrl: './gallery-component.html',
  styleUrls: ['./gallery-component.scss'],
})
export class GalleryComponent {
  private readonly router = inject(Router);
  private readonly _apiConnectionService = inject(ApiConnectionService);

  private readonly previewCount = 5;

  selectedImage = signal<{ src: string; title: string; subtitle: string } | null>(null);
  apiOrigin = 'https://localhost:7058'; // უკეთესია environment-დან

  gallery = rxResource({
    stream: () => this._apiConnectionService.getAllImages(1, this.previewCount),
  });

  images = computed(() => this.gallery.value()?.data?.items ?? []);

  openLightbox(src: string, title: string, subtitle: string) {
    this.selectedImage.set({ src, title, subtitle });
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.selectedImage.set(null);
    document.body.style.overflow = '';
  }

  goToAllImages() {
    this.router.navigate(['/gallery']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}