import { Component, ElementRef, ViewChildren, QueryList, OnInit } from '@angular/core';
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
          {{ currentIndex + 1 }} - {{ Math.min(currentIndex + 3, videos.length) }} de
          {{ videos.length }}
        </div>

        <button
          class="nav-btn next-btn"
          (click)="next()"
          [disabled]="currentIndex + 3 >= videos.length"
        >
          Siguiente ›
        </button>
      </div>

      <!-- Carousel de videos -->
      <div class="carousel">
        <div
          class="video-card"
          *ngFor="let v of visibleVideos; let i = index"
          (contextmenu)="openContextMenu($event, v, i)"
        >
          <div class="video-header">
            <h3>{{ v.title || 'Video ' + v.id }}</h3>
          </div>

          <div class="video-wrapper">
            <video
              #videoEl
              width="100%"
              height="250"
              preload="metadata"
              (timeupdate)="onTimeUpdate(i, $event)"
              (loadedmetadata)="onLoadedMetadata(i, $event)"
            >
              <source [src]="v.src" type="video/mp4" />
              Tu navegador no soporta videos HTML5.

              <!-- Subtítulos -->
              <ng-container *ngFor="let subtitle of v.subtitles; let subIndex = index">
                <track
                  kind="subtitles"
                  [src]="subtitle"
                  [srclang]="'es'"
                  [label]="v.subtitleNames[subIndex] || 'Subtítulo ' + (subIndex + 1)"
                  [default]="subIndex === v.selectedSubtitle"
                />
              </ng-container>
            </video>

            <!-- Barra de progreso -->
            <div class="progress-bar-container">
              <div class="progress-bar" (click)="seekVideo(i, $event)">
                <div
                  class="progress-fill"
                  [style.width.%]="(v.currentTime / v.duration) * 100"
                ></div>
              </div>
              <div class="time-display">
                <span>{{ formatTime(v.currentTime) }}</span>
                <span>{{ formatTime(v.duration) }}</span>
              </div>
            </div>

            <!-- Controles de video personalizados -->
            <div class="video-controls">
              <!-- Fila superior: botones principales (mantener donde están) -->
              <div class="controls-top">
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
                  <button class="control-btn" (click)="seekToEnd(i)" title="Ir al final">⏭️</button>
                </div>
              </div>

              <!-- Fila inferior: volumen, selectores y fullscreen -->
              <div class="controls-bottom">
                <!-- Controles de volumen -->
                <div class="volume-control">
                  <button class="control-btn" (click)="toggleMute(i)" title="Silenciar">
                    {{ isMuted(i) ? '🔇' : '🔊' }}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    [value]="getVolume(i)"
                    (input)="changeVolume(i, $event)"
                    class="volume-slider"
                  />
                </div>

                <!-- Selectores -->
                <div class="selectors">
                  <!-- Selector de subtítulos -->
                  <div class="selector-group" *ngIf="v.subtitles.length > 0">
                    <label>Subtítulos:</label>
                    <select
                      class="form-select"
                      [(ngModel)]="v.selectedSubtitle"
                      (change)="changeSubtitle(i, v.selectedSubtitle)"
                    >
                      <option [value]="-1">Sin subtítulos</option>
                      <option
                        *ngFor="let subtitleName of v.subtitleNames; let idx = index"
                        [value]="idx"
                      >
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
                      (change)="changeAudio(i, v.selectedAudio)"
                    >
                      <option *ngFor="let audioName of v.audioNames; let idx = index" [value]="idx">
                        {{ audioName || 'Audio ' + (idx + 1) }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Botón fullscreen (segunda fila) -->
                <button
                  class="control-btn fullscreen-btn"
                  (click)="toggleFullscreen(i)"
                  title="Pantalla completa"
                >
                  ⛶
                </button>
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
        <button class="add-btn" (click)="openModal()"><span>+</span> Agregar Video</button>
      </div>

      <!-- Modal para agregar video -->
      <div class="modal-backdrop" *ngIf="showModal" (click)="closeModal()"></div>

      <div class="modal" [class.show]="showModal">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editMode ? 'Editar Video' : 'Agregar Nuevo Video' }}</h3>
            <p class="modal-subtitle" *ngIf="!editMode">
              Selecciona 1 video, hasta 2 pistas de audio y 2 archivos de subtítulos
            </p>
            <p class="modal-subtitle" *ngIf="editMode">
              Edita título, selecciona pista de audio/subtítulos, o reemplaza archivos
            </p>
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
                />
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
              />
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
                />
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
                </div>
              </div>
              <!-- BOTÓN ELIMINAR FUERA DEL AREA DE UPLOAD (si hay archivo para mostrar) -->
              <div class="remove-action" *ngIf="newVideo.audios[0] || audioExistsInEdited(0)">
                <button type="button" class="remove-btn" (click)="removeAudio(0)">Eliminar</button>
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
                  [disabled]="audioCount >= 2 && !newVideo.audios[1]"
                />
                <div class="upload-placeholder" *ngIf="!newVideo.audios[1]">
                  <i class="upload-icon">🔊</i>
                  <p>Audio opcional 2</p>
                  <p class="file-types">MP3, WAV, OGG</p>
                  <small *ngIf="audioCount >= 2 && !newVideo.audios[1]"> (Límite alcanzado) </small>
                </div>
                <div class="file-preview" *ngIf="newVideo.audios[1]">
                  <div class="file-details">
                    <i class="file-icon">🔊</i>
                    <div class="file-meta">
                      <strong>{{ newVideo.audios[1].name }}</strong>
                      <span>{{ formatFileSize(newVideo.audios[1].size) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="remove-action" *ngIf="newVideo.audios[1] || audioExistsInEdited(1)">
                <button type="button" class="remove-btn" (click)="removeAudio(1)">Eliminar</button>
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
                />
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
                </div>
              </div>
              <div class="remove-action" *ngIf="newVideo.subtitles[0] || subtitleExistsInEdited(0)">
                <button type="button" class="remove-btn" (click)="removeSubtitle(0)">
                  Eliminar
                </button>
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
                  [disabled]="subtitleCount >= 2 && !newVideo.subtitles[1]"
                />
                <div class="upload-placeholder" *ngIf="!newVideo.subtitles[1]">
                  <i class="upload-icon">📝</i>
                  <p>Subtítulos opcional 2</p>
                  <p class="file-types">VTT</p>
                  <small *ngIf="subtitleCount >= 2 && !newVideo.subtitles[1]">
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
                </div>
              </div>
              <div class="remove-action" *ngIf="newVideo.subtitles[1] || subtitleExistsInEdited(1)">
                <button type="button" class="remove-btn" (click)="removeSubtitle(1)">
                  Eliminar
                </button>
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
            <button class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
            <button
              class="btn btn-primary"
              (click)="editMode ? saveEditedVideo() : addVideo()"
              [disabled]="(!editMode && !newVideo.video) || isAdding"
            >
              <span *ngIf="!isAdding">{{ editMode ? 'Guardar Cambios' : 'Agregar Video' }}</span>
              <span *ngIf="isAdding">Procesando...</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Menú contextual personalizado -->
      <div
        class="context-menu"
        *ngIf="contextMenuVisible"
        [style.left.px]="contextMenuX"
        [style.top.px]="contextMenuY"
        (contextmenu)="$event.preventDefault()"
      >
        <button class="context-item" (click)="editVideoFromContext()">Editar</button>
        <button class="context-item danger" (click)="deleteVideoFromContext()">Eliminar</button>
      </div>
    </div>
  `,
  styleUrls: ['./videos.css'],
})
export class Videos implements OnInit {
  @ViewChildren('videoEl') videoElements!: QueryList<ElementRef<HTMLVideoElement>>;
  // Edit mode state
  editMode = false;
  editVideoIndex: number | null = null;

  videos: VideoItem[] = [];
  currentIndex = 0;
  showModal = false;
  videoCounter = 1;
  isAdding = false;

  // NUEVO: mapa de elementos de audio por id de video
  private audioElements: Map<number, HTMLAudioElement> = new Map();

  newVideo: any = {
    video: null,
    title: '',
    audios: [null, null], // Máximo 2
    subtitles: [null, null], // Máx 2
  };

  errors = {
    video: '',
    audio: '',
    subtitle: '',
  };

  // Propiedad Math para usar en template
  Math = Math;

  // IndexedDB constants
  private readonly IDB_NAME = 'AngularPlants_VideosDB';
  private readonly IDB_STORE = 'videos';

  // flags para indicar ranuras eliminadas en el modal (no tocar videos hasta guardar)
  deletedAudioSlots: boolean[] = [false, false];
  deletedSubtitleSlots: boolean[] = [false, false];

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

  // lifecycle: cargar persistencia
  ngOnInit(): void {
    this.loadVideosFromDB().catch((err) => {
      console.warn('No se pudieron cargar videos desde IndexedDB', err);
    });
  }

  // NUEVOS MÉTODOS PARA CONTROLES DE REPRODUCCIÓN

  togglePlay(index: number, item: VideoItem): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return;

    const globalIndex = this.currentIndex + index;

    // Si el video tiene pistas de audio adjuntas, usamos un HTMLAudioElement para reproducir audio
    const hasExternalAudio = item.audios && item.audios.length > 0 && item.selectedAudio >= 0;

    if (videoElement.paused) {
      // Reproducir
      // Mantener el video silenciado si hay audio externo para evitar solapamiento
      videoElement.muted = hasExternalAudio;
      videoElement.play().catch(() => {
        /* ignore play errors */
      });

      if (hasExternalAudio) {
        const audio = this.createOrGetAudio(item);
        if (!audio) {
          item.isPlaying = true;
          return;
        }
        // asegurar sincronía al iniciar
        try {
          audio.currentTime = videoElement.currentTime;
        } catch {
          /* ignore */
        }
        audio.volume = videoElement.volume;
        audio.play().catch(() => {
          /* ignore */
        });
      }

      item.isPlaying = true;
    } else {
      // Pausar ambos
      videoElement.pause();
      const audio = this.audioElements.get(item.id);
      if (audio) audio.pause();
      item.isPlaying = false;
    }
  }

  // helper: crea o reutiliza el elemento audio para la pista seleccionada
  private createOrGetAudio(videoItem: VideoItem): HTMLAudioElement | null {
    if (!videoItem.audios || videoItem.audios.length === 0) return null;
    const src = videoItem.audios[videoItem.selectedAudio];
    if (!src) return null;

    let audio = this.audioElements.get(videoItem.id);
    if (audio) {
      // si la src actual es distinta, reemplazarla
      if (!audio.src || !audio.src.endsWith(src)) {
        audio.pause();
        audio.src = src;
        audio.load();
      }
    } else {
      audio = new Audio(src);
      audio.preload = 'auto';
      this.audioElements.set(videoItem.id, audio);
    }

    return audio;
  }

  // Adelantar 10 segundos
  seekForward(index: number, seconds: number = 10): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return;

    const newTime = Math.min(videoElement.currentTime + seconds, videoElement.duration);
    videoElement.currentTime = newTime;
    const globalIndex = this.currentIndex + index;
    this.videos[globalIndex].currentTime = newTime;

    // sincronizar audio si existe
    const item = this.videos[globalIndex];
    const audio = this.audioElements.get(item.id);
    if (audio) {
      try {
        audio.currentTime = newTime;
      } catch {
        /* ignore */
      }
    }
  }

  // Retroceder 10 segundos
  seekBackward(index: number, seconds: number = 10): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return;

    const newTime = Math.max(videoElement.currentTime - seconds, 0);
    videoElement.currentTime = newTime;
    const globalIndex = this.currentIndex + index;
    this.videos[globalIndex].currentTime = newTime;

    const item = this.videos[globalIndex];
    const audio = this.audioElements.get(item.id);
    if (audio) {
      try {
        audio.currentTime = newTime;
      } catch {
        /* ignore */
      }
    }
  }

  // Ir al inicio (0 segundos)
  seekToStart(index: number): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return;

    videoElement.currentTime = 0;
    this.videos[this.currentIndex + index].currentTime = 0;

    const item = this.videos[this.currentIndex + index];
    const audio = this.audioElements.get(item.id);
    if (audio) {
      try {
        audio.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }

  // Ir al final (duración total)
  seekToEnd(index: number): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return;

    videoElement.currentTime = videoElement.duration;
    this.videos[this.currentIndex + index].currentTime = videoElement.duration;

    const item = this.videos[this.currentIndex + index];
    const audio = this.audioElements.get(item.id);
    if (audio) {
      try {
        audio.currentTime = videoElement.duration;
      } catch {
        /* ignore */
      }
    }
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
    const globalIndex = this.currentIndex + index;
    this.videos[globalIndex].currentTime = newTime;

    const item = this.videos[globalIndex];
    const audio = this.audioElements.get(item.id);
    if (audio) {
      try {
        audio.currentTime = newTime;
      } catch {
        /* ignore */
      }
    }
  }

  // Control de volumen
  changeVolume(index: number, event: Event): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    const input = event.target as HTMLInputElement;

    if (!videoElement) return;

    const volume = parseFloat(input.value);
    videoElement.volume = volume;

    const globalIndex = this.currentIndex + index;
    const item = this.videos[globalIndex];
    const audio = this.audioElements.get(item.id);
    if (audio) {
      audio.volume = volume;
    }
  }

  toggleMute(index: number): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return;

    const globalIndex = this.currentIndex + index;
    const item = this.videos[globalIndex];
    const audio = this.audioElements.get(item.id);

    if (audio) {
      audio.muted = !audio.muted;
    } else {
      videoElement.muted = !videoElement.muted;
    }
  }

  isMuted(index: number): boolean {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return false;

    const globalIndex = this.currentIndex + index;
    const item = this.videos[globalIndex];
    const audio = this.audioElements.get(item.id);

    return audio ? audio.muted : videoElement.muted;
  }

  getVolume(index: number): number {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return 1;

    const globalIndex = this.currentIndex + index;
    const item = this.videos[globalIndex];
    const audio = this.audioElements.get(item.id);

    return audio ? audio.volume : videoElement.volume;
  }

  // Actualizar tiempo actual
  onTimeUpdate(index: number, event: Event): void {
    const videoElement = event.target as HTMLVideoElement;
    const globalIndex = this.currentIndex + index;

    if (globalIndex < this.videos.length) {
      this.videos[globalIndex].currentTime = videoElement.currentTime;

      // Sincronizar audio con video (pequeño margen para evitar saltos constantes)
      const item = this.videos[globalIndex];
      const audio = this.audioElements.get(item.id);
      if (audio && Math.abs(audio.currentTime - videoElement.currentTime) > 0.3) {
        try {
          audio.currentTime = videoElement.currentTime;
        } catch {
          /* ignore */
        }
      }

      // Si el video llegó al final, marcar como no reproduciendo y pausar audio
      if (videoElement.currentTime >= videoElement.duration) {
        this.videos[globalIndex].isPlaying = false;
        if (audio) audio.pause();
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

  // Cambiar pista de audio: mantener la posición y estado de reproducción
  changeAudio(videoIndex: number, audioIndex: number): void {
    const globalIndex = this.currentIndex + videoIndex;
    const item = this.videos[globalIndex];
    const videoElement = this.videoElements.toArray()[videoIndex]?.nativeElement;
    if (!item || !videoElement) return;

    const currentTime = videoElement.currentTime;
    const wasPlaying = item.isPlaying;

    // Pausar audio anterior y guardar su posición para retomarla
    const prevAudio = this.audioElements.get(item.id);
    let resumeTime = currentTime;
    if (prevAudio) {
      try {
        resumeTime = prevAudio.currentTime || currentTime;
      } catch {
        resumeTime = currentTime;
      }
      prevAudio.pause();
      this.audioElements.delete(item.id);
    }

    item.selectedAudio = audioIndex;

    // Si la nueva pista existe, crearla y sincronizar usando resumeTime
    if (item.audios && item.audios.length > 0 && item.selectedAudio >= 0) {
      const audio = this.createOrGetAudio(item);
      if (audio) {
        try {
          audio.currentTime = resumeTime;
        } catch {
          /* ignore */
        }
        audio.volume = videoElement.volume;
        // si el video está reproduciéndose, reproducir el audio nuevo en la misma posición
        if (wasPlaying) {
          videoElement.muted = true;
          audio.play().catch(() => {
            /* ignore */
          });
        }
      }
    } else {
      // no hay pista externa -> asegurar que el video no esté silenciado
      videoElement.muted = false;
    }
  }

  // MÉTODOS EXISTENTES (sin cambios)
  changeSubtitle(videoIndex: number, subtitleIndex: number): void {
    const videoElement = this.videoElements.toArray()[videoIndex]?.nativeElement;
    if (!videoElement) return;

    const globalIndex = this.currentIndex + videoIndex;
    // guardar selección en el modelo
    if (globalIndex < this.videos.length) {
      this.videos[globalIndex].selectedSubtitle = subtitleIndex;
    }

    if (videoElement.textTracks) {
      // Desactivar todos primero
      for (let i = 0; i < videoElement.textTracks.length; i++) {
        videoElement.textTracks[i].mode = 'disabled';
      }

      // Si se seleccionó una pista válida, activarla
      if (subtitleIndex >= 0 && videoElement.textTracks[subtitleIndex]) {
        videoElement.textTracks[subtitleIndex].mode = 'showing';
      }
    }
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

    // Asegurar índice válido y máximo 2 pistas
    if (index < 0 || index > 1) return;

    // Siempre asignar/actualizar la pista en la posición indicada
    this.newVideo.audios[index] = file;
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
    // Marcar ranura como eliminada y borrar el valor en el formulario.
    // No tocar this.videos aquí: el cambio se aplicará al guardar.
    const entry = this.newVideo.audios && this.newVideo.audios[index];
    if (entry && (entry.url || entry instanceof File)) {
      try {
        // si era objectURL creado en el formulario, revocar
        if ((entry as any).url) URL.revokeObjectURL((entry as any).url);
        // si era File no hay objectURL asociado aquí
      } catch {}
    }

    this.newVideo.audios[index] = null;
    this.deletedAudioSlots[index] = true;
  }

  removeSubtitle(index: number): void {
    const entry = this.newVideo.subtitles && this.newVideo.subtitles[index];
    if (entry && (entry.url || entry instanceof File)) {
      try {
        if ((entry as any).url) URL.revokeObjectURL((entry as any).url);
      } catch {}
    }

    this.newVideo.subtitles[index] = null;
    this.deletedSubtitleSlots[index] = true;
  }

  addVideo(): void {
    if (!this.newVideo.video) {
      this.errors.video = 'Debes seleccionar un video principal';
      return;
    }

    this.isAdding = true;

    setTimeout(async () => {
      const videoFile = this.newVideo.video as File;
      const validAudios = (this.newVideo.audios || []).filter((a: File | null) => a) as File[];
      const validSubtitles = (this.newVideo.subtitles || []).filter(
        (s: File | null) => s,
      ) as File[];

      const videoURL = URL.createObjectURL(videoFile);
      const audioURLs = validAudios.map((audio: File) => URL.createObjectURL(audio));
      const subtitleURLs = validSubtitles.map((subtitle: File) => URL.createObjectURL(subtitle));

      const id = this.videoCounter++;

      this.videos.push({
        id,
        src: videoURL,
        title: this.newVideo.title || `Video ${id}`,
        audios: audioURLs,
        subtitles: subtitleURLs,
        selectedAudio: audioURLs.length > 0 ? 0 : -1,
        selectedSubtitle: subtitleURLs.length > 0 ? 0 : -1,
        isPlaying: false,
        audioNames: validAudios.map((a: File) => a.name),
        subtitleNames: validSubtitles.map((s: File) => s.name.replace('.vtt', '')),
        duration: 0,
        currentTime: 0,
      });

      // Persistir en IndexedDB (Files/Blobs se pueden clonar en IDB)
      try {
        await this.saveVideoToDB({
          id,
          title: this.newVideo.title || `Video ${id}`,
          video: videoFile,
          audios: validAudios,
          subtitles: validSubtitles,
          audioNames: validAudios.map((a: File) => a.name),
          subtitleNames: validSubtitles.map((s: File) => s.name),
          selectedAudio: audioURLs.length > 0 ? 0 : -1,
          selectedSubtitle: subtitleURLs.length > 0 ? 0 : -1,
          duration: 0,
          currentTime: 0,
        });
      } catch (e) {
        console.warn('No se pudo guardar video en IndexedDB', e);
      }

      this.resetNewVideo();
      this.isAdding = false;
      this.closeModal();

      alert('✅ Video agregado exitosamente!');
    }, 1000);
  }

  // Editar: abrir modal en modo edición con los datos actuales
  editVideoFromContext(): void {
    if (this.contextMenuIndex == null) {
      this.closeContextMenu();
      return;
    }
    const idx = this.contextMenuIndex;
    this.openEditModal(idx);
    this.closeContextMenu();
  }

  // Abre modal en modo edición y prellena newVideo con metadatos existentes
  openEditModal(globalIndex: number): void {
    const item = this.videos[globalIndex];
    if (!item) return;

    this.editMode = true;
    this.editVideoIndex = globalIndex;
    // Prellenar campos de newVideo para permitir reemplazos o dejar como están
    this.newVideo = {
      video: null, // permitir reemplazar video si se desea
      title: item.title || '',
      // Para audios/subtitles guardamos objetos con url/name si no se reemplazan
      audios: (item.audios || []).map((url, i) => ({
        url,
        name: item.audioNames && item.audioNames[i] ? item.audioNames[i] : `Audio ${i + 1}`,
      })),
      subtitles: (item.subtitles || []).map((url, i) => ({
        url,
        name:
          item.subtitleNames && item.subtitleNames[i]
            ? item.subtitleNames[i]
            : `Subtítulo ${i + 1}`,
      })),
      selectedAudio: item.selectedAudio,
      selectedSubtitle: item.selectedSubtitle,
    };

    this.resetErrors();
    this.showModal = true;
  }

  // Recupera registro desde IndexedDB (si existe) para mantener blobs cuando no se reemplazan
  private getVideoRecordFromDB(id: number): Promise<any | null> {
    return new Promise(async (resolve) => {
      try {
        const db = await this.openIdb();
        const tx = db.transaction(this.IDB_STORE, 'readonly');
        const store = tx.objectStore(this.IDB_STORE);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  // Guardar cambios del modo edición: actualiza UI e IndexedDB (si existe)
  async saveEditedVideo(): Promise<void> {
    if (this.editVideoIndex == null) return;
    this.isAdding = true;
    const idx = this.editVideoIndex;
    const item = this.videos[idx];
    if (!item) {
      this.isAdding = false;
      return;
    }

    try {
      const originalRec = await this.getVideoRecordFromDB(item.id);

      // Preparar audios/subtitles: pueden ser File (reemplazo), objeto {url,name} (mantener) o null (eliminar)
      const updatedAudioURLs: (string | undefined)[] = [];
      const updatedAudioNames: (string | undefined)[] = [];
      const updatedAudioBlobs: (Blob | undefined)[] =
        originalRec && originalRec.audios ? [...originalRec.audios] : [];

      const auds = this.newVideo.audios || [];
      let audioChanged = false;
      for (let i = 0; i < Math.max(auds.length, item.audios.length || 0); i++) {
        const a = auds[i];
        // si el usuario marcó la ranura como eliminada en el modal -> forzar eliminación
        if (this.deletedAudioSlots[i]) {
          audioChanged = true;
          updatedAudioURLs[i] = undefined;
          updatedAudioNames[i] = undefined;
          updatedAudioBlobs[i] = undefined;
          continue;
        }
        if (a instanceof File) {
          audioChanged = true;
          // reemplazar: revocar URL antigua y crear nueva
          if (item.audios && item.audios[i]) {
            try {
              URL.revokeObjectURL(item.audios[i]);
            } catch {}
          }
          const url = URL.createObjectURL(a);
          updatedAudioURLs[i] = url;
          updatedAudioNames[i] = a.name;
          updatedAudioBlobs[i] = a;
        } else if (a && a.url) {
          // mantener la existencia (no es un File nuevo)
          updatedAudioURLs[i] = a.url;
          updatedAudioNames[i] = a.name;
          // mantener blob existente (updatedAudioBlobs[i] ya contiene el blob desde originalRec si existe)
        } else if (a === null) {
          // eliminación explícita
          audioChanged = true;
          if (item.audios && item.audios[i]) {
            try {
              URL.revokeObjectURL(item.audios[i]);
            } catch {}
          }
          updatedAudioURLs[i] = undefined;
          updatedAudioNames[i] = undefined;
          updatedAudioBlobs[i] = undefined; // marcar para eliminar en DB
        } else {
          // si no hay nada nuevo y no existía antes, queda undefined
          updatedAudioURLs[i] = updatedAudioURLs[i];
        }
      }

      const updatedSubtitleURLs: (string | undefined)[] = [];
      const updatedSubtitleNames: (string | undefined)[] = [];
      const updatedSubtitleBlobs: (Blob | undefined)[] =
        originalRec && originalRec.subtitles ? [...originalRec.subtitles] : [];

      const subs = this.newVideo.subtitles || [];
      let subtitleChanged = false;
      for (let i = 0; i < Math.max(subs.length, item.subtitles.length || 0); i++) {
        const s = subs[i];
        // si el usuario marcó la ranura como eliminada en el modal -> forzar eliminación
        if (this.deletedSubtitleSlots[i]) {
          subtitleChanged = true;
          updatedSubtitleURLs[i] = undefined;
          updatedSubtitleNames[i] = undefined;
          updatedSubtitleBlobs[i] = undefined;
          continue;
        }
        if (s instanceof File) {
          subtitleChanged = true;
          if (item.subtitles && item.subtitles[i]) {
            try {
              URL.revokeObjectURL(item.subtitles[i]);
            } catch {}
          }
          const url = URL.createObjectURL(s);
          updatedSubtitleURLs[i] = url;
          updatedSubtitleNames[i] = s.name.replace('.vtt', '');
          updatedSubtitleBlobs[i] = s;
        } else if (s && s.url) {
          updatedSubtitleURLs[i] = s.url;
          updatedSubtitleNames[i] = s.name;
        } else if (s === null) {
          subtitleChanged = true;
          if (item.subtitles && item.subtitles[i]) {
            try {
              URL.revokeObjectURL(item.subtitles[i]);
            } catch {}
          }
          updatedSubtitleURLs[i] = undefined;
          updatedSubtitleNames[i] = undefined;
          updatedSubtitleBlobs[i] = undefined;
        } else {
          updatedSubtitleURLs[i] = updatedSubtitleURLs[i];
        }
      }

      // Construir arrays finales filtrando entradas eliminadas (undefined)
      const finalAudioURLs = updatedAudioURLs.filter((u): u is string => !!u);
      const finalAudioNames = updatedAudioNames.filter((n): n is string => !!n);
      const finalAudioBlobs = updatedAudioBlobs.filter((b) => b !== undefined) as Blob[];

      const finalSubtitleURLs = updatedSubtitleURLs.filter((u): u is string => !!u);
      const finalSubtitleNames = updatedSubtitleNames.filter((n): n is string => !!n);
      const finalSubtitleBlobs = updatedSubtitleBlobs.filter((b) => b !== undefined) as Blob[];

      // Actualizar el objeto en memoria solo si hubo cambios; si no, conservar los valores actuales
      if (audioChanged) {
        item.audios = finalAudioURLs;
        item.audioNames = finalAudioNames;
        // asegurar selección válida
        if (!item.audios || item.audios.length === 0) item.selectedAudio = -1;
        else if (item.selectedAudio >= item.audios.length) item.selectedAudio = 0;
      } else {
        // si no hubo cambios, mantener item.audios / audioNames tal cual
      }

      if (subtitleChanged) {
        item.subtitles = finalSubtitleURLs;
        item.subtitleNames = finalSubtitleNames;
        if (!item.subtitles || item.subtitles.length === 0) item.selectedSubtitle = -1;
        else if (item.selectedSubtitle >= item.subtitles.length) item.selectedSubtitle = 0;
      }

      item.title = this.newVideo.title || item.title;
      item.selectedAudio =
        typeof this.newVideo.selectedAudio === 'number'
          ? this.newVideo.selectedAudio
          : item.selectedAudio;
      item.selectedSubtitle =
        typeof this.newVideo.selectedSubtitle === 'number'
          ? this.newVideo.selectedSubtitle
          : item.selectedSubtitle;

      // Actualizar IndexedDB: combinar blobs del original con reemplazos / eliminaciones
      const recordToSave: any = originalRec || { id: item.id };
      recordToSave.title = item.title;
      recordToSave.selectedAudio = item.selectedAudio;
      recordToSave.selectedSubtitle = item.selectedSubtitle;
      recordToSave.audioNames = item.audioNames || [];
      recordToSave.subtitleNames = item.subtitleNames || [];

      // Si hubo cambios, reemplazar arrays de blobs en el registro; si no, mantener original
      if (audioChanged) {
        recordToSave.audios = finalAudioBlobs;
      }
      if (subtitleChanged) {
        recordToSave.subtitles = finalSubtitleBlobs;
      }

      try {
        await this.saveVideoToDB(recordToSave);
      } catch {
        /* ignore db save errors */
      }
    } finally {
      this.isAdding = false;
      this.editMode = false;
      this.editVideoIndex = null;
      this.resetNewVideo();
      this.closeModal();
      alert('✅ Cambios guardados correctamente');
    }
  }

  private resetNewVideo(): void {
    this.newVideo = {
      video: null,
      title: '',
      audios: [null, null],
      subtitles: [null, null],
    };
    // resetear flags de eliminación
    this.deletedAudioSlots = [false, false];
    this.deletedSubtitleSlots = [false, false];
  }

  private resetErrors(): void {
    this.errors = {
      video: '',
      audio: '',
      subtitle: '',
    };
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Agregado: formatea segundos a "MM:SS" o "H:MM:SS"
  formatTime(seconds: number | null | undefined): string {
    if (seconds == null || !isFinite(seconds) || seconds <= 0) {
      return '00:00';
    }
    const total = Math.floor(seconds);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const mm = m.toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  }

  get audioCount(): number {
    const audios = this.newVideo && this.newVideo.audios ? this.newVideo.audios : [];
    return audios.filter((a: any) => !!a).length;
  }

  get subtitleCount(): number {
    const subtitles = this.newVideo && this.newVideo.subtitles ? this.newVideo.subtitles : [];
    return subtitles.filter((s: any) => !!s).length;
  }

  // Helpers para evitar accesos directos potencialmente undefined en el template
  audioExistsInEdited(index: number): boolean {
    return (
      this.editMode &&
      typeof this.editVideoIndex === 'number' &&
      !!this.videos &&
      !!this.videos[this.editVideoIndex] &&
      Array.isArray(this.videos[this.editVideoIndex].audios) &&
      this.videos[this.editVideoIndex].audios.length > index
    );
  }

  subtitleExistsInEdited(index: number): boolean {
    return (
      this.editMode &&
      typeof this.editVideoIndex === 'number' &&
      !!this.videos &&
      !!this.videos[this.editVideoIndex] &&
      Array.isArray(this.videos[this.editVideoIndex].subtitles) &&
      this.videos[this.editVideoIndex].subtitles.length > index
    );
  }

  ngOnDestroy() {
    // detener y limpiar audios creados
    this.audioElements.forEach((audio) => {
      try {
        audio.pause();
      } catch {}
    });
    this.audioElements.clear();

    this.videos.forEach((video) => {
      try {
        URL.revokeObjectURL(video.src);
      } catch {}
      video.audios.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      });
      video.subtitles.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      });
    });
  }

  // Añadido: abrir/cerrar fullscreen sobre el elemento <video>
  toggleFullscreen(index: number): void {
    const videoElement = this.videoElements.toArray()[index]?.nativeElement;
    if (!videoElement) return;

    const doc: any = document;
    const isFullscreen = !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );

    if (isFullscreen) {
      if (doc.exitFullscreen) doc.exitFullscreen().catch(() => {});
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
      else if (doc.msExitFullscreen) doc.msExitFullscreen();
    } else {
      const el: any = videoElement;
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    }
  }

  // CONTEXT MENU STATE
  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuVideoId: number | null = null;
  contextMenuIndex: number | null = null;

  // handler reference para remover listener global
  private windowClickHandler = (e: Event) => this.closeContextMenu();

  // Abrir menú contextual al hacer click derecho sobre una tarjeta de video
  openContextMenu(event: MouseEvent, video: VideoItem, index: number): void {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMenuVideoId = video.id;
    this.contextMenuIndex = this.currentIndex + index;

    // cerrar cuando se haga click en cualquier parte
    window.addEventListener('click', this.windowClickHandler);
  }

  closeContextMenu(): void {
    this.contextMenuVisible = false;
    this.contextMenuVideoId = null;
    this.contextMenuIndex = null;
    window.removeEventListener('click', this.windowClickHandler);
  }

  // Borrar video desde menú contextual
  deleteVideoFromContext(): void {
    if (this.contextMenuIndex == null) {
      this.closeContextMenu();
      return;
    }
    const idx = this.contextMenuIndex;
    const item = this.videos[idx];
    if (!item) {
      this.closeContextMenu();
      return;
    }

    // Confirmación
    const ok = confirm(`¿Eliminar "${item.title || 'este video'}"? Esta acción es irreversible.`);
    if (!ok) {
      this.closeContextMenu();
      return;
    }

    // Remover recursos de memoria (object URLs)
    try {
      URL.revokeObjectURL(item.src);
    } catch {}
    (item.audios || []).forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    });
    (item.subtitles || []).forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    });

    // Detener y remover audio asociado si existe
    const audio = this.audioElements.get(item.id);
    if (audio) {
      try {
        audio.pause();
      } catch {}
      this.audioElements.delete(item.id);
    }

    // Remover del array y de IndexedDB
    this.videos.splice(idx, 1);
    this.deleteVideoFromDB(item.id).catch(() => {
      // ignore DB errors
    });

    this.closeContextMenu();
  }

  // ---------- IndexedDB helpers ----------
  private openIdb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB no disponible'));
        return;
      }
      const req = indexedDB.open(this.IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.IDB_STORE)) {
          db.createObjectStore(this.IDB_STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  private saveVideoToDB(record: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.openIdb();
        const tx = db.transaction(this.IDB_STORE, 'readwrite');
        const store = tx.objectStore(this.IDB_STORE);
        store.put(record);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  private saveVideoMetadataToDB(id: number, metadata: Partial<any>): Promise<void> {
    return new Promise(async (resolve) => {
      try {
        const db = await this.openIdb();
        const tx = db.transaction(this.IDB_STORE, 'readwrite');
        const store = tx.objectStore(this.IDB_STORE);
        const getReq = store.get(id);
        getReq.onsuccess = () => {
          const rec = getReq.result;
          if (rec) {
            const updated = { ...rec, ...metadata };
            store.put(updated);
          }
        };
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  private deleteVideoFromDB(id: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.openIdb();
        const tx = db.transaction(this.IDB_STORE, 'readwrite');
        const store = tx.objectStore(this.IDB_STORE);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  private loadVideosFromDB(): Promise<void> {
    return new Promise(async (resolve) => {
      try {
        const db = await this.openIdb();
        const tx = db.transaction(this.IDB_STORE, 'readonly');
        const store = tx.objectStore(this.IDB_STORE);
        const req = store.getAll();
        req.onsuccess = () => {
          const items = req.result || [];
          let maxId = this.videoCounter;
          items.forEach((it: any) => {
            const videoBlob: Blob | undefined = it.video;
            const audioBlobs: Blob[] = it.audios || [];
            const subtitleBlobs: Blob[] = it.subtitles || [];

            const videoURL = videoBlob ? URL.createObjectURL(videoBlob) : '';
            const audioURLs = (audioBlobs || []).map((b: Blob) => URL.createObjectURL(b));
            const subtitleURLs = (subtitleBlobs || []).map((b: Blob) => URL.createObjectURL(b));

            const id = it.id;
            this.videos.push({
              id,
              src: videoURL,
              title: it.title || `Video ${id}`,
              audios: audioURLs,
              subtitles: subtitleURLs,
              selectedAudio:
                typeof it.selectedAudio === 'number'
                  ? it.selectedAudio
                  : audioURLs.length > 0
                    ? 0
                    : -1,
              selectedSubtitle:
                typeof it.selectedSubtitle === 'number'
                  ? it.selectedSubtitle
                  : subtitleURLs.length > 0
                    ? 0
                    : -1,
              isPlaying: false,
              audioNames: it.audioNames || [],
              subtitleNames: it.subtitleNames || [],
              duration: it.duration || 0,
              currentTime: it.currentTime || 0,
            });

            if (id >= maxId) maxId = id + 1;
          });
          this.videoCounter = maxId;
          resolve();
        };
        req.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
}
