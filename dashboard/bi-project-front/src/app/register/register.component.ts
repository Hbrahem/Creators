import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  signupForm = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
    
  };
  feedbackMessage: string | null = null; // Variable to store feedback message

  constructor(private http: HttpClient) {}

  onSubmit(): void {
    if (this.signupForm.password !== this.signupForm.confirmPassword) {
      this.feedbackMessage = "Passwords don't match";
      return;
    }

    this.http.post<any>('http://127.0.0.1:5000/signup', this.signupForm)
      .subscribe(
        response => {
          this.feedbackMessage = "User created successfully"; // Set success message
        },
        error => {
          this.feedbackMessage = "Error: " + error.message; // Set error message
        }
      );
  }
}
