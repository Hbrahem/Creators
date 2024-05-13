import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentPredictionComponent } from './sentiment-prediction.component';

describe('SentimentPredictionComponent', () => {
  let component: SentimentPredictionComponent;
  let fixture: ComponentFixture<SentimentPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SentimentPredictionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SentimentPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
