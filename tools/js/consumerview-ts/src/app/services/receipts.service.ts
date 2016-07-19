// 3rd party imports
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

// own stuff
import { RECEIPTSHEADER } from '../mocks/receipts.mock';
import {Receipt, ReceiptHeader} from '../model/receipt.model';


@Injectable()
export class ReceiptsService {

  receiptsUrl : string = "../data/receipt1.xml";

  af : AngularFire;
  http: Http;

  constructor(http: Http, database : AngularFire) {
    this.af = database;
    this.http = http;
  }


  getReceipts() : Promise<ReceiptHeader[]> {
    // TODO - get data from firebase
    return this.http.get(this.receiptsUrl).toPromise().then(
      res => {
        return RECEIPTSHEADER;
      }
      );
  }

  getReceipt(uri : string) : Promise<Receipt> {
    return this.http.get(this.receiptsUrl).toPromise().then(res => {

      var xml2js:IX2JS = new X2JS();
      var xml = res.text();
      var receipt : Object = xml2js.xml_str2json(xml);
      console.log("ReceiptsService parse XML: " + receipt);
      return receipt;
    });
  }

  addReceipt(receipt: Receipt) {
    // TODO put it also to the receiptheader
    // TODO retrieve uid of the user  var uid = this.af.auth.getAuth().uid;
    var receipts : any = this.af.database.list("/anonymous/receipts");
    var tmp = receipts.push();
    tmp.set(receipt);
    console.log("Receipt Service add: receipt: " + receipt + ", key: " + tmp.getKey());

  }
}
