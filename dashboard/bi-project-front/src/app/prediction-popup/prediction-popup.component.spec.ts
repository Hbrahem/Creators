import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionPopupComponent } from './prediction-popup.component';

describe('PredictionPopupComponent', () => {
  let component: PredictionPopupComponent;
  let fixture: ComponentFixture<PredictionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PredictionPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PredictionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
