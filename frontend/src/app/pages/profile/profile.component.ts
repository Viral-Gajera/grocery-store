import { Component, OnInit } from '@angular/core';

import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AppStateService } from '../../core/services/app-state.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports : [FormsModule, CommonModule]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  editing = false;

  constructor(
    private apiService: ApiService,
    private appStateService: AppStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.appStateService.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        console.log(user)
        this.user = { ...user };
      }
    });
  }

  enableEditing() {
    this.editing = true;
  }

  async saveProfile() {
    if (!this.user) return;

    if (!/^[A-Za-z\s]+$/.test(this.user.name)) {
      alert('Customer Name must have alphabets only.');
      return;
    }
    if (this.user.name.length > 50) {
      alert('Customer Name must be less than 50 characters.');
      return;
    }
    if (!/^\d{10}$/.test(this.user.contact)) {
      alert('Contact number must be 10 digits.');
      return;
    }
    if (!/^[6789]/.test(this.user.contact)) {
      alert('Contact number must start with 6, 7, 8, or 9.');
      return;
    }

    if (this.user.id) {
      const updatedUser = await this.apiService.updateUser(this.user.id, this.user);
      this.appStateService.setCurrentUser(updatedUser);
      alert('Profile Updated Successfully!');
      this.editing = false;
    }
  }
}