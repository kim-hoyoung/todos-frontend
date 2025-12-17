import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiClient } from './api-client';

export interface AuthRequest {
  email: string;
  password: string;
}
export interface AuthResponse {
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private api: ApiClient) {}

  signup(body: AuthRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(`/users/create`, body);
  }
  login(body: AuthRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(`/users/login`, body).pipe(
      catchError((err: HttpErrorResponse) => {
        let msg = '로그인에 실패했습니다.';
        if (err.status === 401 || err.status === 400) {
          msg = '이메일 또는 비밀번호가 올바르지 않습니다.';
        } else if (err.status === 0) {
          msg = '서버에 연결할 수 없습니다.';
        }
        return throwError(() => new Error(msg));
      })
    );
  }
}
