import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../../core/services/app-state.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  cartCount = 0;
  currentUser: User | null = null;

  constructor(private appStateService: AppStateService, public router: Router) { }

  ngOnInit() {
    this.appStateService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
    this.appStateService.cart$.subscribe(cart => {
      this.cartCount = cart.length;
    });
  }

  logout() {
    this.appStateService.setCurrentUser(null);
    this.appStateService.clearCart();
    this.router.navigate(['/login']);
  }
}
