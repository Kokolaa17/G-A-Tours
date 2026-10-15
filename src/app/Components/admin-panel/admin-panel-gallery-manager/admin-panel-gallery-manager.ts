import { Component, EventEmitter, inject, Output, signal, viewChild } from '@angular/core';
import { GalleryPage } from '../../gallery-page/gallery-page';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiConnectionService } from '../../../Services/api-connection-service';

const MAX_SIZE_MB = 10;

@Component({
  selector: 'app-admin-panel-gallery-manager',
  imports: [GalleryPage, ReactiveFormsModule],
  templateUrl: './admin-panel-gallery-manager.html',
  styleUrl: './admin-panel-gallery-manager.scss',
})
export class AdminPanelGalleryManager {
  private _apiConnectionService = inject(ApiConnectionService);
  private fb = inject(FormBuilder);
  private gallery = viewChild(GalleryPage);

  file: File | null = null;
  previewUrl = signal<string | null>(null);
  dragging = signal(false);
  submitting = signal(false);
  status = signal<{ type: 'success' | 'error'; text: string } | null>(null);
 
  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    location: ['', [Validators.maxLength(100)]],
    caption: ['', [Validators.maxLength(300)]],
  });
 
  onFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.setFile(input.files[0]);
    input.value = ''; 
  }
 
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(false);
    const f = event.dataTransfer?.files?.[0];
    if (f) this.setFile(f);
  }
 
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(true);
  }
 
  private setFile(f: File) {
    this.status.set(null);
 
    if (!f.type.startsWith('image/')) {
      this.status.set({ type: 'error', text: 'Please choose an image file (JPG, PNG, WEBP).' });
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      this.status.set({ type: 'error', text: `Image must be smaller than ${MAX_SIZE_MB} MB.` });
      return;
    }
 
    this.clearPreview();
    this.file = f;
    this.previewUrl.set(URL.createObjectURL(f));
  }
 
  removeFile() {
    this.clearPreview();
    this.file = null;
  }
 
  private clearPreview() {
    const url = this.previewUrl();
    if (url) URL.revokeObjectURL(url);
    this.previewUrl.set(null);
  }
 
  reset() {
    this.removeFile();
    this.form.reset({ name: '', location: '', caption: '' });
    this.status.set(null);
  }
 
  submit() {
    if (!this.file) {
      this.status.set({ type: 'error', text: 'Choose a photo to upload.' });
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
 
    const { name, location, caption } = this.form.getRawValue();
 
    // Field names must match the Swagger body exactly (case-sensitive)
    const body = new FormData();
    body.append('Image', this.file, this.file.name);
    body.append('Name', name!.trim());
    if (location?.trim()) body.append('Location', location.trim());
    if (caption?.trim()) body.append('Caption', caption.trim());
 
    this.submitting.set(true);
    this.status.set(null);
 
    this._apiConnectionService.uploadImage(body).subscribe({
      next: () => {
        this.submitting.set(false);
        this.reset();
        this.status.set({ type: 'success', text: 'Photo uploaded.' });
        this.gallery()?.reload();
      },
      error: (err) => {
        this.submitting.set(false);
        this.status.set({
          type: 'error',
          text: err?.error?.message || err?.error?.title || 'Upload failed. Check the details and try again.',
        });
      },
    });
  }
}
