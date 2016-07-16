import { Component, OnInit } from '@angular/core';
import {ReceiptsService, Receipt} from '../../services/receipts.service';

@Component({
  moduleId: module.id,
  selector: 'app-receipts',
  templateUrl: 'receipts.component.html',
  styleUrls: ['receipts.component.css'],
  providers: [ReceiptsService]
})
export class ReceiptsComponent implements OnInit {

  private receipts : Receipt[];

  constructor(private receiptsService : ReceiptsService) {}

  ngOnInit() {
       this.receiptsService.getReceipts().then(response => this.receipts = response);
  }

  getReceipts() {
    return this.receipts;
  }
}
