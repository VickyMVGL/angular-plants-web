import { Component } from '@angular/core';

@Component({
  selector: 'page-carousel',
  imports: [],
  template: `
    <div class="container-fluid p-0">
  <div id="header-carousel" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img class="w-100" src="assets/img/carousel-1.jpg" alt="Image">
        <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
          <div class="p-3" style="max-width: 900px;">
            <h3 class="text-white mb-3 d-none d-sm-block">Best Pet Services</h3>
            <h1 class="display-3 text-white mb-3">Keep Your Pet Happy</h1>
            <h5 class="text-white mb-3 d-none d-sm-block">Duo nonumy et dolor tempor no et.</h5>
            <a class="btn btn-lg btn-primary mt-3 mt-md-4 px-4">Book Now</a>
            <a class="btn btn-lg btn-secondary mt-3 mt-md-4 px-4">Learn More</a>
          </div>
        </div>
      </div>

      <div class="carousel-item">
        <img class="w-100" src="assets/img/carousel-2.jpg" alt="Image">
        <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
          <div class="p-3" style="max-width: 900px;">
            <h3 class="text-white mb-3 d-none d-sm-block">Best Pet Services</h3>
            <h1 class="display-3 text-white mb-3">Pet Spa & Grooming</h1>
            <h5 class="text-white mb-3 d-none d-sm-block">Duo nonumy et dolor tempor no et.</h5>
            <a class="btn btn-lg btn-primary mt-3 mt-md-4 px-4">Book Now</a>
            <a class="btn btn-lg btn-secondary mt-3 mt-md-4 px-4">Learn More</a>
          </div>
        </div>
      </div>
    </div>

    <a class="carousel-control-prev" href="#header-carousel" data-slide="prev">
      <div class="btn btn-primary rounded" style="width: 45px; height: 45px;">
        <span class="carousel-control-prev-icon mb-n2"></span>
      </div>
    </a>
    <a class="carousel-control-next" href="#header-carousel" data-slide="next">
      <div class="btn btn-primary rounded" style="width: 45px; height: 45px;">
        <span class="carousel-control-next-icon mb-n2"></span>
      </div>
    </a>
  </div>
</div>

  `,
  styleUrl: './carousel.css'
})
export class Carousel {

}
