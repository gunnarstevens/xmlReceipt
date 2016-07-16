import { Injectable } from '@angular/core';
import $ = require('jquery');

import { RECEIPTS } from '../mocks/receipts.mock';

export class Receipt {
  id: number;
  name: string;
  iconUrl : string;
}


@Injectable()
export class ReceiptsService {

  constructor() {}

  getReceipts() : Receipt[] {

     var xml = "<rss version='2.0'><channel><title>RSS Title</title></channel></rss>";
     var any$ : any = $;

     // https://api.jquery.com/jQuery.parseXML/
     var xmlDoc : any = any$.parseXML(xml);
     console.log("ReceiptsService parse XML: " + xmlDoc);

     return RECEIPTS;
  }
}
