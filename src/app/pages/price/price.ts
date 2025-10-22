import { Component } from '@angular/core';
import { Booking } from '../../components/booking/booking';
import { Pricing } from '../../components/pricing/pricing';

@Component({
  selector: 'page-price',
  imports: [Pricing, Booking],
  template: `
    <page-pricing></page-pricing>
    <page-booking></page-booking>
  `,
  styleUrl: './price.css'
})

export class PricePage {

}
