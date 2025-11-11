// cv.component.ts
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="container-fluid bg-light py-5">
      <div class="container">
        <!-- Selector de diseño y color -->
        <div class="row mb-4">
          <div class="col-md-6">
            <label class="subtitle mb-2">Diseño del CV</label>
            <select
              class="form-control"
              [value]="selectedDesign"
              (change)="onDesignChange($any($event.target).value)"
            >
              <option value="standard">Standard</option>
              <option value="circular">Circular</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="subtitle mb-2">Color del CV</label>
            <select
              class="form-control"
              [value]="selectedColor"
              (change)="onColorChange($any($event.target).value)"
            >
              <option value="primary">Color Primario</option>
              <option value="secondary">Color Secundario</option>
              <option value="bg">Color de Fondo</option>
              <option value="text-1">Color Texto 1</option>
              <option value="text-2">Color Texto 2</option>
            </select>
          </div>
        </div>

        <form [formGroup]="cvForm" (ngSubmit)="generateCV()">
          <!-- Detalles Personales -->
          <div class="card mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Detalles Personales</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Foto</label>
                    <input
                      type="file"
                      class="form-control"
                      (change)="onFileSelected($event)"
                      accept="image/*"
                    />
                    <small class="form-text text-muted">Recomendado: 200x200px</small>
                  </div>
                  <div class="form-group">
                    <label>Nombre *</label>
                    <input type="text" class="form-control" formControlName="firstName" required />
                  </div>
                  <div class="form-group">
                    <label>Apellido *</label>
                    <input type="text" class="form-control" formControlName="lastName" required />
                  </div>
                  <div class="form-group">
                    <label>Posición deseada *</label>
                    <input
                      type="text"
                      class="form-control"
                      formControlName="desiredPosition"
                      required
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Email *</label>
                    <input type="email" class="form-control" formControlName="email" required />
                  </div>
                  <div class="form-group">
                    <label>Teléfono *</label>
                    <input type="tel" class="form-control" formControlName="phone" required />
                  </div>
                  <div class="form-group">
                    <label>Dirección *</label>
                    <input type="text" class="form-control" formControlName="address" required />
                  </div>
                  <div class="form-group">
                    <label>Código Postal *</label>
                    <input type="text" class="form-control" formControlName="postalCode" required />
                  </div>
                  <div class="form-group">
                    <label>Ciudad *</label>
                    <input type="text" class="form-control" formControlName="city" required />
                  </div>
                </div>
              </div>

              <!-- Campos opcionales -->
              <div class="row mt-3">
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Fecha de Nacimiento</label>
                    <input type="date" class="form-control" formControlName="birthDate" />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>Lugar de Nacimiento</label>
                    <input type="text" class="form-control" formControlName="birthPlace" />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label>LinkedIn</label>
                    <input type="url" class="form-control" formControlName="linkedin" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Perfil -->
          <div class="card mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Perfil</h5>
            </div>
            <div class="card-body">
              <div class="form-group">
                <textarea
                  class="form-control"
                  rows="4"
                  formControlName="profile"
                  placeholder="Describe tu perfil profesional..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Educación -->
          <div class="card mb-4">
            <div
              class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
            >
              <h5 class="mb-0">Educación</h5>
              <button type="button" class="btn btn-secondary btn-sm" (click)="addEducation()">
                Agregar Educación
              </button>
            </div>
            <div class="card-body" formArrayName="education">
              <div
                *ngFor="let edu of educationControls; let i = index"
                [formGroupName]="i"
                class="border-bottom pb-3 mb-3"
              >
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Escuela *</label>
                      <input type="text" class="form-control" formControlName="school" required />
                    </div>
                    <div class="form-group">
                      <label>Ciudad *</label>
                      <input type="text" class="form-control" formControlName="city" required />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Fecha de Inicio *</label>
                      <input
                        type="date"
                        class="form-control"
                        formControlName="startDate"
                        required
                      />
                    </div>
                    <div class="form-group">
                      <label>Fecha de Fin</label>
                      <input type="date" class="form-control" formControlName="endDate" />
                      <div class="form-check mt-2">
                        <input type="checkbox" class="form-check-input" formControlName="current" />
                        <label class="form-check-label">Actualmente estudiando</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Descripción</label>
                  <textarea class="form-control" rows="3" formControlName="description"></textarea>
                </div>
                <button type="button" class="btn btn-danger btn-sm" (click)="removeEducation(i)">
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <!-- Experiencia Laboral -->
          <div class="card mb-4">
            <div
              class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
            >
              <h5 class="mb-0">Experiencia Laboral</h5>
              <button type="button" class="btn btn-secondary btn-sm" (click)="addExperience()">
                Agregar Experiencia
              </button>
            </div>
            <div class="card-body" formArrayName="experience">
              <div
                *ngFor="let exp of experienceControls; let i = index"
                [formGroupName]="i"
                class="border-bottom pb-3 mb-3"
              >
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Posición *</label>
                      <input type="text" class="form-control" formControlName="position" required />
                    </div>
                    <div class="form-group">
                      <label>Empleador *</label>
                      <input type="text" class="form-control" formControlName="employer" required />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Ciudad *</label>
                      <input type="text" class="form-control" formControlName="city" required />
                    </div>
                    <div class="form-group">
                      <label>Fecha de Inicio *</label>
                      <input
                        type="date"
                        class="form-control"
                        formControlName="startDate"
                        required
                      />
                    </div>
                    <div class="form-group">
                      <label>Fecha de Fin</label>
                      <input type="date" class="form-control" formControlName="endDate" />
                      <div class="form-check mt-2">
                        <input type="checkbox" class="form-check-input" formControlName="current" />
                        <label class="form-check-label">Trabajo actual</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Descripción</label>
                  <textarea class="form-control" rows="3" formControlName="description"></textarea>
                </div>
                <button type="button" class="btn btn-danger btn-sm" (click)="removeExperience(i)">
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <!-- Habilidades -->
          <div class="card mb-4">
            <div
              class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
            >
              <h5 class="mb-0">Habilidades</h5>
              <button type="button" class="btn btn-secondary btn-sm" (click)="addSkill()">
                Agregar Habilidad
              </button>
            </div>
            <div class="card-body" formArrayName="skills">
              <div
                *ngFor="let skill of skillControls; let i = index"
                [formGroupName]="i"
                class="border-bottom pb-3 mb-3"
              >
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Habilidad *</label>
                      <input type="text" class="form-control" formControlName="name" required />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Nivel *</label>
                      <select class="form-control" formControlName="level" required>
                        <option value="beginner">Principiante</option>
                        <option value="moderate">Moderado</option>
                        <option value="good">Bueno</option>
                        <option value="very-good">Muy Bueno</option>
                        <option value="excellent">Excelente</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button type="button" class="btn btn-danger btn-sm" (click)="removeSkill(i)">
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <!-- Idiomas -->
          <div class="card mb-4">
            <div
              class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
            >
              <h5 class="mb-0">Idiomas</h5>
              <button type="button" class="btn btn-secondary btn-sm" (click)="addLanguage()">
                Agregar Idioma
              </button>
            </div>
            <div class="card-body" formArrayName="languages">
              <div
                *ngFor="let lang of languageControls; let i = index"
                [formGroupName]="i"
                class="border-bottom pb-3 mb-3"
              >
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Idioma *</label>
                      <input type="text" class="form-control" formControlName="language" required />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label>Nivel *</label>
                      <select class="form-control" formControlName="level" required>
                        <option value="beginner">Principiante</option>
                        <option value="moderate">Moderado</option>
                        <option value="good">Bueno</option>
                        <option value="very-good">Muy Bueno</option>
                        <option value="fluent">Fluido</option>
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                        <option value="C2">C2</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button type="button" class="btn btn-danger btn-sm" (click)="removeLanguage(i)">
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <!-- Hobbies -->
          <div class="card mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Hobbies</h5>
            </div>
            <div class="card-body">
              <div class="form-group">
                <textarea
                  class="form-control"
                  rows="3"
                  formControlName="hobbies"
                  placeholder="Tus hobbies e intereses..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="row mb-5">
            <div class="col-md-4">
              <button
                type="submit"
                class="btn btn-primary btn-lg btn-block"
                [disabled]="!cvForm.valid"
              >
                Generar Vista Previa
              </button>
            </div>
            <div class="col-md-4">
              <button
                type="button"
                class="btn btn-success btn-lg btn-block"
                (click)="downloadPDF()"
                [disabled]="!cvForm.valid"
              >
                Descargar PDF
              </button>
            </div>
            <div class="col-md-4">
              <button
                type="button"
                class="btn btn-secondary btn-lg btn-block"
                (click)="saveDraft()"
              >
                Guardar Borrador
              </button>
            </div>
          </div>
        </form>

        <!-- Vista previa del CV para PDF -->
        <div #cvPreview *ngIf="showPreview" class="card mt-5">
          <div
            class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0">Vista Previa del CV</h5>
            <button type="button" class="btn btn-success btn-sm" (click)="downloadPDF()">
              Descargar PDF
            </button>
          </div>
          <div class="card-body p-0">
            <div [ngClass]="getCvClass()" class="cv-preview p-4" style="background: white;">
              <!-- Header -->
              <div
                class="cv-header text-center mb-4"
                [ngClass]="'bg-' + selectedColor + ' text-white'"
              >
                <div class="py-4">
                  <h1 class="mb-2">{{ cvForm.value.firstName }} {{ cvForm.value.lastName }}</h1>
                  <h3 class="subtitle mb-3">{{ cvForm.value.desiredPosition }}</h3>
                  <div class="row justify-content-center">
                    <div class="col-auto">
                      <i class="fas fa-envelope mr-2"></i>{{ cvForm.value.email }}
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-phone mr-2"></i>{{ cvForm.value.phone }}
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-map-marker-alt mr-2"></i>{{ cvForm.value.city }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <!-- Columna izquierda -->
                <div class="col-md-8">
                  <!-- Perfil -->
                  <div *ngIf="cvForm.value.profile" class="cv-section mb-4">
                    <h4 class="section-title" [ngClass]="'text-' + selectedColor">
                      Perfil Profesional
                    </h4>
                    <p class="text-justify">{{ cvForm.value.profile }}</p>
                  </div>

                  <!-- Experiencia Laboral -->
                  <div *ngIf="experienceControls.length > 0" class="cv-section mb-4">
                    <h4 class="section-title" [ngClass]="'text-' + selectedColor">
                      Experiencia Laboral
                    </h4>
                    <div *ngFor="let exp of cvForm.value.experience" class="cv-item mb-3">
                      <div class="d-flex justify-content-between">
                        <h5 class="mb-1">{{ exp.position }} - {{ exp.employer }}</h5>
                        <span class="text-muted">
                          {{ formatDate(exp.startDate) }} -
                          {{ exp.current ? 'Presente' : formatDate(exp.endDate) }}
                        </span>
                      </div>
                      <p class="text-muted mb-1">{{ exp.city }}</p>
                      <p class="mb-0" *ngIf="exp.description">{{ exp.description }}</p>
                    </div>
                  </div>

                  <!-- Educación -->
                  <div *ngIf="educationControls.length > 0" class="cv-section mb-4">
                    <h4 class="section-title" [ngClass]="'text-' + selectedColor">Educación</h4>
                    <div *ngFor="let edu of cvForm.value.education" class="cv-item mb-3">
                      <div class="d-flex justify-content-between">
                        <h5 class="mb-1">{{ edu.school }}</h5>
                        <span class="text-muted">
                          {{ formatDate(edu.startDate) }} -
                          {{ edu.current ? 'Presente' : formatDate(edu.endDate) }}
                        </span>
                      </div>
                      <p class="text-muted mb-1">{{ edu.city }}</p>
                      <p class="mb-0" *ngIf="edu.description">{{ edu.description }}</p>
                    </div>
                  </div>
                </div>

                <!-- Columna derecha -->
                <div class="col-md-4">
                  <!-- Habilidades -->
                  <div *ngIf="skillControls.length > 0" class="cv-section mb-4">
                    <h4 class="section-title" [ngClass]="'text-' + selectedColor">Habilidades</h4>
                    <div *ngFor="let skill of cvForm.value.skills" class="cv-skill mb-2">
                      <div class="d-flex justify-content-between">
                        <span>{{ skill.name }}</span>
                        <span class="text-muted">{{ getSkillLevelText(skill.level) }}</span>
                      </div>
                      <div class="progress" style="height: 4px;">
                        <div
                          class="progress-bar"
                          [ngClass]="'bg-' + selectedColor"
                          [style.width.%]="getSkillLevelPercentage(skill.level)"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <!-- Idiomas -->
                  <div *ngIf="languageControls.length > 0" class="cv-section mb-4">
                    <h4 class="section-title" [ngClass]="'text-' + selectedColor">Idiomas</h4>
                    <div *ngFor="let lang of cvForm.value.languages" class="cv-skill mb-2">
                      <div class="d-flex justify-content-between">
                        <span>{{ lang.language }}</span>
                        <span class="text-muted">{{ getLanguageLevelText(lang.level) }}</span>
                      </div>
                      <div class="progress" style="height: 4px;">
                        <div
                          class="progress-bar"
                          [ngClass]="'bg-' + selectedColor"
                          [style.width.%]="getLanguageLevelPercentage(lang.level)"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <!-- Hobbies -->
                  <div *ngIf="cvForm.value.hobbies" class="cv-section mb-4">
                    <h4 class="section-title" [ngClass]="'text-' + selectedColor">Hobbies</h4>
                    <p>{{ cvForm.value.hobbies }}</p>
                  </div>

                  <!-- Información de Contacto -->
                  <div class="cv-section">
                    <h4 class="section-title" [ngClass]="'text-' + selectedColor">Contacto</h4>
                    <div class="cv-contact-item mb-2">
                      <i class="fas fa-envelope mr-2" [ngClass]="'text-' + selectedColor"></i>
                      {{ cvForm.value.email }}
                    </div>
                    <div class="cv-contact-item mb-2">
                      <i class="fas fa-phone mr-2" [ngClass]="'text-' + selectedColor"></i>
                      {{ cvForm.value.phone }}
                    </div>
                    <div class="cv-contact-item mb-2">
                      <i class="fas fa-map-marker-alt mr-2" [ngClass]="'text-' + selectedColor"></i>
                      {{ cvForm.value.address }}, {{ cvForm.value.postalCode }},
                      {{ cvForm.value.city }}
                    </div>
                    <div *ngIf="cvForm.value.linkedin" class="cv-contact-item mb-2">
                      <i class="fab fa-linkedin mr-2" [ngClass]="'text-' + selectedColor"></i>
                      {{ cvForm.value.linkedin }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .cv-preview {
        min-height: 297mm;
        background: white;
        font-family: 'Arial', sans-serif;
      }

      .cv-standard {
        /* Estilos para diseño standard */
      }

      .cv-circular {
        /* Estilos para diseño circular */
        border-radius: 15px;
        overflow: hidden;
      }

      .section-title {
        border-bottom: 2px solid;
        padding-bottom: 5px;
        margin-bottom: 15px;
        font-weight: bold;
      }

      .cv-item {
        border-left: 3px solid;
        padding-left: 15px;
      }

      .cv-skill {
        margin-bottom: 10px;
      }

      .cv-contact-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }

      /* Colores dinámicos */
      .bg-primary {
        background-color: var(--color-primary) !important;
      }
      .bg-secondary {
        background-color: var(--color-secondary) !important;
      }
      .bg-bg {
        background-color: var(--color-bg) !important;
      }
      .bg-text-1 {
        background-color: var(--color-text-1) !important;
      }
      .bg-text-2 {
        background-color: var(--color-text-2) !important;
      }

      .text-primary {
        color: var(--color-primary) !important;
      }
      .text-secondary {
        color: var(--color-secondary) !important;
      }
      .text-bg {
        color: var(--color-bg) !important;
      }
      .text-text-1 {
        color: var(--color-text-1) !important;
      }
      .text-text-2 {
        color: var(--color-text-2) !important;
      }

      .cv-item {
        border-left-color: var(--color-primary);
      }
      .bg-primary .cv-item {
        border-left-color: white;
      }
    `,
  ],
})
export class CvComponent implements OnInit {
  @ViewChild('cvPreview') cvPreview!: ElementRef;

  cvForm: FormGroup;
  selectedDesign: string = 'standard';
  selectedColor: string = 'primary';
  showPreview: boolean = false;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder) {
    this.cvForm = this.createCvForm();
  }

  ngOnInit() {
    this.loadDraft();
  }

  // Getters para acceder a los FormArray desde la plantilla y desde el componente
  get educationControls() {
    return (this.cvForm.get('education') as FormArray).controls;
  }

  get experienceControls() {
    return (this.cvForm.get('experience') as FormArray).controls;
  }

  get skillControls() {
    return (this.cvForm.get('skills') as FormArray).controls;
  }

  get languageControls() {
    return (this.cvForm.get('languages') as FormArray).controls;
  }

  // Manejo cambio de diseño
  onDesignChange(value: string) {
    // Actualizar diseño seleccionado
    this.selectedDesign = value;
  }

  // Manejo cambio de color: aplica variables CSS con valores por defecto
  onColorChange(value?: string) {
    if (value) {
      this.selectedColor = value;
    }
    this.applyColorVariables();
  }

  private applyColorVariables() {
    const defaults: { [key: string]: string } = {
      primary: '#007bff',
      secondary: '#6c757d',
      bg: '#f8f9fa',
      'text-1': '#212529',
      'text-2': '#6c757d',
    };

    // Mapear claves a variables CSS que usamos en estilos
    const root = document.documentElement;
    root.style.setProperty('--color-primary', defaults['primary']);
    root.style.setProperty('--color-secondary', defaults['secondary']);
    root.style.setProperty('--color-bg', defaults['bg']);
    root.style.setProperty('--color-text-1', defaults['text-1']);
    root.style.setProperty('--color-text-2', defaults['text-2']);

    // Si se quiere potenciar la selección dinámica por clave, se puede ajustar aquí
  }

  // Manejo de archivo de foto
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Guardar la imagen en el formulario como dataURL para previsualizar y exportar
        this.cvForm.patchValue({ photo: result });
      };
      reader.readAsDataURL(file);
    }
  }

  // Funciones para crear grupos del FormArray
  private createEducationGroup(): FormGroup {
    return this.fb.group({
      school: ['', Validators.required],
      city: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      current: [false],
      description: [''],
    });
  }

  private createExperienceGroup(): FormGroup {
    return this.fb.group({
      position: ['', Validators.required],
      employer: ['', Validators.required],
      city: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      current: [false],
      description: [''],
    });
  }

  private createSkillGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      level: ['beginner', Validators.required],
    });
  }

  private createLanguageGroup(): FormGroup {
    return this.fb.group({
      language: ['', Validators.required],
      level: ['beginner', Validators.required],
    });
  }

  // Operaciones sobre arrays
  addEducation() {
    (this.cvForm.get('education') as FormArray).push(this.createEducationGroup());
  }

  removeEducation(index: number) {
    (this.cvForm.get('education') as FormArray).removeAt(index);
  }

  addExperience() {
    (this.cvForm.get('experience') as FormArray).push(this.createExperienceGroup());
  }

  removeExperience(index: number) {
    (this.cvForm.get('experience') as FormArray).removeAt(index);
  }

  addSkill() {
    (this.cvForm.get('skills') as FormArray).push(this.createSkillGroup());
  }

  removeSkill(index: number) {
    (this.cvForm.get('skills') as FormArray).removeAt(index);
  }

  addLanguage() {
    (this.cvForm.get('languages') as FormArray).push(this.createLanguageGroup());
  }

  removeLanguage(index: number) {
    (this.cvForm.get('languages') as FormArray).removeAt(index);
  }

  // Generar vista previa (habilita el bloque de preview)
  generateCV() {
    if (!this.cvForm.valid) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }
    this.showPreview = true;
    // Aplicar colores (por si se cargó borrador)
    this.applyColorVariables();
  }

  // Obtener clase del CV según diseño seleccionado
  getCvClass(): string {
    return this.selectedDesign === 'circular' ? 'cv-circular' : 'cv-standard';
  }

  // Guardar y cargar borrador en localStorage
  saveDraft() {
    try {
      const data = this.cvForm.value;
      localStorage.setItem('cvDraft', JSON.stringify(data));
      alert('Borrador guardado');
    } catch (e) {
      console.error('Error guardando borrador', e);
      alert('No se pudo guardar el borrador');
    }
  }

  loadDraft() {
    try {
      const raw = localStorage.getItem('cvDraft');
      if (!raw) return;
      const data = JSON.parse(raw);

      // Separar arrays para tratarlos por separado
      const { education = [], experience = [], skills = [], languages = [], photo, ...rest } = data;

      // Aplicar valores simples
      this.cvForm.patchValue(rest || {});

      // Si hay foto guardada (dataURL) la aplicamos
      if (photo) {
        this.cvForm.patchValue({ photo });
      }

      // Reemplazar arrays completos
      const eduArray = this.cvForm.get('education') as FormArray;
      const expArray = this.cvForm.get('experience') as FormArray;
      const sklArray = this.cvForm.get('skills') as FormArray;
      const langArray = this.cvForm.get('languages') as FormArray;

      const clear = (fa: FormArray) => {
        while (fa.length !== 0) {
          fa.removeAt(0);
        }
      };

      clear(eduArray);
      education.forEach((e: any) => {
        const g = this.createEducationGroup();
        g.patchValue(e || {});
        eduArray.push(g);
      });

      clear(expArray);
      experience.forEach((e: any) => {
        const g = this.createExperienceGroup();
        g.patchValue(e || {});
        expArray.push(g);
      });

      clear(sklArray);
      skills.forEach((s: any) => {
        const g = this.createSkillGroup();
        g.patchValue(s || {});
        sklArray.push(g);
      });

      clear(langArray);
      languages.forEach((l: any) => {
        const g = this.createLanguageGroup();
        g.patchValue(l || {});
        langArray.push(g);
      });

      // Aplicar colores por defecto
      this.applyColorVariables();
    } catch (e) {
      console.error('Error cargando borrador', e);
    }
  }

  // Mejora en downloadPDF: asegurar que el elemento preview exista antes de generar
  async downloadPDF(): Promise<void> {
    if (!this.cvForm.valid) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      // Si el preview no está visible, forzamos su render y esperamos un breve intervalo
      if (!this.cvPreview || !this.cvPreview.nativeElement) {
        this.showPreview = true;
        // Esperar para que Angular renderice el elemento (puede ajustarse si es necesario)
        await new Promise((resolve) => setTimeout(resolve, 250));
      }

      const element = this.cvPreview.nativeElement;
      const canvas = await html2canvas(element, {
        scale: 2, // Mejor calidad
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const first = this.cvForm.value.firstName || 'Nombre';
      const last = this.cvForm.value.lastName || 'Apellido';
      const fileName = `${first}_${last}_CV.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor intente nuevamente.');
    }
  }

  // Métodos de utilidad para formatear datos
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
    });
  }

  getSkillLevelText(level: string): string {
    const levels: { [key: string]: string } = {
      beginner: 'Principiante',
      moderate: 'Moderado',
      good: 'Bueno',
      'very-good': 'Muy Bueno',
      excellent: 'Excelente',
    };
    return levels[level] || level;
  }

  getSkillLevelPercentage(level: string): number {
    const percentages: { [key: string]: number } = {
      beginner: 25,
      moderate: 50,
      good: 75,
      'very-good': 90,
      excellent: 100,
    };
    return percentages[level] || 0;
  }

  getLanguageLevelText(level: string): string {
    const levels: { [key: string]: string } = {
      beginner: 'Principiante',
      moderate: 'Moderado',
      good: 'Bueno',
      'very-good': 'Muy Bueno',
      fluent: 'Fluido',
      A1: 'A1',
      A2: 'A2',
      B1: 'B1',
      B2: 'B2',
      C1: 'C1',
      C2: 'C2',
    };
    return levels[level] || level;
  }

  getLanguageLevelPercentage(level: string): number {
    const percentages: { [key: string]: number } = {
      beginner: 20,
      moderate: 40,
      good: 60,
      'very-good': 80,
      fluent: 100,
      A1: 17,
      A2: 33,
      B1: 50,
      B2: 67,
      C1: 83,
      C2: 100,
    };
    return percentages[level] || 0;
  }

  // Métodos existentes (se mantienen igual)
  createCvForm(): FormGroup {
    return this.fb.group({
      photo: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      desiredPosition: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      birthDate: [''],
      birthPlace: [''],
      linkedin: [''],
      profile: [''],
      education: this.fb.array([]),
      experience: this.fb.array([]),
      skills: this.fb.array([]),
      languages: this.fb.array([]),
      hobbies: [''],
    });
  }

  // ... (resto de métodos del formulario se mantienen igual)
}
