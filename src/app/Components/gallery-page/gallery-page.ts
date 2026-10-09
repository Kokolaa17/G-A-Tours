import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ApiConnectionService } from '../../Services/api-connection-service';


@Component({
  selector: 'app-gallery-page',
  imports: [],
  templateUrl: './gallery-page.html',
  styleUrls: ['./gallery-page.scss'],
})
export class GalleryPage {
  private readonly _apiConnectionService = inject(ApiConnectionService);

  private readonly pageSize = 12;

  apiOrigin = 'https://localhost:7058'; // უკეთესია environment-დან

  page = signal(1);
  selectedImage = signal<{ src: string; title: string; subtitle: string } | null>(null);

  gallery = rxResource({
    params: () => ({ page: this.page() }),
    stream: ({ params }) => this._apiConnectionService.getAllImages(params.page, this.pageSize),
  });

  images = computed(() => this.gallery.value()?.data?.items ?? []);
  totalPages = computed(() => this.gallery.value()?.data?.totalPages ?? 0);
  hasNext = computed(() => this.page() < this.totalPages());
  hasPrevious = computed(() => this.page() > 1);

  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages() || p === this.page()) return;
    this.page.set(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openLightbox(src: string, title: string, subtitle: string) {
    this.selectedImage.set({ src, title, subtitle });
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.selectedImage.set(null);
    document.body.style.overflow = '';
  }
}