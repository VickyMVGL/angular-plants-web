import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'page-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid pt-5">
      <div class="d-flex flex-column text-center mb-5 pt-5">
        <h4 class="text-secondary mb-3">Contact Us</h4>
        <h1 class="display-4 m-0">Contact For <span class="text-primary">Any Query</span></h1>
      </div>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-8 mb-5">
          <div class="contact-form">
            <!-- alerta de éxito (handled in TS) -->
            <div *ngIf="submitSuccess" class="alert alert-success">Mensaje enviado correctamente (simulado)</div>

            <!-- Si usas ReactiveForms, mantén formGroup; si no, convierte a form normal -->
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" novalidate>
              <div class="control-group mb-3">
                <input type="text" class="form-control p-4" formControlName="name" placeholder="Your Name" />
                <div class="text-danger mt-1" *ngIf="f.name.touched && f.name.invalid">
                  <small *ngIf="f.name.errors?.['required']">El nombre es requerido.</small>
                  <small *ngIf="f.name.errors?.['minlength']">Mínimo 2 caracteres.</small>
                </div>
              </div>

              <div class="control-group mb-3">
                <input type="email" class="form-control p-4" formControlName="email" placeholder="Your Email" />
                <div class="text-danger mt-1" *ngIf="f.email.touched && f.email.invalid">
                  <small *ngIf="f.email.errors?.['required']">El email es requerido.</small>
                  <small *ngIf="f.email.errors?.['email']">Email inválido.</small>
                </div>
              </div>

              <div class="control-group mb-3">
                <input type="text" class="form-control p-4" formControlName="subject" placeholder="Subject" />
                <div class="text-danger mt-1" *ngIf="f.subject.touched && f.subject.invalid">
                  <small *ngIf="f.subject.errors?.['required']">El asunto es requerido.</small>
                </div>
              </div>

              <div class="control-group mb-3">
                <textarea class="form-control p-4" rows="6" formControlName="message" placeholder="Message"></textarea>
                <div class="text-danger mt-1" *ngIf="f.message.touched && f.message.invalid">
                  <small *ngIf="f.message.errors?.['required']">El mensaje es requerido.</small>
                  <small *ngIf="f.message.errors?.['minlength']">Mínimo 10 caracteres.</small>
                </div>
              </div>

              <div>
                <button class="btn btn-primary py-3 px-5" type="submit" [disabled]="contactForm.invalid">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  `,
  styleUrls: ['./contact.css']
})
export class Contact {
  contactForm: FormGroup;
  submitSuccess = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    this.submitSuccess = false;
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) {
      return;
    }
    // Simulate success
    this.submitSuccess = true;
    this.contactForm.reset();
  }
}
