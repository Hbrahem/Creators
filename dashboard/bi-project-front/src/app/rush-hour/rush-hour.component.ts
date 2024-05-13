import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, BarChart, CanvasRenderer]);

@Component({
  selector: 'app-rush-hour',
  templateUrl: './rush-hour.component.html',
  styleUrls: ['./rush-hour.component.css'],
})
export class RushHourComponent implements OnInit {
  chartOption: any;
  date: string | undefined;
  show_chart: boolean = false;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  fetchPrediction() {
    if (this.date == '') {
      this.errorMessage = 'Date must not be empty';
    } else {
      this.errorMessage = '';
      this.http
        .post<any>(
          'http://127.0.0.1:5000/predict/random_forest_regressor_model',
          {
            date: this.date,
          }
        )
        .subscribe((payload) => {
          const xAxisData = payload.times;
          const yAxisData = payload.people;

          this.chartOption = {
            xAxis: {
              type: 'category',
              data: xAxisData,
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                data: yAxisData,
                type: 'bar', // Set the chart type to 'bar'
              },
            ],
          };
        });
      this.show_chart = true;
    }
  }
}
