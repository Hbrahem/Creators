import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberOfPersonsComponent } from './number-of-persons.component';

describe('NumberOfPersonsComponent', () => {
  let component: NumberOfPersonsComponent;
  let fixture: ComponentFixture<NumberOfPersonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NumberOfPersonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NumberOfPersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
