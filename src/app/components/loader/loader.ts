import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loader-container">
      <div class="tanagram-title" id="tanagramTitle">Tanagrama 1 - Figura 76</div>
      <canvas #miCanvas id="miCanvas"></canvas>
      <div class="progress-container">
        <div class="progress-bar" id="progressBar"></div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 10000;
      }

      :root {
        --color-primary-fallback: #ed6436;
        --color-secondary-fallback: #65c178;
        --color-text-1-fallback: #181818;
        --color-text-2-fallback: #777777;
        --color-bg-fallback: #ffffff;
      }

      .loader-container {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          135deg,
          var(--color-bg, var(--color-bg-fallback)) 0%,
          var(--color-secondary, var(--color-secondary-fallback)) 100%
        );
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        overflow: hidden;
        position: relative;
      }

      .tanagram-title {
        position: absolute;
        top: 20px;
        left: 20px;
        background-color: var(--color-bg, var(--color-bg-fallback));
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        color: var(--color-primary, var(--color-primary-fallback));
        z-index: 10;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
        font-size: 1.2rem;
        opacity: 0.95;
      }

      canvas {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .progress-container {
        position: absolute;
        bottom: 20px;
        left: 20px;
        right: 20px;
        height: 8px;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        overflow: hidden;
      }

      .progress-bar {
        height: 100%;
        background: linear-gradient(
          to right,
          var(--color-primary, var(--color-primary-fallback)),
          var(--color-secondary, var(--color-secondary-fallback))
        );
        width: 25%;
        transition: width 0.5s ease;
      }

      .info {
        position: absolute;
        bottom: 40px;
        left: 20px;
        color: var(--color-text-1, var(--color-text-1-fallback));
        font-size: 0.9rem;
        opacity: 0.8;
      }
    `,
  ],
})
export class LoaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('miCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private tanagramTitle!: HTMLElement;
  private progressBar!: HTMLElement;

  // Estado
  private currentTanagram = 1;
  private totalTanagrams = 4;
  private isAnimating = false;
  private transitionSpeed = 1200; // ms
  private lastTransitionTime = 0;

  // Configuración de dibujo
  private escala = 90;
  private offsetX = 0;
  private offsetY = 0;

  private animationFrameId: number = 0;
  private intervalId: any;
  private redirectTimeoutId: any;

  private mediumUnit = Math.sqrt(2); // ~1.414
  private smallUnit = 1.0;

  // Posiciones actuales de animación
  private currentPositions: any;
  private targetPositions: any;
  private animationProgress = 0;

  // POSICIONES EXACTAS DE LOS TANAGRAMAS ORIGINALES
  private tanagramPositions: any = {
    // Tanagrama 1 - Figura 76
    1: {
      morado: [
        [1.586, 4.0],
        [4.414, 4.0],
        [3.0, 2.586],
      ],
      azul: [
        [4.414, 4.0],
        [3.0, 2.586],
        [4.414, 1.172],
      ],
      amarillo: [
        [4.414, 0.872],
        [3.0, 0.872],
        [3.707, 1.579],
      ],
      naranja: [
        [3.0, 0.872],
        [3.707, 1.579],
        [3.0, 2.286],
        [2.293, 1.579],
      ],
      verde: [
        [3.0, 0.872],
        [1.586, 0.872],
        [2.293, 1.579],
      ],
      rosa: [
        [2.586, 1.9],
        [1.586, 2.9],
        [1.586, 0.9],
      ],
      rojo: [
        [2.6, 1.9],
        [1.6, 2.9],
        [1.6, 4.0],
        [2.6, 3.0],
      ],
    },
    // Tanagrama 2 - Figura 143
    2: {
      morado: (() => {
        const [v1x, v1y] = this.rotarPunto(1.586, 4.0, 3.0, 2.586, 135);
        const [v2x, v2y] = this.rotarPunto(4.414, 4.0, 3.0, 2.586, 135);
        const v3x = 3.0,
          v3y = 2.586;
        const TX = 0.3,
          TY = 0.2;
        return [
          [v1x + TX, v1y + TY],
          [v2x + TX, v2y + TY],
          [v3x + TX, v3y + TY],
        ];
      })(),
      azul: (() => {
        const [v1x_r, v1y_r] = this.rotarPunto(4.414, 4.0, 3.0, 2.586, 45);
        const centerY = 2.586;
        const distY = v1y_r - centerY;
        const TX = 0.3,
          TY = 0.3;
        return [
          [3.0 + TX, centerY - distY + TY],
          [3.0 + TX, centerY + TY],
          [5.0 + TX, centerY + TY],
        ];
      })(),
      amarillo: (() => {
        const headPivotX = 4.414,
          headPivotY = 1.172;
        const Y_SHIFT = -0.3,
          DOWN_SHIFT = 2.1,
          X_SHIFT = -1.5;
        const v3x = headPivotX - this.mediumUnit + X_SHIFT;
        const v3y = headPivotY + Y_SHIFT + DOWN_SHIFT;
        const v1x = v3x + this.smallUnit,
          v1y = v3y;
        const v2x = v1x,
          v2y = v1y + this.smallUnit;
        return [
          [v2x, v2y],
          [v3x, v3y],
          [v1x, v1y],
        ];
      })(),
      naranja: (() => {
        const centroX = 3.0,
          centroY = 1.579;
        const [v1x, v1y] = this.rotarPunto(3.0, 0.872, centroX, centroY, 45);
        const [v2x, v2y] = this.rotarPunto(3.707, 1.579, centroX, centroY, 45);
        const [v3x, v3y] = this.rotarPunto(3.0, 2.286, centroX, centroY, 45);
        const [v4x, v4y] = this.rotarPunto(2.293, 1.579, centroX, centroY, 45);
        const TY = 1.9;
        return [
          [v1x, v1y + TY],
          [v2x, v2y + TY],
          [v3x, v3y + TY],
          [v4x, v4y + TY],
        ];
      })(),
      verde: (() => {
        const pivotX = 3.0,
          pivotY = 0.872;
        const [v2x, v2y] = this.rotarPunto(1.586, 0.872, pivotX, pivotY, 135);
        const [v1x, v1y] = this.rotarPunto(2.293, 1.579, pivotX, pivotY, 135);
        const TX = 0.5,
          TY = 3.1;
        return [
          [pivotX + TX, pivotY + TY],
          [v2x + TX, v2y + TY],
          [v1x + TX, v1y + TY],
        ];
      })(),
      rosa: (() => {
        const shiftY = -2.25,
          TX = 0.7,
          baseY = 4.0;
        return [
          [2.586 + TX, baseY - this.smallUnit + shiftY],
          [1.586 + TX, baseY + shiftY],
          [1.586 + TX, baseY - this.smallUnit * 2 + shiftY],
        ];
      })(),
      rojo: (() => {
        const centroX = 2.1,
          centroY = 2.95;
        const [v1x, v1y] = this.rotarPunto(2.6, 1.9, centroX, centroY, 90);
        const [v2x, v2y] = this.rotarPunto(1.6, 2.9, centroX, centroY, 90);
        const [v3x, v3y] = this.rotarPunto(1.6, 4.0, centroX, centroY, 90);
        const [v4x, v4y] = this.rotarPunto(2.6, 3.0, centroX, centroY, 90);
        const TX = -0.7,
          TY = 0.5;
        return [
          [v1x + TX, v1y + TY],
          [v2x + TX, v2y + TY],
          [v3x + TX, v3y + TY],
          [v4x + TX, v4y + TY],
        ];
      })(),
    },
    // Tanagrama 3 - Figura 28
    3: {
      amarillo: [
        [0, 2],
        [1, 2],
        [0, 3],
      ],
      rojo: [
        [1, 1],
        [2, 1],
        [1, 2],
        [0, 2],
      ],
      azul: [
        [0, 3],
        [2, 3],
        [2, 1],
      ],
      morado: [
        [2, 3],
        [4, 3],
        [2, 1],
      ],
      rosa: [
        [1, 3],
        [3, 3],
        [2, 4],
      ],
      verde: [
        [3, 3],
        [3, 4],
        [2, 4],
      ],
      naranja: [
        [3, 3],
        [4, 3],
        [4, 4],
        [3, 4],
      ],
    },
    // Tanagrama 4 - Figura 165
    4: {
      morado: (() => {
        const [v1x, v1y] = this.rotarPunto(1.586, 4.0, 3.0, 2.586, 135);
        const [v2x, v2y] = this.rotarPunto(4.414, 4.0, 3.0, 2.586, 135);
        const v3x = 3.0,
          v3y = 2.586;
        const TY = -1.2;
        return [
          [v1x, v1y + TY],
          [v2x, v2y + TY],
          [v3x, v3y + TY],
        ];
      })(),
      azul: (() => {
        const [v1x_r, v1y_r] = this.rotarPunto(4.414, 4.0, 3.0, 2.586, 45);
        const centerY = 2.586,
          distY = v1y_r - centerY,
          TY = -1.2;
        return [
          [3.0, centerY - distY + TY],
          [3.0, centerY + TY],
          [5.0, centerY + TY],
        ];
      })(),
      amarillo: (() => {
        const headPivotX = 4.414,
          headPivotY = 1.172;
        const Y_SHIFT = -0.3,
          DOWN_SHIFT = 1.95;
        const pivotX = headPivotX - this.mediumUnit;
        const pivotY = headPivotY + Y_SHIFT + DOWN_SHIFT;
        const [v1x, v1y] = this.rotarPunto(pivotX + this.smallUnit, pivotY, pivotX, pivotY, 45);
        const [v2x, v2y] = this.rotarPunto(
          pivotX + this.smallUnit,
          pivotY + this.smallUnit,
          pivotX,
          pivotY,
          45,
        );
        return [
          [v2x, v2y],
          [pivotX, pivotY],
          [v1x, v1y],
        ];
      })(),
      naranja: (() => {
        const centroX = 3.0,
          centroY = 1.579;
        const [v1x, v1y] = this.rotarPunto(3.0, 0.872, centroX, centroY, 90);
        const [v2x, v2y] = this.rotarPunto(3.707, 1.579, centroX, centroY, 90);
        const [v3x, v3y] = this.rotarPunto(3.0, 2.286, centroX, centroY, 90);
        const [v4x, v4y] = this.rotarPunto(2.293, 1.579, centroX, centroY, 90);
        const TY = 0.5;
        return [
          [v1x, v1y + TY],
          [v2x, v2y + TY],
          [v3x, v3y + TY],
          [v4x, v4y + TY],
        ];
      })(),
      verde: (() => {
        const pivotX = 3.0,
          pivotY = 0.872;
        const [v2x, v2y] = this.rotarPunto(1.586, 0.872, pivotX, pivotY, -270);
        const [v1x, v1y] = this.rotarPunto(2.293, 1.579, pivotX, pivotY, -270);
        const TY = 3.35;
        return [
          [pivotX, pivotY + TY],
          [v2x, v2y + TY],
          [v1x, v1y + TY],
        ];
      })(),
      rosa: (() => {
        const baseY = 4.0,
          TY_BASE = 3.25,
          TX = -0.1;
        const v1x_base = 2.586,
          v1y_base = baseY - this.smallUnit + TY_BASE;
        const [v2x_r, v2y_r] = this.rotarPunto(1.586, baseY + TY_BASE, v1x_base, v1y_base, 90);
        const [v3x_r, v3y_r] = this.rotarPunto(
          1.586,
          baseY - this.smallUnit * 2 + TY_BASE,
          v1x_base,
          v1y_base,
          90,
        );
        const reflectionY = v2y_r;
        const v1y_reflected = 2 * reflectionY - v1y_base;
        return [
          [v1x_base + TX, v1y_reflected],
          [v2x_r + TX, v2y_r],
          [v3x_r + TX, v3y_r],
        ];
      })(),
      rojo: (() => {
        const centroX = 2.1,
          centroY = 2.95;
        const [v1x, v1y] = this.rotarPunto(2.6, 1.9, centroX, centroY, 90);
        const [v2x, v2y] = this.rotarPunto(1.6, 2.9, centroX, centroY, 90);
        const [v3x, v3y] = this.rotarPunto(1.6, 4.0, centroX, centroY, 90);
        const [v4x, v4y] = this.rotarPunto(2.6, 3.0, centroX, centroY, 90);
        const TX = 1.5,
          TY = 1.8;
        return [
          [v1x + TX, v1y + TY],
          [v2x + TX, v2y + TY],
          [v3x + TX, v3y + TY],
          [v4x + TX, v4y + TY],
        ];
      })(),
    },
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Redirigir después de 10 segundos (ajustable)
    this.redirectTimeoutId = setTimeout(() => {
      this.router.navigate(['/home']);
    }, 10000);
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
  }

  ngOnDestroy(): void {
    // Limpiar todos los timeouts y animation frames
    if (this.redirectTimeoutId) {
      clearTimeout(this.redirectTimeoutId);
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Limpiar event listeners
    window.removeEventListener('resize', this.handleResize);
  }

  private initializeCanvas(): void {
    this.canvas = this.canvasRef.nativeElement;
    const context = this.canvas.getContext('2d');

    if (!context) {
      console.error('No se pudo obtener el contexto 2D del canvas');
      return;
    }

    this.ctx = context;
    this.tanagramTitle = document.getElementById('tanagramTitle')!;
    this.progressBar = document.getElementById('progressBar')!;

    // Inicializar posiciones
    this.currentPositions = JSON.parse(JSON.stringify(this.tanagramPositions[1]));
    this.targetPositions = JSON.parse(JSON.stringify(this.tanagramPositions[1]));

    // Inicializar tamaño y empezar animación
    this.actualizarTamanoCanvas();
    this.actualizarInterfaz();
    this.iniciarTransicion();

    // Configurar redimensionamiento
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);

    // Configurar transiciones automáticas
    this.intervalId = setInterval(() => {
      if (!this.isAnimating) {
        this.iniciarSiguienteTransicion();
      }
    }, this.transitionSpeed + 300);

    // Iniciar loop de animación
    this.animationFrameId = requestAnimationFrame((time) => this.actualizarAnimacion(time));
  }

  private handleResize(): void {
    this.actualizarTamanoCanvas();
    this.dibujarTanagrama();
  }

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================

  private rotarPunto(
    x: number,
    y: number,
    cx: number,
    cy: number,
    angleDeg: number,
  ): [number, number] {
    const angleRad = angleDeg * (Math.PI / 180);
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const tx = x - cx;
    const ty = y - cy;
    const rx = tx * cos - ty * sin;
    const ry = tx * sin + ty * cos;
    return [rx + cx, ry + cy];
  }

  private getThemeColor(varName: string, fallback: string): string {
    const style = getComputedStyle(document.documentElement);
    const value = style.getPropertyValue(varName).trim();
    return value && value !== '' ? value : fallback;
  }

  private actualizarTamanoCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Centrar las figuras manteniendo su tamaño
    this.offsetX = (this.canvas.width - 4.5 * this.escala) / 2;
    this.offsetY = (this.canvas.height - 5 * this.escala) / 2;
  }

  private dibujarPieza(puntos: number[][], color: string, borderColor: string): void {
    if (!puntos || puntos.length === 0) return;

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(
      this.offsetX + puntos[0][0] * this.escala,
      this.offsetY + puntos[0][1] * this.escala,
    );

    for (let i = 1; i < puntos.length; i++) {
      this.ctx.lineTo(
        this.offsetX + puntos[i][0] * this.escala,
        this.offsetY + puntos[i][1] * this.escala,
      );
    }

    this.ctx.closePath();
    this.ctx.fill();

    // Borde usando el color de fondo para separar piezas
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private limpiarCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private dibujarTanagrama(): void {
    this.limpiarCanvas();

    // Obtener colores del tema actual
    const cPrimary = this.getThemeColor('--color-primary', '#ed6436');
    const cSecondary = this.getThemeColor('--color-secondary', '#65c178');
    const cText1 = this.getThemeColor('--color-text-1', '#181818');
    const cText2 = this.getThemeColor('--color-text-2', '#777777');
    const cBg = this.getThemeColor('--color-bg', '#ffffff');

    // Mapeamos las piezas originales a la paleta del tema
    this.dibujarPieza(this.currentPositions.morado, cPrimary, cBg);
    this.dibujarPieza(this.currentPositions.azul, cSecondary, cBg);
    this.dibujarPieza(this.currentPositions.amarillo, cText1, cBg);
    this.dibujarPieza(this.currentPositions.naranja, cText2, cBg);
    this.dibujarPieza(this.currentPositions.verde, cPrimary, cBg);
    this.dibujarPieza(this.currentPositions.rosa, cSecondary, cBg);
    this.dibujarPieza(this.currentPositions.rojo, cText2, cBg);
  }

  private actualizarAnimacion(tiempoActual: number): void {
    if (!this.lastTransitionTime) this.lastTransitionTime = tiempoActual;

    const deltaTime = tiempoActual - this.lastTransitionTime;
    this.lastTransitionTime = tiempoActual;

    if (this.isAnimating) {
      this.animationProgress += deltaTime / this.transitionSpeed;

      if (this.animationProgress >= 1) {
        this.animationProgress = 1;
        this.isAnimating = false;
        setTimeout(() => this.iniciarSiguienteTransicion(), 300);
      } else {
        const t = this.animationProgress;
        const smoothT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        const piezas = ['morado', 'azul', 'amarillo', 'naranja', 'verde', 'rosa', 'rojo'];
        for (const pieza of piezas) {
          if (
            this.currentPositions[pieza] &&
            this.targetPositions[pieza] &&
            this.currentPositions[pieza].length === this.targetPositions[pieza].length
          ) {
            for (let i = 0; i < this.currentPositions[pieza].length; i++) {
              const startX = this.currentPositions[pieza][i][0];
              const targetX = this.targetPositions[pieza][i][0];
              this.currentPositions[pieza][i][0] = startX + (targetX - startX) * smoothT;

              const startY = this.currentPositions[pieza][i][1];
              const targetY = this.targetPositions[pieza][i][1];
              this.currentPositions[pieza][i][1] = startY + (targetY - startY) * smoothT;
            }
          }
        }
      }
    }

    this.dibujarTanagrama();
    this.animationFrameId = requestAnimationFrame((time) => this.actualizarAnimacion(time));
  }

  private actualizarInterfaz(): void {
    const titulos = [
      'Tanagrama 1 - Figura 76',
      'Tanagrama 2 - Figura 143',
      'Tanagrama 3 - Figura 28',
      'Tanagrama 4 - Figura 165',
    ];

    if (this.tanagramTitle) {
      this.tanagramTitle.textContent = titulos[this.currentTanagram - 1];
    }

    if (this.progressBar) {
      this.progressBar.style.width = `${(this.currentTanagram / this.totalTanagrams) * 100}%`;
    }
  }

  private iniciarTransicion(): void {
    if (this.isAnimating) return;
    this.targetPositions = JSON.parse(JSON.stringify(this.tanagramPositions[this.currentTanagram]));
    this.animationProgress = 0;
    this.isAnimating = true;
    this.actualizarInterfaz();
  }

  private iniciarSiguienteTransicion(): void {
    this.currentTanagram =
      this.currentTanagram < this.totalTanagrams ? this.currentTanagram + 1 : 1;
    this.iniciarTransicion();
  }
}
