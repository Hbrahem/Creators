import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements AfterViewInit {
  not_loading: boolean = false;
  ngAfterViewInit(): void {
    const authenticated = localStorage.getItem('access_token');
    if (authenticated) {
      window.location.href = '/home';
    }else {
      this.not_loading = true;
    }

  }
}
