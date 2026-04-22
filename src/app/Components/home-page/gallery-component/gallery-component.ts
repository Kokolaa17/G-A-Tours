import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-gallery-component',
  imports: [TranslateModule],
  templateUrl: './gallery-component.html',
  styleUrl: './gallery-component.scss',
})
export class GalleryComponent {
  private readonly router = inject(Router);

  selectedImage: { src: string; title: string; subtitle: string } | null = null;

  openLightbox(src: string, title: string, subtitle: string) {
    this.selectedImage = { src, title, subtitle };
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.selectedImage = null;
    document.body.style.overflow = '';
  }

    goToAllImages() {
    this.router.navigate(['/gallery']);
  }
  
}
