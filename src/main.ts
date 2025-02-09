import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {provideHttpClient } from '@angular/common/http';

import { provideRouter, Routes } from '@angular/router';

import { SellerSetupComponent } from './app/components/seller-setup/seller-setup.component';
import { ProductListComponent } from './app/components/product-list/product-list.component';
import { ProductFormComponent } from './app/components/product-form/product-form.component';
import { CampaignListComponent } from './app/components/campaign-list/campaign-list.component';
import { CampaignFormComponent } from './app/components/campaign-form/campaign-form.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const routes: Routes = [
  { path: '', component: SellerSetupComponent },
  { path: 'seller-setup', component: SellerSetupComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductFormComponent },
  { path: 'campaigns', component: CampaignListComponent },
  { path: 'campaigns/new', component: CampaignFormComponent },
  { path: 'campaigns/new/:productId', component: CampaignFormComponent },
  { path: 'campaigns/edit/:id', component: CampaignFormComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
    ),
    provideRouter(routes),
    provideAnimationsAsync(),

  ],
}).catch(err => console.error(err));
