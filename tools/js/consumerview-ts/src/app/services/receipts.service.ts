// 3rd party imports
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { AngularFire } from 'angularfire2';

// own stuff
import { RECEIPTSHEADER } from '../mocks/receipts.mock';
import {Receipt, ReceiptHeader} from '../model/receipt.model';


@Injectable()
export class ReceiptsService {

  // TODO retrieve uid of the user  var uid = this.af.auth.getAuth().uid and put it on the path
  RECEIPTS_PATH  = "/anonymous/receipts";


  af : AngularFire;
  http: Http;

  constructor(http: Http, database : AngularFire) {
    this.af = database;
    this.http = http;
  }


  getReceipts() : Observable<Receipt[]> {
    // return this.http.get("../data/receipt1.xml").toPromise().then(
    //  res => { return RECEIPTSHEADER; } );
    return this.af.database.list(this.RECEIPTS_PATH);
  }

  getReceipt(id : string) : Observable<Receipt> {
    return this.af.database.object(this.RECEIPTS_PATH + "/" + id);
  }

  addReceipt(receipt: Receipt) {
    var receipts : any = this.af.database.list(this.RECEIPTS_PATH);
    var tmp = receipts.push();
    tmp.set(receipt);
    console.log("Receipt Service add: receipt: " + receipt + ", key: " + tmp.getKey());
  }


  // foo() : Promise<any> {
  //   return this.http.get(this.receiptsUrl).toPromise().then(res => {
  //     var xml2js:IX2JS = new X2JS();
  //     var xml = res.text();
  //     var receipt:Object = xml2js.xml_str2json(xml);
  //     console.log("ReceiptsService parse XML: " + receipt);
  //   });
  // }
}
