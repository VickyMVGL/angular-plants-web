import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  image: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

@Component({
  selector: 'page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- HERO / SIMPLE CAROUSEL -->
    <section class="hero" role="region" aria-label="Hero carousel">
      <div
        class="hero-slide"
        *ngFor="let slide of slides; let i = index"
        [class.active]="i === currentSlide"
      >
        <img [src]="slide.image" [alt]="slide.title" />
        <div class="hero-caption">
          <small class="eyebrow">{{ slide.eyebrow }}</small>
          <h2 class="title">{{ slide.title }}</h2>
          <p class="lead">{{ slide.subtitle }}</p>
          <div class="hero-cta">
            <button class="btn btn-primary" (click)="onBookNow()">Book Now</button>
            <button class="btn btn-outline" (click)="onLearnMore()">Learn More</button>
          </div>
        </div>
      </div>

      <div class="carousel-controls" aria-hidden="false">
        <button (click)="prev()" aria-label="Previous slide">‹</button>
        <button (click)="next()" aria-label="Next slide">›</button>
      </div>

      <div class="carousel-indicators" role="tablist">
        <button
          *ngFor="let _s of slides; let j = index"
          [class.active]="j === currentSlide"
          (click)="goTo(j)"
          aria-label="Go to slide {{ j + 1 }}"
        ></button>
      </div>
    </section>
  `,
})
export class Header implements OnInit, OnDestroy {
  menuOpen = false;

  slides: Slide[] = [
    {
      image: 'assets/img/carousel-1.jpg',
      eyebrow: 'Best Pet Services',
      title: 'Keep Your Pet Happy',
      subtitle: 'High quality pet care and grooming for your beloved friends.',
    },
    {
      image: 'assets/img/carousel-2.jpg',
      eyebrow: 'Pet Spa & Grooming',
      title: 'Pamper Your Pet',
      subtitle: 'Relaxing spa treatments and expert groomers.',
    },
  ];

  currentSlide = 0;
  private intervalId: any = null;
  readonly intervalMs = 5000;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  onGetQuote(): void {
    console.log('Get Quote clicked');
  }

  onBookNow(): void {
    console.log('Book Now clicked');
  }

  onLearnMore(): void {
    console.log('Learn More clicked');
  }

  next(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prev(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goTo(index: number): void {
    this.currentSlide = index;
    this.startAutoSlide();
  }

  private startAutoSlide(): void {
    this.stopAutoSlide();
    this.intervalId = setInterval(() => this.next(), this.intervalMs);
  }

  private stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
