import { Component } from '@angular/core';

@Component({
  selector: 'page-team',
  imports: [],
  template: `
    <div class="container mt-5 pt-5 pb-3">
  <div class="d-flex flex-column text-center mb-5">
    <h4 class="text-secondary mb-3">Team Member</h4>
    <h1 class="display-4 m-0">Meet Our <span class="text-primary">Team Member</span></h1>
  </div>
  <div class="row">
    <div class="col-lg-3 col-md-6" *ngFor="let member of [1,2,3,4]">
      <div class="team card position-relative overflow-hidden border-0 mb-4">
        <img class="card-img-top" src="assets/img/team-{{member}}.jpg" alt="">
        <div class="card-body text-center p-0">
          <div class="team-text d-flex flex-column justify-content-center bg-light">
            <h5>Member {{member}}</h5>
            <i>Role</i>
          </div>
          <div class="team-social d-flex align-items-center justify-content-center bg-dark">
            <a class="btn btn-outline-primary rounded-circle text-center mr-2 px-0" style="width:36px;height:36px" href="#"><i class="fab fa-twitter"></i></a>
            <a class="btn btn-outline-primary rounded-circle text-center mr-2 px-0" style="width:36px;height:36px" href="#"><i class="fab fa-facebook-f"></i></a>
            <a class="btn btn-outline-primary rounded-circle text-center mr-2 px-0" style="width:36px;height:36px" href="#"><i class="fab fa-linkedin-in"></i></a>
            <a class="btn btn-outline-primary rounded-circle text-center px-0" style="width:36px;height:36px" href="#"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  `,
  styleUrl: './team.css'
})
export class Team {

}
