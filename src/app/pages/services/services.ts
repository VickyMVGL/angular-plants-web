import { Component } from '@angular/core';
import { Testimonial } from '../../components/testimonial/testimonial';
import { Services } from '../../components/services/services';

@Component({
  selector: 'app-services',
  imports: [Services, Testimonial],
  template: `
    <page-services></page-services>
    <page-testimonial></page-testimonial>

  `,
  styleUrl: './services.css'
})
export class ServicesPage {

}
