import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CvService {
  private localStorageKey = 'cvList';

  // Cambia esto por tu endpoint real cuando lo tengas
  private apiUrl = '/api/cvs';

  constructor(private http: HttpClient) {}

  /**
   * Guarda un CV en localStorage
   */
  saveCv(cvData: any): Observable<any> {
    return this.http.post(this.apiUrl, cvData).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => {
        console.warn('POST falló; usando fallback localStorage. Error:', err);
        // fallback: guardar en localStorage
        try {
          const cvList = this.getCvListFromStorage();

          // Si cvData tiene un objeto 'data', usarlo, sino usar cvData completo
          const cvFormData = cvData.data || cvData;
          const id = cvData.id || this.generateId();
          const name = cvData.name || `CV_${id}`;

          const cvToSave = {
            id: id,
            name: name,
            data: cvFormData,
            lastModified: new Date().toISOString(),
            createdAt: cvData.createdAt || new Date().toISOString(),
          };

          // Si es un CV existente, actualizar; sino agregar nuevo
          const existingIndex = cvList.findIndex((cv: any) => cv.id === id);
          if (existingIndex >= 0) {
            cvList[existingIndex] = cvToSave;
          } else {
            cvList.push(cvToSave);
          }

          localStorage.setItem(this.localStorageKey, JSON.stringify(cvList));
          return of({ success: true, id, name, fallback: true });
        } catch (e) {
          console.error('Error en fallback localStorage:', e);
          return throwError(() => new Error('Error al guardar en localStorage'));
        }
      }),
    );
  }

  /**
   * Obtener lista de CVs desde localStorage
   */
  getCvs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((err) => {
        console.warn('GET falló; devolviendo datos desde localStorage. Error:', err);
        const cvList = this.getCvListFromStorage();
        return of(cvList);
      }),
    );
  }

  /**
   * Obtener lista de CVs directamente desde localStorage (síncrono)
   */
  getCvsSync(): any[] {
    return this.getCvListFromStorage();
  }

  /**
   * Eliminar un CV
   */
  deleteCv(cvId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${cvId}`).pipe(
      catchError((err) => {
        console.warn('DELETE falló; eliminando de localStorage. Error:', err);
        try {
          const cvList = this.getCvListFromStorage();
          const updatedList = cvList.filter((cv: any) => cv.id !== cvId);
          localStorage.setItem(this.localStorageKey, JSON.stringify(updatedList));
          return of({ success: true, fallback: true });
        } catch (e) {
          console.error('Error eliminando CV:', e);
          return throwError(() => new Error('Error al eliminar el CV'));
        }
      }),
    );
  }

  /**
   * Obtener un CV por ID
   */
  getCvById(cvId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${cvId}`).pipe(
      catchError((err) => {
        console.warn('GET por ID falló; buscando en localStorage. Error:', err);
        try {
          const cvList = this.getCvListFromStorage();
          const cv = cvList.find((item: any) => item.id === cvId);
          return of(cv || null);
        } catch (e) {
          console.error('Error obteniendo CV por ID:', e);
          return throwError(() => new Error('Error al obtener el CV'));
        }
      }),
    );
  }

  /**
   * Obtener un CV por ID (síncrono)
   */
  getCvByIdSync(cvId: string): any {
    try {
      const cvList = this.getCvListFromStorage();
      return cvList.find((item: any) => item.id === cvId) || null;
    } catch (e) {
      console.error('Error obteniendo CV por ID (síncrono):', e);
      return null;
    }
  }

  /**
   * Obtener lista de CVs desde localStorage
   */
  private getCvListFromStorage(): any[] {
    try {
      const raw = localStorage.getItem(this.localStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Verificar que sea un array
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (e) {
      console.error('Error parsing cvList from localStorage:', e);
      return [];
    }
  }

  /**
   * Generar ID único
   */
  private generateId(): string {
    return 'cv_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * Limpiar todos los CVs (para debugging)
   */
  clearAllCvs(): void {
    localStorage.removeItem(this.localStorageKey);
  }
}
