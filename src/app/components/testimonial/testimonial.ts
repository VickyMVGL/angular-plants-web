import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'page-testimonial',
  imports: [CommonModule],
  template: `
    <div class="testimonial-section">
      <div class="container">
        <div class="text-center mb-5">
          <h4 class="text-secondary mb-3">Testimonials</h4>
          <h1 class="display-4 m-0">What Our Clients <span class="text-primary">Say</span></h1>
        </div>

        <div class="testimonial-carousel">
          <div
            class="testimonial-item"
            *ngFor="let testimonial of testimonials; let i = index"
            [class.active]="currentIndex === i"
          >
            <div class="testimonial-card">
              <div class="testimonial-content">
                <p class="testimonial-text">"{{ testimonial.text }}"</p>
                <div class="testimonial-author">
                  <h5 class="author-name">{{ testimonial.name }}</h5>
                  <span class="author-role">{{ testimonial.role }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="carousel-controls">
          <button class="control-btn" (click)="prev()">‹</button>

          <div class="indicators">
            <span
              *ngFor="let testimonial of testimonials; let i = index"
              class="indicator"
              [class.active]="currentIndex === i"
              (click)="goToSlide(i)"
            ></span>
          </div>

          <button class="control-btn" (click)="next()">›</button>
        </div>
      </div>
    </div>
  `,
})
export class Testimonial {
  testimonials = [
    {
      name: 'María González',
      role: 'Dog Owner',
      text: 'Excelente servicio para mi labrador. El equipo es muy profesional y cariñoso con las mascotas. Mi perro siempre vuelve contento y bien cuidado después de cada visita.',
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Cat Lover',
      text: 'Llevo a mis dos gatos regularmente y siempre reciben la mejor atención. Los veterinarios son muy cuidadosos y el grooming es de primera calidad. Totalmente recomendado.',
    },
    {
      name: 'Ana Martínez',
      role: 'Pet Sitter',
      text: 'Como cuidadora profesional, confío plenamente en este centro. Sus estándares de higiene y cuidado son excepcionales. Siempre recomiendo este lugar a mis clientes.',
    },
    {
      name: 'David López',
      role: 'Bird Owner',
      text: 'Servicio completo para todo tipo de mascotas. Mi loro recibió atención especializada y los resultados fueron maravillosos. Muy agradecido por el trato recibido.',
    },
    {
      name: 'Laura Sánchez',
      role: 'Multiple Pet Owner',
      text: 'Tengo 3 perros y 2 gatos, y todos reciben la mejor atención. El personal es amable, profesional y realmente aman a los animales. No podría estar más satisfecha.',
    },
    {
      name: 'Roberto Fernández',
      role: 'First Time Owner',
      text: 'Como primer dueño de mascota, me guiaron en todo momento. Explicaron cada procedimiento y me dieron consejos valiosos para el cuidado de mi cachorro.',
    },
  ];

  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prev() {
    this.currentIndex =
      this.currentIndex === 0 ? this.testimonials.length - 1 : this.currentIndex - 1;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }
}
