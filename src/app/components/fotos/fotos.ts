import { Component } from '@angular/core';
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
    <div class="videos-container">
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
        <div class="video-card" *ngFor="let foto of fotosVisibles">
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
        <button class="add-btn" (click)="openModal()"><span>＋</span> Agregar Foto</button>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showModal"></div>

    <div class="modal" [class.show]="showModal">
      <div class="modal-content">
        <button class="close-btn" (click)="closeModal()">×</button>

        <div class="modal-header">
          <h3>Nueva Foto</h3>
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
            *ngIf="imageChangedEvent"
            [imageChangedEvent]="imageChangedEvent"
            [maintainAspectRatio]="false"
            format="jpeg"
            (imageCropped)="imageCropped($event)"
          ></image-cropper>

          <div class="summary-card" *ngIf="croppedImage">
            <h4>Vista previa</h4>
            <img [src]="croppedImage" />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
          <button
            class="btn btn-primary"
            (click)="savePhoto()"
            [disabled]="!tituloFoto || !(croppedImage || imageChangedEvent)"
          >
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
export class Fotos {
  fotos: Foto[] = [];
  currentIndex = 0;
  itemsPerPage = 3;

  showModal = false;

  tituloFoto = '';
  imageChangedEvent: any = null;
  croppedImage: string | null = null;

  // Exponer Math para usar en la plantilla
  public Math = Math;

  private idCounter = 1;

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

  openModal(): void {
    this.resetForm();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onFileChange(event: Event): void {
    // El image-cropper espera el event del input file
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64 || null;
  }

  savePhoto(): void {
    if (!this.tituloFoto) return;

    // Si ya tenemos la imagen recortada, la usamos directamente
    if (this.croppedImage) {
      this.fotos.push({
        id: this.idCounter++,
        titulo: this.tituloFoto,
        src: this.croppedImage,
      });
      this.closeModal();
      return;
    }

    // Fallback: si no hay imagen recortada, convertir el archivo seleccionado a base64
    if (this.imageChangedEvent) {
      const input = this.imageChangedEvent.target as HTMLInputElement;
      const file = input?.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.fotos.push({
          id: this.idCounter++,
          titulo: this.tituloFoto,
          src: base64,
        });
        this.closeModal();
      };
      reader.readAsDataURL(file);
    }
  }

  private resetForm(): void {
    this.tituloFoto = '';
    this.imageChangedEvent = null;
    this.croppedImage = null;
  }
}
