// src/app/pages/ver-cv/ver-cv.ts
import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type CvRow = {
  id: number;
  name: string;
  email?: string;
  title?: string;
  createdAt?: string;
};

@Component({
  selector: 'page-ver-cv',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <h2 class="mb-3">Ver Curriculums</h2>

      <div class="mb-3 row g-2">
        <div class="col-md-6">
          <input class="form-control" placeholder="Buscar..." (input)="onSearch($event)" />
        </div>
        <div class="col-md-6 text-end">
          <button class="btn btn-sm btn-outline-secondary" (click)="reloadFromStorage()">Recargar</button>
        </div>
      </div>

      <div class="table-responsive">
        <table #cvTable id="cv-table" class="display table table-striped" style="width:100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Título</th>
              <th>Creado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of rows()">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.email || '-' }}</td>
              <td>{{ row.title || '-' }}</td>
              <td>{{ row.createdAt || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="rows().length === 0" class="mt-3 text-muted">
        No hay curriculums guardados.
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .table-responsive { overflow-x: auto; }
    `
  ]
})
export class VerCvComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cvTable', { static: true }) cvTable!: ElementRef<HTMLTableElement>;

  // signal con las filas (reactivo)
  private _rows = signal<CvRow[]>([]);
  rows = this._rows.asReadonly();

  private dtInstance: any = null;

  constructor() {
    // cargar datos desde localStorage de manera segura
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined' || !window.localStorage) {
      // no estamos en navegador -> dejamos rows vacío
      this._rows.set([]);
      return;
    }

    try {
      const raw = localStorage.getItem('cvs');
      if (!raw) {
        // si no existe, inicializamos con ejemplo vacío (puedes cambiar)
        this._rows.set([]);
        return;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        this._rows.set([]);
        return;
      }

      const normalized: CvRow[] = parsed.map((c: any, i: number) => ({
        id: Number(c.id ?? i + 1),
        name: c.name ?? `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim(),
        email: c.email ?? '',
        title: c.title ?? '',
        createdAt: c.createdAt ?? (c.createdAtISO ? new Date(c.createdAtISO).toLocaleDateString() : '')
      }));

      this._rows.set(normalized);
    } catch (err) {
      console.warn('VerCv: error leyendo cvs desde localStorage', err);
      this._rows.set([]);
    }
  }

  // método público para recargar (botón)
  reloadFromStorage() {
    this.destroyDataTableIfExists();
    this.loadFromStorage();
    // reinit DataTables si ya se mostró la tabla
    setTimeout(() => this.initDataTable(), 50);
  }

  async ngAfterViewInit(): Promise<void> {
    if (typeof window === 'undefined') return;

    await this.initDataTable();
  }

  private async initDataTable() {
    if (typeof window === 'undefined') return;

    // import dinámico para Vite; evita errores SSR
    const jqueryModule = await import('jquery');
    const $ = (jqueryModule && (jqueryModule as any).default) || jqueryModule;

    // importar datatables (usa jQuery)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await import('datatables.net')(window, $);

    // opcional: importar estilos (si tu bundler soporta importar css desde js)
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await import('datatables.net-dt/css/jquery.dataTables.css');
    } catch {
      // si falla, espera que incluyas CSS por otra vía (index.html o styles)
    }

    // destruir existente (HMR)
    try {
      if ($.fn.dataTable.isDataTable(this.cvTable.nativeElement)) {
        $(this.cvTable.nativeElement).DataTable().destroy();
      }
    } catch {
      // ignore
    }

    // inicializar DataTable
    this.dtInstance = $(this.cvTable.nativeElement).DataTable({
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      pageLength: 10,
      // si prefieres pasar datos directamente: data: this.rows()
      // pero aquí usamos DOM (ngFor)
      language: {
        // textos en español básicos
        emptyTable: 'No hay datos disponibles',
        search: 'Buscar:',
        lengthMenu: 'Mostrar _MENU_ entradas',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ entradas',
        paginate: {
          previous: 'Anterior',
          next: 'Siguiente'
        }
      }
    });
  }

  private destroyDataTableIfExists() {
    if (this.dtInstance) {
      try {
        this.dtInstance.destroy(true);
      } catch {
        /* ignore */
      } finally {
        this.dtInstance = null;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyDataTableIfExists();
  }

  onSearch(event: Event) {
    if (!this.dtInstance) return;
    const v = (event.target as HTMLInputElement).value;
    this.dtInstance.search(v).draw();
  }
}
