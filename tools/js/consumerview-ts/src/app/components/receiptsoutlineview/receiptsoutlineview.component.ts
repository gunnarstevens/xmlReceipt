import { Component, OnInit } from '@angular/core';
import {ReceiptsService} from '../../services/receipts.service';
import {xmlreceipt} from '../../model/receipt.model';
import {Observable} from "rxjs/Rx";



@Component({
  moduleId: module.id,
  selector: 'cv-receiptsoutlineview',
  templateUrl: 'receiptsoutlineview.component.html',
  styleUrls: ['receiptsoutlineview.component.css'],
  providers: [ReceiptsService]
})
export class ReceiptsOutlineViewComponent implements OnInit {

  receipts : Observable<xmlreceipt[]>;
  selectedReceipt: xmlreceipt;

  constructor(private receiptsService : ReceiptsService) {}


  ngOnInit() {
    // this.receiptsService.getReceipts().then(response => this.receipts = response);
    this.receipts = this.receiptsService.getReceipts();
   }

  getReceipts() {
    return this.receipts;
  }


  onSelect(receipt: xmlreceipt) { this.selectedReceipt = receipt; }
}
