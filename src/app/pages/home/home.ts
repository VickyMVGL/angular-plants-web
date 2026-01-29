import { Component } from '@angular/core';

import { About } from '../../components/about/about';
import { Blog } from '../../components/blog/blog';
import { Booking } from '../../components/booking/booking';
import { Carousel } from '../../components/carousel/carousel';
import { Features } from '../../components/features/features';
import { Team } from '../../components/team/team';
import { Testimonial } from '../../components/testimonial/testimonial';
import { Services } from '../../components/services/services';
import { Videos } from '../../components/videos/videos';
import { Fotos } from '../../components/fotos/fotos';

@Component({
  selector: 'page-home',
  standalone: true,
  imports: [About, Blog, Booking, Carousel, Features, Services, Videos, Fotos, Team, Testimonial],
  template: `
    <page-carousel></page-carousel>
    <page-booking></page-booking>
    <page-about></page-about>
    <page-blog></page-blog>
    <page-videos></page-videos>
    <page-fotos></page-fotos>
    <page-services></page-services>
    <page-features></page-features>
    <page-team></page-team>
    <page-testimonial></page-testimonial>
  `,
  styleUrls: ['./home.css'],
})
export class Home {}
