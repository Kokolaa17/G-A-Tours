import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserLogInInterface } from '../Interfaces/user-log-in-interface';
import { ApiResponseInterface } from '../Interfaces/api-response-interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);

    logIn(command: UserLogInInterface): Observable<ApiResponseInterface<string>> {
    return this._httpClient.post<ApiResponseInterface<string>>(`https://localhost:7058/api/Auth/login
`, command);
  }
}
