import { Component } from '@angular/core';
import { Blog } from '../../components/blog/blog';
import { Booking } from '../../components/booking/booking';
import { Pricing } from '../../components/pricing/pricing';


@Component({
  selector: 'app-booking',
  imports: [Blog, Booking, Pricing],
  template: `
    <page-blog></page-blog>
    <page-booking></page-booking>
    <page-pricing></page-pricing>
  `,
  styleUrl: './booking.css'
})
export class BookingPage {

}
