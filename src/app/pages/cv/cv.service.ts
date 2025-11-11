// cv.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CvService {
  // Cambia esto por tu endpoint real cuando lo tengas
  private apiUrl = '/api/cvs';

  constructor(private http: HttpClient) {}

  /**
   * Guarda un CV.
   * Intenta hacer POST a la API; si falla (o si la API no existe),
   * hace fallback guardando en localStorage (mock).
   */
  saveCv(payload: any): Observable<any> {
    // Si quieres forzar siempre mock: return this.saveMock(payload);
    return this.http.post(this.apiUrl, payload).pipe(
      map((res) => {
        // respuesta del backend
        return res;
      }),
      catchError((err) => {
        console.warn('POST falló; usando fallback localStorage. Error:', err);
        // fallback: guardar en localStorage con id timestamp
        try {
          const store = this.getStore();
          const id = 'cv_' + Date.now();
          store[id] = payload;
          localStorage.setItem('mock_cvs_store', JSON.stringify(store));
          return of({ ok: true, id, fallback: true });
        } catch (e) {
          return throwError(() => e);
        }
      })
    );
  }

  /**
   * Obtener CVs (útil para la sección admin futura que mostrará DataTables)
   * Devuelve lista de items guardados en backend o en localStorage si backend fallase.
   */
  listCvs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((err) => {
        console.warn('GET falló; devolviendo mock desde localStorage. Error:', err);
        const store = this.getStore();
        const arr = Object.keys(store).map((k) => ({ id: k, data: store[k] }));
        return of(arr);
      })
    );
  }

  private getStore(): { [key: string]: any } {
    try {
      const raw = localStorage.getItem('mock_cvs_store');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  // opcional: eliminar CV del mock store (útil para admin)
  deleteCvMock(id: string) {
    const store = this.getStore();
    delete store[id];
    localStorage.setItem('mock_cvs_store', JSON.stringify(store));
    return of({ ok: true });
  }
}
