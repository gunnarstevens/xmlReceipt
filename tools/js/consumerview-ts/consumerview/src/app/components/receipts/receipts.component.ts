import { Component, OnInit } from '@angular/core';
import { ReceiptsService} from '../../services/receipts.service';

@Component({
  moduleId: module.id,
  selector: 'app-receipts',
  templateUrl: 'receipts.component.html',
  styleUrls: ['receipts.component.css'],
  providers: [ReceiptsService]
})
export class ReceiptsComponent implements OnInit {

  private receipts : String[];

  constructor(private receiptsService : ReceiptsService) {}

  ngOnInit() {
      this.receipts = this.receiptsService.getReceipts();
  }

  getReceipts() {
    return this.receipts;
  }
}
