import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {AccountBalanceComponent} from './components/account-balance/account-balance.component';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [],
  standalone: true,
  imports: [AccountBalanceComponent, RouterOutlet],
})
export class AppComponent {}
