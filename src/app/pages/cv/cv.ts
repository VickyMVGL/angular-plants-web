// cv.component.ts
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
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
        <!-- Gestión de CVs Guardados -->
        <div class="row mb-4">
          <div class="col-md-12">
            <div class="card">
              <div
                class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
              >
                <h5 class="mb-0">Mis CVs Guardados</h5>
                <div>
                  <button
                    class="btn btn-success btn-sm mr-2"
                    (click)="saveCV()"
                    [disabled]="!cvForm.valid"
                  >
                    Guardar CV Actual
                  </button>
                  <button class="btn btn-outline-light btn-sm" (click)="newCV()">Nuevo CV</button>
                </div>
              </div>
              <div class="card-body">
                <!-- Input para nombre personalizado al guardar -->
                <div *ngIf="showSaveInput" class="mb-3">
                  <div class="row">
                    <div class="col-md-8">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Nombre para este CV (ej: CV Ingeniero Software)"
                        [(ngModel)]="newCvName"
                        #cvNameInput
                      />
                    </div>
                    <div class="col-md-4">
                      <button class="btn btn-primary mr-2" (click)="confirmSave()">
                        Confirmar
                      </button>
                      <button class="btn btn-secondary" (click)="cancelSave()">Cancelar</button>
                    </div>
                  </div>
                </div>

                <div *ngIf="cvList.length === 0" class="text-center text-muted py-3">
                  <p>
                    No hay CVs guardados. Completa el formulario y haz clic en "Guardar CV Actual".
                  </p>
                </div>

                <div class="list-group" *ngIf="cvList.length > 0">
                  <div
                    *ngFor="let cv of cvList"
                    class="list-group-item d-flex justify-content-between align-items-center"
                    [class.active]="currentCvId === cv.id"
                  >
                    <div class="flex-grow-1">
                      <h6 class="mb-1">
                        {{ cv.name }}
                        <span *ngIf="currentCvId === cv.id" class="badge badge-primary ml-2"
                          >Actual</span
                        >
                      </h6>
                      <small class="text-muted">
                        Creado: {{ formatDisplayDate(cv.createdAt) }} | Modificado:
                        {{ formatDisplayDate(cv.lastModified) }}
                      </small>
                    </div>
                    <div class="btn-group">
                      <button class="btn btn-outline-primary btn-sm mr-1" (click)="loadCV(cv.id)">
                        Cargar
                      </button>
                      <button class="btn btn-outline-danger btn-sm" (click)="deleteCV(cv.id)">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        <div class="row">
          <!-- Formulario -->
          <div class="col-md-6">
            <form [formGroup]="cvForm">
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
                        <input
                          type="text"
                          class="form-control"
                          formControlName="firstName"
                          [class.is-invalid]="
                            cvForm.get('firstName')?.invalid && cvForm.get('firstName')?.touched
                          "
                          required
                        />
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('firstName')?.errors?.['required']"
                        >
                          El nombre es obligatorio
                        </div>
                      </div>
                      <div class="form-group">
                        <label>Apellido *</label>
                        <input
                          type="text"
                          class="form-control"
                          formControlName="lastName"
                          [class.is-invalid]="
                            cvForm.get('lastName')?.invalid && cvForm.get('lastName')?.touched
                          "
                          required
                        />
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('lastName')?.errors?.['required']"
                        >
                          El apellido es obligatorio
                        </div>
                      </div>
                      <div class="form-group">
                        <label>Posición deseada *</label>
                        <input
                          type="text"
                          class="form-control"
                          formControlName="desiredPosition"
                          [class.is-invalid]="
                            cvForm.get('desiredPosition')?.invalid &&
                            cvForm.get('desiredPosition')?.touched
                          "
                          required
                        />
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('desiredPosition')?.errors?.['required']"
                        >
                          La posición deseada es obligatoria
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          class="form-control"
                          formControlName="email"
                          [class.is-invalid]="
                            cvForm.get('email')?.invalid && cvForm.get('email')?.touched
                          "
                          required
                        />
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('email')?.errors?.['required']"
                        >
                          El email es obligatorio
                        </div>
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('email')?.errors?.['email']"
                        >
                          Formato de email inválido
                        </div>
                      </div>
                      <div class="form-group">
                        <label>Teléfono *</label>
                        <input
                          type="tel"
                          class="form-control"
                          formControlName="phone"
                          [class.is-invalid]="
                            cvForm.get('phone')?.invalid && cvForm.get('phone')?.touched
                          "
                          required
                        />
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('phone')?.errors?.['required']"
                        >
                          El teléfono es obligatorio
                        </div>
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('phone')?.errors?.['pattern']"
                        >
                          Solo se permiten números, espacios, +, - y ()
                        </div>
                      </div>
                      <div class="form-group">
                        <label>Dirección *</label>
                        <input
                          type="text"
                          class="form-control"
                          formControlName="address"
                          [class.is-invalid]="
                            cvForm.get('address')?.invalid && cvForm.get('address')?.touched
                          "
                          required
                        />
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('address')?.errors?.['required']"
                        >
                          La dirección es obligatoria
                        </div>
                      </div>
                      <div class="form-group">
                        <label>Código Postal *</label>
                        <input
                          type="text"
                          class="form-control"
                          formControlName="postalCode"
                          [class.is-invalid]="
                            cvForm.get('postalCode')?.invalid && cvForm.get('postalCode')?.touched
                          "
                          required
                        />
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('postalCode')?.errors?.['required']"
                        >
                          El código postal es obligatorio
                        </div>
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('postalCode')?.errors?.['pattern']"
                        >
                          Solo se permiten números y letras
                        </div>
                      </div>
                      <div class="form-group">
                        <label>Ciudad *</label>
                        <input
                          type="text"
                          class="form-control"
                          formControlName="city"
                          [class.is-invalid]="
                            cvForm.get('city')?.invalid && cvForm.get('city')?.touched
                          "
                          required
                        />
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('city')?.errors?.['required']"
                        >
                          La ciudad es obligatoria
                        </div>
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('city')?.errors?.['pattern']"
                        >
                          Solo se permiten letras y espacios
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Campos opcionales -->
                  <div class="row mt-3">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label>Fecha de Nacimiento</label>
                        <input
                          type="date"
                          class="form-control"
                          formControlName="birthDate"
                          [class.is-invalid]="
                            cvForm.get('birthDate')?.invalid && cvForm.get('birthDate')?.touched
                          "
                        />
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('birthDate')?.errors?.['futureDate']"
                        >
                          La fecha de nacimiento no puede ser futura
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label>Lugar de Nacimiento</label>
                        <input
                          type="text"
                          class="form-control"
                          formControlName="birthPlace"
                          [class.is-invalid]="
                            cvForm.get('birthPlace')?.invalid && cvForm.get('birthPlace')?.touched
                          "
                        />
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('birthPlace')?.errors?.['pattern']"
                        >
                          Solo se permiten letras y espacios
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label>LinkedIn</label>
                        <input
                          type="url"
                          class="form-control"
                          formControlName="linkedin"
                          [class.is-invalid]="
                            cvForm.get('linkedin')?.invalid && cvForm.get('linkedin')?.touched
                          "
                        />
                        <div
                          class="invalid-feedback"
                          *ngIf="cvForm.get('linkedin')?.errors?.['pattern']"
                        >
                          Formato de URL inválido
                        </div>
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
                          <input
                            type="text"
                            class="form-control"
                            formControlName="school"
                            [class.is-invalid]="
                              educationControls[i].get('school')?.invalid &&
                              educationControls[i].get('school')?.touched
                            "
                            required
                          />
                          <div
                            class="invalid-feedback"
                            *ngIf="educationControls[i].get('school')?.errors?.['required']"
                          >
                            La escuela es obligatoria
                          </div>
                        </div>
                        <div class="form-group">
                          <label>Ciudad *</label>
                          <input
                            type="text"
                            class="form-control"
                            formControlName="city"
                            [class.is-invalid]="
                              educationControls[i].get('city')?.invalid &&
                              educationControls[i].get('city')?.touched
                            "
                            required
                          />
                          <div
                            class="invalid-feedback"
                            *ngIf="educationControls[i].get('city')?.errors?.['required']"
                          >
                            La ciudad es obligatoria
                          </div>
                          <div
                            class="invalid-feedback"
                            *ngIf="educationControls[i].get('city')?.errors?.['pattern']"
                          >
                            Solo se permiten letras y espacios
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label>Fecha de Inicio *</label>
                          <input
                            type="date"
                            class="form-control"
                            formControlName="startDate"
                            [class.is-invalid]="
                              educationControls[i].get('startDate')?.invalid &&
                              educationControls[i].get('startDate')?.touched
                            "
                            required
                          />
                          <div
                            class="invalid-feedback"
                            *ngIf="educationControls[i].get('startDate')?.errors?.['required']"
                          >
                            La fecha de inicio es obligatoria
                          </div>
                        </div>
                        <div class="form-group">
                          <label>Fecha de Fin</label>
                          <input
                            type="date"
                            class="form-control"
                            formControlName="endDate"
                            [class.is-invalid]="
                              educationControls[i].get('endDate')?.invalid &&
                              educationControls[i].get('endDate')?.touched
                            "
                          />
                          <div
                            class="invalid-feedback"
                            *ngIf="educationControls[i].get('endDate')?.errors?.['dateOrder']"
                          >
                            La fecha de fin no puede ser anterior a la fecha de inicio
                          </div>
                          <div class="form-check mt-2">
                            <input
                              type="checkbox"
                              class="form-check-input"
                              formControlName="current"
                              (change)="onCurrentEducationChange(i)"
                            />
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
                        (input)="onEditorInputArray('education', i, $event)"
                        [innerHTML]="educationControls[i].get('description')?.value || ''"
                        style="min-height:60px;"
                      ></div>
                    </div>
                    <button
                      type="button"
                      class="btn btn-danger btn-sm"
                      (click)="removeEducation(i)"
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
                          <input
                            type="text"
                            class="form-control"
                            formControlName="position"
                            [class.is-invalid]="
                              experienceControls[i].get('position')?.invalid &&
                              experienceControls[i].get('position')?.touched
                            "
                            required
                          />
                          <div
                            class="invalid-feedback"
                            *ngIf="experienceControls[i].get('position')?.errors?.['required']"
                          >
                            La posición es obligatoria
                          </div>
                        </div>
                        <div class="form-group">
                          <label>Empleador *</label>
                          <input
                            type="text"
                            class="form-control"
                            formControlName="employer"
                            [class.is-invalid]="
                              experienceControls[i].get('employer')?.invalid &&
                              experienceControls[i].get('employer')?.touched
                            "
                            required
                          />
                          <div
                            class="invalid-feedback"
                            *ngIf="experienceControls[i].get('employer')?.errors?.['required']"
                          >
                            El empleador es obligatorio
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label>Ciudad *</label>
                          <input
                            type="text"
                            class="form-control"
                            formControlName="city"
                            [class.is-invalid]="
                              experienceControls[i].get('city')?.invalid &&
                              experienceControls[i].get('city')?.touched
                            "
                            required
                          />
                          <div
                            class="invalid-feedback"
                            *ngIf="experienceControls[i].get('city')?.errors?.['required']"
                          >
                            La ciudad es obligatoria
                          </div>
                          <div
                            class="invalid-feedback"
                            *ngIf="experienceControls[i].get('city')?.errors?.['pattern']"
                          >
                            Solo se permiten letras y espacios
                          </div>
                        </div>
                        <div class="form-group">
                          <label>Fecha de Inicio *</label>
                          <input
                            type="date"
                            class="form-control"
                            formControlName="startDate"
                            [class.is-invalid]="
                              experienceControls[i].get('startDate')?.invalid &&
                              experienceControls[i].get('startDate')?.touched
                            "
                            required
                          />
                          <div
                            class="invalid-feedback"
                            *ngIf="experienceControls[i].get('startDate')?.errors?.['required']"
                          >
                            La fecha de inicio es obligatoria
                          </div>
                        </div>
                        <div class="form-group">
                          <label>Fecha de Fin</label>
                          <input
                            type="date"
                            class="form-control"
                            formControlName="endDate"
                            [class.is-invalid]="
                              experienceControls[i].get('endDate')?.invalid &&
                              experienceControls[i].get('endDate')?.touched
                            "
                          />
                          <div
                            class="invalid-feedback"
                            *ngIf="experienceControls[i].get('endDate')?.errors?.['dateOrder']"
                          >
                            La fecha de fin no puede ser anterior a la fecha de inicio
                          </div>
                          <div class="form-check mt-2">
                            <input
                              type="checkbox"
                              class="form-check-input"
                              formControlName="current"
                              (change)="onCurrentExperienceChange(i)"
                            />
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
                        (input)="onEditorInputArray('experience', i, $event)"
                        [innerHTML]="experienceControls[i].get('description')?.value || ''"
                        style="min-height:60px;"
                      ></div>
                    </div>
                    <button
                      type="button"
                      class="btn btn-danger btn-sm"
                      (click)="removeExperience(i)"
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
                          <input
                            type="text"
                            class="form-control"
                            formControlName="name"
                            [class.is-invalid]="
                              skillControls[i].get('name')?.invalid &&
                              skillControls[i].get('name')?.touched
                            "
                            required
                          />
                          <div
                            class="invalid-feedback"
                            *ngIf="skillControls[i].get('name')?.errors?.['required']"
                          >
                            El nombre de la habilidad es obligatorio
                          </div>
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
                  <h5 class="text-bg">Idiomas</h5>
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
                          <input
                            type="text"
                            class="form-control"
                            formControlName="language"
                            [class.is-invalid]="
                              languageControls[i].get('language')?.invalid &&
                              languageControls[i].get('language')?.touched
                            "
                            required
                          />
                          <div
                            class="invalid-feedback"
                            *ngIf="languageControls[i].get('language')?.errors?.['required']"
                          >
                            El idioma es obligatorio
                          </div>
                          <div
                            class="invalid-feedback"
                            *ngIf="languageControls[i].get('language')?.errors?.['pattern']"
                          >
                            Solo se permiten letras y espacios
                          </div>
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
                      (input)="onEditorInput('hobbies', $event)"
                      [innerHTML]="cvForm.get('hobbies')?.value || ''"
                      style="min-height:60px;"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="row mb-5">
                <div class="col-md-6">
                  <button
                    type="button"
                    class="btn btn-success btn-lg btn-block"
                    (click)="downloadPDF()"
                    [disabled]="!cvForm.valid"
                  >
                    Descargar PDF
                  </button>
                </div>
                <div class="col-md-6">
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
          </div>

          <!-- Vista previa del CV en tiempo real -->
          <div class="col-md-6">
            <div class="card sticky-top" style="top: 20px;">
              <div
                class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
              >
                <h5 class="mb-0">Vista Previa del CV</h5>
                <div>
                  <span *ngIf="currentCvId" class="badge badge-light mr-2">
                    {{ getCurrentCvName() }}
                  </span>
                  <button
                    type="button"
                    class="btn btn-success btn-sm"
                    (click)="downloadPDF()"
                    [disabled]="!cvForm.valid"
                  >
                    Descargar PDF
                  </button>
                </div>
              </div>
              <div class="card-body p-0">
                <div #cvPreview class="cv-preview-standard p-4" style="background: white;">
                  <!-- Header -->
                  <div class="cv-header text-center mb-4">
                    <div class="py-3">
                      <h1 class="mb-1 main-name">
                        {{ cvForm.value.firstName || 'Nombre' }}
                        {{ cvForm.value.lastName || 'Apellido' }}
                      </h1>
                      <h3 class="subtitle mb-2">
                        {{ cvForm.value.desiredPosition || 'Posición deseada' }}
                      </h3>
                    </div>
                  </div>

                  <div class="cv-container">
                    <!-- Columna izquierda (70%) -->
                    <div class="cv-main-column">
                      <!-- Perfil -->
                      <div *ngIf="cvForm.value.profile" class="cv-section mb-4">
                        <h2 class="section-title">Perfil Profesional</h2>
                        <div
                          class="text-justify profile-content"
                          [innerHTML]="cvForm.value.profile"
                        ></div>
                      </div>

                      <!-- Experiencia Laboral -->
                      <div *ngIf="experienceControls.length > 0" class="cv-section mb-4">
                        <h2 class="section-title">Experiencia Laboral</h2>
                        <div *ngFor="let exp of cvForm.value.experience" class="cv-item mb-3">
                          <div class="d-flex justify-content-between">
                            <h4 class="mb-1">
                              {{ exp.position || 'Posición' }} - {{ exp.employer || 'Empleador' }}
                            </h4>
                            <span class="date-range">
                              {{ formatDate(exp.startDate) }} -
                              {{ exp.current ? 'Presente' : formatDate(exp.endDate) }}
                            </span>
                          </div>
                          <p class="location mb-1">{{ exp.city || 'Ciudad' }}</p>
                          <div
                            class="description"
                            *ngIf="exp.description"
                            [innerHTML]="exp.description"
                          ></div>
                        </div>
                      </div>

                      <!-- Educación -->
                      <div *ngIf="educationControls.length > 0" class="cv-section mb-4">
                        <h2 class="section-title">Educación</h2>
                        <div *ngFor="let edu of cvForm.value.education" class="cv-item mb-3">
                          <div class="d-flex justify-content-between">
                            <h4 class="mb-1">{{ edu.school || 'Escuela' }}</h4>
                            <span class="date-range">
                              {{ formatDate(edu.startDate) }} -
                              {{ edu.current ? 'Presente' : formatDate(edu.endDate) }}
                            </span>
                          </div>
                          <p class="location mb-1">{{ edu.city || 'Ciudad' }}</p>
                          <div
                            class="description"
                            *ngIf="edu.description"
                            [innerHTML]="edu.description"
                          ></div>
                        </div>
                      </div>
                    </div>

                    <!-- Columna derecha (30%) -->
                    <div class="cv-side-column">
                      <!-- Foto -->
                      <div *ngIf="cvForm.value.photo" class="cv-section mb-4">
                        <div class="text-center">
                          <img
                            [src]="cvForm.value.photo"
                            alt="Foto de perfil"
                            class="profile-photo"
                          />
                        </div>
                      </div>

                      <!-- Información de Contacto -->
                      <div class="cv-section mb-4">
                        <h3 class="side-section-title">Contacto</h3>
                        <div class="cv-contact-item mb-2">
                          {{ cvForm.value.email || 'email@ejemplo.com' }}
                        </div>
                        <div class="cv-contact-item mb-2">
                          {{ cvForm.value.phone || '+1234567890' }}
                        </div>
                        <div class="cv-contact-item mb-2">
                          {{ cvForm.value.address || 'Dirección' }},
                          {{ cvForm.value.postalCode || 'CP' }},
                          {{ cvForm.value.city || 'Ciudad' }}
                        </div>
                        <div *ngIf="cvForm.value.linkedin" class="cv-contact-item mb-2">
                          {{ cvForm.value.linkedin }}
                        </div>
                        <div *ngIf="cvForm.value.birthDate" class="cv-contact-item mb-2">
                          {{ formatDate(cvForm.value.birthDate) }}
                        </div>
                        <div *ngIf="cvForm.value.birthPlace" class="cv-contact-item mb-2">
                          Nacimiento: {{ cvForm.value.birthPlace }}
                        </div>
                      </div>

                      <!-- Habilidades -->
                      <div *ngIf="skillControls.length > 0" class="cv-section mb-4">
                        <h3 class="side-section-title">Habilidades</h3>
                        <div *ngFor="let skill of cvForm.value.skills" class="cv-skill mb-2">
                          <div class="d-flex justify-content-between">
                            <span>{{ skill.name || 'Habilidad' }}</span>
                            <span class="skill-level">{{ getSkillLevelText(skill.level) }}</span>
                          </div>
                          <div class="progress" style="height: 6px;">
                            <div
                              class="progress-bar"
                              [style.width.%]="getSkillLevelPercentage(skill.level)"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <!-- Idiomas -->
                      <div *ngIf="languageControls.length > 0" class="cv-section mb-4">
                        <h3 class="side-section-title">Idiomas</h3>
                        <div *ngFor="let lang of cvForm.value.languages" class="cv-skill mb-2">
                          <div class="d-flex justify-content-between">
                            <span>{{ lang.language || 'Idioma' }}</span>
                            <span class="skill-level">{{ getLanguageLevelText(lang.level) }}</span>
                          </div>
                          <div class="progress" style="height: 6px;">
                            <div
                              class="progress-bar"
                              [style.width.%]="getLanguageLevelPercentage(lang.level)"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <!-- Hobbies -->
                      <div *ngIf="cvForm.value.hobbies" class="cv-section mb-4">
                        <h3 class="side-section-title">Hobbies</h3>
                        <div class="hobbies-content" [innerHTML]="cvForm.value.hobbies"></div>
                      </div>
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
      /* Estilos para el diseño estándar del CV */
      .cv-preview-standard {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        font-family: 'Arial', 'Helvetica', sans-serif;
        background: white;
        color: #333;
      }

      .cv-container {
        display: flex;
        gap: 2rem;
      }

      .cv-main-column {
        flex: 0 0 70%;
      }

      .cv-side-column {
        flex: 0 0 30%;
      }

      .cv-header {
        border-bottom: 3px solid var(--main-color, #2c3e50);
        margin-bottom: 2rem;
      }

      .main-name {
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--main-color, #2c3e50);
        margin: 0;
      }

      .subtitle {
        font-size: 1.3rem;
        color: #666;
        font-weight: normal;
        margin: 0;
      }

      .section-title {
        font-size: 1.4rem;
        font-weight: bold;
        color: var(--main-color, #2c3e50);
        border-bottom: 2px solid var(--main-color, #2c3e50);
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .side-section-title {
        font-size: 1.1rem;
        font-weight: bold;
        color: var(--main-color, #2c3e50);
        margin-bottom: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .cv-item {
        margin-bottom: 1.5rem;
      }

      .cv-item h4 {
        font-size: 1.1rem;
        font-weight: bold;
        color: #333;
        margin: 0 0 0.3rem 0;
      }

      .date-range {
        color: #666;
        font-size: 0.9rem;
        font-weight: normal;
      }

      .location {
        color: #666;
        font-style: italic;
        font-size: 0.9rem;
        margin: 0;
      }

      .description {
        font-size: 0.95rem;
        line-height: 1.5;
        color: #444;
      }

      .profile-photo {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--main-color, #2c3e50);
      }

      .cv-contact-item {
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
      }

      .cv-skill {
        margin-bottom: 1rem;
      }

      .skill-level {
        font-size: 0.8rem;
        color: #666;
      }

      .progress {
        background-color: #f0f0f0;
        border-radius: 3px;
        overflow: hidden;
        margin-top: 0.2rem;
      }

      .progress-bar {
        background-color: var(--main-color, #2c3e50);
        height: 100%;
        transition: width 0.3s ease;
      }

      .profile-content,
      .hobbies-content {
        font-size: 0.95rem;
        line-height: 1.6;
        color: #444;
      }

      /* Estilos responsivos */
      @media (max-width: 768px) {
        .cv-container {
          flex-direction: column;
        }

        .cv-main-column,
        .cv-side-column {
          flex: 0 0 100%;
        }
      }

      /* Validaciones y estilos del formulario */
      .is-invalid {
        border-color: #dc3545 !important;
      }

      .invalid-feedback {
        display: block;
        width: 100%;
        margin-top: 0.25rem;
        font-size: 0.875rem;
        color: #dc3545;
        border: none !important;
        box-shadow: none !important;
        background: none !important;
      }

      /* Campos del formulario con borde primario pequeño */
      .form-control {
        border: 1px solid var(--color-primary, #007bff) !important;
        border-radius: 4px;
        box-shadow: none !important;
      }

      .form-control:focus {
        border-color: var(--color-primary, #007bff) !important;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.1) !important;
      }

      /* Botones sin relieve */
      .btn {
        box-shadow: none !important;
        border: 1px solid transparent !important;
        background-image: none !important;
        text-shadow: none !important;
        -webkit-appearance: none !important;
        appearance: none !important;
      }

      .btn:focus,
      .btn:active,
      .btn:hover {
        box-shadow: none !important;
        transform: none !important;
      }

      .btn-primary,
      .btn-secondary,
      .btn-success,
      .btn-danger,
      .btn-light,
      .btn-dark {
        background-image: none !important;
        box-shadow: none !important;
        border: 1px solid transparent !important;
      }

      /* Editor WYSIWYG simple - Solución para dirección del texto */
      .editor-toolbar {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      .editor-toolbar .btn {
        padding: 4px 6px;
        font-size: 12px;
      }

      .editor-content {
        min-height: 60px;
        overflow: auto;
        background-color: rgba(255, 255, 255, 0.92) !important;
        border: 1px solid var(--color-primary, #007bff) !important;
        border-radius: 4px;
        padding: 8px 10px;
        color: inherit;
        caret-color: auto;
        direction: ltr !important;
        text-align: left !important;
        unicode-bidi: plaintext !important;
      }

      .editor-content * {
        direction: ltr !important;
        text-align: left !important;
        unicode-bidi: plaintext !important;
      }

      /* Forzar LTR en todos los elementos del editor */
      [contenteditable='true'] {
        direction: ltr !important;
        text-align: left !important;
        unicode-bidi: plaintext !important;
      }

      /* Variables CSS para colores */
      :root {
        --main-color: #2c3e50;
        --color-primary: #007bff;
        --color-secondary: #6c757d;
        --color-bg: #f8f9fa;
        --color-text-1: #212529;
        --color-text-2: #6c757d;
      }

      /* Títulos con color de fondo */
      .text-bg {
        color: var(--color-bg, #f8f9fa) !important;
      }

      /* Quitar marco de las advertencias */
      .alert,
      .alert-danger,
      .alert-warning {
        border: none !important;
        box-shadow: none !important;
        background: none !important;
      }
    `,
  ],
})
export class CvComponent implements OnInit, OnDestroy {
  @ViewChild('cvPreview') cvPreview!: ElementRef;
  @ViewChild('cvNameInput') cvNameInput!: ElementRef;

  cvForm: FormGroup;
  selectedDesign: string = 'standard';
  selectedColor: string = 'primary';
  selectedFile: File | null = null;

  // Nuevas propiedades para gestión de múltiples CVs
  cvList: any[] = [];
  currentCvId: string | null = null;
  showSaveInput: boolean = false;
  newCvName: string = '';

  // Mutation Observer para cambios en CSS
  private mutationObserver?: MutationObserver;

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
    this.loadCVList();
    this.applyPaletteFromLocalStorage();

    try {
      window.addEventListener('storage', this.storageHandler, false);
    } catch (e) {}

    this.setupRootObserver();

    // Suscribirse a cambios del formulario
    this.cvForm.valueChanges.subscribe(() => {
      // Auto-guardado cada 30 segundos si es un CV existente
      if (this.currentCvId && this.cvForm.valid) {
        this.autoSave();
      }
    });
  }

  ngOnDestroy() {
    try {
      window.removeEventListener('storage', this.storageHandler);
    } catch (e) {}
    try {
      if (this.mutationObserver) this.mutationObserver.disconnect();
    } catch (e) {}
  }

  // =========================================================================
  // MÉTODOS DE GESTIÓN DE MÚLTIPLES CVs (LOCALSTORAGE)
  // =========================================================================

  /**
   * Cargar la lista de CVs guardados desde localStorage
   */
  loadCVList() {
    try {
      const raw = localStorage.getItem('cvList');
      this.cvList = raw ? JSON.parse(raw) : [];

      // Cargar automáticamente el último CV modificado
      if (this.cvList.length > 0) {
        const lastModified = this.cvList.sort(
          (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        )[0];
        this.loadCV(lastModified.id);
      }
    } catch (e) {
      console.error('Error cargando lista de CVs:', e);
      this.cvList = [];
    }
  }

  /**
   * Guardar el CV actual en la lista
   */
  saveCV(customName?: string) {
    if (!this.cvForm.valid) {
      alert('Por favor complete todos los campos obligatorios antes de guardar');
      return;
    }

    // Si no se proporciona nombre, pedirlo al usuario
    if (!customName) {
      this.showSaveInput = true;
      this.newCvName = this.generateDefaultName();
      setTimeout(() => {
        if (this.cvNameInput) {
          this.cvNameInput.nativeElement.focus();
        }
      }, 100);
      return;
    }

    this.confirmSave();
  }

  /**
   * Confirmar guardado con el nombre proporcionado
   */
  confirmSave() {
    if (!this.newCvName.trim()) {
      alert('Por favor ingrese un nombre para el CV');
      return;
    }

    try {
      const cvData = this.cvForm.value;
      const name = this.newCvName.trim();
      const id = this.currentCvId || this.generateId();

      const cvToSave = {
        id: id,
        name: name,
        data: cvData,
        lastModified: new Date().toISOString(),
        createdAt: this.currentCvId ? this.getCVById(id)?.createdAt : new Date().toISOString(),
      };

      // Obtener lista existente
      const existingList = this.getCVList();

      // Si es un CV existente, actualizar; sino agregar nuevo
      const existingIndex = existingList.findIndex((cv: any) => cv.id === id);
      if (existingIndex >= 0) {
        existingList[existingIndex] = cvToSave;
      } else {
        existingList.push(cvToSave);
      }

      // Guardar en localStorage
      localStorage.setItem('cvList', JSON.stringify(existingList));
      this.cvList = existingList;
      this.currentCvId = id;

      this.showSaveInput = false;
      this.newCvName = '';

      alert(`CV "${name}" guardado correctamente`);
    } catch (e) {
      console.error('Error guardando CV:', e);
      alert('Error al guardar el CV');
    }
  }

  /**
   * Cancelar el guardado
   */
  cancelSave() {
    this.showSaveInput = false;
    this.newCvName = '';
  }

  /**
   * Cargar un CV específico por ID
   */
  loadCV(cvId: string) {
    try {
      const cvList = this.getCVList();
      const cv = cvList.find((item: any) => item.id === cvId);
      if (cv) {
        this.loadCVData(cv.data);
        this.currentCvId = cvId;
      }
    } catch (e) {
      console.error('Error cargando CV:', e);
      alert('Error al cargar el CV');
    }
  }

  /**
   * Eliminar un CV
   */
  deleteCV(cvId: string) {
    if (confirm('¿Está seguro de que desea eliminar este CV? Esta acción no se puede deshacer.')) {
      try {
        const cvList = this.getCVList();
        const updatedList = cvList.filter((cv: any) => cv.id !== cvId);
        localStorage.setItem('cvList', JSON.stringify(updatedList));
        this.cvList = updatedList;

        // Si era el CV actual, limpiar formulario
        if (this.currentCvId === cvId) {
          this.newCV();
        }

        alert('CV eliminado correctamente');
      } catch (e) {
        console.error('Error eliminando CV:', e);
        alert('Error al eliminar el CV');
      }
    }
  }

  /**
   * Crear nuevo CV vacío
   */
  newCV() {
    if (this.cvForm.dirty && this.cvForm.valid) {
      if (!confirm('Tiene cambios sin guardar. ¿Está seguro de que desea crear un nuevo CV?')) {
        return;
      }
    }

    this.cvForm.reset();
    this.currentCvId = null;
    this.clearFormArrays();
  }

  /**
   * Auto-guardado cada 30 segundos para CVs existentes
   */
  private autoSave() {
    // Implementar lógica de auto-guardado si se desea
  }

  /**
   * Obtener lista de CVs desde localStorage
   */
  private getCVList(): any[] {
    try {
      const raw = localStorage.getItem('cvList');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Obtener CV por ID
   */
  private getCVById(id: string): any {
    const cvList = this.getCVList();
    return cvList.find((cv: any) => cv.id === id);
  }

  /**
   * Generar ID único
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Generar nombre por defecto para el CV
   */
  private generateDefaultName(): string {
    const data = this.cvForm.value;
    if (data.firstName && data.lastName && data.desiredPosition) {
      return `${data.firstName} ${data.lastName} - ${data.desiredPosition}`;
    } else if (data.firstName && data.lastName) {
      return `${data.firstName} ${data.lastName} - CV`;
    } else {
      return `CV_${new Date().toLocaleDateString()}`;
    }
  }

  /**
   * Obtener nombre del CV actual
   */
  getCurrentCvName(): string {
    if (!this.currentCvId) return 'Nuevo CV';
    const cv = this.getCVById(this.currentCvId);
    return cv ? cv.name : 'Nuevo CV';
  }

  /**
   * Formatear fecha para display
   */
  formatDisplayDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // =========================================================================
  // MÉTODOS DEL FORMULARIO Y VALIDACIONES
  // =========================================================================

  // Getters para los FormArrays
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

  // Manejo de cambios de diseño y color
  onDesignChange(value: string) {
    this.selectedDesign = value;
  }

  onColorChange(value?: string) {
    if (value) {
      this.selectedColor = value;
    }
    this.applyColorVariables();
  }

  // Manejo de archivos
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.cvForm.patchValue({ photo: result });
      };
      reader.readAsDataURL(file);
    }
  }

  // Validaciones personalizadas
  private noNumbersValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const hasNumbers = /\d/.test(control.value);
    return hasNumbers ? { pattern: true } : null;
  }

  private onlyLettersAndSpacesValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const isValid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(control.value);
    return isValid ? null : { pattern: true };
  }

  private phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const isValid = /^[\d\s+\-()]*$/.test(control.value);
    return isValid ? null : { pattern: true };
  }

  private postalCodeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const isValid = /^[a-zA-Z0-9\s\-]*$/.test(control.value);
    return isValid ? null : { pattern: true };
  }

  private urlValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    try {
      new URL(control.value);
      return null;
    } catch {
      return { pattern: true };
    }
  }

  private futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const inputDate = new Date(control.value);
    const today = new Date();
    return inputDate > today ? { futureDate: true } : null;
  }

  private dateOrderValidator(group: AbstractControl): ValidationErrors | null {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    const current = group.get('current')?.value;

    if (!startDate || !endDate || current) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return end < start ? { dateOrder: true } : null;
  }

  // MÉTODOS PARA MANEJAR CHECKBOX "ACTUAL"
  onCurrentEducationChange(index: number) {
    const educationGroup = (this.cvForm.get('education') as FormArray).at(index);
    const current = educationGroup.get('current')?.value;

    if (current) {
      educationGroup.get('endDate')?.disable();
      educationGroup.get('endDate')?.clearValidators();
    } else {
      educationGroup.get('endDate')?.enable();
      educationGroup.get('endDate')?.setValidators(this.dateOrderValidator);
    }
    educationGroup.get('endDate')?.updateValueAndValidity();
  }

  onCurrentExperienceChange(index: number) {
    const experienceGroup = (this.cvForm.get('experience') as FormArray).at(index);
    const current = experienceGroup.get('current')?.value;

    if (current) {
      experienceGroup.get('endDate')?.disable();
      experienceGroup.get('endDate')?.clearValidators();
    } else {
      experienceGroup.get('endDate')?.enable();
      experienceGroup.get('endDate')?.setValidators(this.dateOrderValidator);
    }
    experienceGroup.get('endDate')?.updateValueAndValidity();
  }

  // Creación de grupos del formulario
  private createEducationGroup(): FormGroup {
    const group = this.fb.group(
      {
        school: ['', Validators.required],
        city: ['', [Validators.required, this.onlyLettersAndSpacesValidator]],
        startDate: ['', Validators.required],
        endDate: [''],
        current: [false],
        description: [''],
      },
      { validators: this.dateOrderValidator }
    );

    return group;
  }

  private createExperienceGroup(): FormGroup {
    const group = this.fb.group(
      {
        position: ['', Validators.required],
        employer: ['', Validators.required],
        city: ['', [Validators.required, this.onlyLettersAndSpacesValidator]],
        startDate: ['', Validators.required],
        endDate: [''],
        current: [false],
        description: [''],
      },
      { validators: this.dateOrderValidator }
    );

    return group;
  }

  private createSkillGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      level: ['beginner', Validators.required],
    });
  }

  private createLanguageGroup(): FormGroup {
    return this.fb.group({
      language: ['', [Validators.required, this.onlyLettersAndSpacesValidator]],
      level: ['beginner', Validators.required],
    });
  }

  private createCvForm(): FormGroup {
    return this.fb.group({
      photo: [''],
      firstName: ['', [Validators.required, this.noNumbersValidator]],
      lastName: ['', [Validators.required, this.noNumbersValidator]],
      desiredPosition: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator]],
      address: ['', Validators.required],
      postalCode: ['', [Validators.required, this.postalCodeValidator]],
      city: ['', [Validators.required, this.onlyLettersAndSpacesValidator]],
      birthDate: ['', this.futureDateValidator],
      birthPlace: ['', this.onlyLettersAndSpacesValidator],
      linkedin: ['', this.urlValidator],
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

  // =========================================================================
  // MÉTODOS DE COLORES Y OBSERVERS
  // =========================================================================

  private applyColorVariables() {
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
      const cardEl = this.cvPreview?.nativeElement;
      if (!cardEl) return;

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
        if (val) cardEl.style.setProperty(v, val);
      });
    } catch (e) {
      // ignore
    }
  }

  // =========================================================================
  // MÉTODOS DE CARGA Y GUARDADO
  // =========================================================================

  /**
   * Cargar datos de un CV en el formulario
   */
  private loadCVData(data: any) {
    if (!data) return;

    const { education = [], experience = [], skills = [], languages = [], photo, ...rest } = data;

    // Aplicar valores simples
    this.cvForm.patchValue(rest || {});

    if (photo) {
      this.cvForm.patchValue({ photo });
    }

    // Limpiar y cargar arrays
    this.clearFormArrays();

    const eduArray = this.cvForm.get('education') as FormArray;
    const expArray = this.cvForm.get('experience') as FormArray;
    const sklArray = this.cvForm.get('skills') as FormArray;
    const langArray = this.cvForm.get('languages') as FormArray;

    education.forEach((e: any) => {
      const g = this.createEducationGroup();
      g.patchValue(e || {});
      eduArray.push(g);
      if (e.current) {
        this.onCurrentEducationChange(eduArray.length - 1);
      }
    });

    experience.forEach((e: any) => {
      const g = this.createExperienceGroup();
      g.patchValue(e || {});
      expArray.push(g);
      if (e.current) {
        this.onCurrentExperienceChange(expArray.length - 1);
      }
    });

    skills.forEach((s: any) => {
      const g = this.createSkillGroup();
      g.patchValue(s || {});
      sklArray.push(g);
    });

    languages.forEach((l: any) => {
      const g = this.createLanguageGroup();
      g.patchValue(l || {});
      langArray.push(g);
    });

    this.applyColorVariables();
  }

  /**
   * Limpiar arrays del formulario
   */
  private clearFormArrays() {
    const educationArray = this.cvForm.get('education') as FormArray;
    const experienceArray = this.cvForm.get('experience') as FormArray;
    const skillsArray = this.cvForm.get('skills') as FormArray;
    const languagesArray = this.cvForm.get('languages') as FormArray;

    while (educationArray.length > 0) educationArray.removeAt(0);
    while (experienceArray.length > 0) experienceArray.removeAt(0);
    while (skillsArray.length > 0) skillsArray.removeAt(0);
    while (languagesArray.length > 0) languagesArray.removeAt(0);
  }

  // Método de guardado de borrador (compatibilidad)
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

  // =========================================================================
  // MÉTODOS DE DESCARGA PDF
  // =========================================================================

  async downloadPDF(): Promise<void> {
    if (!this.cvForm.valid) {
      alert('Por favor complete todos los campos obligatorios correctamente');
      return;
    }

    try {
      const element = this.cvPreview.nativeElement;
      const canvas = await html2canvas(element, {
        scale: 2,
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

  // =========================================================================
  // MÉTODOS DE UTILIDAD
  // =========================================================================

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
      A1: 17,
      A2: 33,
      B1: 50,
      B2: 67,
      C1: 83,
      C2: 100,
    };
    return percentages[level] || 0;
  }

  // =========================================================================
  // MÉTODOS DEL EDITOR WYSIWYG - CORREGIDOS
  // =========================================================================

  applyFormat(editor: string, command: string, value?: string) {
    const editorEl = this.getEditorElement(editor);
    if (!editorEl) return;

    // Guardar la selección actual
    this.saveSelection(editor);

    document.execCommand(command, false, value);
    editorEl.focus();

    // Forzar actualización del formulario
    this.onEditorInput(editor, new Event('input'));
  }

  applyFormatArray(arrayName: string, index: number, command: string, value?: string) {
    const editorEl = this.getEditorElement(arrayName, index);
    if (!editorEl) return;

    // Guardar la selección actual
    this.saveSelection(arrayName, index);

    document.execCommand(command, false, value);
    editorEl.focus();

    // Forzar actualización del formulario
    this.onEditorInputArray(arrayName, index, new Event('input'));
  }

  private saveSelection(editor: string, index?: number) {
    try {
      const editorEl = this.getEditorElement(editor, index);
      if (!editorEl) return;

      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorEl);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      const startOffset = preCaretRange.toString().length;

      // Guardar la posición del caret
      localStorage.setItem(`caret-${editor}-${index || ''}`, startOffset.toString());
    } catch (e) {
      // ignore
    }
  }

  private restoreSelection(editor: string, index?: number) {
    try {
      const editorEl = this.getEditorElement(editor, index);
      if (!editorEl) return;

      const savedOffset = localStorage.getItem(`caret-${editor}-${index || ''}`);
      if (!savedOffset) return;

      const sel = window.getSelection();
      if (!sel) return;

      sel.removeAllRanges();
      const range = document.createRange();

      let charIndex = 0;
      const nodeStack: Node[] = [editorEl];
      let node: Node | null = null;
      let foundStart = false;

      while ((node = nodeStack.pop()!) !== undefined) {
        if (node.nodeType === 3) {
          // Text node
          const nextCharIndex = charIndex + (node.textContent?.length || 0);
          if (
            !foundStart &&
            parseInt(savedOffset) >= charIndex &&
            parseInt(savedOffset) <= nextCharIndex
          ) {
            range.setStart(node, parseInt(savedOffset) - charIndex);
            range.setEnd(node, parseInt(savedOffset) - charIndex);
            foundStart = true;
          }
          charIndex = nextCharIndex;
        } else {
          // Para elementos no-texto, agregar hijos en orden inverso
          const children = node.childNodes;
          for (let i = children.length - 1; i >= 0; i--) {
            nodeStack.push(children[i]);
          }
        }
      }

      if (foundStart) {
        sel.addRange(range);
      }
    } catch (e) {
      // ignore
    }
  }

  private placeCaretAtEnd(el: HTMLElement) {
    try {
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } catch (e) {
      // ignore
    }
  }

  private getEditorElement(editor: string, index?: number): HTMLElement | null {
    const selector =
      index !== undefined ? `[data-editor="${editor}-${index}"]` : `[data-editor="${editor}"]`;
    return document.querySelector(selector);
  }

  onEditorInput(editor: string, event: Event) {
    const target = event.target as HTMLElement;
    const content = target.innerHTML;

    if (!content.trim()) {
      target.innerHTML = '';
      return;
    }

    this.cvForm.get(editor)?.setValue(content);

    // Restaurar selección después de actualizar
    setTimeout(() => {
      this.restoreSelection(editor);
    }, 0);
  }

  onEditorInputArray(arrayName: string, index: number, event: Event) {
    const target = event.target as HTMLElement;
    const content = target.innerHTML;

    if (!content.trim()) {
      target.innerHTML = '';
      return;
    }

    const control = (this.cvForm.get(arrayName) as FormArray).at(index);
    control.get('description')?.setValue(content);

    // Restaurar selección después de actualizar
    setTimeout(() => {
      this.restoreSelection(arrayName, index);
    }, 0);
  }

  createLink(editor: string, index?: number) {
    const url = prompt('URL del enlace (incluya http://)');
    if (!url) return;
    const selector = index !== undefined ? `${editor}-${index}` : editor;
    const el = this.getEditorElement(selector, undefined);
    if (!el) return;

    // Guardar selección antes de crear el enlace
    this.saveSelection(editor, index);

    document.execCommand('createLink', false, url);
    const ev = new Event('input', { bubbles: true });
    el.dispatchEvent(ev);

    // Restaurar selección después de crear el enlace
    setTimeout(() => {
      this.restoreSelection(editor, index);
    }, 0);
  }
}
