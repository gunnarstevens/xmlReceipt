import { Component, OnInit } from '@angular/core';
import {ReceiptsService} from '../../services/receipts.service';
import {ReceiptHeader} from '../../model/receipt.model';

@Component({
  moduleId: module.id,
  selector: 'app-receipts',
  templateUrl: 'receipts.component.html',
  styleUrls: ['receipts.component.css'],
  providers: [ReceiptsService]
})
export class ReceiptsComponent implements OnInit {

  private receipts : ReceiptHeader[];

  constructor(private receiptsService : ReceiptsService) {}

  ngOnInit() {
       this.receiptsService.getReceipts().then(response => this.receipts = response);
  }

  getReceipts() {
    return this.receipts;
  }
}
