import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'page-blog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="themed-root container pt-5">
      <div class="d-flex flex-column text-center mb-5">
        <h4 class="text-secondary mb-3">Pet Blog</h4>
        <h1 class="display-4 m-0"><span class="text-primary">Updates</span> From Blog</h1>
      </div>
      <div class="row pb-3">
        <div class="col-lg-4 mb-4" *ngFor="let b of [1, 2, 3]">
          <div class="card border-0 mb-2">
            <img class="card-img-top" src="assets/img/blog-{{ b }}.jpg" alt="" />
            <div class="card-body bg-light p-4">
              <h4 class="card-title text-truncate">Diam amet eos at no eos</h4>
              <div class="d-flex mb-3">
                <small class="mr-2"><i class="fa fa-user text-muted"></i> Admin</small>
                <small class="mr-2"><i class="fa fa-folder text-muted"></i> Web Design</small>
                <small class="mr-2"><i class="fa fa-comments text-muted"></i> 15</small>
              </div>
              <p>Diam amet eos at no eos sit lorem...</p>
              <a class="font-weight-bold" href="#">Read More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./blog.css'],
})
export class Blog {}
