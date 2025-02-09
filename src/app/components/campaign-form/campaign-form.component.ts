import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {Campaign, CampaignService, CampaignStatus} from '../../services/campaign.service';
import {Product, ProductService} from '../../services/product.service';
import {KeywordService} from '../../services/keyword.service';
import {LocationService} from '../../services/location.service';
import {ActivatedRoute, Router} from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRow, MatChipsModule} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {KeyValuePipe, NgForOf} from '@angular/common';
import {MatFormField, MatLabel, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AccountBalanceService} from '../../services/account-balance.service';

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatLabel,
    KeyValuePipe,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    FormsModule,
    MatSelect,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatChipGrid,
    MatChipInput,
    MatChipRow,
    MatIcon,
    NgForOf,
    MatButton
  ]
})
export class CampaignFormComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedKeywords = signal<string[]>([]);
  filteredKeywords = signal<string[]>([]);
  keywordCtrl = new FormControl('');

  campaignStatus = CampaignStatus;
  campaignForm: FormGroup;
  isEditMode = false;
  campaignId: string | null = null;
  sellerId: string | null = null;
  products = signal<Product[]>([]);
  towns = signal<string[]>([]);
  filteredTowns = computed(() => {
    const currentTown = this.campaignForm.get('town')?.value?.toLowerCase() || '';
    return currentTown
      ? this.towns().filter((town) => town.toLowerCase().includes(currentTown))
      : this.towns();
  });

  readonly announcer = inject(LiveAnnouncer);
  productId: string = '';

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private productService: ProductService,
    private keywordService: KeywordService,
    private locationService: LocationService,
    private accountBalanceService: AccountBalanceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.campaignForm = this.fb.group({
      name: ['', Validators.required],
      bidAmount: [null, [Validators.required, Validators.min(0.01)]],
      campaignFund: [null, [Validators.required, Validators.min(0.01)]],
      status: [CampaignStatus.ON, Validators.required],
      town: ['', Validators.required],
      radius: [null, [Validators.required, Validators.min(1)]],
    });

  }

  ngOnInit(): void {
    this.sellerId = localStorage.getItem('sellerId');
    if (!this.sellerId) {
      this.router.navigate(['/seller-setup']);
      return;
    }
    this.loadProducts();
    this.loadTowns();

    this.productId = this.route.snapshot.paramMap.get('productId') || '';
    this.campaignId = this.route.snapshot.paramMap.get('id');

    if (this.campaignId) {
      this.isEditMode = true;
      this.loadCampaign();
    }

    this.keywordCtrl.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && value.length >= 0) {
          return this.keywordService.getKeywordsByQuery(value).pipe(
            catchError(() => of([]))
          );
        } else {
          return of([]);
        }
      })
    ).subscribe(keywords => {
      const filtered = keywords.filter(
        (keyword) => !this.selectedKeywords().includes(keyword)
      );
      this.filteredKeywords.set(filtered);
    });
  }

  loadProducts() {
    this.productService.getProductsBySellerId(this.sellerId!).subscribe({
      next: (products) => {
        this.products.set(products);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  loadTowns() {
    this.locationService.getAllTowns().subscribe({
      next: (towns) => {
        this.towns.set(towns);
      },
      error: (error) => {
        console.error('Error fetching towns:', error);
      },
    });
  }

  loadCampaign() {
    this.campaignService.getCampaignById(this.campaignId!).subscribe({
      next: (campaign) => {
        this.campaignForm.patchValue(campaign);
        this.selectedKeywords.set(campaign.keywords);
        this.productId = campaign.productId;
        this.accountBalanceService.fetchBalance();
      },
      error: (error) => {
        console.error('Error loading campaign:', error);
      },
    });
  }

  saveCampaign() {
    if (this.campaignForm.invalid) {
      alert('Please fill in all required fields.');
      console.log('Form invalid:');
      Object.keys(this.campaignForm.controls).forEach(key => {
        const control = this.campaignForm.get(key);
        console.log(`${key}: ${control?.valid}`);
      });
      return;
    }

    const productId = this.productId;
    const sellerId = this.sellerId!;

    if (!productId) {
      console.error('Product ID is missing.');
      return;
    }
    if (!sellerId) {
      console.error('Seller ID is missing.');
      return;
    }

    const campaign: Campaign = {
      ...this.campaignForm.value,
      keywords: this.selectedKeywords(),
      productId: productId,
      sellerId: sellerId,
    };

    if (this.isEditMode) {
      this.campaignService.updateCampaign(this.campaignId!, campaign).subscribe({
        next: () => {
          this.router.navigate(['/campaigns']);
          this.accountBalanceService.fetchBalance();
        },
        error: (error) => {
          if (error.status === 400 && error.error.message === 'Insufficient funds') {
            alert('Insufficient funds to create or update the campaign. Please check your account balance.');
          } else {
            console.error('Error updating campaign:', error);
          }
        },
      });
    } else {
      this.campaignService.createCampaign(campaign).subscribe({
        next: () => {
          this.router.navigate(['/campaigns']);
          this.accountBalanceService.fetchBalance();
        },
        error: (error) => {
          if (error.status === 400 && error.error.message === 'Insufficient funds') {
            alert('Insufficient funds to create or update the campaign. Please check your account balance.');
          } else {
            console.error('Error creating campaign:', error);
          }
        },
      });
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.selectedKeywords().includes(value)) {
      this.keywordService.findOrCreateByValues([value]).subscribe({
        next: () => {
          this.selectedKeywords.update((keywords) => [...keywords, value]);
          this.announcer.announce(`Added ${value}`);
        },
        error: (error) => {
          console.error('Error adding keyword:', error);
        },
      });
    }

    event.chipInput!.clear();
    this.keywordCtrl.setValue('');
  }

  remove(keyword: string): void {
    this.selectedKeywords.update((keywords) => keywords.filter(k => k !== keyword));
    this.announcer.announce(`Removed ${keyword}`);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (value && !this.selectedKeywords().includes(value)) {
      this.selectedKeywords.update((keywords) => [...keywords, value]);
      this.announcer.announce(`Selected ${value}`);
    }

    this.keywordCtrl.setValue('');
  }
}
