import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerSetupComponent } from './seller-setup.component';

describe('SellerSetupComponent', () => {
  let component: SellerSetupComponent;
  let fixture: ComponentFixture<SellerSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
