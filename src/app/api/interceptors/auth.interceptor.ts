import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  const isAuthRequest = req.url.includes('/users/login') || req.url.includes('/users/create');

  if (!token || isAuthRequest) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: token,
    },
  });

  return next(authReq);
};
