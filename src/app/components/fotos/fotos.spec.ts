import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Fotos } from './fotos';

describe('FotosComponent', () => {
  let component: Fotos;
  let fixture: ComponentFixture<Fotos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Fotos],
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fotos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('inicia sin fotos', () => {
    expect(component.fotos.length).toBe(0);
  });

  it('agrega una foto al guardar', () => {
    component.tituloFoto = 'Foto de prueba';
    component.croppedImage = 'data:image/jpeg;base64,test';

    component.savePhoto();

    expect(component.fotos.length).toBe(1);
    expect(component.fotos[0].titulo).toBe('Foto de prueba');
  });

  it('avanza y retrocede en el carrusel', () => {
    for (let i = 0; i < 6; i++) {
      component.fotos.push({
        id: i,
        titulo: 'Foto ' + i,
        src: 'data:image/jpeg;base64,test',
      });
    }

    component.next();
    expect(component.currentIndex).toBe(3);

    component.prev();
    expect(component.currentIndex).toBe(0);
  });
});
