import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

@Component({
  selector: 'app-number-of-persons',
  templateUrl: './number-of-persons.component.html',
  styleUrls: ['./number-of-persons.component.css']
})
export class NumberOfPersonsComponent implements OnInit {
  chartOption: any;
  begin_date: string | undefined;
  end_date: string | undefined;
  granularity: string | undefined;
  show_chart: boolean = false;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  formatDate(date: string) {
    return new Date(date).toISOString().split('T')[0];
  }

  fetchPrediction() {
    this.errorMessage = '';
    if (!this.begin_date || !this.end_date || !this.granularity) {
      this.errorMessage = "Please fill in all fields.";
      return;
    }
  
    const beginDate = new Date(this.begin_date);
    const endDate = new Date(this.end_date);
  
    if (beginDate >= endDate) {
      this.errorMessage = "Begin date must be before end date.";
      return;
    }
  
    this.http
      .post<any>('http://127.0.0.1:5000/predict/number-of-persons', {
        begin_date: this.formatDate(this.begin_date),
        end_date: this.formatDate(this.end_date),
        granularity: this.granularity,
      })
      .subscribe((payload) => {
        const xAxisData = payload.dates;
        const yAxisData = payload.number_of_persons.map((value: number) => Math.round(value));
  
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
              type: 'line',
            },
          ],
        };
  
        // Add provided ECharts option here
        this.chartOption = {
          ...this.chartOption, // Keep existing options
          tooltip: {
            trigger: 'axis',
            position: function (pt:any) {
              return [pt[0], '10%'];
            }
          },
          title: {
            left: 'center',
            text: 'Prediction of Number of Persons'
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
            }
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 10
            },
            {
              start: 0,
              end: 10
            }
          ]
        };
  
        this.show_chart = true; // Set to true to display the chart
      });
  }
}
