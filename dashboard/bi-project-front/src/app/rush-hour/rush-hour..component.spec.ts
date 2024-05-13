import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RushHourComponent } from './rush-hour.component';

describe('RushHourComponent', () => {
  let component: RushHourComponent;
  let fixture: ComponentFixture<RushHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RushHourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RushHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
