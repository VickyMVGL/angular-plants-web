import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPage } from './config';

describe('ConfigPage', () => {
  let component: ConfigPage;
  let fixture: ComponentFixture<ConfigPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
