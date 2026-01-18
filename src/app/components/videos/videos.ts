import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface VideoItem {
  src: string;
  audios: string[];
  subtitles: string[];
  selectedAudio: number;
  selectedSubtitle: number;
  isPlaying: boolean;
}

@Component({
  selector: 'page-videos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="carousel">
      <button (click)="prev()">‹</button>

      <div class="video-card" *ngFor="let v of visibleVideos">
        <video #video>
          <source [src]="v.src" type="video/mp4">

          <ng-container *ngFor="let s of v.subtitles; let i = index">
            <track kind="subtitles" [src]="s" srclang="es" />
          </ng-container>
        </video>

        <div class="controls">
          <button (click)="togglePlay(video, v)">
            {{ v.isPlaying ? 'Pause' : 'Play' }}
          </button>

          <select (change)="changeSubtitle(video, v, $event)">
            <option *ngFor="let s of v.subtitles; let i = index" [value]="i">
              Sub {{ i + 1 }}
            </option>
          </select>
        </div>
      </div>

      <button (click)="next()">›</button>
    </div>

    <button class="add-btn" (click)="openModal()">Agregar video</button>

    <!-- MODAL -->
    <div class="modal" [@If]="showModal">
      <div class="modal-content">
        <h3>Agregar Video</h3>

        <input type="file" accept="video/*" (change)="onFileChange($event,'video')">
        <input type="file" accept="audio/*" multiple (change)="onFileChange($event,'audio')">
        <input type="file" accept=".vtt" multiple (change)="onFileChange($event,'subtitle')">

        <div class="modal-actions">
          <button (click)="addVideo()">Guardar</button>
          <button (click)="closeModal()">Cancelar</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./videos.css']
})
export class Videos {

  videos: VideoItem[] = [];
  currentIndex = 0;
  showModal = false;

  newVideo: any = {
    video: null,
    audios: [],
    subtitles: []
  };

  get visibleVideos(): VideoItem[] {
    return this.videos.slice(this.currentIndex, this.currentIndex + 3);
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

  togglePlay(video: HTMLVideoElement, item: VideoItem): void {
    if (video.paused) {
      video.play();
      item.isPlaying = true;
    } else {
      video.pause();
      item.isPlaying = false;
    }
  }

  changeSubtitle(video: HTMLVideoElement, item: VideoItem, event: Event): void {
    const index = Number((event.target as HTMLSelectElement).value);
    Array.from(video.textTracks).forEach((track, i) => {
      track.mode = i === index ? 'showing' : 'disabled';
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.newVideo = { video: null, audios: [], subtitles: [] };
  }

  onFileChange(event: any, type: string): void {
    const files = event.target.files;
    if (type === 'video') this.newVideo.video = files[0];
    if (type === 'audio') this.newVideo.audios = Array.from(files);
    if (type === 'subtitle') this.newVideo.subtitles = Array.from(files);
  }

  addVideo(): void {
    if (!this.newVideo.video) return;

    const videoURL = URL.createObjectURL(this.newVideo.video);
    const subtitleURLs = this.newVideo.subtitles.map((s: any) =>
      URL.createObjectURL(s)
    );

    this.videos.push({
      src: videoURL,
      audios: [],
      subtitles: subtitleURLs,
      selectedAudio: 0,
      selectedSubtitle: 0,
      isPlaying: false
    });

    this.closeModal();
  }
}
