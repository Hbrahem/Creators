import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prediction-popup',
  templateUrl: './prediction-popup.component.html',
  styleUrls: ['./prediction-popup.component.css']
})
export class PredictionPopupComponent {
  @Input() prediction:any;

  constructor(public activeModal: NgbActiveModal) {}
}
