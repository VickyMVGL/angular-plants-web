// cv.component.ts
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
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
              <option value="standard">Estandar</option>
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
              <h5 class="text-bg">Detalles Personales</h5>
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
              <h5 class="text-bg">Perfil</h5>
            </div>
            <div class="card-body">
              <div class="form-group">
                <div class="editor-toolbar mb-2">
                  <button
                    type="button"
                    class="btn btn-sm btn-light mr-1"
                    (click)="applyFormat('profile', 'bold')"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light mr-1"
                    (click)="applyFormat('profile', 'italic')"
                  >
                    <i>i</i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light mr-1"
                    (click)="applyFormat('profile', 'underline')"
                  >
                    U
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light mr-1"
                    (click)="applyFormat('profile', 'insertUnorderedList')"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light mr-1"
                    (click)="applyFormat('profile', 'insertOrderedList')"
                  >
                    1. List
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light mr-1"
                    (click)="createLink('profile')"
                  >
                    Link
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light"
                    (click)="applyFormat('profile', 'removeFormat')"
                  >
                    Clear
                  </button>
                </div>
                <div
                  class="editor-content form-control"
                  contenteditable="true"
                  data-editor="profile"
                  dir="ltr"
                  (input)="onEditorInput('profile', $event)"
                  [innerHTML]="cvForm.get('profile')?.value || ''"
                  style="min-height:90px;"
                ></div>
              </div>
            </div>
          </div>

          <!-- Educación -->
          <div class="card mb-4">
            <div
              class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
            >
              <h5 class="text-bg">Educación</h5>
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                (click)="addEducation()"
                style="box-shadow:none!important;border:none!important;background-image:none!important;outline:none!important;-webkit-appearance:none!important;appearance:none!important;"
              >
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
                  <div class="editor-toolbar mb-2">
                    <button
                      type="button"
                      class="btn btn-sm btn-light mr-1"
                      (click)="applyFormatArray('education', i, 'bold')"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-light mr-1"
                      (click)="applyFormatArray('education', i, 'italic')"
                    >
                      <i>i</i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-light mr-1"
                      (click)="applyFormatArray('education', i, 'underline')"
                    >
                      U
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-light mr-1"
                      (click)="applyFormatArray('education', i, 'insertUnorderedList')"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-light"
                      (click)="applyFormatArray('education', i, 'removeFormat')"
                    >
                      Clear
                    </button>
                  </div>
                  <div
                    class="editor-content form-control"
                    contenteditable="true"
                    [attr.data-editor]="'education-' + i"
                    dir="ltr"
                    (input)="onEditorInputArray('education', i, $event)"
                    [innerHTML]="educationControls[i].get('description')?.value || ''"
                    style="min-height:60px;"
                  ></div>
                </div>
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  (click)="removeEducation(i)"
                  style="box-shadow:none!important;border:none!important;background-image:none!important;outline:none!important;-webkit-appearance:none!important;appearance:none!important;"
                >
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
              <h5 class="text-bg">Experiencia Laboral</h5>
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                (click)="addExperience()"
                style="box-shadow:none!important;border:none!important;background-image:none!important;outline:none!important;-webkit-appearance:none!important;appearance:none!important;"
              >
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
                  <div class="editor-toolbar mb-2">
                    <button
                      type="button"
                      class="btn btn-sm btn-light mr-1"
                      (click)="applyFormatArray('experience', i, 'bold')"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-light mr-1"
                      (click)="applyFormatArray('experience', i, 'italic')"
                    >
                      <i>i</i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-light mr-1"
                      (click)="applyFormatArray('experience', i, 'underline')"
                    >
                      U
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-light mr-1"
                      (click)="applyFormatArray('experience', i, 'insertUnorderedList')"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-light"
                      (click)="applyFormatArray('experience', i, 'removeFormat')"
                    >
                      Clear
                    </button>
                  </div>
                  <div
                    class="editor-content form-control"
                    contenteditable="true"
                    [attr.data-editor]="'experience-' + i"
                    dir="ltr"
                    (input)="onEditorInputArray('experience', i, $event)"
                    [innerHTML]="experienceControls[i].get('description')?.value || ''"
                    style="min-height:60px;"
                  ></div>
                </div>
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  (click)="removeExperience(i)"
                  style="box-shadow:none!important;border:none!important;background-image:none!important;outline:none!important;-webkit-appearance:none!important;appearance:none!important;"
                >
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
              <h5 class="text-bg">Habilidades</h5>
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                (click)="addSkill()"
                style="box-shadow:none!important;border:none!important;background-image:none!important;outline:none!important;-webkit-appearance:none!important;appearance:none!important;"
              >
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
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  (click)="removeSkill(i)"
                  style="box-shadow:none!important;border:none!important;background-image:none!important;outline:none!important;-webkit-appearance:none!important;appearance:none!important;"
                >
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
              <h5 class="text-bg">Idiomas</h5>
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                (click)="addLanguage()"
                style="box-shadow:none!important;border:none!important;background-image:none!important;outline:none!important;-webkit-appearance:none!important;appearance:none!important;"
              >
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
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  (click)="removeLanguage(i)"
                  style="box-shadow:none!important;border:none!important;background-image:none!important;outline:none!important;-webkit-appearance:none!important;appearance:none!important;"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <!-- Hobbies -->
          <div class="card mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="text-bg">Hobbies</h5>
            </div>
            <div class="card-body">
              <div class="form-group">
                <div class="editor-toolbar mb-2">
                  <button
                    type="button"
                    class="btn btn-sm btn-light mr-1"
                    (click)="applyFormat('hobbies', 'bold')"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light mr-1"
                    (click)="applyFormat('hobbies', 'italic')"
                  >
                    <i>i</i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light mr-1"
                    (click)="applyFormat('hobbies', 'underline')"
                  >
                    U
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light mr-1"
                    (click)="applyFormat('hobbies', 'insertUnorderedList')"
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-light"
                    (click)="applyFormat('hobbies', 'removeFormat')"
                  >
                    Clear
                  </button>
                </div>
                <div
                  class="editor-content form-control"
                  contenteditable="true"
                  data-editor="hobbies"
                  dir="ltr"
                  (input)="onEditorInput('hobbies', $event)"
                  [innerHTML]="cvForm.get('hobbies')?.value || ''"
                  style="min-height:60px;"
                ></div>
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
                style="box-shadow:none!important;border:none!important;background-image:none!important;outline:none!important;-webkit-appearance:none!important;appearance:none!important;"
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
                style="box-shadow:none!important;border:none!important;background-image:none!important;outline:none!important;-webkit-appearance:none!important;appearance:none!important;"
              >
                Descargar PDF
              </button>
            </div>
            <div class="col-md-4">
              <button
                type="button"
                class="btn btn-secondary btn-lg btn-block"
                (click)="saveDraft()"
                style="box-shadow:none!important;border:none!important;background-image:none!important;outline:none!important;-webkit-appearance:none!important;appearance:none!important;"
              >
                Guardar Borrador
              </button>
            </div>
          </div>
        </form>

        <!-- Vista previa del CV para PDF -->
        <div #cvPreview *ngIf="showPreview" class="card mt-5 cv-preview-card">
          <div
            class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
          >
            <h5 class="mb-0">Vista Previa del CV</h5>
            <button
              type="button"
              class="btn btn-success btn-sm"
              (click)="downloadPDF()"
              style="box-shadow:none!important;border:none!important;background-image:none!important;outline:none!important;-webkit-appearance:none!important;appearance:none!important;"
            >
              Descargar PDF
            </button>
          </div>
          <div class="card-body p-0">
            <div
              [ngClass]="getCvClass()"
              class="cv-preview p-4 preview-root"
              style="background: white;"
            >
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
                    <div class="text-justify" [innerHTML]="cvForm.value.profile"></div>
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
                      <p class="mb-0" *ngIf="exp.description" [innerHTML]="exp.description"></p>
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
                      <p class="mb-0" *ngIf="edu.description" [innerHTML]="edu.description"></p>
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
                    <div [innerHTML]="cvForm.value.hobbies"></div>
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

      /* Editor WYSIWYG simple */
      .editor-toolbar {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      .editor-toolbar .btn {
        padding: 4px 6px;
        font-size: 12px;
      }

      /* Ajustes para inputs/selects/textareas: usar color de fondo de la paleta y borde primario */
      .form-control {
        background-color: var(--color-bg) !important;
        border: 1px solid var(--color-primary) !important;
        box-shadow: none !important;
        color: var(--color-text-1) !important;
      }
      .form-control:focus {
        border-color: var(--color-primary) !important;
        box-shadow: 0 0 0 0.06rem rgba(0, 0, 0, 0.03) !important;
      }

      /* Editor content: forzar LTR y alineación a la izquierda para evitar "texto al revés" y aplicar borde primario */
      .editor-content,
      .editor-content * {
        /* Forzar dirección LTR en el editor y todos sus nodos hijos. */
        direction: ltr !important;
        text-align: left !important;
        /* Usar isolate para evitar efectos BIDI sin activar comportamientos especiales */
        unicode-bidi: isolate !important;
      }

      .editor-content {
        min-height: 60px;
        overflow: auto;
        /* ligera translucidez para distinguir del fondo sin cambiar color */
        background-color: rgba(255, 255, 255, 0.92) !important;
        border: 1px solid var(--color-primary) !important;
        border-radius: 4px;
        padding: 8px 10px;
        color: inherit;
        caret-color: auto;
      }

      .preview-root .editor-content,
      .preview-root .editor-content * {
        direction: ltr !important;
        text-align: left !important;
        unicode-bidi: isolate !important;
        background-color: rgba(255, 255, 255, 0.95) !important;
        border: 1px solid var(--color-primary) !important;
      }

      /* Quitar relieve de los botones de la toolbar WYSIWYG */
      .editor-toolbar .btn,
      .editor-toolbar .btn *,
      .editor-toolbar .btn::before,
      .editor-toolbar .btn::after {
        box-shadow: none !important;
        -webkit-box-shadow: none !important;
        border: none !important;
        background-image: none !important;
        outline: none !important;
        transform: none !important;
      }
      .editor-toolbar .btn:hover,
      .editor-toolbar .btn:active,
      .editor-toolbar .btn:focus {
        box-shadow: none !important;
        -webkit-box-shadow: none !important;
        transform: none !important;
      }

      /* Hacer las cajas de edición ligeramente traslúcidas para separarlas del fondo sin cambiar el color */
      .editor-content {
        background-color: rgba(255, 255, 255, 0.92); /* ligera opacidad sobre fondo */
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 4px;
        padding: 8px 10px;
        color: inherit;
      }

      /* Si el preview tiene fondo distinto, ajustar la transparencia para la vista previa fuera del formulario */
      .preview-root .editor-content {
        background-color: rgba(255, 255, 255, 0.95);
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

      /* Botones planos en la vista previa: quitar relieve (sombras, bordes, gradientes) */
      .preview-root .btn {
        box-shadow: none !important;
        border: none !important;
        background-image: none !important;
        outline: none !important;
        /* mantener algo de radio si se desea */
        border-radius: 4px !important;
      }
      .preview-root .btn:focus,
      .preview-root .btn:active,
      .preview-root .btn:hover {
        box-shadow: none !important;
        transform: none !important;
      }
      .preview-root .btn-primary,
      .preview-root .btn-secondary,
      .preview_root .btn-danger,
      .preview_root .btn-light,
      .preview_root .btn-dark {
        background-image: none !important;
        box-shadow: none !important;
        border: none !important;
      }
      /* Anular focus rings que añaden relieve en algunos navegadores */
      .preview-root .btn:focus {
        box-shadow: none !important;
      }

      /* Forzar botones totalmente planos dentro de la tarjeta de preview (incluye header y body) */
      .cv-preview-card .btn,
      .cv-preview-card .btn *,
      .cv-preview-card .btn::before,
      .cv-preview-card .btn::after {
        box-shadow: none !important;
        -webkit-box-shadow: none !important;
        border: none !important;
        background-image: none !important; /* quita degradados */
        outline: none !important;
        text-shadow: none !important;
        filter: none !important;
        -webkit-appearance: none !important;
        appearance: none !important;
      }

      /* Asegurar que las variantes no reintroduzcan sombras o bordes */
      .cv-preview-card .btn-primary,
      .cv-preview-card .btn-secondary,
      .cv-preview-card .btn-success,
      .cv-preview-card .btn-danger,
      .cv-preview-card .btn-light,
      .cv-preview-card .btn-dark {
        background-image: none !important;
        box-shadow: none !important;
        -webkit-box-shadow: none !important;
        border: none !important;
      }

      /* También anular estilos en estados :hover/:active/:focus */
      .cv-preview-card .btn:hover,
      .cv-preview-card .btn:active,
      .cv-preview-card .btn:focus {
        box-shadow: none !important;
        -webkit-box-shadow: none !important;
        transform: none !important;
      }
    `,
  ],
})
export class CvComponent implements OnInit, OnDestroy {
  @ViewChild('cvPreview') cvPreview!: ElementRef;

  cvForm: FormGroup;
  selectedDesign: string = 'standard';
  selectedColor: string = 'primary';
  showPreview: boolean = false;
  selectedFile: File | null = null;

  // Handler binding para poder remover el listener
  private storageHandler = (e: StorageEvent) => {
    if (e.key === 'active_palette') {
      try {
        const p = e.newValue ? JSON.parse(e.newValue) : null;
        if (p) this.applyPaletteToRoot(p);
      } catch (err) {
        /* ignore */
      }
    }
  };

  constructor(private fb: FormBuilder) {
    this.cvForm = this.createCvForm();
  }

  ngOnInit() {
    this.loadDraft();
    // Aplicar paleta guardada si existe
    this.applyPaletteFromLocalStorage();
    // Escuchar cambios en localStorage iniciados por el componente Config
    try {
      window.addEventListener('storage', this.storageHandler, false);
    } catch (e) {}

    // Observar cambios en :root (estilos inline) para sincronizar con el preview
    this.setupRootObserver();
  }

  ngOnDestroy() {
    try {
      window.removeEventListener('storage', this.storageHandler);
    } catch (e) {}
    try {
      if (this.mutationObserver) this.mutationObserver.disconnect();
    } catch (e) {}
  }

  // Observador para detectar cambios en document.documentElement.style y sincronizar preview
  private mutationObserver?: MutationObserver;

  private setupRootObserver() {
    try {
      const root = document.documentElement;
      this.mutationObserver = new MutationObserver(() => {
        this.applyRootVarsToPreview();
      });
      this.mutationObserver.observe(root, { attributes: true, attributeFilter: ['style'] });
    } catch (e) {
      // ignore non-browser contexts
    }
  }

  private applyRootVarsToPreview() {
    try {
      // Encontrar el elemento preview-root dentro del componente (si renderizado)
      const cardEl =
        this.cvPreview && this.cvPreview.nativeElement ? this.cvPreview.nativeElement : null;
      if (!cardEl) return;
      const previewRoot: HTMLElement | null = cardEl.querySelector('.preview-root');
      if (!previewRoot) return;

      const rootStyles = getComputedStyle(document.documentElement);
      const vars = [
        '--color-primary',
        '--color-secondary',
        '--color-bg',
        '--color-text-1',
        '--color-text-2',
      ];
      vars.forEach((v) => {
        const val = rootStyles.getPropertyValue(v).trim();
        if (val) previewRoot.style.setProperty(v, val);
      });
    } catch (e) {
      // ignore
    }
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
    // Delegamos en la paleta persistida para mantener sincronía con el componente Config
    this.applyPaletteFromLocalStorage();
  }

  private applyPaletteFromLocalStorage() {
    try {
      const raw = localStorage.getItem('active_palette');
      if (!raw) return;
      const p = JSON.parse(raw);
      this.applyPaletteToRoot(p);
    } catch (e) {
      // ignore
    }
  }

  private applyPaletteToRoot(p: any) {
    if (!p) return;
    try {
      const root = document.documentElement;
      if (p.primary) root.style.setProperty('--color-primary', p.primary);
      if (p.secondary) root.style.setProperty('--color-secondary', p.secondary);
      if (p.text1) root.style.setProperty('--color-text-1', p.text1);
      if (p.text2) root.style.setProperty('--color-text-2', p.text2);
      if (p.bg) root.style.setProperty('--color-bg', p.bg);
    } catch (e) {
      // ignore
    }
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

  // Crear formulario principal del CV (faltaba en el archivo)
  private createCvForm(): FormGroup {
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
    // Forzar sincronización inmediata con variables de root
    setTimeout(() => this.applyRootVarsToPreview(), 50);
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
      beginner: 25,
      moderate: 50,
      good: 75,
      'very-good': 90,
      fluent: 100,
      A1: 10,
      A2: 20,
      B1: 30,
      B2: 40,
      C1: 50,
      C2: 60,
    };
    return percentages[level] || 0;
  }

  // Aplicar formato al contenido del editor (perfil, educación, experiencia, hobbies)
  applyFormat(editor: string, command: string, value?: string) {
    const editorEl = this.getEditorElement(editor);
    if (!editorEl) return;

    document.execCommand(command, false, value);
    editorEl.focus();
    this.saveSelection(editor);
  }

  // Aplicar formato a elementos dentro de un FormArray (educación, experiencia)
  applyFormatArray(arrayName: string, index: number, command: string, value?: string) {
    const editorEl = this.getEditorElement(arrayName, index);
    if (!editorEl) return;

    document.execCommand(command, false, value);
    editorEl.focus();
    this.saveSelection(arrayName, index);
  }

  // Guardar selección actual en el editor (para restaurar después)
  private saveSelection(editor: string, index?: number) {
    // Nota: serializar contenedores DOM es frágil; para este editor simple
    // solo comprobamos que exista una selección y no intentamos persistir nodos.
    try {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      // No persistimos la selección en storage para evitar serialización de nodos.
      return;
    } catch (e) {
      // ignore
    }
  }

  // Restaurar selección en el editor
  private restoreSelection(editor: string, index?: number) {
    // Esta implementación es intencionalmente mínima: no intentamos restaurar
    // selecciones complejas desde localStorage en este ejemplo.
    try {
      const sel = window.getSelection();
      if (!sel) return;
      // noop
      return;
    } catch (e) {
      // ignore
    }
  }

  // Colocar el cursor (caret) al final del elemento contenteditable
  private placeCaretAtEnd(el: HTMLElement) {
    try {
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false); // mover al final
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } catch (e) {
      // ignore
    }
  }

  // Obtener elemento del editor (perfil, educación, experiencia, hobbies)
  private getEditorElement(editor: string, index?: number): HTMLElement | null {
    const selector =
      index !== undefined ? `[data-editor="${editor}-${index}"]` : `[data-editor="${editor}"]`;
    return document.querySelector(selector);
  }

  // Manejo de entrada en los editores (perfil, educación, experiencia, hobbies)
  onEditorInput(editor: string, event: Event) {
    const target = event.target as HTMLElement;
    const content = target.innerHTML;

    // Limpiar contenido vacío
    if (!content.trim()) {
      target.innerHTML = '';
      return;
    }

    // Guardar cambios en el formulario
    this.cvForm.get(editor)?.setValue(content);

    // Sincronizar selección
    this.saveSelection(editor);

    // Asegurar que el caret quede al final para evitar que el siguiente caracter
    // se inserte al inicio (problema de bidi/edición detectado).
    this.placeCaretAtEnd(target);
  }

  onEditorInputArray(arrayName: string, index: number, event: Event) {
    const target = event.target as HTMLElement;
    const content = target.innerHTML;

    // Limpiar contenido vacío
    if (!content.trim()) {
      target.innerHTML = '';
      return;
    }

    // Guardar cambios en el formulario
    const control = (this.cvForm.get(arrayName) as FormArray).at(index);
    control.get('description')?.setValue(content);

    // Sincronizar selección
    this.saveSelection(arrayName, index);

    // Forzar caret al final en el editor específico
    this.placeCaretAtEnd(target);
  }

  // Crear enlace simple en el editor
  createLink(editor: string, index?: number) {
    const url = prompt('URL del enlace (incluya http://)');
    if (!url) return;
    const selector = index !== undefined ? `${editor}-${index}` : editor;
    const el = this.getEditorElement(selector, undefined);
    if (!el) return;
    document.execCommand('createLink', false, url);
    const ev = new Event('input', { bubbles: true });
    el.dispatchEvent(ev);

    // Mover caret al final después de crear el enlace
    this.placeCaretAtEnd(el);
  }
}
