import { Component } from '@angular/core';

import { User } from '../../core/models/user.model';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AppStateService } from '../../core/services/app-state.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    imports: [FormsModule, CommonModule, RouterLink],
})
export class RegisterComponent {
    user: User = {
        name: '',
        email: '',
        password: '',
        address: '',
        contact: '',
        role: 'customer'
    };
    registered = false;
    generatedCustomerId: number | undefined;

    constructor(
        private apiService: ApiService,
        private appStateService: AppStateService,
        private router: Router
    ) { }

    async register() {
        if (!/^[A-Za-z\s]+$/.test(this.user.name)) {
            alert('Customer Name must have alphabets only.');
            return;
        }
        if (this.user.name.length > 50) {
            alert('Customer Name must be less than 50 characters.');
            return;
        }
        if (!/^[A-Za-z][A-Za-z0-9.]+@[A-Za-z0-9.]+/.test(this.user.email)) {
            alert('Email ID not valid.');
            return;
        }
        if (!/[A-Za-z0-9!@#$%^&*]{5,30}/.test(this.user.password)) {
            alert('Password length must be between 5 to 30 characters.');
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

        // this.user.customerId = 'CUST' + Math.floor(Math.random() * 10000);
        const newUser = await this.apiService.registerUser(this.user);
        this.generatedCustomerId = newUser.id;
        this.registered = true;
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
}
