import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

function decodeMojibake(value: string): string {
  // Recover text when backend sends UTF-8 bytes interpreted as latin-1.
  if (!/[\u00C0-\u00FF]/.test(value)) {
    return value;
  }

  try {
    const decoded = decodeURIComponent(
      Array.from(value)
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );

    return /[\u0600-\u06FF]/.test(decoded) ? decoded : value;
  } catch {
    return value;
  }
}

function normalizeUtf8Payload(payload: unknown): unknown {
  if (typeof payload === 'string') {
    return decodeMojibake(payload);
  }

  if (Array.isArray(payload)) {
    return payload.map(normalizeUtf8Payload);
  }

  if (payload && typeof payload === 'object') {
    const normalized: Record<string, unknown> = {};
    Object.entries(payload as Record<string, unknown>).forEach(([key, value]) => {
      normalized[key] = normalizeUtf8Payload(value);
    });
    return normalized;
  }

  return payload;
}

export const utf8ResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const utf8Request = req.clone({
    setHeaders: {
      Accept: 'application/json; charset=utf-8',
      'Accept-Charset': 'utf-8'
    }
  });

  return next(utf8Request).pipe(
    map((event) => {
      if (!(event instanceof HttpResponse) || event.body == null) {
        return event;
      }

      return event.clone({
        body: normalizeUtf8Payload(event.body)
      });
    })
  );
};
