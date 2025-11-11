import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCv } from './ver-cv';

describe('VerCv', () => {
  let component: VerCv;
  let fixture: ComponentFixture<VerCv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerCv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerCv);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
