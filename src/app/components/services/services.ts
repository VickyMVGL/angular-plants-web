import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'page-services',
  imports: [CommonModule],
  template: `
    <div class="themed-root container-fluid bg-light pt-5">
      <div class="container py-5">
        <div class="d-flex flex-column text-center mb-5">
          <h4 class="text-secondary mb-3">Our Services</h4>
          <h1 class="display-4 m-0"><span class="text-primary">Premium</span> Pet Services</h1>
        </div>
        <div class="row pb-3">
          <!-- 6 cards -->
          <div class="col-md-6 col-lg-4 mb-4" *ngFor="let s of [1, 2, 3, 4, 5, 6]">
            <div class="d-flex flex-column text-center bg-white mb-2 p-3 p-sm-5">
              <h3 class="display-3 font-weight-normal text-secondary mb-3">Icon</h3>
              <h3 class="mb-3">Service {{ s }}</h3>
              <p>Diam amet eos at no eos sit lorem...</p>
              <a class="text-uppercase font-weight-bold" href="#">Read More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './services.css',
})
export class Services {}
