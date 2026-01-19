import { Component, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface VideoItem {
  id: number;
  src: string;
  title: string;
  audios: string[];
  subtitles: string[];
  selectedAudio: number;
  selectedSubtitle: number;
  isPlaying: boolean;
  audioNames: string[];
  subtitleNames: string[];
}

@Component({
  selector: 'page-videos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="videos-container">
      <h2 class="section-title">Galería de Videos</h2>
      
      <!-- Controles de navegación -->
      <div class="carousel-controls">
        <button class="nav-btn prev-btn" (click)="prev()" [disabled]="currentIndex === 0">
          ‹ Anterior
        </button>
        
        <div class="carousel-counter">
          {{ currentIndex + 1 }} - {{ Math.min(currentIndex + 3, videos.length) }} de {{ videos.length }}
        </div>
        
        <button class="nav-btn next-btn" (click)="next()" [disabled]="currentIndex + 3 >= videos.length">
          Siguiente ›
        </button>
      </div>

      <!-- Carousel de videos -->
      <div class="carousel">
        <div class="video-card" *ngFor="let v of visibleVideos; let i = index">
          <div class="video-header">
            <h3>{{ v.title || 'Video ' + v.id }}</h3>
          </div>
          
          <div class="video-wrapper">
            <video #videoEl width="100%" height="250" preload="metadata">
              <source [src]="v.src" type="video/mp4">
              Tu navegador no soporta videos HTML5.
              
              <!-- Subtítulos -->
              <ng-container *ngFor="let subtitle of v.subtitles; let subIndex = index">
                <track 
                  kind="subtitles" 
                  [src]="subtitle" 
                  [srclang]="'es'" 
                  [label]="v.subtitleNames[subIndex] || 'Subtítulo ' + (subIndex + 1)"
                  [default]="subIndex === v.selectedSubtitle">
              </ng-container>
            </video>
            
            <!-- Controles de video personalizados -->
            <div class="video-controls">
              <button class="control-btn play-btn" (click)="togglePlay(i, v)">
                {{ v.isPlaying ? '⏸️ Pausar' : '▶️ Reproducir' }}
              </button>
              
              <div class="selectors">
                <!-- Selector de subtítulos -->
                <div class="selector-group" *ngIf="v.subtitles.length > 0">
                  <label>Subtítulos:</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="v.selectedSubtitle"
                    (change)="changeSubtitle(i, v.selectedSubtitle)">
                    <option [value]="-1">Sin subtítulos</option>
                    <option *ngFor="let subtitleName of v.subtitleNames; let idx = index" 
                            [value]="idx">
                      {{ subtitleName || 'Subtítulo ' + (idx + 1) }}
                    </option>
                  </select>
                </div>
                
                <!-- Selector de audio -->
                <div class="selector-group" *ngIf="v.audios.length > 0">
                  <label>Pista de Audio:</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="v.selectedAudio"
                    (change)="changeAudio(i, v.selectedAudio)">
                    <option *ngFor="let audioName of v.audioNames; let idx = index" 
                            [value]="idx">
                      {{ audioName || 'Audio ' + (idx + 1) }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- Información del video -->
            <div class="video-info">
              <div class="info-item" *ngIf="v.audios.length > 0">
                <span class="info-label">Pistas de audio:</span>
                <span class="info-value">{{ v.audios.length }}</span>
              </div>
              <div class="info-item" *ngIf="v.subtitles.length > 0">
                <span class="info-label">Subtítulos:</span>
                <span class="info-value">{{ v.subtitles.length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje cuando no hay videos -->
      <div *ngIf="videos.length === 0" class="empty-state">
        <p>No hay videos disponibles. ¡Agrega el primero!</p>
      </div>

      <!-- Botón para agregar video -->
      <div class="add-video-section">
        <button class="add-btn" (click)="openModal()">
          <span>+</span> Agregar Video
        </button>
      </div>

      <!-- Modal para agregar video -->
      <div class="modal-backdrop" *ngIf="showModal" (click)="closeModal()"></div>
      
      <div class="modal" [class.show]="showModal">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Agregar Nuevo Video</h3>
            <p class="modal-subtitle">Selecciona 1 video, hasta 2 pistas de audio y 2 archivos de subtítulos</p>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          
          <div class="modal-body">
            <!-- Video principal (OBLIGATORIO) -->
            <div class="form-group">
              <label class="form-label required">Video Principal</label>
              <p class="form-help">Formato: MP4, WebM, MOV. Máx: 100MB</p>
              <div class="file-upload-area" [class.has-file]="newVideo.video">
                <input 
                  type="file" 
                  class="file-input" 
                  accept="video/*" 
                  (change)="onFileChange($event, 'video')"
                  #videoInput
                >
                <div class="upload-placeholder" *ngIf="!newVideo.video">
                  <i class="upload-icon">📹</i>
                  <p>Haz clic o arrastra un video aquí</p>
                  <p class="file-types">MP4, WebM, MOV</p>
                </div>
                <div class="file-preview" *ngIf="newVideo.video">
                  <div class="file-details">
                    <i class="file-icon">📹</i>
                    <div class="file-meta">
                      <strong>{{ newVideo.video.name }}</strong>
                      <span>{{ formatFileSize(newVideo.video.size) }}</span>
                    </div>
                  </div>
                  <button type="button" class="remove-btn" (click)="removeFile('video')">
                    Eliminar
                  </button>
                </div>
              </div>
              <div class="error-message" *ngIf="errors.video">
                {{ errors.video }}
              </div>
            </div>

            <!-- Título del video -->
            <div class="form-group">
              <label class="form-label">Título del Video</label>
              <input 
                type="text" 
                class="form-control" 
                [(ngModel)]="newVideo.title"
                placeholder="Ej: Tutorial de Angular - Introducción"
                maxlength="50"
              >
              <div class="char-counter">{{ newVideo.title?.length || 0 }}/50</div>
            </div>

            <!-- Separador -->
            <div class="section-divider">
              <span>Pistas de Audio (Opcional - Máx 2)</span>
            </div>

            <!-- Pista de Audio 1 -->
            <div class="form-group">
              <label class="form-label">Pista de Audio 1</label>
              <p class="form-help">Formato: MP3, WAV, OGG</p>
              <div class="file-upload-area" [class.has-file]="newVideo.audios[0]">
                <input 
                  type="file" 
                  class="file-input" 
                  accept="audio/*" 
                  (change)="onAudioChange($event, 0)"
                  #audioInput1
                >
                <div class="upload-placeholder" *ngIf="!newVideo.audios[0]">
                  <i class="upload-icon">🔊</i>
                  <p>Audio opcional 1</p>
                  <p class="file-types">MP3, WAV, OGG</p>
                </div>
                <div class="file-preview" *ngIf="newVideo.audios[0]">
                  <div class="file-details">
                    <i class="file-icon">🔊</i>
                    <div class="file-meta">
                      <strong>{{ newVideo.audios[0].name }}</strong>
                      <span>{{ formatFileSize(newVideo.audios[0].size) }}</span>
                    </div>
                  </div>
                  <button type="button" class="remove-btn" (click)="removeAudio(0)">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            <!-- Pista de Audio 2 -->
            <div class="form-group">
              <label class="form-label">Pista de Audio 2</label>
              <p class="form-help">Formato: MP3, WAV, OGG</p>
              <div class="file-upload-area" [class.has-file]="newVideo.audios[1]">
                <input 
                  type="file" 
                  class="file-input" 
                  accept="audio/*" 
                  (change)="onAudioChange($event, 1)"
                  #audioInput2
                  [disabled]="newVideo.audios.length >= 2 && !newVideo.audios[1]"
                >
                <div class="upload-placeholder" *ngIf="!newVideo.audios[1]">
                  <i class="upload-icon">🔊</i>
                  <p>Audio opcional 2</p>
                  <p class="file-types">MP3, WAV, OGG</p>
                  <small *ngIf="newVideo.audios.length >= 2 && !newVideo.audios[1]">
                    (Límite alcanzado)
                  </small>
                </div>
                <div class="file-preview" *ngIf="newVideo.audios[1]">
                  <div class="file-details">
                    <i class="file-icon">🔊</i>
                    <div class="file-meta">
                      <strong>{{ newVideo.audios[1].name }}</strong>
                      <span>{{ formatFileSize(newVideo.audios[1].size) }}</span>
                    </div>
                  </div>
                  <button type="button" class="remove-btn" (click)="removeAudio(1)">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            <!-- Separador -->
            <div class="section-divider">
              <span>Archivos de Subtítulos (Opcional - Máx 2)</span>
            </div>

            <!-- Subtítulo 1 -->
            <div class="form-group">
              <label class="form-label">Archivo de Subtítulos 1</label>
              <p class="form-help">Formato: .vtt (WebVTT)</p>
              <div class="file-upload-area" [class.has-file]="newVideo.subtitles[0]">
                <input 
                  type="file" 
                  class="file-input" 
                  accept=".vtt,text/vtt" 
                  (change)="onSubtitleChange($event, 0)"
                  #subtitleInput1
                >
                <div class="upload-placeholder" *ngIf="!newVideo.subtitles[0]">
                  <i class="upload-icon">📝</i>
                  <p>Subtítulos opcional 1</p>
                  <p class="file-types">VTT</p>
                </div>
                <div class="file-preview" *ngIf="newVideo.subtitles[0]">
                  <div class="file-details">
                    <i class="file-icon">📝</i>
                    <div class="file-meta">
                      <strong>{{ newVideo.subtitles[0].name }}</strong>
                      <span>{{ formatFileSize(newVideo.subtitles[0].size) }}</span>
                    </div>
                  </div>
                  <button type="button" class="remove-btn" (click)="removeSubtitle(0)">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            <!-- Subtítulo 2 -->
            <div class="form-group">
              <label class="form-label">Archivo de Subtítulos 2</label>
              <p class="form-help">Formato: .vtt (WebVTT)</p>
              <div class="file-upload-area" [class.has-file]="newVideo.subtitles[1]">
                <input 
                  type="file" 
                  class="file-input" 
                  accept=".vtt,text/vtt" 
                  (change)="onSubtitleChange($event, 1)"
                  #subtitleInput2
                  [disabled]="newVideo.subtitles.length >= 2 && !newVideo.subtitles[1]"
                >
                <div class="upload-placeholder" *ngIf="!newVideo.subtitles[1]">
                  <i class="upload-icon">📝</i>
                  <p>Subtítulos opcional 2</p>
                  <p class="file-types">VTT</p>
                  <small *ngIf="newVideo.subtitles.length >= 2 && !newVideo.subtitles[1]">
                    (Límite alcanzado)
                  </small>
                </div>
                <div class="file-preview" *ngIf="newVideo.subtitles[1]">
                  <div class="file-details">
                    <i class="file-icon">📝</i>
                    <div class="file-meta">
                      <strong>{{ newVideo.subtitles[1].name }}</strong>
                      <span>{{ formatFileSize(newVideo.subtitles[1].size) }}</span>
                    </div>
                  </div>
                  <button type="button" class="remove-btn" (click)="removeSubtitle(1)">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            <!-- Resumen -->
            <div class="summary-card">
              <h4>Resumen</h4>
              <div class="summary-item">
                <span>Video:</span>
                <strong>{{ newVideo.video ? '✓ Seleccionado' : '✗ Pendiente' }}</strong>
              </div>
              <div class="summary-item">
                <span>Pistas de audio:</span>
                <strong>{{ audioCount }}/2</strong>
              </div>
              <div class="summary-item">
                <span>Archivos de subtítulos:</span>
                <strong>{{ subtitleCount }}/2</strong>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">
              Cancelar
            </button>
            <button 
              class="btn btn-primary" 
              (click)="addVideo()"
              [disabled]="!newVideo.video || isAdding"
            >
              <span *ngIf="!isAdding">Agregar Video</span>
              <span *ngIf="isAdding">Procesando...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./videos.css']
})
export class Videos {
  @ViewChildren('videoEl') videoElements!: QueryList<ElementRef<HTMLVideoElement>>;

  videos: VideoItem[] = [];
  currentIndex = 0;
  showModal = false;
  videoCounter = 1;
  isAdding = false;

  newVideo: any = {
    video: null,
    title: '',
    audios: [], // Máximo 2
    subtitles: [] // Máximo 2
  };

  errors = {
    video: '',
    audio: '',
    subtitle: ''
  };

  // Propiedad Math para usar en template
  Math = Math;

  get visibleVideos(): VideoItem[] {
    const start = this.currentIndex;
    const end = start + 3;
    return this.videos.slice(start, end);
  }

  next(): void {
    if (this.currentIndex + 3 < this.videos.length) {
      this.currentIndex += 3;
    }
  }

  prev(): void {
    if (this.currentIndex - 3 >= 0) {
      this.currentIndex -= 3;
    }
  }

  togglePlay(index: number, item: VideoItem): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return;

    if (videoElement.paused) {
      videoElement.play();
      item.isPlaying = true;
    } else {
      videoElement.pause();
      item.isPlaying = false;
    }
  }

  changeSubtitle(videoIndex: number, subtitleIndex: number): void {
    const videoElement = this.videoElements.toArray()[videoIndex]?.nativeElement;
    if (!videoElement) return;

    if (videoElement.textTracks) {
      for (let i = 0; i < videoElement.textTracks.length; i++) {
        videoElement.textTracks[i].mode = 'disabled';
      }
      
      if (subtitleIndex >= 0 && videoElement.textTracks[subtitleIndex]) {
        videoElement.textTracks[subtitleIndex].mode = 'showing';
      }
    }
  }

  changeAudio(videoIndex: number, audioIndex: number): void {
    console.log(`Cambiar audio del video ${videoIndex} a track ${audioIndex}`);
    // Nota: Cambiar audio requiere una implementación más compleja
    // ya que HTML5 video no soporta múltiples pistas de audio nativamente
  }

  openModal(): void {
    this.showModal = true;
    this.resetErrors();
  }

  closeModal(): void {
    this.showModal = false;
    this.resetNewVideo();
    this.resetErrors();
  }

  onFileChange(event: any, type: string): void {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'video') {
      // Validar video
      if (!file.type.startsWith('video/')) {
        this.errors.video = 'Por favor selecciona un archivo de video válido';
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB
        this.errors.video = 'El archivo no debe exceder los 100MB';
        return;
      }
      this.newVideo.video = file;
      this.errors.video = '';
    }
  }

  onAudioChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validar audio
    if (!file.type.startsWith('audio/')) {
      alert('Por favor selecciona un archivo de audio válido');
      return;
    }

    // Asegurar que tenemos un array de tamaño 2
    if (!this.newVideo.audios[index]) {
      this.newVideo.audios[index] = file;
    }
  }

  onSubtitleChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validar subtítulo
    if (file.type !== 'text/vtt' && !file.name.endsWith('.vtt')) {
      alert('Por favor selecciona un archivo VTT válido');
      return;
    }

    // Asegurar que tenemos un array de tamaño 2
    if (!this.newVideo.subtitles[index]) {
      this.newVideo.subtitles[index] = file;
    }
  }

  removeFile(type: string): void {
    if (type === 'video') {
      this.newVideo.video = null;
    }
  }

  removeAudio(index: number): void {
    this.newVideo.audios[index] = null;
  }

  removeSubtitle(index: number): void {
    this.newVideo.subtitles[index] = null;
  }

  addVideo(): void {
    // Validar
    if (!this.newVideo.video) {
      this.errors.video = 'Debes seleccionar un video principal';
      return;
    }

    this.isAdding = true;

    // Simular procesamiento
    setTimeout(() => {
      // Crear URLs para los archivos
      const videoURL = URL.createObjectURL(this.newVideo.video);
      
      // Filtrar archivos nulos y crear URLs
      const validAudios = this.newVideo.audios.filter((a: File | null) => a);
      const validSubtitles = this.newVideo.subtitles.filter((s: File | null) => s);
      
      const audioURLs = validAudios.map((audio: File) => URL.createObjectURL(audio));
      const subtitleURLs = validSubtitles.map((subtitle: File) => URL.createObjectURL(subtitle));

      // Agregar el video a la lista
      this.videos.push({
        id: this.videoCounter++,
        src: videoURL,
        title: this.newVideo.title || `Video ${this.videoCounter - 1}`,
        audios: audioURLs,
        subtitles: subtitleURLs,
        selectedAudio: 0,
        selectedSubtitle: subtitleURLs.length > 0 ? 0 : -1,
        isPlaying: false,
        audioNames: validAudios.map((a: File) => a.name),
        subtitleNames: validSubtitles.map((s: File) => s.name.replace('.vtt', ''))
      });

      // Limpiar y cerrar
      this.resetNewVideo();
      this.isAdding = false;
      this.closeModal();
      
      // Mostrar mensaje de éxito
      alert('✅ Video agregado exitosamente!');
    }, 1000);
  }

  private resetNewVideo(): void {
    this.newVideo = {
      video: null,
      title: '',
      audios: [null, null], // Array de tamaño 2
      subtitles: [null, null] // Array de tamaño 2
    };
  }

  private resetErrors(): void {
    this.errors = {
      video: '',
      audio: '',
      subtitle: ''
    };
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  get audioCount(): number {
    const audios = (this.newVideo && this.newVideo.audios) ? this.newVideo.audios : [];
    return audios.filter((a: any) => !!a).length;
  }

  get subtitleCount(): number {
    const subtitles = (this.newVideo && this.newVideo.subtitles) ? this.newVideo.subtitles : [];
    return subtitles.filter((s: any) => !!s).length;
  }

  // Limpiar URLs cuando el componente se destruye
  ngOnDestroy() {
    this.videos.forEach(video => {
      URL.revokeObjectURL(video.src);
      video.audios.forEach(url => URL.revokeObjectURL(url));
      video.subtitles.forEach(url => URL.revokeObjectURL(url));
    });
  }
}