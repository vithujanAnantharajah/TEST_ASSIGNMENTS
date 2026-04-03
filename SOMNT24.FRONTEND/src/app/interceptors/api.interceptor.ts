import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // If sending FormData (for files), browser handles boundaries automatically
  // otherwise, set JSON headers.
  const isFormData = req.body instanceof FormData;

  const headers: any = { 'Accept': 'application/json' };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const clonedRequest = req.clone({ setHeaders: headers });
  return next(clonedRequest);
};