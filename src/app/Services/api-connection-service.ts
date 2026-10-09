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
}
