import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        this.authService.saveToken(response.access_token);
        localStorage.setItem('role', response.role);
          this.router.navigate(['/']);
      },
      (error) => {
        console.error('Login failed:', error);
        if (error.error && error.error.msg) {
          this.errorMessage = error.error.msg;
        } else {
          this.errorMessage = 'An error occurred while logging in.';
        }
      }
    );
  }
}
