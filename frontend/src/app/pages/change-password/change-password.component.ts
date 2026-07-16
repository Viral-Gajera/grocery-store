import { Component, OnInit } from '@angular/core';

import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AppStateService } from '../../core/services/app-state.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css'],
    imports: [FormsModule, CommonModule],
})
export class ChangePasswordComponent implements OnInit {
    user: User | null = null;
    password = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    };
    // editing = false;

    constructor(
        private apiService: ApiService,
        private appStateService: AppStateService,
        private router: Router
    ) {}

    ngOnInit() {
        this.appStateService.currentUser$.subscribe((user) => {
            if (!user) {
                this.router.navigate(['/login']);
            } else {
                this.user = { ...user };
            }
        });
    }

    async savePassword() {
        if (!this.user) return;

        if (this.user.password !== this.password.oldPassword) {
            alert('Old Password does not match');
            return;
        }

        if (!/[A-Za-z0-9!@#$%^&*]{5,30}/.test(this.password.newPassword)) {
            alert('Password length must be between 5 to 30 characters.');
            return;
        }

        if (this.password.newPassword !== this.password.confirmPassword) {
            alert('Password does not match');
            return;
        }

        if (this.user.id) {
            const updatedUser = await this.apiService.updateUser(
                this.user.id,
                this.user
            );
            this.appStateService.setCurrentUser(updatedUser);
            alert('Password Updated Successfully!');
            this.router.navigate(['/']);
        }
    }
}
