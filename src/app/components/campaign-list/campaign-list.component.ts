// campaign-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CampaignService, Campaign } from '../../services/campaign.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css'],
  imports: [
    MatTable,
    MatButton,
    RouterLink,
    MatColumnDef,
    MatCell,
    MatHeaderCell,
    MatCellDef,
    MatHeaderCellDef,
    MatIcon,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatHeaderRow,
    MatIconButton,
    MatRowDef
  ]
})
export class CampaignListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'status', 'bidAmount', 'campaignFund', 'town', 'radius', 'actions'];
  dataSource = new MatTableDataSource<Campaign>();
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  pageIndex = 0;

  sellerId: string | null = null;

  constructor(private campaignService: CampaignService) {}

  ngOnInit(): void {
    this.sellerId = localStorage.getItem('sellerId');
    if (!this.sellerId) {
      return;
    }

    this.loadCampaigns(this.pageIndex, this.pageSize);
  }

  loadCampaigns(page: number, size: number): void {
    this.campaignService.getCampaignsBySellerId(this.sellerId!, page, size).subscribe({
      next: (data) => {
        this.dataSource.data = data.content;
        this.totalElements = data.totalElements;
        this.pageIndex = data.number;
        this.pageSize = data.size;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania kampanii:', error);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.loadCampaigns(event.pageIndex, event.pageSize);
  }

  editCampaign(campaignId: string): void {
  }

  deleteCampaign(campaignId: string): void {
  }
}
