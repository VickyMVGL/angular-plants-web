import { Component } from '@angular/core';
import { About } from '../../components/about/about';
import { Features } from '../../components/features/features';
import { Team } from '../../components/team/team';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [About, Features, Team],
  template: `
    <page-about></page-about>
    <page-features></page-features>
    <page-team></page-team>
  `,
  styleUrl: './about.css'
})
export class AboutPage {

}
