import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {AccountBalanceComponent} from './components/account-balance/account-balance.component';
import {NavbarComponent} from './navbar/navbar.component';
import {Campaign} from './services/campaign.service';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      main {
        padding: 60px;
      }
    `,
  ],
  standalone: true,
  imports: [AccountBalanceComponent, RouterOutlet, NavbarComponent],
})
export class AppComponent {
  title = 'campaign-management-system';
}
