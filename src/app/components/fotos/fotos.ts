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
            <input type="file" accept="image/jpeg" (change)="onFileChange($event)" #fileInput />
          </div>

          <div *ngIf="showCropper" class="cropper-container">
            <image-cropper
              #cropper
              [imageChangedEvent]="cropperEvent"
              [imageBase64]="imageBase64"
              [maintainAspectRatio]="false"
              format="jpeg"
              (imageCropped)="imageCropped($event)"
            ></image-cropper>

            <div class="cropper-actions">
              <button class="btn btn-primary" (click)="captureCrop()">Capturar Recorte</button>
            </div>
          </div>

          <div class="preview-container" *ngIf="hasPreview()">
            <h4>Vista previa</h4>
            <div class="image-comparison">
              <div class="image-section">
                <h5>Original</h5>
                <img [src]="imageBase64" class="preview-image" />
              </div>
              <div class="image-section" *ngIf="croppedImage">
                <h5>Recortada</h5>
                <img [src]="croppedImage" class="preview-image" />
                <button
                  class="btn btn-success btn-sm"
                  (click)="useCroppedImage()"
                  style="margin-top: 10px;"
                >
                  Usar esta imagen
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
          <button class="btn btn-primary" (click)="savePhoto()" [disabled]="!canSave()">
            {{ editingMode ? 'Actualizar Foto' : 'Guardar Foto' }}
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
  cropperEvent: any = null;
  imageBase64 = '';
  croppedImage = '';
  showCropper = false;

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
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      this.cropperEvent = event;
      this.showCropper = true;

      // Convertir a base64 para vista previa
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result && typeof result === 'string') {
          this.imageBase64 = result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  imageCropped(event: ImageCroppedEvent): void {
    // Este evento se dispara cuando el usuario termina de recortar
    if (event.base64) {
      this.croppedImage = event.base64;
    }
  }

  captureCrop(): void {
    // Forzar la captura del recorte actual
    // Nota: En realidad, imageCropped ya se dispara automáticamente
    // Este botón es solo para asegurarnos
    console.log('Recorte capturado manualmente');
  }

  useCroppedImage(): void {
    // Usar la imagen recortada como definitiva
    this.imageBase64 = this.croppedImage;
  }

  hasPreview(): boolean {
    return !!this.imageBase64;
  }

  canSave(): boolean {
    return !!this.tituloFoto && !!this.imageBase64;
  }

  savePhoto(): void {
    if (!this.canSave()) return;

    if (this.editingMode && this.editingId != null) {
      const idx = this.fotos.findIndex((f) => f.id === this.editingId);
      if (idx !== -1) {
        this.fotos[idx] = { ...this.fotos[idx], titulo: this.tituloFoto, src: this.imageBase64 };
      }
    } else {
      this.fotos.push({
        id: this.idCounter++,
        titulo: this.tituloFoto,
        src: this.imageBase64,
      });
    }

    this.saveToStorage();
    this.closeModal();
  }

  private resetForm(): void {
    this.tituloFoto = '';
    this.cropperEvent = null;
    this.imageBase64 = '';
    this.croppedImage = '';
    this.showCropper = false;
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
    this.cropperEvent = null;
    this.croppedImage = '';
    this.showCropper = true;
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
