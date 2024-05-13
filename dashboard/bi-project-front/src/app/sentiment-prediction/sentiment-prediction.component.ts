import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { PredictionPopupComponent } from '../prediction-popup/prediction-popup.component';

@Component({
  selector: 'app-sentiment-prediction',
  templateUrl: './sentiment-prediction.component.html',
  styleUrls: ['./sentiment-prediction.component.css'],
})
export class SentimentPredictionComponent {
  feedback: string | undefined;
  prediction: string | undefined;
  errorMessage: string | undefined;
  constructor(private modalService: NgbModal, private http: HttpClient) {}

  fetchPrediction() {
    if (!this.feedback) {
      this.errorMessage = 'The Message cannot be empty';
    } else {
      this.errorMessage = '';
      this.http
        .post<any>('http://127.0.0.1:5000/predict/sentiment', {
          text: this.feedback,
        })
        .subscribe((prediction) => {
          this.openPopup(prediction);
        });
    }
  }

  openPopup(predictionData: { feedback: string; score: number }) {
    const modalRef = this.modalService.open(PredictionPopupComponent);
    modalRef.componentInstance.prediction = predictionData;
  }
}
