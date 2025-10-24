import { Component, AfterViewInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule],
  template: `
    <style>
      /* ------------------------------------------------------------
         NOTE: Variables and preview-related rules are scoped to
         the .preview-root element so that changes do NOT affect
         the left sidebar or any other UI outside of the preview.
         ------------------------------------------------------------ */

      /* CSS variables defaults (scoped to preview) */
      .preview-root {
        --color-primary: #ed6436;
        --color-secondary: #6c757d;
        --color-text-1: #212529;
        --color-text-2: #6c757d;
        --color-bg: #f8f9fa;

        --title-font: 'Nunito', sans-serif;
        --text-font: 'Nunito Sans', sans-serif;

        --title-size: 40px; /* px */
        --subtitle-size: 20px; /* px */
        --text-size: 16px; /* px */
      }

      /* Sidebar - unchanged and outside preview */
      .left-panel {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 320px;
        background: #ffffff;
        border-right: 1px solid #e6e6e6;
        padding: 1rem;
        overflow-y: auto;
        z-index: 1050;
        /* Prevent sidebar from inheriting app-wide theme variables */
        --color-primary: #ed6436;
        --color-secondary: #6c757d;
        --color-text-1: #212529;
        --color-text-2: #6c757d;
        --color-bg: #ffffff;
        --title-font: 'Nunito', sans-serif;
        --text-font: 'Nunito Sans', sans-serif;
        --title-size: 40px;
        --subtitle-size: 20px;
        --text-size: 16px;
      }
      .content-wrapper {
        margin-left: 340px; /* leave space for sidebar + gap */
        padding-top: 1rem;
      }
      .panel-section {
        margin-bottom: 1.25rem;
      }
      .panel-section h5 {
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .mode-toggle .btn {
        margin-right: 0.25rem;
      }

      /* Saved item */
      .saved-item {
        border: 1px solid #eee;
        padding: 0.5rem;
        border-radius: 6px;
        margin-bottom: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .palette-preview {
        display: flex;
        gap: 0.25rem;
        align-items: center;
      }
      .swatch {
        width: 22px;
        height: 22px;
        border-radius: 3px;
        border: 1px solid rgba(0, 0, 0, 0.08);
      }

      /* ----------------------------
         Preview-scoped styles (use variables)
         ---------------------------- */
      .preview-root .text-primary {
        color: var(--color-primary) !important;
      }
      .preview-root .text-secondary {
        color: var(--color-secondary) !important;
      }
      .preview-root {
        background: var(--color-bg);
        color: var(--color-text-1);
        font-family: var(--text-font);
        font-size: var(--text-size);
      }
      .preview-root h1,
      .preview-root .display-4 {
        font-family: var(--title-font);
        font-size: var(--title-size);
        color: var(--color-text-1);
      }
      .preview-root h4,
      .preview-root h5,
      .preview-root .subtitle {
        font-family: var(--title-font);
        font-size: var(--subtitle-size);
        color: var(--color-text-2);
      }

      /* make the booking card respect variables (scoped) */
      .preview-root .bg-primary {
        background-color: var(--color-primary) !important;
      }
      .preview-root .btn-primary {
        background-color: var(--color-primary) !important;
        border-color: var(--color-primary) !important;
      }
      .preview-root .bg-light {
        background-color: var(--color-bg) !important;
      }

      /* Navbar: scoping and states
         - Navbar background = Color texto 1
         - Active tab: background Color principal, text Color fondo (keeps existing)
         - Hover on non-active tabs: background Color principal, text Color fondo
      */
      .preview-root .navbar {
        background: var(--color-text-1) !important;
      }
      .preview-root .navbar .nav-link {
        color: var(--color-bg) !important;
        transition: background 0.18s ease, color 0.18s ease;
      }
      .preview-root .navbar .nav-link:hover {
        background: var(--color-primary) !important;
        color: var(--color-bg) !important;
        border-radius: 6px;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
      }
      .preview-root .navbar .nav-link.active {
        color: var(--color-bg) !important;
        background: var(--color-primary) !important;
        border-radius: 6px;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        transition: background 0.18s ease, color 0.18s ease;
        position: relative;
      }
      .preview-root .navbar .nav-link.active::after {
        content: none;
      }

      /* Adjust the border-right separators (Opening Hours / Email / Call) to color-text-2 */
      .preview-root .border-right {
        /* ensure width & color are controlled by preview variables */
        border-right: 1px solid var(--color-text-2) !important;
      }

      /* Form controls inside preview should reflect color-bg and color-text-2 */
      .preview-root .form-control,
      .preview-root .custom-select,
      .preview-root .datetimepicker-input {
        background-color: var(--color-bg) !important;
        color: var(--color-text-2) !important;
        border-color: transparent !important;
      }
      .preview-root .form-control::placeholder,
      .preview-root .datetimepicker-input::placeholder {
        color: var(--color-text-2) !important;
        opacity: 0.85;
      }

      /* Book Now button: text = color-bg; button background = color-secondary */
      .preview-root .btn.btn-dark {
        background-color: var(--color-secondary) !important;
        border-color: var(--color-secondary) !important;
        color: var(--color-bg) !important;
      }
      /* Log In button (uses btn-primary large) should match the same style requested */
      .preview-root a.btn.btn-lg.btn-primary,
      .preview-root .btn-lg.btn-primary {
        background-color: var(--color-secondary) !important;
        border-color: var(--color-secondary) !important;
        color: var(--color-bg) !important;
      }

      /* Context menu (global, not scoped to preview so it appears within sidebar too) */
      #custom-context-menu {
        position: fixed;
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.12);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
        border-radius: 6px;
        z-index: 2000;
        display: none;
        min-width: 150px;
        padding: 6px 0;
        font-size: 0.95rem;
      }
      #custom-context-menu .cm-item {
        padding: 8px 12px;
        cursor: pointer;
      }
      #custom-context-menu .cm-item:hover {
        background: #f5f5f5;
      }

      /* Toast notifications container (outside preview) */
      #toast-container {
        position: fixed;
        right: 18px;
        top: 18px;
        z-index: 2500;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .toast-item {
        background: #0b0b0b;
        color: #fff;
        padding: 10px 14px;
        border-radius: 8px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        font-size: 0.95rem;
        opacity: 0.98;
      }
      .toast-item.success {
        background: #2f855a;
      }
      .toast-item.info {
        background: #3182ce;
      }
      .toast-item.warn {
        background: #dd6b20;
      }

      /* Edit modal (floating small panel) */
      #edit-panel {
        position: fixed;
        z-index: 2100;
        right: 20px;
        top: 80px;
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.12);
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        display: none;
        min-width: 320px;
        max-width: 420px;
      }
      #edit-panel label {
        font-size: 0.85rem;
        color: #333;
      }
      #edit-panel input[type='text'],
      #edit-panel input[type='number'],
      #edit-panel select {
        width: 100%;
        padding: 6px 8px;
        margin-top: 6px;
        margin-bottom: 8px;
        border: 1px solid #e6e6e6;
        border-radius: 6px;
      }
      #edit-panel .edit-section {
        margin-bottom: 8px;
      }

      /* Confirm panel (custom confirmation) */
      #confirm-panel {
        position: fixed;
        z-index: 2200;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.12);
        padding: 14px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        display: none;
        min-width: 300px;
      }
      #confirm-panel p {
        margin: 0;
        margin-bottom: 12px;
      }

      /* small responsiveness */
      @media (max-width: 991.98px) {
        .left-panel {
          position: static;
          width: 100%;
          border-right: none;
          border-bottom: 1px solid #e6e6e6;
        }
        .content-wrapper {
          margin-left: 0;
        }
      }

      /* form tweaks */
      .small-input {
        font-size: 0.9rem;
        padding: 0.35rem;
      }
      input[type='number'] {
        -moz-appearance: textfield;
      } /* keep it simple */
    </style>

    <!-- Left Sidebar -->
    <aside class="left-panel" aria-label="Configuración de diseño">
      <div class="d-flex align-items-center mb-3">
        <h4 class="m-0">Ajustes de Vista</h4>
        <small class="ml-auto text-muted">Preview live</small>
      </div>

      <!-- Tabs -->
      <ul class="nav nav-pills mb-3" id="configTabs" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="palette-tab" data-toggle="pill" href="#palette" role="tab"
            >Paleta</a
          >
        </li>
        <li class="nav-item">
          <a class="nav-link" id="typography-tab" data-toggle="pill" href="#typography" role="tab"
            >Tipografía</a
          >
        </li>
        <li class="nav-item">
          <a class="nav-link" id="saved-tab" data-toggle="pill" href="#saved" role="tab"
            >Guardados</a
          >
        </li>
      </ul>

      <div class="tab-content" id="configTabsContent">
        <!-- Palette Tab -->
        <div class="tab-pane fade show active" id="palette" role="tabpanel">
          <div class="panel-section">
            <h5>Modo de entrada</h5>
            <div class="mode-toggle mb-2">
              <button class="btn btn-outline-secondary btn-sm" id="mode-hex">HEX / RGB</button>
              <button class="btn btn-outline-secondary btn-sm" id="mode-picker">
                Seleccionar 5 colores
              </button>
            </div>

            <div id="input-hex">
              <div class="form-group">
                <label class="small">Color principal (hex o rgb)</label>
                <input
                  id="primary-input"
                  class="form-control small-input"
                  placeholder="#ed6436 or rgb(0,123,255)"
                />
              </div>
              <div class="form-group">
                <label class="small">Color secundario</label>
                <input
                  id="secondary-input"
                  class="form-control small-input"
                  placeholder="#6c757d or rgb(108,117,125)"
                />
              </div>
              <div class="form-group">
                <label class="small">Color texto 1</label>
                <input
                  id="text1-input"
                  class="form-control small-input"
                  placeholder="#212529 or rgb(33,37,41)"
                />
              </div>
              <div class="form-group">
                <label class="small">Color texto 2</label>
                <input
                  id="text2-input"
                  class="form-control small-input"
                  placeholder="#6c757d or rgb(108,117,125)"
                />
              </div>
              <div class="form-group">
                <label class="small">Color fondo</label>
                <input
                  id="bg-input"
                  class="form-control small-input"
                  placeholder="#f8f9fa or rgb(248,249,250)"
                />
              </div>
            </div>

            <div id="input-picker" style="display: none">
              <div class="form-group">
                <label class="small">Color principal</label>
                <input type="color" id="primary-picker" class="form-control" value="#ed6436" />
              </div>
              <div class="form-group">
                <label class="small">Color secundario</label>
                <input type="color" id="secondary-picker" class="form-control" value="#6c757d" />
              </div>
              <div class="form-group">
                <label class="small">Color texto 1</label>
                <input type="color" id="text1-picker" class="form-control" value="#212529" />
              </div>
              <div class="form-group">
                <label class="small">Color texto 2</label>
                <input type="color" id="text2-picker" class="form-control" value="#6c757d" />
              </div>
              <div class="form-group">
                <label class="small">Color fondo</label>
                <input type="color" id="bg-picker" class="form-control" value="#f8f9fa" />
              </div>
            </div>

            <div class="d-flex justify-content-between mt-2">
              <button id="apply-palette" class="btn btn-sm btn-dark">Aplicar</button>
              <button id="reset-palette" class="btn btn-sm btn-outline-secondary">Restaurar</button>
            </div>
          </div>

          <div class="panel-section">
            <h5>Guardar paleta</h5>
            <div class="form-group">
              <input
                id="palette-name"
                class="form-control small-input"
                placeholder="Nombre de paleta (ej. 'Invierno')"
              />
            </div>
            <div class="d-flex justify-content-between">
              <button id="save-palette" class="btn btn-sm btn-primary">Guardar</button>
            </div>
          </div>
        </div>

        <!-- Typography Tab -->
        <div class="tab-pane fade" id="typography" role="tabpanel">
          <div class="panel-section">
            <h5>Tamaños (px)</h5>
            <div class="form-group">
              <label class="small">Tamaño títulos (px)</label>
              <input
                id="title-size"
                type="number"
                min="8"
                class="form-control small-input"
                placeholder="40"
                value="40"
              />
            </div>
            <div class="form-group">
              <label class="small">Tamaño subtítulos (px)</label>
              <input
                id="subtitle-size"
                type="number"
                min="8"
                class="form-control small-input"
                placeholder="20"
                value="20"
              />
            </div>
            <div class="form-group">
              <label class="small">Tamaño texto (px)</label>
              <input
                id="text-size"
                type="number"
                min="8"
                class="form-control small-input"
                placeholder="16"
                value="16"
              />
            </div>
            <div class="d-flex justify-content-between mt-2">
              <button id="apply-typography" class="btn btn-sm btn-dark">Aplicar</button>
              <button id="reset-typography" class="btn btn-sm btn-outline-secondary">
                Restaurar
              </button>
            </div>
          </div>

          <div class="panel-section">
            <h5>Tipografías</h5>
            <div class="form-group">
              <label class="small">Tipografía de títulos</label>
              <!-- valores sencillos: nombre de la familia (sin comillas ni , sans-serif) -->
              <select id="title-font" class="form-control small-input">
                <option value="Nunito">Nunito</option>
                <option value="Nunito Sans">Nunito Sans</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Roboto">Roboto</option>
              </select>
            </div>
            <div class="form-group">
              <label class="small">Tipografía de texto</label>
              <select id="text-font" class="form-control small-input">
                <option value="Nunito Sans">Nunito Sans</option>
                <option value="Nunito">Nunito</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Roboto">Roboto</option>
              </select>
            </div>

            <!-- Upload fonts -->
            <div class="form-group">
              <label class="small">Subir fuente (TTF / OTF)</label>
              <input id="font-upload" type="file" accept=".ttf,.otf" class="form-control-file" />
              <small class="form-text text-muted"
                >Sube un archivo .ttf o .otf para añadirlo a las opciones.</small
              >
            </div>

            <!-- NEW: name input for typography (same pattern as palette) -->
            <div class="form-group">
              <label class="small">Nombre de la tipografía</label>
              <input
                id="typography-name"
                class="form-control small-input"
                placeholder="Nombre (ej. 'Titulares grandes')"
              />
            </div>

            <div class="d-flex justify-content-between mt-2">
              <button id="save-typography" class="btn btn-sm btn-primary">
                Guardar tipografía
              </button>
            </div>
          </div>
        </div>

        <!-- Saved Tab -->
        <div class="tab-pane fade" id="saved" role="tabpanel">
          <div class="panel-section">
            <h5>Paletas guardadas</h5>
            <div id="saved-palettes-list" class="mb-2"></div>
          </div>
          <div class="panel-section">
            <h5>Tipografías guardadas</h5>
            <div id="saved-typographies-list"></div>
          </div>
          <div class="d-flex justify-content-between mt-2">
            <button id="clear-all" class="btn btn-sm btn-outline-danger">Eliminar todo</button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Content (moved to the right) -->
    <!-- WRAP the preview area inside .preview-root so all CSS variables are scoped -->
    <div class="preview-root">
      <div class="content-wrapper">
        <!-- Topbar Start -->
        <div class="container-fluid">
          <div class="row py-3 px-lg-5">
            <div class="col-lg-4">
              <a href="" class="navbar-brand d-none d-lg-block">
                <h1 class="m-0 display-5 text-capitalize">
                  <span class="text-primary">Pet</span>Lover
                </h1>
              </a>
            </div>
            <div class="col-lg-8 text-center text-lg-right">
              <div class="d-inline-flex align-items-center">
                <div class="d-inline-flex flex-column text-center pr-3 border-right">
                  <p>Opening Hours</p>
                  <p class="m-0">8.00AM - 9.00PM</p>
                </div>
                <div class="d-inline-flex flex-column text-center px-3 border-right">
                  <p>Email Us</p>
                  <p class="m-0">info@example.com</p>
                </div>
                <div class="d-inline-flex flex-column text-center pl-3">
                  <p>Call Us</p>
                  <p class="m-0">+012 345 6789</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Topbar End -->

        <!-- Navbar Start -->
        <div class="container-fluid p-0">
          <nav class="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-lg-5">
            <a href="" class="navbar-brand d-block d-lg-none">
              <h1 class="m-0 display-5 text-capitalize font-italic text-white">
                <span class="text-primary">Safety</span>First
              </h1>
            </a>
            <button
              type="button"
              class="navbar-toggler"
              data-toggle="collapse"
              data-target="#navbarCollapse"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-between px-3" id="navbarCollapse">
              <div class="navbar-nav mr-auto py-0">
                <a class="nav-item nav-link active">Home</a>
                <a class="nav-item nav-link">About</a>
                <a class="nav-item nav-link">Service</a>
                <a class="nav-item nav-link">Price</a>
                <a class="nav-item nav-link">Booking</a>
                <div class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" data-toggle="dropdown">Pages</a>
                  <div class="dropdown-menu rounded-0 m-0">
                    <a class="dropdown-item">Blog Grid</a>
                    <a class="dropdown-item">Blog Detail</a>
                  </div>
                </div>
              </div>
              <a class="btn btn-lg btn-primary px-3 d-none d-lg-block">Log In</a>
            </div>
          </nav>
        </div>
        <!-- Navbar End -->

        <!-- Booking Start (Preview Area) -->
        <div class="container-fluid bg-light">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-5">
                <div class="bg-primary py-5 px-4 px-sm-5">
                  <form class="py-5">
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-control border-0 p-4"
                        placeholder="Your Name"
                        required="required"
                      />
                    </div>
                    <div class="form-group">
                      <input
                        type="email"
                        class="form-control border-0 p-4"
                        placeholder="Your Email"
                        required="required"
                      />
                    </div>
                    <div class="form-group">
                      <div class="date" id="date" data-target-input="nearest">
                        <input
                          type="text"
                          class="form-control border-0 p-4 datetimepicker-input"
                          placeholder="Reservation Date"
                          data-target="#date"
                          data-toggle="datetimepicker"
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="time" id="time" data-target-input="nearest">
                        <input
                          type="text"
                          class="form-control border-0 p-4 datetimepicker-input"
                          placeholder="Reservation Time"
                          data-target="#time"
                          data-toggle="datetimepicker"
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <select class="custom-select border-0 px-4" style="height: 47px">
                        <option selected>Select A Service</option>
                        <option value="1">Service 1</option>
                        <option value="2">Service 1</option>
                        <option value="3">Service 1</option>
                      </select>
                    </div>
                    <div>
                      <button class="btn btn-dark btn-block border-0 py-3" type="submit">
                        Book Now
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div class="col-lg-7 py-5 py-lg-0 px-3 px-lg-5">
                <h4 class="text-secondary mb-3">Going for a vacation?</h4>
                <h1 class="display-4 mb-4">Book For <span class="text-primary">Your Pet</span></h1>
                <p>
                  Labore vero lorem eos sed aliquy ipsum aliquy sed. Vero dolore dolore takima ipsum
                  lorem rebum
                </p>
                <div class="row py-2">
                  <div class="col-sm-6">
                    <div class="d-flex flex-column">
                      <div class="d-flex align-items-center mb-2">
                        <h1 class="flaticon-house font-weight-normal text-secondary m-0 mr-3"></h1>
                        <h5 class="text-truncate m-0">Pet Boarding</h5>
                      </div>
                      <p>Diam amet eos at no eos sit lorem, amet rebum ipsum clita stet</p>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="d-flex flex-column">
                      <div class="d-flex align-items-center mb-2">
                        <h1 class="flaticon-food font-weight-normal text-secondary m-0 mr-3"></h1>
                        <h5 class="text-truncate m-0">Pet Feeding</h5>
                      </div>
                      <p>Diam amet eos at no eos sit lorem, amet rebum ipsum clita stet</p>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="d-flex flex-column">
                      <div class="d-flex align-items-center mb-2">
                        <h1
                          class="flaticon-grooming font-weight-normal text-secondary m-0 mr-3"
                        ></h1>
                        <h5 class="text-truncate m-0">Pet Grooming</h5>
                      </div>
                      <p class="m-0">
                        Diam amet eos at no eos sit lorem, amet rebum ipsum clita stet
                      </p>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="d-flex flex-column">
                      <div class="d-flex align-items-center mb-2">
                        <h1 class="flaticon-toy font-weight-normal text-secondary m-0 mr-3"></h1>
                        <h5 class="text-truncate m-0">Pet Tranning</h5>
                      </div>
                      <p class="m-0">
                        Diam amet eos at no eos sit lorem, amet rebum ipsum clita stet
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Booking End -->
      </div>
    </div>
    <!-- preview-root end -->

    <!-- Custom context menu -->
    <div id="custom-context-menu" role="menu" aria-hidden="true">
      <div class="cm-item" data-action="apply">Aplicar</div>
      <div class="cm-item" data-action="edit">Editar</div>
      <div class="cm-item" data-action="delete">Borrar</div>
    </div>

    <!-- Edit panel (rename + color/font/size editor) -->
    <div id="edit-panel" aria-hidden="true">
      <label id="edit-panel-label">Editar</label>
      <div id="edit-panel-content">
        <!-- contenido dinámico -->
      </div>
      <div
        style="
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-top: 6px;
        "
      >
        <button id="edit-panel-save" class="btn btn-sm btn-primary">Guardar</button>
        <button id="edit-panel-cancel" class="btn btn-sm btn-outline-secondary">Cancelar</button>
      </div>
    </div>

    <!-- Confirm panel (custom) -->
    <div id="confirm-panel" role="dialog" aria-hidden="true">
      <p id="confirm-panel-message">¿Estás seguro?</p>
      <div style="display: flex; gap: 8px; justify-content: flex-end">
        <button id="confirm-cancel" class="btn btn-sm btn-outline-secondary">Cancelar</button>
        <button id="confirm-ok" class="btn btn-sm btn-danger">Eliminar</button>
      </div>
    </div>

    <!-- Toast container -->
    <div id="toast-container" aria-live="polite" aria-atomic="true"></div>
  `,
  styleUrls: ['./config.css'],
})
export class ConfigPage implements AfterViewInit, OnDestroy {
  private cleanupFns: Array<() => void> = [];
  private contextState: any = { visible: false, targetType: null, targetIndex: null };
  private confirmCallback: (() => void) | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // initialize everything once template is rendered
    this.initHandlers();
    this.initFromPreview();
  }

  ngOnDestroy(): void {
    // remove all listeners
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
  }

  /* -------------------------
     Utilities & storage
     ------------------------- */
  private normalizeColorInput(value: string | null): string | null {
    if (!value) return null;
    value = String(value).trim();
    if (/^rgb\(/i.test(value)) return value;
    if (/^[0-9A-Fa-f]{6}$/.test(value)) return '#' + value;
    if (/^[0-9A-Fa-f]{3}$/.test(value)) return '#' + value;
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)) return value;
    return null;
  }

  private toHexIfPossible(colorStr: string | null): string | null {
    if (!colorStr) return null;
    colorStr = colorStr.trim();
    if (colorStr.startsWith('#')) return colorStr;
    const m = colorStr.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
    if (!m) return null;
    const r = parseInt(m[1]),
      g = parseInt(m[2]),
      b = parseInt(m[3]);
    return '#' + [r, g, b].map((x) => ('0' + x.toString(16)).slice(-2)).join('');
  }

  private getSaved(key: string): any[] {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  }
  private setSaved(key: string, arr: any[]): void {
    localStorage.setItem(key, JSON.stringify(arr || []));
  }

  private escapeHtml(text: string): string {
    const map: any = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text || '').replace(/[&<>"']/g, (m) => map[m]);
  }

  private showToast(message: string, type = 'success', timeout = 3000) {
    const container = this.el.nativeElement.querySelector('#toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast-item ' + (type || '');
    t.textContent = message;

    // Ensure visibility even if global styles override .toast-item background
    const bgMap: any = {
      success: '#2f855a',
      info: '#3182ce',
      warn: '#dd6b20',
      default: '#0b0b0b',
    };
    const bg = bgMap[type] || bgMap.default;
    t.style.backgroundColor = bg;
    t.style.color = '#fff';
    t.style.padding = t.style.padding || '10px 14px';
    t.style.borderRadius = t.style.borderRadius || '8px';
    t.style.boxShadow = t.style.boxShadow || '0 6px 18px rgba(0,0,0,0.12)';

    container.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      t.style.opacity = '0';
      t.style.transform = 'translateY(-6px)';
    }, timeout - 300);
    setTimeout(() => {
      if (container.contains(t)) container.removeChild(t);
    }, timeout);
  }

  /* -------------------------
     Apply functions (manipulate preview wrapper CSS variables)
     ------------------------- */
  private applyPaletteToElement(el: HTMLElement | null, p: any) {
    if (!p || !el) return;
    const style = el.style;
    if (p.primary) style.setProperty('--color-primary', p.primary);
    if (p.secondary) style.setProperty('--color-secondary', p.secondary);
    if (p.text1) style.setProperty('--color-text-1', p.text1);
    if (p.text2) style.setProperty('--color-text-2', p.text2);
    if (p.bg) style.setProperty('--color-bg', p.bg);

    // Also apply to :root so the changes affect the whole app (other pages)
    try {
      const rootStyle =
        (document && document.documentElement && document.documentElement.style) || null;
      if (rootStyle) {
        if (p.primary) rootStyle.setProperty('--color-primary', p.primary);
        if (p.secondary) rootStyle.setProperty('--color-secondary', p.secondary);
        if (p.text1) rootStyle.setProperty('--color-text-1', p.text1);
        if (p.text2) rootStyle.setProperty('--color-text-2', p.text2);
        if (p.bg) rootStyle.setProperty('--color-bg', p.bg);
      }
    } catch (e) {
      /* ignore in non-browser contexts */
    }
  }

  private applyTypographyToElement(el: HTMLElement | null, t: any) {
    if (!el) return;
    const style = el.style;
    if (t.titleFont) style.setProperty('--title-font', t.titleFont);
    if (t.textFont) style.setProperty('--text-font', t.textFont);

    if (t.titleSize !== undefined && t.titleSize !== null) {
      if (typeof t.titleSize === 'number' || /^[0-9]+$/.test(String(t.titleSize)))
        style.setProperty('--title-size', String(t.titleSize) + 'px');
      else style.setProperty('--title-size', t.titleSize);
    }
    if (t.subtitleSize !== undefined && t.subtitleSize !== null) {
      if (typeof t.subtitleSize === 'number' || /^[0-9]+$/.test(String(t.subtitleSize)))
        style.setProperty('--subtitle-size', String(t.subtitleSize) + 'px');
      else style.setProperty('--subtitle-size', t.subtitleSize);
    }
    if (t.textSize !== undefined && t.textSize !== null) {
      if (typeof t.textSize === 'number' || /^[0-9]+$/.test(String(t.textSize)))
        style.setProperty('--text-size', String(t.textSize) + 'px');
      else style.setProperty('--text-size', t.textSize);
    }

    // Also apply typography to :root so other pages inherit changes
    try {
      const rootStyle =
        (document && document.documentElement && document.documentElement.style) || null;
      if (rootStyle) {
        if (t.titleFont) rootStyle.setProperty('--title-font', t.titleFont);
        if (t.textFont) rootStyle.setProperty('--text-font', t.textFont);
        if (t.titleSize !== undefined && t.titleSize !== null) {
          if (typeof t.titleSize === 'number' || /^[0-9]+$/.test(String(t.titleSize)))
            rootStyle.setProperty('--title-size', String(t.titleSize) + 'px');
          else rootStyle.setProperty('--title-size', t.titleSize);
        }
        if (t.subtitleSize !== undefined && t.subtitleSize !== null) {
          if (typeof t.subtitleSize === 'number' || /^[0-9]+$/.test(String(t.subtitleSize)))
            rootStyle.setProperty('--subtitle-size', String(t.subtitleSize) + 'px');
          else rootStyle.setProperty('--subtitle-size', t.subtitleSize);
        }
        if (t.textSize !== undefined && t.textSize !== null) {
          if (typeof t.textSize === 'number' || /^[0-9]+$/.test(String(t.textSize)))
            rootStyle.setProperty('--text-size', String(t.textSize) + 'px');
          else rootStyle.setProperty('--text-size', t.textSize);
        }
      }
    } catch (e) {
      /* ignore in non-browser contexts */
    }
  }

  private readCurrentPaletteFromPreview(): any {
    const previewRoot: HTMLElement | null = this.el.nativeElement.querySelector('.preview-root');
    if (!previewRoot) return {};
    const styles = getComputedStyle(previewRoot);
    return {
      primary: styles.getPropertyValue('--color-primary').trim() || '#ed6436',
      secondary: styles.getPropertyValue('--color-secondary').trim() || '#6c757d',
      text1: styles.getPropertyValue('--color-text-1').trim() || '#212529',
      text2: styles.getPropertyValue('--color-text-2').trim() || '#6c757d',
      bg: styles.getPropertyValue('--color-bg').trim() || '#f8f9fa',
    };
  }

  private readCurrentTypographyFromPreview(): any {
    const previewRoot: HTMLElement | null = this.el.nativeElement.querySelector('.preview-root');
    if (!previewRoot) return {};
    const styles = getComputedStyle(previewRoot);
    const t = styles.getPropertyValue('--title-size').trim() || '40px';
    const s = styles.getPropertyValue('--subtitle-size').trim() || '20px';
    const x = styles.getPropertyValue('--text-size').trim() || '16px';
    return {
      titleFont: styles.getPropertyValue('--title-font').trim() || '"Nunito", sans-serif',
      textFont: styles.getPropertyValue('--text-font').trim() || '"Nunito Sans", sans-serif',
      titleSize: parseInt(t, 10) || 40,
      subtitleSize: parseInt(s, 10) || 20,
      textSize: parseInt(x, 10) || 16,
    };
  }

  /* -------------------------
     Main init: attach listeners & wire UI
     ------------------------- */
  private initHandlers(): void {
    const root = this.el.nativeElement as HTMLElement;
    const previewRoot = root.querySelector('.preview-root') as HTMLElement;
    // Manual tab handling: Bootstrap JS may not be present in Angular app,
    // so implement simple tab switching to make "Tipografía" / "Guardados" accessible.
    const tabLinks = Array.from(root.querySelectorAll('#configTabs .nav-link')) as HTMLElement[];
    const tabPanes = Array.from(root.querySelectorAll('.tab-pane')) as HTMLElement[];
    const activateTab = (link: HTMLElement) => {
      // deactivate all links/panes
      tabLinks.forEach((l) => {
        l.classList.remove('active');
        l.setAttribute('aria-selected', 'false');
      });
      tabPanes.forEach((p) => {
        p.classList.remove('show', 'active');
      });
      // activate target
      link.classList.add('active');
      link.setAttribute('aria-selected', 'true');
      const target = link.getAttribute('href') || link.getAttribute('data-target');
      if (target) {
        const pane = root.querySelector(target) as HTMLElement;
        if (pane) pane.classList.add('show', 'active');
      }
    };
    // attach listeners and register cleanup
    tabLinks.forEach((lnk) => {
      const fn = this.renderer.listen(lnk, 'click', (ev: Event) => {
        ev.preventDefault();
        activateTab(lnk);
      });
      this.cleanupFns.push(fn);
    });

    // Elements (many)
    const modeHex = root.querySelector('#mode-hex') as HTMLElement;
    const modePicker = root.querySelector('#mode-picker') as HTMLElement;
    const inputHex = root.querySelector('#input-hex') as HTMLElement;
    const inputPicker = root.querySelector('#input-picker') as HTMLElement;

    const primaryInput = root.querySelector('#primary-input') as HTMLInputElement;
    const secondaryInput = root.querySelector('#secondary-input') as HTMLInputElement;
    const text1Input = root.querySelector('#text1-input') as HTMLInputElement;
    const text2Input = root.querySelector('#text2-input') as HTMLInputElement;
    const bgInput = root.querySelector('#bg-input') as HTMLInputElement;

    const primaryPicker = root.querySelector('#primary-picker') as HTMLInputElement;
    const secondaryPicker = root.querySelector('#secondary-picker') as HTMLInputElement;
    const text1Picker = root.querySelector('#text1-picker') as HTMLInputElement;
    const text2Picker = root.querySelector('#text2-picker') as HTMLInputElement;
    const bgPicker = root.querySelector('#bg-picker') as HTMLInputElement;

    const applyPaletteBtn = root.querySelector('#apply-palette') as HTMLElement;
    const resetPaletteBtn = root.querySelector('#reset-palette') as HTMLElement;
    const savePaletteBtn = root.querySelector('#save-palette') as HTMLElement;
    const paletteNameInput = root.querySelector('#palette-name') as HTMLInputElement;

    const titleSize = root.querySelector('#title-size') as HTMLInputElement;
    const subtitleSize = root.querySelector('#subtitle-size') as HTMLInputElement;
    const textSize = root.querySelector('#text-size') as HTMLInputElement;
    const applyTypographyBtn = root.querySelector('#apply-typography') as HTMLElement;
    const resetTypographyBtn = root.querySelector('#reset-typography') as HTMLElement;
    const titleFont = root.querySelector('#title-font') as HTMLSelectElement;
    const textFont = root.querySelector('#text-font') as HTMLSelectElement;
    const saveTypographyBtn = root.querySelector('#save-typography') as HTMLElement;
    const fontUploadInput = root.querySelector('#font-upload') as HTMLInputElement;
    const typographyNameInput = root.querySelector('#typography-name') as HTMLInputElement;

    const savedPalettesList = root.querySelector('#saved-palettes-list') as HTMLElement;
    const savedTypographyList = root.querySelector('#saved-typographies-list') as HTMLElement;
    const clearAllBtn = root.querySelector('#clear-all') as HTMLElement;

    const contextMenu = root.querySelector('#custom-context-menu') as HTMLElement;

    const editPanel = root.querySelector('#edit-panel') as HTMLElement;
    const editPanelLabel = root.querySelector('#edit-panel-label') as HTMLElement;
    const editPanelContent = root.querySelector('#edit-panel-content') as HTMLElement;
    const editSaveBtn = root.querySelector('#edit-panel-save') as HTMLElement;
    const editCancelBtn = root.querySelector('#edit-panel-cancel') as HTMLElement;

    const confirmPanel = root.querySelector('#confirm-panel') as HTMLElement;
    const confirmMessage = root.querySelector('#confirm-panel-message') as HTMLElement;
    const confirmOk = root.querySelector('#confirm-ok') as HTMLElement;
    const confirmCancel = root.querySelector('#confirm-cancel') as HTMLElement;

    // Mode toggles
    if (modeHex && modePicker && inputHex && inputPicker) {
      this.cleanupFns.push(
        this.renderer.listen(modeHex, 'click', () => {
          inputHex.style.display = 'block';
          inputPicker.style.display = 'none';
        })
      );
      this.cleanupFns.push(
        this.renderer.listen(modePicker, 'click', () => {
          inputHex.style.display = 'none';
          inputPicker.style.display = 'block';
        })
      );
    }

    // Apply palette
    if (applyPaletteBtn) {
      this.cleanupFns.push(
        this.renderer.listen(applyPaletteBtn, 'click', () => {
          let palette: any = {};
          if (inputHex && inputHex.style.display !== 'none') {
            const p =
              this.normalizeColorInput(primaryInput?.value) ||
              this.readCurrentPaletteFromPreview().primary;
            const s =
              this.normalizeColorInput(secondaryInput?.value) ||
              this.readCurrentPaletteFromPreview().secondary;
            const t1 =
              this.normalizeColorInput(text1Input?.value) ||
              this.readCurrentPaletteFromPreview().text1;
            const t2 =
              this.normalizeColorInput(text2Input?.value) ||
              this.readCurrentPaletteFromPreview().text2;
            const bg =
              this.normalizeColorInput(bgInput?.value) || this.readCurrentPaletteFromPreview().bg;
            palette = { primary: p, secondary: s, text1: t1, text2: t2, bg: bg };
          } else {
            palette = {
              primary: primaryPicker?.value,
              secondary: secondaryPicker?.value,
              text1: text1Picker?.value,
              text2: text2Picker?.value,
              bg: bgPicker?.value,
            };
          }
          this.applyPaletteToElement(previewRoot, palette);
        })
      );
    }

    // Reset palette
    if (resetPaletteBtn) {
      this.cleanupFns.push(
        this.renderer.listen(resetPaletteBtn, 'click', () => {
          const defaults = {
            primary: '#ed6436',
            secondary: '#6c757d',
            text1: '#212529',
            text2: '#6c757d',
            bg: '#f8f9fa',
          };
          this.applyPaletteToElement(previewRoot, defaults);
          if (primaryPicker) primaryPicker.value = defaults.primary;
          if (secondaryPicker) secondaryPicker.value = defaults.secondary;
          if (text1Picker) text1Picker.value = defaults.text1;
          if (text2Picker) text2Picker.value = defaults.text2;
          if (bgPicker) bgPicker.value = defaults.bg;
          if (primaryInput) primaryInput.value = '';
          if (secondaryInput) secondaryInput.value = '';
          if (text1Input) text1Input.value = '';
          if (text2Input) text2Input.value = '';
          if (bgInput) bgInput.value = '';
        })
      );
    }

    // Save palette
    if (savePaletteBtn) {
      this.cleanupFns.push(
        this.renderer.listen(savePaletteBtn, 'click', () => {
          const name = (paletteNameInput?.value || '').trim();
          if (!name) {
            this.showToast('Escribe un nombre para la paleta antes de guardar', 'warn');
            return;
          }
          const palette = this.readCurrentPaletteFromPreview();
          const arr = this.getSaved('my_palettes');
          arr.push({ name: name, data: palette, created: Date.now() });
          this.setSaved('my_palettes', arr);
          if (paletteNameInput) paletteNameInput.value = '';
          this.renderSavedLists();
          this.showToast('Paleta guardada correctamente', 'success');
        })
      );
    }

    // Typography apply/reset/save
    if (applyTypographyBtn) {
      this.cleanupFns.push(
        this.renderer.listen(applyTypographyBtn, 'click', () => {
          const makeFamily = (val: string) => {
            if (!val) return null;
            if (/,/.test(val) || /^".*"$/.test(val) || /^'.*'$/.test(val)) return val;
            return `"${val}", sans-serif`;
          };
          const sizes = {
            titleSize: Number(titleSize?.value) || 40,
            subtitleSize: Number(subtitleSize?.value) || 20,
            textSize: Number(textSize?.value) || 16,
          };
          this.applyTypographyToElement(previewRoot, {
            titleFont: makeFamily(titleFont?.value),
            textFont: makeFamily(textFont?.value),
            titleSize: sizes.titleSize,
            subtitleSize: sizes.subtitleSize,
            textSize: sizes.textSize,
          });
        })
      );
    }
    if (resetTypographyBtn) {
      this.cleanupFns.push(
        this.renderer.listen(resetTypographyBtn, 'click', () => {
          const defaults = {
            titleFont: '"Nunito", sans-serif',
            textFont: '"Nunito Sans", sans-serif',
            titleSize: 40,
            subtitleSize: 20,
            textSize: 16,
          };
          if (titleFont) titleFont.value = 'Nunito';
          if (textFont) textFont.value = 'Nunito Sans';
          if (titleSize) titleSize.value = String(defaults.titleSize);
          if (subtitleSize) subtitleSize.value = String(defaults.subtitleSize);
          if (textSize) textSize.value = String(defaults.textSize);
          this.applyTypographyToElement(previewRoot, defaults);
        })
      );
    }
    if (saveTypographyBtn) {
      this.cleanupFns.push(
        this.renderer.listen(saveTypographyBtn, 'click', () => {
          const name = (typographyNameInput?.value || '').trim();
          if (!name) {
            this.showToast('Escribe un nombre para la tipografía antes de guardar', 'warn');
            return;
          }
          const t = {
            name: name,
            data: {
              titleFont: titleFont?.value,
              textFont: textFont?.value,
              titleSize: Number(titleSize?.value) || 40,
              subtitleSize: Number(subtitleSize?.value) || 20,
              textSize: Number(textSize?.value) || 16,
            },
            created: Date.now(),
          };
          const arr = this.getSaved('my_typographies');
          arr.push(t);
          this.setSaved('my_typographies', arr);
          if (typographyNameInput) typographyNameInput.value = '';
          this.renderSavedLists();
          this.showToast('Tipografía guardada correctamente', 'success');
        })
      );
    }

    // Font upload
    if (fontUploadInput) {
      this.cleanupFns.push(
        this.renderer.listen(fontUploadInput, 'change', (ev: any) => {
          const file = ev.target.files && ev.target.files[0];
          if (!file) return;
          const allowed = ['.ttf', '.otf'];
          const name = file.name.toLowerCase();
          if (!allowed.some((ext) => name.endsWith(ext))) {
            this.showToast('Formato no soportado. Sube .ttf o .otf', 'warn');
            fontUploadInput.value = '';
            return;
          }
          const family = 'UploadedFont_' + Date.now();
          const url = URL.createObjectURL(file);
          const style = document.createElement('style');
          const fmt = name.endsWith('.otf') ? 'opentype' : 'truetype';
          style.innerHTML = `
          @font-face {
            font-family: "${family}";
            src: url("${url}") format("${fmt}");
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `;
          document.head.appendChild(style);

          const addOption = (select: HTMLSelectElement, familyName: string, label?: string) => {
            const opt = document.createElement('option');
            opt.value = familyName;
            opt.text = label || familyName;
            select.appendChild(opt);
          };
          if (titleFont) addOption(titleFont, family, file.name + ' (uploaded)');
          if (textFont) addOption(textFont, family, file.name + ' (uploaded)');

          if (titleFont) titleFont.value = family;
          if (textFont) textFont.value = family;

          this.applyTypographyToElement(previewRoot, {
            titleFont: `"${family}", sans-serif`,
            textFont: `"${family}", sans-serif`,
            titleSize: Number(titleSize?.value) || 40,
            subtitleSize: Number(subtitleSize?.value) || 20,
            textSize: Number(textSize?.value) || 16,
          });

          this.showToast('Fuente subida y añadida a las opciones', 'info');
          fontUploadInput.value = '';
        })
      );
    }

    // Saved lists render function is defined below; call now to attach contextmenu listeners when created
    // Context menu helpers (global click/keydown)
    this.cleanupFns.push(
      this.renderer.listen(document, 'click', (ev: any) => {
        if (contextMenu && !contextMenu.contains(ev.target)) this.hideContextMenu(contextMenu);
      })
    );
    this.cleanupFns.push(
      this.renderer.listen(document, 'keydown', (ev: KeyboardEvent) => {
        if (ev.key === 'Escape') {
          this.hideContextMenu(contextMenu);
          if (editPanel && editPanel.style.display === 'block') editPanel.style.display = 'none';
          if (confirmPanel && confirmPanel.style.display === 'block')
            this.closeConfirm(confirmPanel);
        }
      })
    );

    // Confirm buttons
    if (confirmCancel) {
      this.cleanupFns.push(
        this.renderer.listen(confirmCancel, 'click', () => this.closeConfirm(confirmPanel))
      );
    }
    if (confirmOk) {
      this.cleanupFns.push(
        this.renderer.listen(confirmOk, 'click', () => {
          if (typeof this.confirmCallback === 'function') this.confirmCallback();
          this.closeConfirm(confirmPanel);
        })
      );
    }

    // Clear all
    if (clearAllBtn) {
      this.cleanupFns.push(
        this.renderer.listen(clearAllBtn, 'click', () => {
          this.openConfirm(
            confirmMessage,
            confirmPanel,
            'Eliminar todas las paletas y tipografías guardadas?',
            () => {
              localStorage.removeItem('my_palettes');
              localStorage.removeItem('my_typographies');
              this.renderSavedLists();
              this.showToast('Todo eliminado', 'success');
            }
          );
        })
      );
    }

    // live pickers apply
    [primaryPicker, secondaryPicker, text1Picker, text2Picker, bgPicker].forEach((el) => {
      if (!el) return;
      this.cleanupFns.push(
        this.renderer.listen(el, 'input', () => {
          this.applyPaletteToElement(previewRoot, {
            primary: primaryPicker?.value,
            secondary: secondaryPicker?.value,
            text1: text1Picker?.value,
            text2: text2Picker?.value,
            bg: bgPicker?.value,
          });
        })
      );
    });

    // live font select change
    [titleFont, textFont].forEach((el) => {
      if (!el) return;
      this.cleanupFns.push(
        this.renderer.listen(el, 'change', () => {
          const makeFamily = (val: string) => {
            if (!val) return null;
            if (/,/.test(val) || /^".*"$/.test(val) || /^'.*'$/.test(val)) return val;
            return `"${val}", sans-serif`;
          };
          this.applyTypographyToElement(previewRoot, {
            titleFont: makeFamily(titleFont?.value),
            textFont: makeFamily(textFont?.value),
            titleSize: Number(titleSize?.value) || 40,
            subtitleSize: Number(subtitleSize?.value) || 20,
            textSize: Number(textSize?.value) || 16,
          });
        })
      );
    });

    // Save reference elements for use by renderSavedLists and edit panel
    // Closure captures
    (this as any)._ui = {
      root,
      previewRoot,
      savedPalettesList,
      savedTypographyList,
      contextMenu,
      editPanel,
      editPanelLabel,
      editPanelContent,
      editSaveBtn,
      editCancelBtn,
      confirmPanel,
      confirmMessage,
    };
    // initial render of saved lists
    this.renderSavedLists();
  }

  /* -------------------------
     Context menu & edit/confirm panels
     ------------------------- */
  private showContextMenu(
    x: number,
    y: number,
    type: string,
    index: number,
    contextMenuEl: HTMLElement
  ) {
    this.contextState.visible = true;
    this.contextState.targetType = type;
    this.contextState.targetIndex = index;
    contextMenuEl.style.left = x + 'px';
    contextMenuEl.style.top = y + 'px';
    contextMenuEl.style.display = 'block';
  }

  private hideContextMenu(contextMenuEl: HTMLElement | null) {
    if (!contextMenuEl) return;
    contextMenuEl.style.display = 'none';
    this.contextState.visible = false;
    this.contextState.targetType = null;
    this.contextState.targetIndex = null;
  }

  private openConfirm(
    confirmMessageEl: HTMLElement | null,
    confirmPanelEl: HTMLElement | null,
    message: string,
    onConfirm: () => void
  ) {
    if (!confirmPanelEl || !confirmMessageEl) return;
    confirmMessageEl.textContent = message || '¿Estás seguro?';
    confirmPanelEl.style.display = 'block';
    confirmPanelEl.setAttribute('aria-hidden', 'false');
    this.confirmCallback = onConfirm;
  }

  private closeConfirm(confirmPanelEl: HTMLElement | null) {
    if (!confirmPanelEl) return;
    confirmPanelEl.style.display = 'none';
    confirmPanelEl.setAttribute('aria-hidden', 'true');
    this.confirmCallback = null;
  }

  /* -------------------------
     Render saved lists (creates DOM nodes similar to original script)
     ------------------------- */
  private renderSavedLists() {
    const ui = (this as any)._ui;
    if (!ui) return;
    const { savedPalettesList, savedTypographyList, previewRoot, root, contextMenu } = ui as any;

    // Palettes
    const pals = this.getSaved('my_palettes');
    savedPalettesList.innerHTML = '';
    if (!pals || pals.length === 0) {
      savedPalettesList.innerHTML = '<small class="text-muted">No hay paletas guardadas.</small>';
    } else {
      pals.forEach((p: any, idx: number) => {
        const item = document.createElement('div');
        item.className = 'saved-item';
        item.dataset['type'] = 'palette';
        item.dataset['index'] = String(idx);

        const left = document.createElement('div');
        left.innerHTML = `<div><strong style="font-size:.9rem">${this.escapeHtml(
          p.name
        )}</strong></div><div class="small text-muted">${new Date(
          p.created
        ).toLocaleString()}</div>`;

        const preview = document.createElement('div');
        // Inline preview styles so previews are visible even if global CSS overrides exist
        preview.className = 'palette-preview';
        preview.style.display = 'flex';
        preview.style.gap = '6px';
        preview.style.alignItems = 'center';
        preview.style.padding = '4px';
        preview.style.border = '1px solid #eee';
        preview.style.borderRadius = '6px';
        preview.style.background = '#fff';

        const parseColor = (c: string | undefined) => {
          if (!c) return null;
          const val = String(c).trim();
          const mRgb = val.match(/^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)$/i);
          if (mRgb) return [parseInt(mRgb[1]), parseInt(mRgb[2]), parseInt(mRgb[3])];
          let hex = val.replace('#', '').trim();
          if (/^[0-9A-Fa-f]{3}$/.test(hex))
            hex = hex
              .split('')
              .map((h) => h + h)
              .join('');
          if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
            return [
              parseInt(hex.substr(0, 2), 16),
              parseInt(hex.substr(2, 2), 16),
              parseInt(hex.substr(4, 2), 16),
            ];
          }
          return null;
        };
        const luminance = (rgb: number[] | null) => {
          if (!rgb) return 0;
          const [r, g, b] = rgb;
          return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        };

        ['primary', 'secondary', 'text1', 'text2', 'bg'].forEach((k) => {
          const s = document.createElement('div');
          // inline swatch baseline (avoid relying on external CSS)
          s.style.width = '22px';
          s.style.height = '22px';
          s.style.borderRadius = '3px';
          s.style.boxSizing = 'border-box';
          s.style.flex = '0 0 auto';
          const col = p.data && p.data[k] ? p.data[k] : '#ffffff';
          s.style.background = col;
          // stronger border if color is very light so it remains visible on white
          const rgb = parseColor(col);
          if (luminance(rgb) > 0.85) {
            s.style.border = '1px solid rgba(0,0,0,0.24)';
            s.style.boxShadow = 'inset 0 0 0 1px rgba(0,0,0,0.02)';
          } else {
            s.style.border = '1px solid rgba(0,0,0,0.08)';
          }
          preview.appendChild(s);
        });

        const loadBtn = document.createElement('button');
        loadBtn.className = 'btn btn-sm btn-outline-primary';
        loadBtn.textContent = 'Cargar';
        loadBtn.addEventListener('click', () => {
          this.applyPaletteToElement(previewRoot, p.data);
          this.showToast('Paleta aplicada', 'success');
        });

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '8px';
        wrapper.appendChild(preview);
        wrapper.appendChild(loadBtn);

        item.appendChild(left);
        item.appendChild(wrapper);
        savedPalettesList.appendChild(item);

        item.addEventListener('contextmenu', (evt: MouseEvent) => {
          evt.preventDefault();
          this.showContextMenu(evt.clientX, evt.clientY, 'palette', idx, contextMenu);
        });
      });
    }

    // Typographies
    const typs = this.getSaved('my_typographies');
    savedTypographyList.innerHTML = '';
    if (!typs || typs.length === 0) {
      savedTypographyList.innerHTML =
        '<small class="text-muted">No hay tipografías guardadas.</small>';
    } else {
      typs.forEach((t: any, idx: number) => {
        const item = document.createElement('div');
        item.className = 'saved-item';
        item.dataset['type'] = 'typography';
        item.dataset['index'] = String(idx);

        const left = document.createElement('div');
        left.innerHTML = `<div><strong style="font-size:.9rem">${this.escapeHtml(
          t.name
        )}</strong></div><div class="small text-muted">${new Date(
          t.created
        ).toLocaleString()}</div>`;

        // small preview for typography (inline styles so it doesn't depend on :root)
        const makeFamily = (val: string) => {
          if (!val) return null;
          if (/,/.test(val) || /^".*"$/.test(val) || /^'.*'$/.test(val)) return val;
          return `"${val}", sans-serif`;
        };
        const preview = document.createElement('div');
        preview.style.display = 'flex';
        preview.style.flexDirection = 'column';
        preview.style.justifyContent = 'center';
        preview.style.alignItems = 'center';
        preview.style.minWidth = '64px';
        preview.style.height = '44px';
        preview.style.padding = '6px';
        preview.style.border = '1px solid #eee';
        preview.style.borderRadius = '6px';
        preview.style.background = '#fff';
        preview.style.boxSizing = 'border-box';
        const sampleTitle = document.createElement('div');
        sampleTitle.textContent = 'Aa';
        sampleTitle.style.fontFamily = makeFamily(t.data.titleFont) || '"Nunito", sans-serif';
        sampleTitle.style.fontSize = (Number(t.data.titleSize) || 20) + 'px';
        sampleTitle.style.lineHeight = '1';
        sampleTitle.style.color = '#333';
        const sampleText = document.createElement('div');
        sampleText.textContent = 'ab';
        sampleText.style.fontFamily = makeFamily(t.data.textFont) || '"Nunito Sans", sans-serif';
        sampleText.style.fontSize = Math.max(12, (Number(t.data.textSize) || 16) - 4) + 'px';
        sampleText.style.lineHeight = '1';
        sampleText.style.color = '#666';
        preview.appendChild(sampleTitle);
        preview.appendChild(sampleText);

        const loadBtn = document.createElement('button');
        loadBtn.className = 'btn btn-sm btn-outline-primary';
        loadBtn.textContent = 'Cargar';
        loadBtn.addEventListener('click', () => {
          const makeFamilyInner = (val: string) => {
            if (!val) return null;
            if (/,/.test(val) || /^".*"$/.test(val) || /^'.*'$/.test(val)) return val;
            return `"${val}", sans-serif`;
          };
          this.applyTypographyToElement(previewRoot, {
            titleFont: makeFamilyInner(t.data.titleFont),
            textFont: makeFamilyInner(t.data.textFont),
            titleSize: Number(t.data.titleSize) || 40,
            subtitleSize: Number(t.data.subtitleSize) || 20,
            textSize: Number(t.data.textSize) || 16,
          });
          // update selects/inputs when loading
          const uiTitle = root.querySelector('#title-font') as HTMLSelectElement;
          const uiText = root.querySelector('#text-font') as HTMLSelectElement;
          const uiTitleSize = root.querySelector('#title-size') as HTMLInputElement;
          const uiSubtitleSize = root.querySelector('#subtitle-size') as HTMLInputElement;
          const uiTextSize = root.querySelector('#text-size') as HTMLInputElement;
          if (uiTitle) uiTitle.value = t.data.titleFont;
          if (uiText) uiText.value = t.data.textFont;
          if (uiTitleSize) uiTitleSize.value = String(t.data.titleSize);
          if (uiSubtitleSize) uiSubtitleSize.value = String(t.data.subtitleSize);
          if (uiTextSize) uiTextSize.value = String(t.data.textSize);
          this.showToast('Tipografía aplicada', 'success');
        });

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '8px';
        // append preview before load button (left side)
        wrapper.appendChild(preview);
        wrapper.appendChild(loadBtn);

        item.appendChild(left);
        item.appendChild(wrapper);
        savedTypographyList.appendChild(item);

        item.addEventListener('contextmenu', (evt: MouseEvent) => {
          evt.preventDefault();
          this.showContextMenu(evt.clientX, evt.clientY, 'typography', idx, contextMenu);
        });
      });
    }

    // context menu click handling (delegate)
    // remove previous listeners on contextMenu to avoid duplicates
    if ((this as any)._contextMenuListener) {
      (this as any)._contextMenuListener(); // cleanup old
    }
    if (contextMenu) {
      (this as any)._contextMenuListener = this.renderer.listen(contextMenu, 'click', (ev: any) => {
        const action = ev.target?.getAttribute?.('data-action');
        if (!action) return;
        const type = this.contextState.targetType;
        const idx = this.contextState.targetIndex;
        this.hideContextMenu(contextMenu);
        if (type === 'palette') {
          const pals = this.getSaved('my_palettes');
          const p = pals && pals[idx];
          if (!p) {
            this.showToast('Elemento no encontrado', 'warn');
            return;
          }
          if (action === 'apply') {
            this.applyPaletteToElement(previewRoot, p.data);
            this.showToast('Paleta aplicada', 'success');
          } else if (action === 'edit') {
            this.openEditPanel('palette', idx, (updated: any) => {
              const arr = this.getSaved('my_palettes');
              arr[idx] = {
                name: updated.name,
                data: updated.data,
                created: arr[idx].created || Date.now(),
              };
              this.setSaved('my_palettes', arr);
              this.renderSavedLists();
              this.showToast('Paleta actualizada', 'success');
            });
          } else if (action === 'delete') {
            this.openConfirm(
              (this as any)._ui.confirmMessage,
              (this as any)._ui.confirmPanel,
              `Eliminar paleta "${p.name}"?`,
              () => {
                const arr = this.getSaved('my_palettes');
                arr.splice(idx, 1);
                this.setSaved('my_palettes', arr);
                this.renderSavedLists();
                this.showToast('Paleta eliminada', 'success');
              }
            );
          }
        } else if (type === 'typography') {
          const typs = this.getSaved('my_typographies');
          const t = typs && typs[idx];
          if (!t) {
            this.showToast('Elemento no encontrado', 'warn');
            return;
          }
          if (action === 'apply') {
            const makeFamily = (val: string) => {
              if (!val) return null;
              if (/,/.test(val) || /^".*"$/.test(val) || /^'.*'$/.test(val)) return val;
              return `"${val}", sans-serif`;
            };
            this.applyTypographyToElement(previewRoot, {
              titleFont: makeFamily(t.data.titleFont),
              textFont: makeFamily(t.data.textFont),
              titleSize: Number(t.data.titleSize) || 40,
              subtitleSize: Number(t.data.subtitleSize) || 20,
              textSize: Number(t.data.textSize) || 16,
            });
            const uiTitle = root.querySelector('#title-font') as HTMLSelectElement;
            const uiText = root.querySelector('#text-font') as HTMLSelectElement;
            const uiTitleSize = root.querySelector('#title-size') as HTMLInputElement;
            const uiSubtitleSize = root.querySelector('#subtitle-size') as HTMLInputElement;
            const uiTextSize = root.querySelector('#text-size') as HTMLInputElement;
            if (uiTitle) uiTitle.value = t.data.titleFont;
            if (uiText) uiText.value = t.data.textFont;
            if (uiTitleSize) uiTitleSize.value = String(t.data.titleSize);
            if (uiSubtitleSize) uiSubtitleSize.value = String(t.data.subtitleSize);
            if (uiTextSize) uiTextSize.value = String(t.data.textSize);
            this.showToast('Tipografía aplicada', 'success');
          } else if (action === 'edit') {
            this.openEditPanel('typography', idx, (updated: any) => {
              const arr = this.getSaved('my_typographies');
              arr[idx] = {
                name: updated.name,
                data: {
                  titleFont: updated.data.titleFont,
                  textFont: updated.data.textFont,
                  titleSize: Number(updated.data.titleSize) || 40,
                  subtitleSize: Number(updated.data.subtitleSize) || 20,
                  textSize: Number(updated.data.textSize) || 16,
                },
                created: arr[idx].created || Date.now(),
              };
              this.setSaved('my_typographies', arr);
              this.renderSavedLists();
              this.showToast('Tipografía actualizada', 'success');
            });
          } else if (action === 'delete') {
            this.openConfirm(
              (this as any)._ui.confirmMessage,
              (this as any)._ui.confirmPanel,
              `Eliminar tipografía "${t.name}"?`,
              () => {
                const arr = this.getSaved('my_typographies');
                arr.splice(idx, 1);
                this.setSaved('my_typographies', arr);
                this.renderSavedLists();
                this.showToast('Tipografía eliminada', 'success');
              }
            );
          }
        }
      });
      // add cleanup
      this.cleanupFns.push(() => {
        if ((this as any)._contextMenuListener) {
          (this as any)._contextMenuListener();
          (this as any)._contextMenuListener = null;
        }
      });
    }
  }

  /* -------------------------
     Edit panel implementation (creates dynamic form contents)
     ------------------------- */
  private openEditPanel(type: string, index: number, onSave: (updated: any) => void) {
    const ui = (this as any)._ui;
    if (!ui) return;
    const {
      editPanel,
      editPanelLabel,
      editPanelContent,
      editSaveBtn,
      editCancelBtn,
      previewRoot,
      root,
    } = ui as any;
    if (!editPanel || !editPanelContent || !editPanelLabel) return;

    editPanel.style.display = 'block';
    editPanel.setAttribute('aria-hidden', 'false');
    editPanelContent.innerHTML = '';

    let current: any = null;

    const createLabeledNode = (labelText: string, node: HTMLElement) => {
      const wrap = document.createElement('div');
      wrap.className = 'edit-section';
      const lab = document.createElement('label');
      lab.textContent = labelText;
      lab.style.fontSize = '0.85rem';
      lab.style.display = 'block';
      wrap.appendChild(lab);
      wrap.appendChild(node);
      return wrap;
    };

    if (type === 'palette') {
      editPanelLabel.textContent = 'Editar paleta';
      const pals = this.getSaved('my_palettes');
      current = pals[index];

      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.value = current ? current.name : '';
      nameInput.id = 'edit-name-input';
      nameInput.placeholder = 'Nombre de paleta';

      editPanelContent.appendChild(createLabeledNode('Nombre', nameInput));

      const colors = ['primary', 'secondary', 'text1', 'text2', 'bg'];
      const labels = [
        'Color principal',
        'Color secundario',
        'Color texto 1',
        'Color texto 2',
        'Color fondo',
      ];

      colors.forEach((k, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'edit-section';
        const lab = document.createElement('label');
        lab.textContent = labels[i];
        lab.style.fontSize = '0.85rem';
        lab.style.display = 'block';
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value =
          current && current.data[k]
            ? this.toHexIfPossible(current.data[k]) || '#ffffff'
            : '#ffffff';
        colorPicker.style.width = '56px';
        colorPicker.style.height = '34px';
        colorPicker.style.padding = '2px';
        colorPicker.style.border = '1px solid #e6e6e6';
        colorPicker.id = 'edit-color-' + k;

        const text = document.createElement('input');
        text.type = 'text';
        text.value = current && current.data[k] ? current.data[k] : '';
        text.placeholder = '#rrggbb or rgb(...)';
        text.id = 'edit-color-text-' + k;

        colorPicker.addEventListener('input', () => {
          text.value = colorPicker.value;
        });
        text.addEventListener('change', () => {
          const norm = this.normalizeColorInput(text.value);
          if (norm) colorPicker.value = this.toHexIfPossible(norm) || colorPicker.value;
        });

        wrapper.appendChild(lab);
        wrapper.appendChild(colorPicker);
        wrapper.appendChild(text);
        editPanelContent.appendChild(wrapper);
      });

      // save handler
      (editSaveBtn as any).onclick = () => {
        const updatedName = (
          (editPanelContent.querySelector('#edit-name-input') as HTMLInputElement)?.value || ''
        ).trim();
        if (!updatedName) {
          this.showToast('El nombre no puede estar vacío', 'warn');
          return;
        }
        const updatedData: any = {};
        let failed = false;
        colors.forEach((k) => {
          const tval = (editPanelContent.querySelector('#edit-color-text-' + k) as HTMLInputElement)
            ?.value;
          const pval = (editPanelContent.querySelector('#edit-color-' + k) as HTMLInputElement)
            ?.value;
          const normalized = this.normalizeColorInput(tval) || pval || null;
          if (!normalized) failed = true;
          else updatedData[k] = normalized;
        });
        if (failed) {
          this.showToast('Revise los colores. Usa hex o rgb.', 'warn');
          return;
        }
        if (typeof onSave === 'function') onSave({ name: updatedName, data: updatedData });
        closePanel();
      };
    } else if (type === 'typography') {
      editPanelLabel.textContent = 'Editar tipografía';
      const typs = this.getSaved('my_typographies');
      current = typs[index];

      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.value = current ? current.name : '';
      nameInput.id = 'edit-name-input';
      nameInput.placeholder = 'Nombre';

      const titleSelect = document.createElement('select');
      titleSelect.id = 'edit-title-font';
      titleSelect.className = 'small-input';
      titleSelect.style.width = '100%';
      const titleMain = root.querySelector('#title-font') as HTMLSelectElement;
      if (titleMain) titleSelect.innerHTML = titleMain.innerHTML;

      const textSelect = document.createElement('select');
      textSelect.id = 'edit-text-font';
      textSelect.className = 'small-input';
      textSelect.style.width = '100%';
      const textMain = root.querySelector('#text-font') as HTMLSelectElement;
      if (textMain) textSelect.innerHTML = textMain.innerHTML;

      const titleSizeInput = document.createElement('input');
      titleSizeInput.type = 'number';
      titleSizeInput.min = '8';
      titleSizeInput.id = 'edit-title-size';
      titleSizeInput.value =
        current && current.data && current.data.titleSize ? current.data.titleSize : '40';

      const subtitleSizeInput = document.createElement('input');
      subtitleSizeInput.type = 'number';
      subtitleSizeInput.min = '8';
      subtitleSizeInput.id = 'edit-subtitle-size';
      subtitleSizeInput.value =
        current && current.data && current.data.subtitleSize ? current.data.subtitleSize : '20';

      const textSizeInput = document.createElement('input');
      textSizeInput.type = 'number';
      textSizeInput.min = '8';
      textSizeInput.id = 'edit-text-size';
      textSizeInput.value =
        current && current.data && current.data.textSize ? current.data.textSize : '16';

      const extractFamily = (f: string) => {
        if (!f) return '';
        const m = f.match(/^["']?([^"',]+)["']?/);
        if (m) return m[1].trim();
        return f;
      };
      const curTitleFam = current && current.data ? extractFamily(current.data.titleFont) : '';
      const curTextFam = current && current.data ? extractFamily(current.data.textFont) : '';

      const ensureOpt = (select: HTMLSelectElement, value: string) => {
        if (!value) return;
        let found = false;
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].value === value) {
            select.value = value;
            found = true;
            break;
          }
        }
        if (!found) {
          const opt = document.createElement('option');
          opt.value = value;
          opt.text = value + ' (custom)';
          select.appendChild(opt);
          select.value = value;
        }
      };

      ensureOpt(titleSelect, curTitleFam);
      ensureOpt(textSelect, curTextFam);
      titleSelect.value = curTitleFam || titleSelect.value;
      textSelect.value = curTextFam || textSelect.value;

      editPanelContent.appendChild(createLabeledNode('Nombre', nameInput));
      editPanelContent.appendChild(createLabeledNode('Tipografía títulos', titleSelect));
      editPanelContent.appendChild(createLabeledNode('Tipografía texto', textSelect));
      editPanelContent.appendChild(createLabeledNode('Tamaño títulos (px)', titleSizeInput));
      editPanelContent.appendChild(createLabeledNode('Tamaño subtítulos (px)', subtitleSizeInput));
      editPanelContent.appendChild(createLabeledNode('Tamaño texto (px)', textSizeInput));

      (editSaveBtn as any).onclick = () => {
        const updatedName = (
          (editPanelContent.querySelector('#edit-name-input') as HTMLInputElement)?.value || ''
        ).trim();
        if (!updatedName) {
          this.showToast('El nombre no puede estar vacío', 'warn');
          return;
        }
        const updated = {
          name: updatedName,
          data: {
            titleFont: (editPanelContent.querySelector('#edit-title-font') as HTMLSelectElement)
              .value,
            textFont: (editPanelContent.querySelector('#edit-text-font') as HTMLSelectElement)
              .value,
            titleSize:
              Number(
                (editPanelContent.querySelector('#edit-title-size') as HTMLInputElement).value
              ) || 40,
            subtitleSize:
              Number(
                (editPanelContent.querySelector('#edit-subtitle-size') as HTMLInputElement).value
              ) || 20,
            textSize:
              Number(
                (editPanelContent.querySelector('#edit-text-size') as HTMLInputElement).value
              ) || 16,
          },
        };
        if (typeof onSave === 'function') onSave(updated);
        closePanel();
      };
    } else {
      // fallback simple rename
      editPanelLabel.textContent = 'Editar';
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.id = 'edit-name-input';
      editPanelContent.appendChild(createLabeledNode('Nombre', nameInput));
      (editSaveBtn as any).onclick = () => {
        const val = (
          (editPanelContent.querySelector('#edit-name-input') as HTMLInputElement)?.value || ''
        ).trim();
        if (!val) {
          this.showToast('El nombre no puede estar vacío', 'warn');
          return;
        }
        if (typeof onSave === 'function') onSave({ name: val });
        closePanel();
      };
    }

    (editCancelBtn as any).onclick = () => {
      closePanel();
    };

    const closePanel = () => {
      editPanel.style.display = 'none';
      editPanel.setAttribute('aria-hidden', 'true');
      editPanelContent.innerHTML = '';
      (editSaveBtn as any).onclick = null;
      (editCancelBtn as any).onclick = null;
    };
  }

  /* -------------------------
     initFromPreview: initialize pickers/inputs from preview CSS variables
     ------------------------- */
  private initFromPreview() {
    const ui = (this as any)._ui;
    if (!ui) return;
    const { root, previewRoot } = ui as any;

    const primaryPicker = root.querySelector('#primary-picker') as HTMLInputElement;
    const secondaryPicker = root.querySelector('#secondary-picker') as HTMLInputElement;
    const text1Picker = root.querySelector('#text1-picker') as HTMLInputElement;
    const text2Picker = root.querySelector('#text2-picker') as HTMLInputElement;
    const bgPicker = root.querySelector('#bg-picker') as HTMLInputElement;

    const primaryInput = root.querySelector('#primary-input') as HTMLInputElement;
    const secondaryInput = root.querySelector('#secondary-input') as HTMLInputElement;
    const text1Input = root.querySelector('#text1-input') as HTMLInputElement;
    const text2Input = root.querySelector('#text2-input') as HTMLInputElement;
    const bgInput = root.querySelector('#bg-input') as HTMLInputElement;

    const titleFont = root.querySelector('#title-font') as HTMLSelectElement;
    const textFont = root.querySelector('#text-font') as HTMLSelectElement;
    const titleSize = root.querySelector('#title-size') as HTMLInputElement;
    const subtitleSize = root.querySelector('#subtitle-size') as HTMLInputElement;
    const textSize = root.querySelector('#text-size') as HTMLInputElement;

    const p = this.readCurrentPaletteFromPreview();
    if (primaryPicker) primaryPicker.value = this.toHexIfPossible(p.primary) || '#ed6436';
    if (secondaryPicker) secondaryPicker.value = this.toHexIfPossible(p.secondary) || '#6c757d';
    if (text1Picker) text1Picker.value = this.toHexIfPossible(p.text1) || '#212529';
    if (text2Picker) text2Picker.value = this.toHexIfPossible(p.text2) || '#6c757d';
    if (bgPicker) bgPicker.value = this.toHexIfPossible(p.bg) || '#f8f9fa';

    if (primaryInput) primaryInput.value = '';
    if (secondaryInput) secondaryInput.value = '';
    if (text1Input) text1Input.value = '';
    if (text2Input) text2Input.value = '';
    if (bgInput) bgInput.value = '';

    const t = this.readCurrentTypographyFromPreview();
    const extractFamily = (f: string) => {
      if (!f) return '';
      const m = f.match(/^["']?([^"',]+)["']?/);
      if (m) return m[1].trim();
      return f;
    };
    const titleFamily = extractFamily(t.titleFont);
    const textFamily = extractFamily(t.textFont);

    const ensureOption = (select: HTMLSelectElement | null, family: string) => {
      if (!select || !family) return;
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value === family) {
          select.value = family;
          return;
        }
      }
      const opt = document.createElement('option');
      opt.value = family;
      opt.text = family + ' (custom)';
      select.appendChild(opt);
      select.value = family;
    };
    ensureOption(titleFont, titleFamily);
    ensureOption(textFont, textFamily);

    if (titleSize) titleSize.value = String(t.titleSize || 40);
    if (subtitleSize) subtitleSize.value = String(t.subtitleSize || 20);
    if (textSize) textSize.value = String(t.textSize || 16);

    this.renderSavedLists();
  }
}
