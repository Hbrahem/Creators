import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RushHourComponent } from './rush-hour/rush-hour.component';
import { SentimentPredictionComponent } from './sentiment-prediction/sentiment-prediction.component';
import { NumberOfPersonsComponent } from './number-of-persons/number-of-persons.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  //not authenticated
  { path: 'welcome', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: localStorage.getItem("access_token") == null ? 'welcome' : 'home' , pathMatch: 'full' },

  //authenticated
  { path: 'home', component: HomeComponent },
  { path: 'rush-hour', component: RushHourComponent },
  { path: 'sentiment', component: SentimentPredictionComponent },
  { path: 'number-of-persons', component: NumberOfPersonsComponent },
  { path: 'users', component: UsersComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }