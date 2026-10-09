import { computed, inject, Injectable, signal } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map, Observable, of, tap } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { jwtDecode } from "jwt-decode";
import { UserLogInInterface } from "../Interfaces/user-log-in-interface";
import { ApiResponseInterface } from "../Interfaces/api-response-interface";

export interface CurrentUser {
  id: number;
  email: string;
  role: string;
  firstName: string;
}

const TOKEN_KEY = "ga_token";  

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _cookieService = inject(CookieService);
  private readonly baseUrl = "https://localhost:7058/api/Auth";

  private readonly _token = signal<string | null>(this._readValidToken());

  currentUser = signal<CurrentUser | null>(null);
  isLoggedIn = computed(() => this._token() !== null);

  loggedInUserId = computed(() => this.currentUser()?.id ?? this._decode()?.id ?? null);
  loggedInUserName = computed(() => this.currentUser()?.firstName ?? this._decode()?.name ?? null);

  logIn(command: UserLogInInterface): Observable<ApiResponseInterface<string>> {
    return this._httpClient.post<ApiResponseInterface<string>>(`${this.baseUrl}/login`, command);
  }

  register(command: any): Observable<ApiResponseInterface<string>> {
    return this._httpClient.post<ApiResponseInterface<string>>(`${this.baseUrl}/user-register`, command);
  }

  verifyEmail(command: any): Observable<ApiResponseInterface<string>> {
    return this._httpClient.post<ApiResponseInterface<string>>(`${this.baseUrl}/verify-email`, command);
  }

  getToken(): string | null {
    return this._token();
  }

  setToken(token: string): void {
    this._cookieService.set(TOKEN_KEY, token, {
      path: "/",
      expires: 7,
      sameSite: "Lax",
      secure: location.protocol === "https:",
    });
    this._token.set(token);
  }

  logout(): void {
    this._cookieService.delete(TOKEN_KEY, "/");
    this._token.set(null);
    this.currentUser.set(null);
  }

  loadCurrentUser(): Observable<CurrentUser | null> {
    if (!this._token()) return of(null);

    return this._httpClient.get<ApiResponseInterface<CurrentUser>>(`${this.baseUrl}/me`).pipe(
      map((res) => res.data ?? null),
      tap((user) => this.currentUser.set(user)),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) this.logout();
        return of(null);
      })
    );
  }

  // ---- კერძო ----
  private _readValidToken(): string | null {
    const token = this._cookieService.get(TOKEN_KEY);
    console.log('cookie token:', token ? 'found' : 'missing');
    if (!token) return null;
    try {
      const { exp } = jwtDecode<{ exp?: number }>(token);
      console.log('exp:', exp, 'now:', Date.now() / 1000);
      if (exp && exp * 1000 < Date.now()) {
        this._cookieService.delete(TOKEN_KEY, "/");
        return null;
      }
      return token;
    } catch (e) {
      console.log('decode error:', e);
      return null;
    }
  }

  private _decode(): { id: number; name: string } | null {
    const token = this._token();
    if (!token) return null;
    try {
      const d: any = jwtDecode(token);
      const id = d["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const name = d["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      return id ? { id: +id, name: name ?? "" } : null;
    } catch {
      return null;
    }
  }
}