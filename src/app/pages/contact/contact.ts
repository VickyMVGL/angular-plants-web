import { Component } from '@angular/core';
import { Contact } from '../../components/contact/contact';

@Component({
  selector: 'app-contact',
  imports: [Contact],
  template: `
    <page-contact></page-contact>
  `,
  styleUrl: './contact.css'
})
export class ContactPage {

}
