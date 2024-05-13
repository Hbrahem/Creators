import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'bi-project-front';
  logged:boolean = false;
  role: boolean | null = null;

  constructor(private authService: AuthService,public router: Router,) {
    
  }
  ngOnInit(): void {
    this.logged = this.authService.getToken()!= null;
    console.log(this.logged);
    this.role = localStorage.getItem('role') != 'cashier';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }


}
