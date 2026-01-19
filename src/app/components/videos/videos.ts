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
  duration: number;
  currentTime: number;
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
            <video #videoEl 
                   width="100%" 
                   height="250" 
                   preload="metadata"
                   (timeupdate)="onTimeUpdate(i, $event)"
                   (loadedmetadata)="onLoadedMetadata(i, $event)">
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
            
            <!-- Barra de progreso -->
            <div class="progress-bar-container">
              <div class="progress-bar" (click)="seekVideo(i, $event)">
                <div class="progress-fill" [style.width.%]="(v.currentTime / v.duration) * 100"></div>
              </div>
              <div class="time-display">
                <span>{{ formatTime(v.currentTime) }}</span>
                <span>{{ formatTime(v.duration) }}</span>
              </div>
            </div>
            
            <!-- Controles de video personalizados -->
            <div class="video-controls">
              <!-- Controles principales -->
              <div class="main-controls">
                <button class="control-btn" (click)="seekToStart(i)" title="Ir al inicio">
                  ⏮️
                </button>
                <button class="control-btn" (click)="seekBackward(i, 10)" title="Retroceder 10s">
                  ⏪
                </button>
                <button class="control-btn play-btn" (click)="togglePlay(i, v)">
                  {{ v.isPlaying ? '⏸️' : '▶️' }}
                </button>
                <button class="control-btn" (click)="seekForward(i, 10)" title="Adelantar 10s">
                  ⏩
                </button>
                <button class="control-btn" (click)="seekToEnd(i)" title="Ir al final">
                  ⏭️
                </button>
              </div>
              
              <!-- Controles de volumen -->
              <div class="volume-control">
                <button class="control-btn" (click)="toggleMute(i)" title="Silenciar">
                  {{ isMuted(i) ? '🔇' : '🔊' }}
                </button>
                <input type="range" 
                       min="0" 
                       max="1" 
                       step="0.1" 
                       [value]="getVolume(i)"
                       (input)="changeVolume(i, $event)"
                       class="volume-slider">
              </div>
              
              <!-- Selectores -->
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
              <div class="info-item">
                <span class="info-label">Duración:</span>
                <span class="info-value">{{ formatTime(v.duration) }}</span>
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

  // NUEVOS MÉTODOS PARA CONTROLES DE REPRODUCCIÓN

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

  // Adelantar 10 segundos
  seekForward(index: number, seconds: number = 10): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return;

    const newTime = Math.min(videoElement.currentTime + seconds, videoElement.duration);
    videoElement.currentTime = newTime;
    this.videos[this.currentIndex + index].currentTime = newTime;
  }

  // Retroceder 10 segundos
  seekBackward(index: number, seconds: number = 10): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return;

    const newTime = Math.max(videoElement.currentTime - seconds, 0);
    videoElement.currentTime = newTime;
    this.videos[this.currentIndex + index].currentTime = newTime;
  }

  // Ir al inicio (0 segundos)
  seekToStart(index: number): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return;

    videoElement.currentTime = 0;
    this.videos[this.currentIndex + index].currentTime = 0;
  }

  // Ir al final (duración total)
  seekToEnd(index: number): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return;

    videoElement.currentTime = videoElement.duration;
    this.videos[this.currentIndex + index].currentTime = videoElement.duration;
  }

  // Buscar posición específica en la barra de progreso
  seekVideo(index: number, event: MouseEvent): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    const progressBar = event.currentTarget as HTMLElement;
    
    if (!videoElement || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const newTime = percent * videoElement.duration;
    
    videoElement.currentTime = newTime;
    this.videos[this.currentIndex + index].currentTime = newTime;
  }

  // Control de volumen
  changeVolume(index: number, event: Event): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    const input = event.target as HTMLInputElement;
    
    if (!videoElement) return;
    
    videoElement.volume = parseFloat(input.value);
  }

  toggleMute(index: number): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return;
    
    videoElement.muted = !videoElement.muted;
  }

  isMuted(index: number): boolean {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    return videoElement ? videoElement.muted : false;
  }

  getVolume(index: number): number {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    return videoElement ? videoElement.volume : 1;
  }

  // Actualizar tiempo actual
  onTimeUpdate(index: number, event: Event): void {
    const videoElement = event.target as HTMLVideoElement;
    const globalIndex = this.currentIndex + index;
    
    if (globalIndex < this.videos.length) {
      this.videos[globalIndex].currentTime = videoElement.currentTime;
      
      // Si el video llegó al final, marcar como no reproduciendo
      if (videoElement.currentTime >= videoElement.duration) {
        this.videos[globalIndex].isPlaying = false;
      }
    }
  }

  // Cuando se carga la metadata del video
  onLoadedMetadata(index: number, event: Event): void {
    const videoElement = event.target as HTMLVideoElement;
    const globalIndex = this.currentIndex + index;
    
    if (globalIndex < this.videos.length) {
      this.videos[globalIndex].duration = videoElement.duration;
    }
  }

  // Formatear tiempo (MM:SS)
  formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds === 0) return '00:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // MÉTODOS EXISTENTES (sin cambios)
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
      if (!file.type.startsWith('video/')) {
        this.errors.video = 'Por favor selecciona un archivo de video válido';
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
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

    if (!file.type.startsWith('audio/')) {
      alert('Por favor selecciona un archivo de audio válido');
      return;
    }

    if (!this.newVideo.audios[index]) {
      this.newVideo.audios[index] = file;
    }
  }

  onSubtitleChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/vtt' && !file.name.endsWith('.vtt')) {
      alert('Por favor selecciona un archivo VTT válido');
      return;
    }

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
    if (!this.newVideo.video) {
      this.errors.video = 'Debes seleccionar un video principal';
      return;
    }

    this.isAdding = true;

    setTimeout(() => {
      const videoURL = URL.createObjectURL(this.newVideo.video);
      
      const validAudios = this.newVideo.audios.filter((a: File | null) => a);
      const validSubtitles = this.newVideo.subtitles.filter((s: File | null) => s);
      
      const audioURLs = validAudios.map((audio: File) => URL.createObjectURL(audio));
      const subtitleURLs = validSubtitles.map((subtitle: File) => URL.createObjectURL(subtitle));

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
        subtitleNames: validSubtitles.map((s: File) => s.name.replace('.vtt', '')),
        duration: 0,
        currentTime: 0
      });

      this.resetNewVideo();
      this.isAdding = false;
      this.closeModal();
      
      alert('✅ Video agregado exitosamente!');
    }, 1000);
  }

  private resetNewVideo(): void {
    this.newVideo = {
      video: null,
      title: '',
      audios: [null, null],
      subtitles: [null, null]
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

  ngOnDestroy() {
    this.videos.forEach(video => {
      URL.revokeObjectURL(video.src);
      video.audios.forEach(url => URL.revokeObjectURL(url));
      video.subtitles.forEach(url => URL.revokeObjectURL(url));
    });
  }
}