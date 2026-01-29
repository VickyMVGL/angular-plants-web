import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

interface Foto {
  id: number;
  titulo: string;
  src: string;
}

@Component({
  selector: 'page-fotos',
  template: `
    <div class="videos-container" (click)="closeContextMenu()">
      <h2 class="section-title">Carrusel de Fotos</h2>

      <div class="carousel-controls" *ngIf="fotos.length > 0">
        <button class="nav-btn" (click)="prev()" [disabled]="currentIndex === 0">◀ Anterior</button>

        <span class="carousel-counter">
          {{ currentIndex + 1 }} -
          {{ Math.min(currentIndex + itemsPerPage, fotos.length) }}
          / {{ fotos.length }}
        </span>

        <button
          class="nav-btn"
          (click)="next()"
          [disabled]="currentIndex + itemsPerPage >= fotos.length"
        >
          Siguiente ▶
        </button>
      </div>

      <div class="carousel" *ngIf="fotos.length > 0; else emptyState">
        <div
          class="video-card"
          *ngFor="let foto of fotosVisibles"
          (contextmenu)="openContextMenu($event, foto)"
        >
          <div class="video-header">
            <h3>{{ foto.titulo }}</h3>
          </div>

          <div class="video-wrapper">
            <img [src]="foto.src" />
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <p>No hay fotos cargadas</p>
        </div>
      </ng-template>

      <div class="add-video-section">
        <button class="add-btn" (click)="openAddModal()"><span>＋</span> Agregar Foto</button>
      </div>
    </div>

    <!-- Context menu -->
    <div
      *ngIf="contextMenuVisible"
      class="context-menu"
      [ngStyle]="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }"
      (click)="$event.stopPropagation()"
    >
      <button class="context-item" (click)="startEdit(selectedFoto)">Editar</button>
      <button class="context-item" (click)="deleteFoto(selectedFoto?.id)">Eliminar</button>
    </div>

    <div class="modal-backdrop" *ngIf="showModal"></div>

    <div class="modal" [class.show]="showModal">
      <div class="modal-content">
        <button class="close-btn" (click)="closeModal()">×</button>

        <div class="modal-header">
          <h3>{{ editingMode ? 'Editar Foto' : 'Nueva Foto' }}</h3>
          <p class="modal-subtitle">Sube, recorta y previsualiza la imagen</p>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="form-label required">Nombre de la imagen</label>
            <input class="form-control" [(ngModel)]="tituloFoto" maxlength="50" />
          </div>

          <div class="form-group">
            <label class="form-label required">Archivo JPG</label>
            <input type="file" accept="image/jpeg" (change)="onFileChange($event)" />
          </div>

          <image-cropper
            *ngIf="imageChangedEvent || imageBase64"
            [imageChangedEvent]="imageChangedEvent"
            [imageBase64]="imageBase64"
            [maintainAspectRatio]="false"
            format="jpeg"
            (imageCropped)="imageCropped($event)"
          ></image-cropper>

          <div class="summary-card" *ngIf="hasPreview()">
            <h4>Vista previa</h4>
            <img [src]="previewImage()" />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
          <button class="btn btn-primary" (click)="savePhoto()" [disabled]="!canSave()">
            Guardar
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./fotos.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ImageCropperComponent],
})
export class Fotos implements OnInit {
  fotos: Foto[] = [];
  currentIndex = 0;
  itemsPerPage = 3;

  showModal = false;

  tituloFoto = '';
  imageChangedEvent: any = null;
  imageBase64 = '';
  croppedImage = '';

  // Exponer Math para usar en la plantilla
  public Math = Math;

  private idCounter = 1;

  // Context menu / editing
  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  selectedFoto: Foto | null = null;

  editingMode = false;
  editingId: number | null = null;

  ngOnInit(): void {
    this.loadFromStorage();
  }

  get fotosVisibles(): Foto[] {
    return this.fotos.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
  }

  next(): void {
    if (this.currentIndex + this.itemsPerPage < this.fotos.length) {
      this.currentIndex += this.itemsPerPage;
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex -= this.itemsPerPage;
    }
  }

  openAddModal(): void {
    this.resetForm();
    this.editingMode = false;
    this.showModal = true;
    this.closeContextMenu();
  }

  openModalForEdit(): void {
    this.showModal = true;
    this.closeContextMenu();
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
    this.editingMode = false;
    this.editingId = null;
  }

  onFileChange(event: Event): void {
    this.imageChangedEvent = event;
    this.imageBase64 = '';
    this.croppedImage = '';
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64 || '';
  }

  hasPreview(): boolean {
    return !!this.croppedImage || !!this.imageBase64;
  }

  previewImage(): string {
    return this.croppedImage || this.imageBase64;
  }

  canSave(): boolean {
    // Para guardar necesitamos:
    // 1. Título no vacío
    // 2. Y (imagen recortada O imagen base64 O un archivo seleccionado)
    const hasImage = !!this.croppedImage || !!this.imageBase64 || !!this.imageChangedEvent;
    return !!this.tituloFoto && hasImage;
  }

  savePhoto(): void {
    if (!this.canSave()) return;

    // Determinar qué imagen usar
    let finalImage = '';

    if (this.croppedImage) {
      finalImage = this.croppedImage;
    } else if (this.imageBase64) {
      finalImage = this.imageBase64;
    } else if (this.imageChangedEvent) {
      // Si hay un archivo seleccionado pero no se ha recortado,
      // convertirlo a base64 directamente
      const input = this.imageChangedEvent.target as HTMLInputElement;
      const file = input?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          finalImage = reader.result as string;
          this.saveFotoToArray(finalImage);
        };
        reader.readAsDataURL(file);
        return; // Salir aquí porque la operación es asíncrona
      }
    }

    this.saveFotoToArray(finalImage);
  }

  private saveFotoToArray(imageSrc: string): void {
    if (!imageSrc) return;

    if (this.editingMode && this.editingId != null) {
      const idx = this.fotos.findIndex((f) => f.id === this.editingId);
      if (idx !== -1) {
        this.fotos[idx] = { ...this.fotos[idx], titulo: this.tituloFoto, src: imageSrc };
      }
    } else {
      this.fotos.push({
        id: this.idCounter++,
        titulo: this.tituloFoto,
        src: imageSrc,
      });
    }

    this.saveToStorage();
    this.closeModal();
  }

  private resetForm(): void {
    this.tituloFoto = '';
    this.imageChangedEvent = null;
    this.imageBase64 = '';
    this.croppedImage = '';
  }

  // Context menu handlers
  openContextMenu(event: MouseEvent, foto: Foto): void {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenuVisible = true;
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.selectedFoto = foto;
  }

  closeContextMenu(): void {
    this.contextMenuVisible = false;
    this.selectedFoto = null;
  }

  deleteFoto(id?: number | null): void {
    if (!id) return;
    this.fotos = this.fotos.filter((f) => f.id !== id);
    this.saveToStorage();
    this.closeContextMenu();
  }

  startEdit(foto: Foto | null): void {
    if (!foto) return;
    this.editingMode = true;
    this.editingId = foto.id;
    this.tituloFoto = foto.titulo;
    this.imageBase64 = foto.src;
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.openModalForEdit();
  }

  // Local storage persistence
  private saveToStorage(): void {
    try {
      localStorage.setItem('fotos', JSON.stringify(this.fotos));
      localStorage.setItem('fotos_idCounter', String(this.idCounter));
    } catch {
      // silenciar errores de storage
    }
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem('fotos');
      const idc = localStorage.getItem('fotos_idCounter');
      if (raw) {
        this.fotos = JSON.parse(raw) as Foto[];
      }
      if (idc) {
        const parsed = Number(idc);
        if (!Number.isNaN(parsed)) this.idCounter = parsed;
      } else {
        const maxId = this.fotos.reduce((max, f) => Math.max(max, f.id || 0), 0);
        this.idCounter = maxId + 1;
      }
    } catch {
      this.fotos = [];
      this.idCounter = 1;
    }
  }
}
