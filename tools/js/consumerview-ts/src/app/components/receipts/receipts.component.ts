import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {ReceiptsService} from '../../services/receipts.service';
import {xmlreceipt} from '../../model/receipt.model';

@Component({
  moduleId: module.id,
  selector: 'cv-receipts',
  templateUrl: 'receipts.component.html',
  styleUrls: ['receipts.component.css'],
  providers: [ReceiptsService]
})
export class ReceiptsComponent implements OnInit {

  receipts : Observable<xmlreceipt[]>;

  constructor(private receiptsService : ReceiptsService) {}

  ngOnInit() {
      // this.receiptsService.getReceipts().then(response => this.receipts = response);
    this.receipts = this.receiptsService.getReceipts();

    var item : xmlreceipt;
  }

  getReceipts() {
    return this.receipts;
  }
}
