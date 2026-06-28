import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorDialogService, SKIP_ERROR_DIALOG } from '../services/error-dialog.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorDialogService = inject(ErrorDialogService);
  const shouldSkipErrorDialog = req.context.get(SKIP_ERROR_DIALOG);

  if (shouldSkipErrorDialog) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const hasErrorMessage = typeof error.error?.message === 'string' && error.error.message.trim().length > 0;
      const fallbackMessage = 'Something went wrong. Please try again.';
      const userMessage = hasErrorMessage ? error.error.message : fallbackMessage;

      errorDialogService.show(userMessage, error.status ?? null);

      return throwError(() => error);
    })
  );
};
