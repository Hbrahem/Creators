
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import * as echarts from 'echarts';
import { HomeComponent } from './home/home.component';
import { SentimentPredictionComponent } from './sentiment-prediction/sentiment-prediction.component';
import { RushHourComponent } from './rush-hour/rush-hour.component';
import { PredictionPopupComponent } from './prediction-popup/prediction-popup.component';
import { NumberOfPersonsComponent } from './number-of-persons/number-of-persons.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import { RegisterComponent } from './register/register.component';
import { UsersComponent } from './users/users.component';
import {MatTableModule} from '@angular/material/table';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RushHourComponent,
    SentimentPredictionComponent,
    PredictionPopupComponent,
    NumberOfPersonsComponent,
    LandingPageComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatBadgeModule,
    MatIconModule,
    MatTableModule,
    MatRadioModule,
    MatCheckboxModule,
    NgxEchartsModule.forRoot({ echarts }),
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
