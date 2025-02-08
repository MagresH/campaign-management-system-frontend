import {Component, OnInit, effect, inject, signal, computed} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {CampaignService, Campaign, CampaignStatus} from '../../services/campaign.service';
import { ProductService, Product } from '../../services/product.service';
import { KeywordService } from '../../services/keyword.service';
import { LocationService } from '../../services/location.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import {
  MatChipsModule,
  MatChipInputEvent,
} from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
})
export class CampaignFormComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly selectedKeywords = signal<string[]>([]);
  readonly filteredKeywords = signal<string[]>([]);
  readonly keywordQuery$ = signal<string>('');
  campaignStatus = CampaignStatus;
  campaignForm: FormGroup;
  isEditMode = false;
  campaignId: string | null = null;
  sellerId: string | null = null;
  readonly products = signal<Product[]>([]);
  readonly towns = signal<string[]>([]);
  readonly filteredTowns = computed(() => {
    const currentTown = this.campaignForm.get('town')?.value?.toLowerCase() || '';
    return currentTown
      ? this.towns().filter((town) => town.toLowerCase().includes(currentTown))
      : this.towns();
  });

  readonly announcer = inject(LiveAnnouncer);
  currentKeyword: string = '';
  productId: string = '';

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private productService: ProductService,
    private keywordService: KeywordService,
    private locationService: LocationService,
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

    effect(() => {
      const query = this.currentKeyword.trim();
      if (query && query.length >= 2) {
        this.keywordService.getKeywordsByQuery(query).subscribe({
          next: (keywords) => {
            const filtered = keywords.filter(
              (keyword) => !this.selectedKeywords().includes(keyword)
            );
            this.filteredKeywords.set(filtered);
          },
          error: (error) => {
            console.error('Error fetching keywords:', error);
            this.filteredKeywords.set([]);
          },
        });
      } else {
        this.filteredKeywords.set([]);
      }
    });
  }

  ngOnInit(): void {
    this.sellerId = localStorage.getItem('sellerId');
    if (!this.sellerId) {
      this.router.navigate(['/']);
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
      },
      error: (error) => {
        console.error('Error loading campaign:', error);
      },
    });
  }

  saveCampaign() {
    if (this.campaignForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }
    const productId = this.productId;
    const sellerId = this.sellerId!;
    if (!productId || !sellerId) {
      console.error('Product ID or Seller ID is missing.');
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
        },
        error: (error) => {
          console.error('Error updating campaign:', error);
        },
      });
    } else {
      this.campaignService.createCampaign(campaign).subscribe({
        next: () => {
          this.router.navigate(['/campaigns']);
        },
        error: (error) => {
          console.error('Error creating campaign:', error);
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

    this.currentKeyword = '';
  }

  remove(keyword: string): void {
    this.selectedKeywords.update((keywords) => {
      const index = keywords.indexOf(keyword);
      if (index >= 0) {
        keywords.splice(index, 1);
        this.announcer.announce(`Removed ${keyword}`);
      }
      return [...keywords];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (value && !this.selectedKeywords().includes(value)) {
      this.selectedKeywords.update((keywords) => [...keywords, value]);
      this.announcer.announce(`Selected ${value}`);
    }
    this.currentKeyword = '';
    event.option.deselect();
  }
}
