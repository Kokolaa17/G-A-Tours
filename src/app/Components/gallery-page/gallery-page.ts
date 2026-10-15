import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiConnectionService } from '../../Services/api-connection-service';
// TODO: adjust to your real auth service (anything that exposes isAdmin())
import { AuthService } from '../../Services/auth-service';
import { GalleryImageInterface } from '../../Interfaces/gallery-image-interface';

@Component({
  selector: 'app-gallery-page',
  imports: [ReactiveFormsModule],
  templateUrl: './gallery-page.html',
  styleUrls: ['./gallery-page.scss'],
})
export class GalleryPage {
  private readonly _apiConnectionService = inject(ApiConnectionService);
  private readonly _authService = inject(AuthService);
  private readonly _fb = inject(FormBuilder);

  private readonly pageSize = 12;

  apiOrigin = 'https://localhost:7058'; // better from environment

  isAdmin = signal(true);


  page = signal(1);
  selectedImage = signal<{ src: string; title: string; subtitle: string } | null>(null);

  // --- admin state ---
  editingImage = signal<GalleryImageInterface | null>(null);
  deletingImage = signal<GalleryImageInterface | null>(null);
  busy = signal(false);
  actionError = signal<string | null>(null);

  editForm = this._fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    location: ['', [Validators.required, Validators.maxLength(150)]],
    caption: ['', [Validators.maxLength(500)]],
    image: [null as File | null] 
  });

  gallery = rxResource({
    params: () => ({ page: this.page() }),
    stream: ({ params }) => this._apiConnectionService.getAllImages(params.page, this.pageSize),
  });

  images = computed(() => this.gallery.value()?.data?.items ?? []);
  totalPages = computed(() => this.gallery.value()?.data?.totalPages ?? 0);
  hasNext = computed(() => this.page() < this.totalPages());
  hasPrevious = computed(() => this.page() > 1);

  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  /** Called by the parent (gallery-manager) after an upload */
  reload() {
    if (this.page() !== 1) {
      this.page.set(1); // resource reloads by itself when the param changes
    } else {
      this.gallery.reload();
    }
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages() || p === this.page()) return;
    this.page.set(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- lightbox ---
  openLightbox(src: string, title: string, subtitle: string) {
    this.selectedImage.set({ src, title, subtitle });
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.selectedImage.set(null);
    document.body.style.overflow = '';
  }

  // --- admin: edit ---
  openEdit(image: GalleryImageInterface) {
    if (!this.isAdmin()) return;
    this.actionError.set(null);
    this.editForm.reset({
      name: image.name ?? '',
      location: image.location ?? '',
      caption: image.caption ?? '',
    });
    this.editingImage.set(image);
  }

  saveEdit() {
    const image = this.editingImage();
    if (!image || !this.isAdmin()) return;
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const { name, location, caption, image: newImageFile } = this.editForm.getRawValue();
    this.busy.set(true);
    this.actionError.set(null);

    this._apiConnectionService
      .updateImage(image.id, {
        name: name!.trim(),
        location: location?.trim() ?? '',
        caption: caption?.trim() ?? '',
        image: newImageFile ?? undefined
      })
      .subscribe({
        next: (res : any) => {
          this.busy.set(false);
          this.closeDialogs();
          this.gallery.reload();
          console.log('Image updated:', res);
        },
        error: (err) => {
          console.error('Error updating image:', err);
          this.busy.set(false);
          this.actionError.set(err?.error?.message || 'Could not save changes. Try again.');
        },
      });
  }

  // --- admin: delete ---
  openDelete(image: GalleryImageInterface) {
    if (!this.isAdmin()) return;
    this.actionError.set(null);
    this.deletingImage.set(image);
  }

  confirmDelete() {
    const image = this.deletingImage();
    if (!image || !this.isAdmin()) return;

    this.busy.set(true);
    this.actionError.set(null);

    this._apiConnectionService.deleteImage(image.id).subscribe({
      next: () => {
        const wasLastOnPage = this.images().length === 1 && this.page() > 1;
        this.busy.set(false);
        this.closeDialogs();
        if (wasLastOnPage) {
          this.page.set(this.page() - 1); // otherwise we'd land on an empty page
        } else {
          this.gallery.reload();
        }
      },
      error: (err) => {
        console.error('Error deleting image:', err);
        this.busy.set(false);
        this.actionError.set(err?.error?.message || 'Could not delete the photo. Try again.');
      },
    });
  }

  closeDialogs() {
    if (this.busy()) return;
    this.editingImage.set(null);
    this.deletingImage.set(null);
    this.actionError.set(null);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0] || null;
    this.editForm.patchValue({ image: file });
  }
}