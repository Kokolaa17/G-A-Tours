import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PagedResult } from '../Interfaces/paged-result';
import { ApiResponseInterface } from '../Interfaces/api-response-interface';
import { GalleryImageInterface } from '../Interfaces/gallery-image-interface';

@Injectable({
  providedIn: 'root',
})
export class ApiConnectionService {
  private readonly _baseUrl = 'https://localhost:7058/api';
  private readonly _httpClient = inject(HttpClient);

  getAllImages(page = 1, pageSize = 12, search?: string) {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this._httpClient.get<ApiResponseInterface<PagedResult<GalleryImageInterface>>>(
      `${this._baseUrl}/GalleryImage`,
      { params, withCredentials: true }
    );
  }

  uploadImage(formData: FormData) {
    return this._httpClient.post<ApiResponseInterface<GalleryImageInterface>>(
      `${this._baseUrl}/GalleryImage`,
      formData,
      { withCredentials: true }
    );
  }

  updateImage(id: number | string, data: { name: string; location?: string; caption?: string; image?: File }) {
    const formData = new FormData();
    formData.append('Name', data.name);
    if (data.location) formData.append('Location', data.location);
    if (data.caption) formData.append('Caption', data.caption);
    if (data.image) {
      formData.append('Image', data.image, data.image.name);
    }

    return this._httpClient.put<ApiResponseInterface<GalleryImageInterface>>(
      `${this._baseUrl}/GalleryImage/${id}`,
      formData,
      { withCredentials: true }
      // Note: Do NOT manually set Content-Type header; HttpClient handles multipart/form-data boundary automatically.
    );
  }
  
  // ASSUMPTION: DELETE /api/GalleryImage/{id}
  deleteImage(id: number | string) {
    return this._httpClient.delete<ApiResponseInterface<unknown>>(
      `${this._baseUrl}/GalleryImage/${id}`,
      { withCredentials: true }
    );
  }
}
