import { Component } from '@angular/core';

@Component({
  selector: 'page-testimonial',
  imports: [],
  template: `
    <div class="container-fluid bg-light my-5 p-0 py-5">
  <div class="container p-0 py-5">
    <div class="d-flex flex-column text-center mb-5">
      <h4 class="text-secondary mb-3">Testimonial</h4>
      <h1 class="display-4 m-0">Our Client <span class="text-primary">Says</span></h1>
    </div>
    <div class="owl-carousel testimonial-carousel">
      <div class="bg-white mx-3 p-4" *ngFor="let t of [1,2,3,4]">
        <div class="d-flex align-items-end mb-3 mt-n4 ml-n4">
          <img class="img-fluid" src="assets/img/testimonial-{{t}}.jpg" style="width:80px;height:80px" alt="">
          <div class="ml-3"><h5>Client Name</h5><i>Profession</i></div>
        </div>
        <p class="m-0">Sed ea amet kasd elitr stet...</p>
      </div>
    </div>
  </div>
</div>

  `,
  styleUrl: './testimonial.css'
})
export class Testimonial {

}
