import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {ReceiptsService} from '../../services/receipts.service';
import {Receipt} from '../../model/receipt.model';

@Component({
  moduleId: module.id,
  selector: 'app-receipts',
  templateUrl: 'receipts.component.html',
  styleUrls: ['receipts.component.css'],
  providers: [ReceiptsService]
})
export class ReceiptsComponent implements OnInit {

  receipts : Observable<Receipt[]>;

  constructor(private receiptsService : ReceiptsService) {}

  ngOnInit() {
      // this.receiptsService.getReceipts().then(response => this.receipts = response);
    this.receipts = this.receiptsService.getReceipts();

    var item : Receipt;
  }

  getReceipts() {
    return this.receipts;
  }
}
