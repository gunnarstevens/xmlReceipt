import { Component, OnInit } from '@angular/core';
import { Receipt, ReceiptsService} from '../../services/receipts.service';



@Component({
  moduleId: module.id,
  selector: 'cv-receiptsoutlineview',
  templateUrl: 'receiptsoutlineview.component.html',
  styleUrls: ['receiptsoutlineview.component.css'],
  providers: [ReceiptsService]
})
export class ReceiptsOutlineViewComponent implements OnInit {

  receipts : Receipt[];
  selectedHero: Receipt;

  constructor(private receiptsService : ReceiptsService) {}


  ngOnInit() {
    var debug : any = this.receiptsService.getReceipts();
      debug.then(response => this.receipts = response);
  }

  getReceipts() {
    return this.receipts;
  }


  onSelect(hero: Receipt) { this.selectedHero = hero; }
}
