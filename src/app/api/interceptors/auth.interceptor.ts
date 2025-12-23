import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // 로컬 스토리지에 저장된 토큰 조회 ( 로그인 할 떄 저장한거 )
  const token = localStorage.getItem('token');

  // 로그인, 회원가입 요청에는 토큰을 안 붙이게,
  const isAuthRequest = req.url.includes('/users/login') || req.url.includes('/users/create');

  // 토큰이 없거나 로그인, 회원가입인 경우 서버로 리턴,
  // 토큰 만료, 무효된 경우, 401,403 일때 로그인 페이지로 이동
  if (!token || isAuthRequest) {
    return next(req).pipe(
      catchError((error) => {
        {
          alert('로그인이 필요합니다.');
          router.navigate(['']);
        }
        return throwError(() => error);
      })
    );
  }

  // Authorization 헤더에 토큰 추가
  const authReq = req.clone({
    setHeaders: {
      Authorization: token,
    },
  });

  // 토큰이 포함된 요청 전송 + 응답 에러 처리
  return next(authReq).pipe(
    catchError((error) => {
      // 토큰이 만료되었거나 서버에서 무효 처리된 경우
      if (error.status === 401 || error.status === 403) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');

        // 토큰 제거
        localStorage.removeItem('token');

        // 로그인 페이지로 강제 이동
        router.navigate(['']);
      }

      return throwError(() => error);
    })
  );
};
