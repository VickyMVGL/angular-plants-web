import { Component } from '@angular/core';

@Component({
  selector: 'page-booking',
  imports: [],
  template: `
    <div class="container-fluid bg-light">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-5">
        <div class="bg-primary py-5 px-4 px-sm-5">
          <form class="py-5">
            <div class="form-group">
              <input type="text" class="form-control border-0 p-4" placeholder="Your Name" required />
            </div>
            <div class="form-group">
              <input type="email" class="form-control border-0 p-4" placeholder="Your Email" required />
            </div>
            <div class="form-group">
              <input type="text" class="form-control border-0 p-4" placeholder="Reservation Date" />
            </div>
            <div class="form-group">
              <input type="text" class="form-control border-0 p-4" placeholder="Reservation Time" />
            </div>
            <div class="form-group">
              <select class="custom-select border-0 px-4" style="height:47px;">
                <option selected>Select A Service</option>
                <option value="1">Service 1</option>
                <option value="2">Service 2</option>
                <option value="3">Service 3</option>
              </select>
            </div>
            <div>
              <button class="btn btn-dark btn-block border-0 py-3" type="submit">Book Now</button>
            </div>
          </form>
        </div>
      </div>
      <div class="col-lg-7 py-5 py-lg-0 px-3 px-lg-5">
        <h4 class="text-secondary mb-3">Going for a vacation?</h4>
        <h1 class="display-4 mb-4">Book For <span class="text-primary">Your Pet</span></h1>
        <p>Labore vero lorem eos sed aliquy ipsum aliquy sed...</p>
        <!-- Items (Pet Boarding, Feeding...) -->
      </div>
    </div>
  </div>
</div>

  `,
  styleUrl: './booking.css'
})
export class Booking {

}
