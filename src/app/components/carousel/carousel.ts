import { 
  Component, 
  AfterViewInit, 
  OnDestroy, 
  Inject,
  PLATFORM_ID 
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'page-carousel',
  imports: [],
  template: `
    <div class="themed-root container-fluid p-0">
      <div id="header-carousel" class="carousel slide" data-bs-ride="carousel">
        <!-- ... mismo template que antes ... -->
      </div>
    </div>
  `,
  styleUrl: './carousel.css',
})
export class Carousel implements AfterViewInit, OnDestroy {
  private carouselInstance: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Inicializar carousel de Bootstrap
      const carouselElement = document.getElementById('header-carousel');
      if (carouselElement) {
        this.carouselInstance = new bootstrap.Carousel(carouselElement, {
          interval: 5000,
          wrap: true
        });
      }
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.carouselInstance) {
      this.carouselInstance.dispose();
    }
  }
}