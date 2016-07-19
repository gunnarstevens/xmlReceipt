import { Component, OnInit } from '@angular/core';
import {ReceiptsService} from '../../services/receipts.service';
import {ReceiptHeader} from '../../model/receipt.model';



@Component({
  moduleId: module.id,
  selector: 'cv-receiptsoutlineview',
  templateUrl: 'receiptsoutlineview.component.html',
  styleUrls: ['receiptsoutlineview.component.css'],
  providers: [ReceiptsService]
})
export class ReceiptsOutlineViewComponent implements OnInit {

  receipts : ReceiptHeader[];
  selectedReceipt: ReceiptHeader;

  constructor(private receiptsService : ReceiptsService) {}


  ngOnInit() {
    var debug : any = this.receiptsService.getReceipts();
      debug.then(response => this.receipts = response);
  }

  getReceipts() {
    return this.receipts;
  }


  onSelect(receipt: ReceiptHeader) { this.selectedReceipt = receipt; }
}
