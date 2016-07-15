import { Component, OnInit } from '@angular/core';
import { ReceiptsService} from '../../services/receipts.service';

export class Receipt {
  id: number;
  name: string;
  iconUrl : string;
}

const RECEIPTS: Receipt[] = [
  { id: 11, name: 'REWE', iconUrl: "https://s3-media3.fl.yelpcdn.com/bphoto/q-S_KidUP5IzO77thkzMlw/ls.jpg" },
  { id: 12, name: 'LIDL', iconUrl : "https://upload.wikimedia.org/wikipedia/en/3/36/Logo_netto.gif"},
  { id: 13, name: 'REWE', iconUrl: "https://s3-media3.fl.yelpcdn.com/bphoto/q-S_KidUP5IzO77thkzMlw/ls.jpg" },
  { id: 14, name: 'REWE', iconUrl: "https://s3-media3.fl.yelpcdn.com/bphoto/q-S_KidUP5IzO77thkzMlw/ls.jpg" },
  { id: 15, name: 'REWE', iconUrl: "https://s3-media3.fl.yelpcdn.com/bphoto/q-S_KidUP5IzO77thkzMlw/ls.jpg" },
  { id: 16, name: 'REWE', iconUrl: "https://s3-media3.fl.yelpcdn.com/bphoto/q-S_KidUP5IzO77thkzMlw/ls.jpg" },
  { id: 17, name: 'Netto', iconUrl: "https://upload.wikimedia.org/wikipedia/en/3/36/Logo_netto.gif"},
  { id: 18, name: 'REWE', iconUrl: "https://s3-media3.fl.yelpcdn.com/bphoto/q-S_KidUP5IzO77thkzMlw/ls.jpg" },
  { id: 19, name: 'REAL', iconUrl: "https://s3-media3.fl.yelpcdn.com/bphoto/q-S_KidUP5IzO77thkzMlw/ls.jpg" },
  { id: 20, name: 'REAL', iconUrl: "https://s3-media3.fl.yelpcdn.com/bphoto/q-S_KidUP5IzO77thkzMlw/ls.jpg" }
];



@Component({
  moduleId: module.id,
  selector: 'cw-receiptslist',
  templateUrl: 'receiptslist.component.html',
  styleUrls: ['receiptslist.component.css'],
  providers: [ReceiptsService]
})
export class ReceiptslistComponent implements OnInit {

  constructor(private receiptsService : ReceiptsService) {}

  ngOnInit() {
    // this.receipts = this.receiptsService.getReceipts();
  }

  getReceipts() {
    return this.receipts;
  }

  receipts = RECEIPTS;
  selectedHero: Receipt;

  onSelect(hero: Receipt) { this.selectedHero = hero; }
}
