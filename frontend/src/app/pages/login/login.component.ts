import { Component } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AppStateService } from '../../core/services/app-state.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule, RouterLink]
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService,
    private router: Router
  ) { }

  async login() {
    const users = await this.apiService.loginUser(this.email, this.password);
    if (users.length === 0) {
      alert('Invalid Customer ID or Password');
      return;
    }
    this.appStateService.setCurrentUser(users[0]);
    this.router.navigate(['/']);
  }
}
