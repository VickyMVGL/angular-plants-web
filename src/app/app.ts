import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';

@Component({
  selector: 'page-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, Navbar, Footer],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="app-container">
      <header>
        <app-navbar></app-navbar>
      </header>

      <main class="app-main">
        <div class="container">
          <router-outlet></router-outlet>
        </div>
      </main>

      <footer class="app-footer">
        <app-footer></app-footer>
      </footer>
    </div>
  `,
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('angular-plants-web');
}